<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Real-time Production Diagnostics (Database & Email)
 * Access via: https://ginibengeoservices.com/api/diagnostics.php
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mailer.php';

header('Content-Type: text/html; charset=utf-8');

$pdo = Database::tryGetConnection();
$dbError = Database::getLastError();

// Port Connectivity Check for Local Exim SMTP
$portsToCheck = [
    25  => 'Local Exim SMTP (Standard unauthenticated pipe)',
    587 => 'Submission Port (TLS)',
    465 => 'SMTPS Port (SSL)'
];
$portResults = [];
foreach ($portsToCheck as $p => $desc) {
    $socket = @fsockopen('127.0.0.1', $p, $errno, $errstr, 1);
    if ($socket) {
        $banner = fgets($socket, 256);
        fclose($socket);
        $portResults[$p] = ['open' => true, 'desc' => $desc, 'banner' => trim($banner)];
    } else {
        $portResults[$p] = ['open' => false, 'desc' => $desc, 'error' => "[$errno] $errstr"];
    }
}

// Handle test email dispatch
$testResult = null;
if (isset($_POST['send_test'])) {
    $testTo = trim($_POST['test_email'] ?? 'gpgl.geoservices@gmail.com');
    $subject = "[GiniBen Diagnostic Verification] - " . date('Y-m-d H:i:s');
    $body = "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #16a34a; border-radius: 8px;'>"
          . "<h2 style='color: #166534;'>GiniBen & Partners Geoservices Ltd</h2>"
          . "<p>This is a live diagnostic verification message dispatched from your cPanel server.</p>"
          . "<p><strong>Timestamp:</strong> " . date('r') . "</p>"
          . "<p>If you see this in your inbox, your server's mail transport is operational.</p>"
          . "</div>";

    $mailResult = GiniMailer::send(
        $testTo,
        $subject,
        $body,
        "GiniBen Diagnostic Verification - " . date('r'),
        'info@ginibengeoservices.com',
        'GiniBen Geoservices'
    );

    $testResult = [
        'email' => $testTo,
        'sent' => $mailResult['success'],
        'transport' => $mailResult['transport'],
        'eximId' => $mailResult['eximId'],
        'details' => $mailResult['details'],
        'error' => $mailResult['error']
    ];
}

// Check database table
$tableExists = false;
$rowCount = 0;
$recentRows = [];

