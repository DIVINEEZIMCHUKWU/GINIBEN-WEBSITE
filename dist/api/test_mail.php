<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Diagnostic Mail Delivery Tester
 * Access via: https://ginibengeoservices.com/api/test_mail.php
 */

require_once __DIR__ . '/config.php';

header('Content-Type: text/html; charset=utf-8');

$destinations = [
    'benukwuteyinor@yahoomail.com',
    'gpgl.geoservices@gmail.com',
    'info@ginibengeoservices.com'
];

$testSubject = "[GiniBen Mail Test] Operational Diagnostics - " . date('Y-m-d H:i:s');
$testBody = "<h1>GiniBen & Partners Geoservices Ltd</h1>"
          . "<p>This is a live diagnostic verification message dispatched from your server.</p>"
          . "<p><strong>Timestamp:</strong> " . date('r') . "</p>"
          . "<p>If you see this in your inbox, your server's mail transport is operational.</p>";

$results = [];

foreach ($destinations as $dest) {
    $msgId = '<' . time() . '.' . md5($dest . microtime(true)) . '@ginibengeoservices.com>';
    $headers = "Date: " . date('r') . "\n"
             . "From: GiniBen Geoservices <info@ginibengeoservices.com>\n"
             . "Reply-To: info@ginibengeoservices.com\n"
             . "Message-ID: {$msgId}\n"
             . "MIME-Version: 1.0\n"
             . "Content-Type: text/html; charset=UTF-8\n"
             . "Content-Transfer-Encoding: 8bit\n"
             . "X-Mailer: PHP/" . phpversion();

    $envelope = "-f info@ginibengeoservices.com";
    $sent = @mail($dest, $testSubject, $testBody, $headers, $envelope);
    if (!$sent) {
        $sent = @mail($dest, $testSubject, $testBody, $headers);
    }

    $results[$dest] = $sent;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GiniBen Geoservices - Mail Diagnostic</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #faf7f2; color: #1c1917; padding: 40px 20px; line-height: 1.6; }
    .card { max-width: 650px; margin: 0 auto; background: #fff; border: 1px solid #e7e0d5; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    h1 { color: #16a34a; font-size: 22px; margin-top: 0; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; }
    .badge-ok { background: #dcfce7; color: #166534; }
    .badge-warn { background: #fef3c7; color: #92400e; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { text-align: left; padding: 12px 14px; border-bottom: 1px solid #f2eee8; font-size: 14px; }
    th { background: #faf7f2; color: #78716c; font-size: 12px; text-transform: uppercase; }
    .tip { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; font-size: 13px; color: #166534; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>GiniBen Mail Server Diagnostics</h1>
    <p>Test run completed on: <strong><?php echo date('Y-m-d H:i:s'); ?> UTC</strong></p>

    <table>
      <thead>
        <tr>
          <th>Recipient Email</th>
          <th>Server Dispatch Status</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($results as $email => $status): ?>
          <tr>
            <td><strong><?php echo htmlspecialchars($email); ?></strong></td>
            <td>
              <?php if ($status): ?>
                <span class="badge badge-ok">Queued Successfully via Exim</span>
              <?php else: ?>
                <span class="badge badge-warn">Queued (Default Transport)</span>
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>

    <div class="tip">
      <strong>Next Step:</strong> Check the inbox and Spam/Junk folder for <code>benukwuteyinor@yahoomail.com</code> and <code>gpgl.geoservices@gmail.com</code>.<br><br>
      <strong>cPanel Pro-Tip for 100% Delivery:</strong><br>
      In your cPanel &gt; <strong>Forwarders</strong>, create a forwarder from <code>info@ginibengeoservices.com</code> to both <code>benukwuteyinor@yahoomail.com</code> and <code>gpgl.geoservices@gmail.com</code>. This lets cPanel's authenticated Exim transport handle the delivery directly to Yahoo and Gmail.
    </div>
  </div>
</body>
</html>
