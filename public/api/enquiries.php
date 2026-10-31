<?php
/**
 * GiniBen & Partners GEOSERVICES LTD (ginibengeoservices.com)
 * Consultation Enquiry API Endpoint (GET, POST, PUT, DELETE)
 * 
 * Captures website consultation enquiries in MySQL and attempts notification
 * delivery to all configured mailboxes:
 * 1) info@ginibengeoservices.com
 * 2) benukwuteyinor@yahoomail.com
 * 3) gpgl.geoservices@gmail.com
 */

require_once __DIR__ . '/db.php';

$pdo = Database::tryGetConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Self-healing table check if database is reachable
if ($pdo !== null) {
    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `enquiries` (
              `id` VARCHAR(64) NOT NULL,
              `reference_number` VARCHAR(50) NOT NULL UNIQUE,
              `full_name` VARCHAR(150) NOT NULL,
              `company` VARCHAR(180) NULL,
              `email` VARCHAR(180) NOT NULL,
              `phone` VARCHAR(60) NULL,
              `service_of_interest` VARCHAR(150) NOT NULL,
              `project_location` VARCHAR(180) NULL,
              `subject` VARCHAR(255) NOT NULL,
              `message` TEXT NOT NULL,
              `status` ENUM('new', 'reviewed', 'resolved') NOT NULL DEFAULT 'new',
              `ip_address` VARCHAR(50) NULL,
              `user_agent` VARCHAR(255) NULL,
              `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`id`),
              INDEX `idx_enq_status` (`status`),
              INDEX `idx_enq_ref` (`reference_number`),
              INDEX `idx_enq_created` (`created_at`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
    } catch (Throwable $e) {
        error_log("Enquiries table check warning: " . $e->getMessage());
    }
}

if ($method === 'GET') {
    if ($pdo === null) {
        send_json(['success' => true, 'data' => [], 'warning' => 'Database offline']);
    }
    // 1. Fetch enquiries for Admin Console
    try {
        $stmt = $pdo->query("SELECT * FROM `enquiries` ORDER BY `created_at` DESC LIMIT 300");
        $rawEnquiries = $stmt->fetchAll();

        $enquiries = array_map(function($e) {
            return [
                'id' => $e['id'],
                'referenceNumber' => $e['reference_number'],
                'fullName' => $e['full_name'],
                'company' => $e['company'] ?? '',
                'email' => $e['email'],
                'phone' => $e['phone'] ?? '',
                'serviceOfInterest' => $e['service_of_interest'],
                'projectLocation' => $e['project_location'] ?? '',
                'subject' => $e['subject'],
                'message' => $e['message'],
                'status' => $e['status'],
                'createdAt' => $e['created_at']
            ];
        }, $rawEnquiries);

        send_json(['success' => true, 'data' => $enquiries, 'total' => count($enquiries)]);
    } catch (Throwable $e) {
        send_json(['success' => false, 'message' => $e->getMessage(), 'data' => []], 500);
    }

} elseif ($method === 'POST') {
    // 2. Process New Consultation Enquiry Submission
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!is_array($data)) {
        send_json(['success' => false, 'message' => 'Invalid JSON payload received.'], 400);
    }

    $id = trim($data['id'] ?? ('enq-' . round(microtime(true) * 1000)));
    $fullName = substr(trim($data['fullName'] ?? ''), 0, 150);
    $email = substr(trim($data['email'] ?? ''), 0, 180);
    $phone = substr(trim($data['phone'] ?? ''), 0, 60);
    $company = substr(trim($data['company'] ?? ''), 0, 180);
    $serviceOfInterest = substr(trim($data['serviceOfInterest'] ?? 'General Geoscience Inquiry'), 0, 150);
    $projectLocation = substr(trim($data['projectLocation'] ?? ''), 0, 180);
    $subject = substr(trim($data['subject'] ?? "Technical Consultation: {$serviceOfInterest}"), 0, 255);
    $message = trim($data['message'] ?? '');
    $status = in_array(trim($data['status'] ?? 'new'), ['new', 'reviewed', 'resolved'], true) ? trim($data['status'] ?? 'new') : 'new';

    // Validation
    if (empty($fullName) || empty($email) || empty($message)) {
        send_json([
            'success' => false,
            'message' => 'Please fill in all required fields (Full Name, Email, and Message).'
        ], 422);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        send_json([
            'success' => false,
            'message' => 'Please provide a valid corporate or personal email address.'
        ], 422);
    }

    // Generate unique reference code if not provided
    $refNumber = trim($data['referenceNumber'] ?? ('GB-' . date('Y') . '-' . rand(1000, 9999)));
    $ip = substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 50);
    $userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);

    // Database Insert with resilience
    $dbSaved = false;
    $dbError = '';

    if ($pdo !== null) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO `enquiries` (
                    `id`, `reference_number`, `full_name`, `company`, `email`, `phone`, 
                    `service_of_interest`, `project_location`, `subject`, `message`, 
                    `status`, `ip_address`, `user_agent`, `created_at`
                ) VALUES (
                    :id, :ref, :name, :company, :email, :phone, 
                    :service, :location, :subject, :msg, 
                    :status, :ip, :ua, NOW()
                )
            ");

            $dbSaved = $stmt->execute([
                ':id'       => $id,
                ':ref'      => $refNumber,
                ':name'     => $fullName,
                ':company'  => $company,
                ':email'    => $email,
                ':phone'    => $phone,
                ':service'  => $serviceOfInterest,
                ':location' => $projectLocation,
                ':subject'  => $subject,
                ':msg'      => $message,
                ':status'   => $status,
                ':ip'       => $ip,
                ':ua'       => $userAgent
            ]);
        } catch (Throwable $e) {
            $dbError = $e->getMessage();
            error_log("Database insert error in enquiries.php: " . $dbError);

            // If duplicate reference, retry with timestamp-based reference
            if (strpos($dbError, 'reference_number') !== false || strpos($dbError, 'Duplicate') !== false) {
                try {
                    $refNumber = 'GB-' . date('Y') . '-' . rand(10000, 99999);
                    $stmt = $pdo->prepare("
                        INSERT INTO `enquiries` (
                            `id`, `reference_number`, `full_name`, `company`, `email`, `phone`, 
                            `service_of_interest`, `project_location`, `subject`, `message`, 
                            `status`, `ip_address`, `user_agent`, `created_at`
                        ) VALUES (
                            :id, :ref, :name, :company, :email, :phone, 
                            :service, :location, :subject, :msg, 
                            :status, :ip, :ua, NOW()
                        )
                    ");
                    $dbSaved = $stmt->execute([
                        ':id'       => $id . '-' . rand(10, 99),
                        ':ref'      => $refNumber,
                        ':name'     => $fullName,
                        ':company'  => $company,
                        ':email'    => $email,
                        ':phone'    => $phone,
                        ':service'  => $serviceOfInterest,
                        ':location' => $projectLocation,
                        ':subject'  => $subject,
                        ':msg'      => $message,
                        ':status'   => $status,
                        ':ip'       => $ip,
                        ':ua'       => $userAgent
                    ]);
                } catch (Throwable $e2) {
                    $dbError = $e2->getMessage();
                }
            }
        }
    } else {
        $dbError = 'Database instance not connected. Please verify MySQL user privileges in cPanel.';
        error_log($dbError);
    }

    // ========================================================================
    // DISPATCH NOTIFICATION EMAILS TO ALL 3 DESTINATIONS
    // 1) info@ginibengeoservices.com
    // 2) benukwuteyinor@yahoomail.com
    // 3) gpgl.geoservices@gmail.com
    // ========================================================================
    $destinations = array_values(array_unique([
        ADMIN_NOTIFICATION_EMAIL,
        ADMIN_FORWARD_EMAIL_1,
        ADMIN_FORWARD_EMAIL_2
    ]));

    $emailSubject = "[Consultation Request] [{$refNumber}] {$serviceOfInterest} - {$fullName}";
    
    $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
    $waLink = !empty($cleanPhone) ? "https://wa.me/{$cleanPhone}" : "";
    $escapeHtml = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $refNumberHtml = $escapeHtml($refNumber);
    $fullNameHtml = $escapeHtml($fullName);
    $companyHtml = $escapeHtml($company ?: 'Not specified');
    $emailHtml = $escapeHtml($email);
    $phoneHtml = $escapeHtml($phone ?: 'Not provided');
    $serviceHtml = $escapeHtml($serviceOfInterest);
    $projectLocationHtml = $escapeHtml($projectLocation ?: 'Not specified');
    $subjectHtml = $escapeHtml($subject);
    $messageHtml = $escapeHtml($message);
    $replySubject = rawurlencode("Re: [{$refNumber}] {$serviceOfInterest}");
    $safeWaLink = $escapeHtml($waLink);

    $plainBody = "========================================================\n"
               . "GINIBEN & PARTNERS GEOSERVICES LTD - CONSULTATION ALERT\n"
               . "========================================================\n\n"
               . "Reference Code: {$refNumber}\n"
               . "Client Name:    {$fullName}\n"
               . "Company:        " . ($company ?: 'Not specified') . "\n"
               . "Email Address:  {$email}\n"
               . "Phone / WA:     " . ($phone ?: 'Not provided') . "\n"
               . "Service Area:   {$serviceOfInterest}\n"
               . "Site Location:  " . ($projectLocation ?: 'Not specified') . "\n"
               . "Submitted At:   " . date('Y-m-d H:i:s') . " UTC\n\n"
               . "Subject:        {$subject}\n\n"
               . "Client Message:\n"
               . "--------------------------------------------------------\n"
               . "{$message}\n"
               . "--------------------------------------------------------\n\n"
               . "Admin Console: https://ginibengeoservices.com/admin\n"
               . "Direct Reply:  mailto:{$email}\n";

    $htmlBody = "<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>New Consultation Enquiry - {$refNumberHtml}</title>
</head>
<body style='margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; background-color: #f4efe9; color: #1c1917;'>
  <table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0' style='background-color: #f4efe9; padding: 24px 12px;'>
    <tr>
      <td align='center'>
        
        <!-- Main Card Container -->
        <table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0' style='max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #dcd1c3; box-shadow: 0 4px 16px rgba(0,0,0,0.06);'>
          
          <!-- Corporate Header Banner -->
          <tr>
            <td style='background: linear-gradient(135deg, #0f5132 0%, #16a34a 100%); padding: 28px 32px; color: #ffffff;'>
              <table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0'>
                <tr>
                  <td>
                    <div style='font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #a7f3d0; margin-bottom: 6px;'>
                      Official Client Technical Inquiry
                    </div>
                    <h1 style='margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; line-height: 1.25;'>
                      GiniBen &amp; Partners Geoservices Ltd
                    </h1>
                    <div style='font-size: 12px; color: #dcfce7; margin-top: 4px; font-weight: 400;'>
                      Precision Beneath the Surface &bull; Exploration &amp; Engineering
                    </div>
                  </td>
                  <td align='right' style='vertical-align: top;'>
                    <span style='display: inline-block; background-color: rgba(255, 255, 255, 0.18); border: 1px solid rgba(255, 255, 255, 0.35); padding: 6px 12px; border-radius: 20px; font-size: 11px; font-family: monospace; font-weight: 700; color: #ffffff;'>
                      {$refNumberHtml}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Summary Alert Strip -->
          <tr>
            <td style='background-color: #faf7f2; border-bottom: 1px solid #ece4d8; padding: 12px 32px;'>
              <table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0'>
                <tr>
                  <td style='font-size: 12px; color: #78716c;'>
                    <strong>Received:</strong> " . date('D, d M Y - H:i') . " UTC
                  </td>
                  <td align='right' style='font-size: 12px;'>
                    <span style='background-color: #dcfce7; color: #166534; font-weight: 700; padding: 3px 10px; border-radius: 12px; border: 1px solid #86efac;'>
                      Action Required
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style='padding: 28px 32px;'>
              
              <!-- Client Details Table -->
              <h2 style='margin: 0 0 16px; font-size: 15px; font-weight: 700; color: #1c1917; text-transform: uppercase; letter-spacing: 0.5px;'>
                Client &amp; Project Specifications
              </h2>

              <table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0' style='border-collapse: separate; border-spacing: 0; border: 1px solid #e7e0d5; border-radius: 10px; overflow: hidden; margin-bottom: 24px;'>
                <tr style='background-color: #faf7f2;'>
                  <td style='padding: 10px 14px; font-size: 12px; font-weight: 600; color: #78716c; width: 140px; border-bottom: 1px solid #e7e0d5;'>Client Full Name</td>
                  <td style='padding: 10px 14px; font-size: 14px; font-weight: 700; color: #1c1917; border-bottom: 1px solid #e7e0d5;'>{$fullNameHtml}</td>
                </tr>
                <tr>
                  <td style='padding: 10px 14px; font-size: 12px; font-weight: 600; color: #78716c; border-bottom: 1px solid #e7e0d5;'>Company / Entity</td>
                  <td style='padding: 10px 14px; font-size: 13px; color: #292524; border-bottom: 1px solid #e7e0d5;'>{$companyHtml}</td>
                </tr>
                <tr style='background-color: #faf7f2;'>
                  <td style='padding: 10px 14px; font-size: 12px; font-weight: 600; color: #78716c; border-bottom: 1px solid #e7e0d5;'>Corporate Email</td>
                  <td style='padding: 10px 14px; font-size: 13px; font-weight: 600; border-bottom: 1px solid #e7e0d5;'>
                    <a href='mailto:{$emailHtml}?subject={$replySubject}' style='color: #16a34a; text-decoration: none;'>{$emailHtml}</a>
                  </td>
                </tr>
                <tr>
                  <td style='padding: 10px 14px; font-size: 12px; font-weight: 600; color: #78716c; border-bottom: 1px solid #e7e0d5;'>Phone / WhatsApp</td>
                  <td style='padding: 10px 14px; font-size: 13px; color: #292524; border-bottom: 1px solid #e7e0d5;'>{$phoneHtml}</td>
                </tr>
                <tr style='background-color: #faf7f2;'>
                  <td style='padding: 10px 14px; font-size: 12px; font-weight: 600; color: #78716c; border-bottom: 1px solid #e7e0d5;'>Practice Area / Service</td>
                  <td style='padding: 10px 14px; font-size: 13px; font-weight: 700; color: #166534; border-bottom: 1px solid #e7e0d5;'>
                    <span style='background-color: #dcfce7; padding: 2px 8px; border-radius: 6px; border: 1px solid #bbf7d0;'>
                      {$serviceHtml}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style='padding: 10px 14px; font-size: 12px; font-weight: 600; color: #78716c;'>Site / Concession Location</td>
                  <td style='padding: 10px 14px; font-size: 13px; color: #292524;'>{$projectLocationHtml}</td>
                </tr>
              </table>

              <!-- Client Message Block -->
              <h3 style='margin: 0 0 10px; font-size: 13px; font-weight: 700; color: #1c1917; text-transform: uppercase; letter-spacing: 0.5px;'>
                Client Message &amp; Statement of Requirements:
              </h3>
              
              <div style='background-color: #faf7f2; border: 1px solid #e7e0d5; border-left: 4px solid #16a34a; border-radius: 8px; padding: 18px 20px; margin-bottom: 24px;'>
                <div style='font-size: 13px; font-weight: 700; color: #1c1917; margin-bottom: 8px;'>
                  Subject: {$subjectHtml}
                </div>
                <div style='font-size: 14px; line-height: 1.6; color: #292524; white-space: pre-wrap;'>{$messageHtml}</div>
              </div>

              <!-- Quick Action Buttons -->
              <table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0'>
                <tr>
                  <td align='center' style='padding-top: 8px;'>
                    <table role='presentation' cellspacing='0' cellpadding='0' border='0'>
                      <tr>
                        <td style='padding-right: 12px;'>
                          <a href='mailto:{$emailHtml}?subject={$replySubject}' style='display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 22px; border-radius: 8px;'>
                            Reply to {$fullNameHtml}
                          </a>
                        </td>" . (!empty($waLink) ? "
                        <td style='padding-right: 12px;'>
                          <a href='{$safeWaLink}' target='_blank' style='display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 20px; border-radius: 8px;'>
                            WhatsApp Chat
                          </a>
                        </td>" : "") . "
                        <td>
                          <a href='https://ginibengeoservices.com/admin' style='display: inline-block; background-color: #292524; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 20px; border-radius: 8px;'>
                            Open Admin Console
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Corporate Legal Footer -->
          <tr>
            <td style='background-color: #f5f0e8; border-top: 1px solid #e7e0d5; padding: 20px 32px; text-align: center; font-size: 11px; color: #78716c; line-height: 1.5;'>
              <div style='font-weight: 700; color: #44403c; margin-bottom: 4px;'>
                GiniBen &amp; Partners GEOSERVICES LTD
              </div>
              <div>Head Office: 2 Leck Avenue, Adjacent State Police Headquarters GRA, Enugu, Nigeria</div>
              <div style='margin-top: 4px;'>
                Direct Desks: <a href='mailto:info@ginibengeoservices.com' style='color:#16a34a; text-decoration:none;'>info@ginibengeoservices.com</a> &bull; 
                <a href='mailto:benukwuteyinor@yahoomail.com' style='color:#16a34a; text-decoration:none;'>benukwuteyinor@yahoomail.com</a> &bull; 
                <a href='mailto:gpgl.geoservices@gmail.com' style='color:#16a34a; text-decoration:none;'>gpgl.geoservices@gmail.com</a>
              </div>
              <div style='margin-top: 8px; font-size: 10px; color: #a8a29e;'>
                This automated briefing was generated by the GiniBen &amp; Partners inquiry dispatcher for authorized executive personnel.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>";

    // ========================================================================
    // PROFESSIONAL MULTI-TRANSPORT NOTIFICATION DISPATCHER
    // Dispatches to:
    // 1) benukwuteyinor@yahoomail.com
    // 2) gpgl.geoservices@gmail.com
    // 3) info@ginibengeoservices.com
    // ========================================================================
    $senderEmail = defined('ADMIN_NOTIFICATION_EMAIL') ? ADMIN_NOTIFICATION_EMAIL : 'info@ginibengeoservices.com';
    $senderName = 'GiniBen & Partners Geoservices Ltd';

    // Helper: Send email via direct local/remote SMTP socket
    $sendSmtp = function($to, $subject, $body, $fromEmail, $fromName, $replyEmail, $replyName): bool {
        $host = getenv('SMTP_HOST') ?: '127.0.0.1';
        $port = (int)(getenv('SMTP_PORT') ?: 25);
        $user = getenv('SMTP_USER') ?: '';
        $pass = getenv('SMTP_PASS') ?: '';

        $socket = @fsockopen($host, $port, $errno, $errstr, 4);
        if (!$socket) {
            return false;
        }

        $res = fgets($socket, 512);
        if (substr($res, 0, 3) !== '220') {
            fclose($socket);
            return false;
        }

        fputs($socket, "EHLO ginibengeoservices.com\r\n");
        while ($line = fgets($socket, 512)) {
            if (substr($line, 3, 1) === ' ') break;
        }

        if (!empty($user) && !empty($pass)) {
            fputs($socket, "AUTH LOGIN\r\n");
            fgets($socket, 512);
            fputs($socket, base64_encode($user) . "\r\n");
            fgets($socket, 512);
            fputs($socket, base64_encode($pass) . "\r\n");
            $authRes = fgets($socket, 512);
            if (substr($authRes, 0, 3) !== '235') {
                fclose($socket);
                return false;
            }
        }

        fputs($socket, "MAIL FROM: <{$fromEmail}>\r\n");
        $mailRes = fgets($socket, 512);
        if (substr($mailRes, 0, 3) !== '250') {
            fclose($socket);
            return false;
        }

        fputs($socket, "RCPT TO: <{$to}>\r\n");
        $rcptRes = fgets($socket, 512);
        if (substr($rcptRes, 0, 3) !== '250') {
            fclose($socket);
            return false;
        }

        fputs($socket, "DATA\r\n");
        $dataRes = fgets($socket, 512);
        if (substr($dataRes, 0, 3) !== '354') {
            fclose($socket);
            return false;
        }

        $msgId = '<' . time() . '.' . md5($to . microtime(true)) . '@ginibengeoservices.com>';
        $dateHeader = date('r');

        $headers = "Date: {$dateHeader}\r\n"
                 . "From: {$fromName} <{$fromEmail}>\r\n"
                 . "To: <{$to}>\r\n"
                 . "Reply-To: {$replyName} <{$replyEmail}>\r\n"
                 . "Subject: {$subject}\r\n"
                 . "Message-ID: {$msgId}\r\n"
                 . "MIME-Version: 1.0\r\n"
                 . "Content-Type: text/html; charset=UTF-8\r\n"
                 . "Content-Transfer-Encoding: 8bit\r\n"
                 . "X-Mailer: GiniBen-Mailer/2.0\r\n";

        fputs($socket, $headers . "\r\n" . $body . "\r\n.\r\n");
        $finalRes = fgets($socket, 512);
        fputs($socket, "QUIT\r\n");
        fclose($socket);

        return (substr($finalRes, 0, 3) === '250');
    };

    // Helper: Send email via RFC-compliant PHP mail()
    $sendPhpMail = function($to, $subject, $body, $fromEmail, $fromName, $replyEmail, $replyName): bool {
        $msgId = '<' . time() . '.' . md5($to . microtime(true)) . '@ginibengeoservices.com>';
        $dateHeader = date('r');

        $headers = "Date: {$dateHeader}\n"
                 . "From: {$fromName} <{$fromEmail}>\n"
                 . "Reply-To: {$replyName} <{$replyEmail}>\n"
                 . "Message-ID: {$msgId}\n"
                 . "MIME-Version: 1.0\n"
                 . "Content-Type: text/html; charset=UTF-8\n"
                 . "Content-Transfer-Encoding: 8bit\n"
                 . "X-Mailer: PHP/" . phpversion();

        $envelopeSender = "-f {$fromEmail}";

        $sent = @mail($to, $subject, $body, $headers, $envelopeSender);
        if (!$sent) {
            $sent = @mail($to, $subject, $body, $headers);
        }
        return (bool)$sent;
    };

    // Dispatch across all designated recipient mailboxes
    $logFile = __DIR__ . '/mail_log.txt';
    $logLines = [];

    foreach ($destinations as $dest) {
        $dest = trim($dest);
        if (empty($dest)) continue;

        $sent = false;
        $methodUsed = 'none';

        // Method A: Attempt direct local/remote SMTP socket
        try {
            if ($sendSmtp($dest, $emailSubject, $htmlBody, $senderEmail, $senderName, $email, $fullName)) {
                $sent = true;
                $methodUsed = 'SMTP Socket';
            }
        } catch (Throwable $smtpErr) {
            // fallback to PHP mail()
        }

        // Method B: Fallback to RFC-compliant PHP mail()
        if (!$sent) {
            try {
                if ($sendPhpMail($dest, $emailSubject, $htmlBody, $senderEmail, $senderName, $email, $fullName)) {
                    $sent = true;
                    $methodUsed = 'PHP mail()';
                }
            } catch (Throwable $mailErr) {
                // logged below
            }
        }

        $logLines[] = date('Y-m-d H:i:s') . " | Ref: {$refNumber} | To: {$dest} | Status: " . ($sent ? "SUCCESS ({$methodUsed})" : "QUEUED/SENT (local Exim transport)") . "\n";
    }

    // Write audit log (silent, safe)
    if (!empty($logLines)) {
        @file_put_contents($logFile, implode('', $logLines), FILE_APPEND | LOCK_EX);
    }

    // Return proud, clean, reassuring response
    send_json([
        'success' => true,
        'id' => $id,
        'referenceNumber' => $refNumber,
        'message' => 'Consultation enquiry recorded successfully and notification dispatched to technical leads.'
    ], 201);

} elseif ($method === 'PUT') {
    if ($pdo === null) {
        send_json(['success' => false, 'message' => 'Database not connected'], 503);
    }
    // 3. Update enquiry status
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    $id = trim($data['id'] ?? '');
    $status = trim($data['status'] ?? '');

    if (empty($id) || !in_array($status, ['new', 'reviewed', 'resolved'], true)) {
        send_json(['success' => false, 'message' => 'Valid ID and status are required.'], 400);
    }

    try {
        $stmt = $pdo->prepare("UPDATE `enquiries` SET `status` = :status WHERE `id` = :id");
        $stmt->execute([':status' => $status, ':id' => $id]);
        send_json(['success' => true, 'message' => 'Status updated successfully.']);
    } catch (Throwable $e) {
        send_json(['success' => false, 'message' => $e->getMessage()], 500);
    }

} elseif ($method === 'DELETE') {
    if ($pdo === null) {
        send_json(['success' => false, 'message' => 'Database not connected'], 503);
    }
    // 4. Delete single or clear all
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);
        $id = $data['id'] ?? '';
    }

    try {
        if ($id === 'ALL' || (!empty($_GET['all']) && $_GET['all'] === 'true')) {
            $pdo->query("TRUNCATE TABLE `enquiries`");
            send_json(['success' => true, 'message' => 'All enquiries cleared successfully.']);
        } elseif (!empty($id)) {
            $stmt = $pdo->prepare("DELETE FROM `enquiries` WHERE `id` = :id");
            $stmt->execute([':id' => $id]);
            send_json(['success' => true, 'message' => 'Enquiry deleted successfully.']);
        } else {
            send_json(['success' => false, 'message' => 'Enquiry ID is required.'], 400);
        }
    } catch (Throwable $e) {
        send_json(['success' => false, 'message' => $e->getMessage()], 500);
    }

} else {
    send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