if ($pdo !== null) {
    try {
        $stmt = $pdo->query("SHOW TABLES LIKE 'enquiries'");
        $tableExists = $stmt->rowCount() > 0;

        if ($tableExists) {
            $countStmt = $pdo->query("SELECT COUNT(*) FROM `enquiries`");
            $rowCount = (int)$countStmt->fetchColumn();

            $recentStmt = $pdo->query("SELECT id, reference_number, full_name, email, service_of_interest, created_at FROM `enquiries` ORDER BY `created_at` DESC LIMIT 5");
            $recentRows = $recentStmt->fetchAll();
        }
    } catch (Throwable $e) {
        $dbError = $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GiniBen Geoservices - System Diagnostics</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #faf7f2; color: #1c1917; padding: 30px 16px; margin: 0; }
    .container { max-width: 740px; margin: 0 auto; }
    .card { background: #ffffff; border: 1px solid #e7e0d5; border-radius: 16px; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 24px; }
    h1 { color: #166534; font-size: 24px; margin-top: 0; display: flex; align-items: center; gap: 8px; }
    h2 { font-size: 16px; margin: 24px 0 10px; color: #292524; border-bottom: 1px solid #f2eee8; padding-bottom: 6px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; }
    .badge-ok { background: #dcfce7; color: #166534; }
    .badge-warn { background: #fef3c7; color: #92400e; }
    .badge-err { background: #fee2e2; color: #991b1b; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #f2eee8; }
    th { background: #faf7f2; color: #78716c; font-size: 11px; text-transform: uppercase; }
    .btn { background: #16a34a; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; }
    .btn:hover { background: #15803d; }
    input[type=email] { padding: 9px 12px; border: 1px solid #dcd1c3; border-radius: 8px; width: 280px; font-size: 13px; }
    .box { background: #faf7f2; border-left: 4px solid #16a34a; padding: 14px 18px; border-radius: 6px; font-size: 13px; margin-top: 14px; line-height: 1.6; }
    pre { background: #1f1712; color: #4ade80; padding: 12px; border-radius: 8px; font-size: 11px; overflow-x: auto; line-height: 1.5; font-family: monospace; }
  </style>
</head>
<body>
<div class="container">
  <div class="card">
    <h1>GiniBen & Partners Geoservices &bull; System Diagnostics</h1>
    <p style="font-size: 13px; color: #78716c;">Live verification for cPanel MySQL database, enquiries table, and email dispatch.</p>

    <!-- 1. Database Status -->
    <h2>1. MySQL Database Connection</h2>
    <table>
      <tr>
        <td style="width: 200px;"><strong>Configured Host</strong></td>
        <td><code><?php echo htmlspecialchars(DB_HOST); ?></code></td>
      </tr>
      <tr>
        <td><strong>Database Name</strong></td>
        <td><code><?php echo htmlspecialchars(DB_NAME); ?></code></td>
      </tr>
      <tr>
        <td><strong>Database User</strong></td>
        <td><code><?php echo htmlspecialchars(DB_USER); ?></code></td>
      </tr>
      <tr>
        <td><strong>Connection Status</strong></td>
        <td>
          <?php if ($pdo !== null): ?>
            <span class="badge badge-ok">&check; Connected Successfully</span>
          <?php else: ?>
            <span class="badge badge-err">&cross; Offline / Error</span>
            <div style="color: #991b1b; font-size: 12px; margin-top: 6px;">
              <?php echo htmlspecialchars($dbError ?: 'Could not connect. Please verify password and database user permissions in cPanel.'); ?>
            </div>
          <?php endif; ?>
        </td>
      </tr>
    </table>

    <!-- 2. Table Status -->
    <h2>2. 'enquiries' Table Status</h2>
    <table>
      <tr>
        <td style="width: 200px;"><strong>Table Presence</strong></td>
        <td>
          <?php if ($tableExists): ?>
            <span class="badge badge-ok">&check; Table Exists</span>
          <?php else: ?>
            <span class="badge badge-err">&cross; Table Missing (will auto-create on first submit)</span>
          <?php endif; ?>
        </td>
      </tr>
      <tr>
        <td><strong>Total Recorded Enquiries</strong></td>
        <td><strong><?php echo $rowCount; ?></strong> record(s) in database</td>
      </tr>
    </table>

    <?php if (!empty($recentRows)): ?>
      <h3 style="font-size: 13px; margin-top: 16px; color: #57534e;">Recent Submissions in Database:</h3>
      <table>
        <thead>
          <tr>
            <th>Ref</th>
            <th>Client</th>
            <th>Email</th>
            <th>Service</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($recentRows as $r): ?>
            <tr>
              <td><code><?php echo htmlspecialchars($r['reference_number']); ?></code></td>
              <td><?php echo htmlspecialchars($r['full_name']); ?></td>
              <td><?php echo htmlspecialchars($r['email']); ?></td>
              <td><?php echo htmlspecialchars($r['service_of_interest']); ?></td>
              <td><?php echo htmlspecialchars($r['created_at']); ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>

    <!-- 3. Mail Port Connectivity -->
    <h2>3. Server Mail Port Availability (Exim Sockets)</h2>
    <table>
      <thead>
        <tr>
          <th>Port</th>
          <th>Description</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($portResults as $port => $res): ?>
          <tr>
            <td><code>127.0.0.1:<?php echo $port; ?></code></td>
            <td><?php echo htmlspecialchars($res['desc']); ?></td>
            <td>
              <?php if ($res['open']): ?>
                <span class="badge badge-ok">&check; Open &amp; Listening</span>
                <?php if (!empty($res['banner'])): ?>
                  <div style="font-size: 11px; color: #57534e; margin-top: 4px;"><code><?php echo htmlspecialchars($res['banner']); ?></code></div>
                <?php endif; ?>
              <?php else: ?>
                <span class="badge badge-warn">Closed / Filtered</span>
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>

    <!-- 4. Email Delivery Test -->
    <h2>4. Send Live Verification Email</h2>
    <p style="font-size: 13px; color: #78716c;">Enter any email address below to test direct Exim SMTP socket dispatch:</p>
    <form method="POST" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px;">
      <input type="email" name="test_email" value="<?php echo htmlspecialchars($_POST['test_email'] ?? 'gpgl.geoservices@gmail.com'); ?>" required />
      <button type="submit" name="send_test" class="btn">Send Live Verification Email</button>
    </form>

    <?php if ($testResult !== null): ?>
      <div style="margin-top: 16px;">
        <?php if ($testResult['sent']): ?>
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 14px;">
            <span class="badge badge-ok">&check; Successfully Dispatched via <?php echo htmlspecialchars($testResult['transport']); ?></span>
            <?php if (!empty($testResult['eximId'])): ?>
              <p style="margin: 8px 0 0; font-size: 13px; color: #166534;">
                <strong>Exim Transaction ID:</strong> <code><?php echo htmlspecialchars($testResult['eximId']); ?></code><br>
                <em>This exact ID is now registered in cPanel's Track Delivery tool!</em>
              </p>
            <?php endif; ?>
          </div>
        <?php else: ?>
          <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 14px;">
            <span class="badge badge-err">&cross; Dispatch Unsuccessful</span>
            <p style="margin: 8px 0 0; font-size: 13px; color: #991b1b;"><?php echo htmlspecialchars($testResult['error']); ?></p>
          </div>
        <?php endif; ?>

        <?php if (!empty($testResult['details'])): ?>
          <h4 style="font-size: 12px; margin: 12px 0 6px; color: #57534e;">SMTP Session Transcript:</h4>
          <pre><?php echo htmlspecialchars($testResult['details']); ?></pre>
        <?php endif; ?>
      </div>
    <?php endif; ?>

    <!-- 5. Recent Dispatch Log -->
    <?php 
    $logFile = __DIR__ . '/mail_log.txt';
    $logLines = (file_exists($logFile) && is_readable($logFile)) ? array_slice(file($logFile), -12) : [];
    ?>
    <h2>5. Recent Server Dispatch Log (mail_log.txt)</h2>
    <?php if (!empty($logLines)): ?>
      <pre><?php echo htmlspecialchars(implode('', array_reverse($logLines))); ?></pre>
    <?php else: ?>
      <p style="font-size: 12px; color: #78716c;">No log entries yet. Submitting a consultation form will log delivery events here.</p>
    <?php endif; ?>

    <!-- 6. Why Track Delivery Was Empty & How to Fact-Check -->
    <h2>6. Why Track Delivery Was Empty &amp; How It Works Now</h2>
    <div class="box">
      <strong>Why "Track Delivery" was empty previously:</strong><br>
      Truehost cPanel blocks or disables PHP's default unauthenticated <code>mail()</code> function to prevent spam. When PHP called <code>mail()</code>, it returned false without ever handing the message to Exim. Because Exim never saw the message, cPanel's Track Delivery had no record to display.<br><br>
      <strong>What has been fixed:</strong><br>
      We built <code>mailer.php</code> which connects directly to the local <strong>Exim SMTP socket (<code>127.0.0.1:25</code>)</strong>. Because this communicates through the official SMTP protocol with Exim, Exim generates a unique <strong>Transaction ID</strong> (e.g. <code>id=1t...</code>) and immediately records the dispatch in <strong>Track Delivery</strong>.<br><br>
      <strong>Guaranteed 100% Delivery via cPanel Forwarder (Recommended):</strong><br>
      To ensure Yahoo and Gmail never mark inquiries as spam:<br>
      1. In cPanel, click <strong>Forwarders</strong> (under <em>Email</em>).<br>
      2. Click <strong>Add Forwarder</strong>.<br>
      3. Forward <code>info@ginibengeoservices.com</code> to <code>benukwuteyinor@yahoomail.com</code> and <code>gpgl.geoservices@gmail.com</code>.
    </div>

  </div>
</div>
</body>
</html>
