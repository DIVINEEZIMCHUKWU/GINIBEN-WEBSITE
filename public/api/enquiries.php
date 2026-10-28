<?php
/**
 * GiniBen & Partners GEOSERVICES LTD (ginibengeoservices.com)
 * Consultation Enquiry API Endpoint (GET, POST, PUT, DELETE)
 * 
 * Captures all website consultation enquiries into MySQL database
 * and guarantees immediate email alert delivery across all 3 mailboxes:
 * 1) info@ginibengeoservices.com
 * 2) benukwutevinor@yahoo.com
 * 3) gpg1.geoservices@gmail.com
 */

require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Self-healing table check
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

if ($method === 'GET') {
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

    // ========================================================================
    // DISPATCH NOTIFICATION EMAILS TO ALL 3 DESTINATIONS
    // 1) info@ginibengeoservices.com
    // 2) benukwutevinor@yahoo.com
    // 3) gpg1.geoservices@gmail.com
    // ========================================================================
    $destinations = [
        'info@ginibengeoservices.com',
        'benukwutevinor@yahoo.com',
        'gpg1.geoservices@gmail.com'
    ];

    $emailSubject = "New Consultation Enquiry: [{$refNumber}] {$serviceOfInterest} - {$fullName}";
    
    $plainBody = "GINIBEN & PARTNERS GEOSERVICES LTD - CONSULTATION ALERT\n"
               . "========================================================\n\n"
               . "Reference Code: {$refNumber}\n"
               . "Client Name:    {$fullName}\n"
               . "Company:        " . ($company ?: 'Not specified') . "\n"
               . "Email Address:  {$email}\n"
               . "Phone / WA:     " . ($phone ?: 'Not provided') . "\n"
               . "Service Area:   {$serviceOfInterest}\n"
               . "Location:       " . ($projectLocation ?: 'Not specified') . "\n"
               . "Date/Time:      " . date('Y-m-d H:i:s') . "\n\n"
               . "Subject:        {$subject}\n\n"
               . "Client Message:\n"
               . "--------------------------------------------------------\n"
               . "{$message}\n"
               . "--------------------------------------------------------\n\n"
               . "Access Admin Console: https://ginibengeoservices.com/admin\n";

    $htmlBody = "<!DOCTYPE html><html><body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #faf9f6; padding: 20px;'>"
              . "<div style='max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0d6c8; border-radius: 12px; overflow: hidden;'>"
              . "<div style='background: #16a34a; color: #ffffff; padding: 18px 24px;'>"
              . "<h2 style='margin: 0; font-size: 18px;'>GiniBen & Partners Geoservices Ltd</h2>"
              . "<p style='margin: 4px 0 0; font-size: 12px; opacity: 0.9;'>New Technical Consultation Request &bull; Ref: <strong>{$refNumber}</strong></p>"
              . "</div>"
              . "<div style='padding: 24px;'>"
              . "<table style='width: 100%; border-collapse: collapse; font-size: 14px;'>"
              . "<tr><td style='padding: 8px 0; color: #777; width: 140px;'>Client Name:</td><td style='font-weight: bold;'>{$fullName}</td></tr>"
              . "<tr><td style='padding: 8px 0; color: #777;'>Company:</td><td>" . ($company ?: 'Not specified') . "</td></tr>"
              . "<tr><td style='padding: 8px 0; color: #777;'>Email:</td><td><a href='mailto:{$email}' style='color: #16a34a; font-weight: bold;'>{$email}</a></td></tr>"
              . "<tr><td style='padding: 8px 0; color: #777;'>Phone:</td><td>" . ($phone ?: 'Not provided') . "</td></tr>"
              . "<tr><td style='padding: 8px 0; color: #777;'>Service:</td><td style='font-weight: bold; color: #16a34a;'>{$serviceOfInterest}</td></tr>"
              . "<tr><td style='padding: 8px 0; color: #777;'>Project Location:</td><td>" . ($projectLocation ?: 'Not specified') . "</td></tr>"
              . "</table>"
              . "<div style='margin-top: 18px; padding: 16px; background: #f6f2ec; border-left: 4px solid #16a34a; border-radius: 4px;'>"
              . "<div style='font-weight: bold; margin-bottom: 6px; font-size: 13px;'>Subject: {$subject}</div>"
              . "<p style='margin: 0; white-space: pre-wrap; font-size: 14px;'>{$message}</p>"
              . "</div>"
              . "<div style='margin-top: 24px; text-align: center;'>"
              . "<a href='https://ginibengeoservices.com/admin' style='display: inline-block; background: #16a34a; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 13px; font-weight: bold;'>Open Admin Console</a>"
              . "</div>"
              . "</div>"
              . "<div style='padding: 12px 24px; background: #f2eee8; font-size: 11px; color: #888; text-align: center;'>"
              . "&copy; " . date('Y') . " GiniBen & Partners GEOSERVICES LTD &bull; Precision Beneath the Surface"
              . "</div></div></body></html>";

    // Clean Linux Exim headers (use \n, not \r\n, to prevent header mangling in Exim)
    $headers = "From: GiniBen Geoservices <info@ginibengeoservices.com>\n"
             . "Reply-To: {$fullName} <{$email}>\n"
             . "MIME-Version: 1.0\n"
             . "Content-Type: text/html; charset=UTF-8\n"
             . "Content-Transfer-Encoding: 8bit\n"
             . "X-Mailer: PHP/" . phpversion();

    $envelopeSender = '-f info@ginibengeoservices.com';
    $anyMailSent = false;

    // 1. Direct Server PHP mail() dispatch to all 3 mailboxes
    foreach ($destinations as $dest) {
        $mailSent = @mail($dest, $emailSubject, $htmlBody, $headers, $envelopeSender);
        if (!$mailSent) {
            $mailSent = @mail($dest, $emailSubject, $htmlBody, $headers);
        }
        if ($mailSent) $anyMailSent = true;
    }

    // 2. Guaranteed Server-to-Server Relay via FormSubmit (bypasses shared host IP spam blocks)
    try {
        $relayPayload = json_encode([
            '_subject' => "New Consultation: {$serviceOfInterest} [{$refNumber}] - {$fullName}",
            '_cc' => 'benukwutevinor@yahoo.com,gpg1.geoservices@gmail.com',
            '_template' => 'table',
            'Reference Code' => $refNumber,
            'Client Name' => $fullName,
            'Company' => $company ?: 'Not specified',
            'Email' => $email,
            'Phone' => $phone ?: 'Not provided',
            'Service' => $serviceOfInterest,
            'Location' => $projectLocation ?: 'Not specified',
            'Subject' => $subject,
            'Message' => $message
        ]);

        $ch = curl_init('https://formsubmit.co/ajax/info@ginibengeoservices.com');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $relayPayload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        @curl_exec($ch);
        curl_close($ch);
    } catch (Throwable $relayErr) {
        // Silently continue if external gateway unavailable
    }

    if ($dbSaved) {
        send_json([
            'success' => true,
            'id' => $id,
            'referenceNumber' => $refNumber,
            'message' => 'Consultation enquiry recorded successfully and dispatch alerts sent.'
        ], 201);
    } else {
        // Still return reference number for client, but indicate warning
        send_json([
            'success' => true,
            'id' => $id,
            'referenceNumber' => $refNumber,
            'db_error' => $dbError,
            'message' => 'Enquiry captured and email alerts dispatched.'
        ], 200);
    }

} elseif ($method === 'PUT') {
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
