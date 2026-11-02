<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Real-time Production Diagnostics (Database & Email)
 * Access via: https://ginibengeoservices.com/api/diagnostics.php
 */

require_once __DIR__ . '/db.php';

header('Content-Type: text/html; charset=utf-8');

$pdo = Database::tryGetConnection();
$dbError = Database::getLastError();

// Handle test email dispatch
$testResult = null;
if (isset($_POST['send_test'])) {
    $testTo = trim($_POST['test_email'] ?? 'gpgl.geoservices@gmail.com');
    $subject = "[GiniBen Diagnostic Test] - " . date('Y-m-d H:i:s');
    $body = "<h2>GiniBen Diagnostic Test</h2><p>This confirms PHP mail is operational from cPanel Exim.</p><p>Timestamp: " . date('r') . "</p>";
    $msgId = '<' . time() . '.' . md5($testTo . microtime(true)) . '@ginibengeoservices.com>';
    $headers = "Date: " . date('r') . "\r\n"
             . "From: GiniBen Geoservices <info@ginibengeoservices.com>\r\n"
             . "Reply-To: info@ginibengeoservices.com\r\n"
             . "Message-ID: {$msgId}\r\n"
             . "MIME-Version: 1.0\r\n"
             . "Content-Type: text/html; charset=UTF-8\r\n"
             . "Content-Transfer-Encoding: 8bit\r\n"
             . "X-Mailer: PHP/" . phpversion();

    $sent = @mail($testTo, $subject, $body, $headers, "-f info@ginibengeoservices.com");
    if (!$sent) {
        $sent = @mail($testTo, $subject, $body, $headers);
    }
    $testResult = [
        'email' => $testTo,
        'sent' => (bool)$sent
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
    .container { max-width: 720px; margin: 0 auto; }
    .card { background: #ffffff; border: 1px solid #e7e0d5; border-radius: 16px; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 24px; }
    h1 { color: #166534; font-size: 24px; margin-top: 0; display: flex; align-items: center; gap: 8px; }
    h2 { font-size: 16px; margin: 20px 0 10px; color: #292524; border-bottom: 1px solid #f2eee8; padding-bottom: 6px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; }
    .badge-ok { background: #dcfce7; color: #166534; }
    .badge-err { background: #fee2e2; color: #991b1b; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #f2eee8; }
    th { background: #faf7f2; color: #78716c; font-size: 11px; text-transform: uppercase; }
    .btn { background: #16a34a; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; }
    .btn:hover { background: #15803d; }
    input[type=email] { padding: 9px 12px; border: 1px solid #dcd1c3; border-radius: 8px; width: 260px; font-size: 13px; }
    .box { background: #faf7f2; border-left: 4px solid #16a34a; padding: 12px 16px; border-radius: 6px; font-size: 13px; margin-top: 14px; }
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

    <!-- 3. Mail Dispatcher -->
    <h2>3. Email Delivery Test</h2>
    <p style="font-size: 13px; color: #78716c;">Enter any email address below to test mail dispatch instantly:</p>
    <form method="POST" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px;">
      <input type="email" name="test_email" value="<?php echo htmlspecialchars($_POST['test_email'] ?? 'gpgl.geoservices@gmail.com'); ?>" required />
      <button type="submit" name="send_test" class="btn">Send Live Test Alert</button>
    </form>

    <?php if ($testResult !== null): ?>
      <div style="margin-top: 12px;">
        <?php if ($testResult['sent']): ?>
          <span class="badge badge-ok">&check; Test mail queued &amp; dispatched to <?php echo htmlspecialchars($testResult['email']); ?> via Exim</span>
        <?php else: ?>
          <span class="badge badge-err">&cross; Test mail could not be dispatched to <?php echo htmlspecialchars($testResult['email']); ?></span>
        <?php endif; ?>
      </div>
    <?php endif; ?>

    <!-- 4. Recent Dispatch Log -->
    <?php 
    $logFile = __DIR__ . '/mail_log.txt';
    $logLines = (file_exists($logFile) && is_readable($logFile)) ? array_slice(file($logFile), -10) : [];
    ?>
    <h2>4. Recent Server Dispatch Log (mail_log.txt)</h2>
    <?php if (!empty($logLines)): ?>
      <pre style="background: #1f1712; color: #4ade80; padding: 12px; border-radius: 8px; font-size: 11px; overflow-x: auto; line-height: 1.5;"><?php echo htmlspecialchars(implode('', array_reverse($logLines))); ?></pre>
    <?php else: ?>
      <p style="font-size: 12px; color: #78716c;">No log entries yet. Submitting a consultation form will log delivery events here.</p>
    <?php endif; ?>

    <!-- 5. How to Check Without Disturbing Anyone -->
    <h2>5. How to Verify Delivery Without Disturbing Recipients</h2>
    <div class="box">
      <strong>Built-in cPanel "Track Delivery" Tool:</strong><br>
      You do <strong>not</strong> need to call or text Dr. Benjamin or the team to verify if they got an email.<br>
      1. Log into your <strong>Truehost cPanel</strong>.<br>
      2. In the search box at the top, type <strong>Track Delivery</strong> (under the <em>Email</em> section).<br>
      3. In the <em>Recipient Email</em> box, enter: <code>benukwuteyinor@yahoomail.com</code> or <code>gpgl.geoservices@gmail.com</code>.<br>
      4. Click <strong>Run Report</strong>.<br>
      5. cPanel will display the exact timestamp, delivery status, and the remote server's response (e.g. <code>250 OK: accepted by yahoo.com</code> or <code>250 OK: accepted by google.com</code>).
    </div>

  </div>
</div>
</body>
</html>
