<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Robust Multi-Transport Mailer for Truehost cPanel
 * 
 * Supports:
 * 1. Direct Local Exim SMTP Socket (tcp://127.0.0.1:25) - Generates instant Exim tracking IDs visible in cPanel Track Delivery
 * 2. Authenticated SMTP over SSL/TLS (ports 465 / 587)
 * 3. Fallback to PHP native mail()
 */

require_once __DIR__ . '/config.php';

class GiniMailer {

    /**
     * Sends an email to a single recipient with robust multi-transport fallback.
     * 
     * @param string $to Recipient email address
     * @param string $subject Subject line
     * @param string $htmlBody HTML content
     * @param string $plainBody Optional plain text content
     * @param string $replyEmail Optional Reply-To email
     * @param string $replyName Optional Reply-To name
     * @return array Result array ['success' => bool, 'transport' => string, 'eximId' => string, 'details' => string, 'error' => string]
     */
    public static function send(
        string $to,
        string $subject,
        string $htmlBody,
        string $plainBody = '',
        string $replyEmail = '',
        string $replyName = ''
    ): array {
        $fromEmail = defined('ADMIN_NOTIFICATION_EMAIL') ? ADMIN_NOTIFICATION_EMAIL : 'info@ginibengeoservices.com';
        $fromName = 'GiniBen & Partners Geoservices Ltd';
        $replyEmail = $replyEmail ?: $fromEmail;
        $replyName = $replyName ?: $fromName;

        if (empty($plainBody)) {
            $plainBody = strip_tags(str_replace(['<br>', '<br/>', '<br />', '</p>'], "\n", $htmlBody));
        }

        $log = [];
        $eximId = '';

        // --------------------------------------------------------------------
        // Transport 1: Direct Local Exim SMTP (127.0.0.1:25)
        // cPanel Exim natively accepts local connections without authentication
        // for locally-hosted domain senders, immediately registering in cPanel Track Delivery!
        // --------------------------------------------------------------------
        $smtpResult = self::trySocketSmtp('127.0.0.1', 25, false, $fromEmail, $fromName, $to, $subject, $htmlBody, $plainBody, $replyEmail, $replyName, $log);
        if ($smtpResult['success']) {
            return [
                'success' => true,
                'transport' => 'Exim SMTP (127.0.0.1:25)',
                'eximId' => $smtpResult['eximId'],
                'details' => implode("\n", $log),
                'error' => ''
            ];
        }

        // --------------------------------------------------------------------
        // Transport 2: Try localhost:587 / localhost:465 with SMTP credentials if defined
        // --------------------------------------------------------------------
        $smtpHost = getenv('SMTP_HOST') ?: 'localhost';
        $smtpPort = (int)(getenv('SMTP_PORT') ?: 587);
        $smtpUser = getenv('SMTP_USER') ?: 'info@ginibengeoservices.com';
        $smtpPass = getenv('SMTP_PASS') ?: (defined('DB_PASS') ? DB_PASS : '');

        if (!empty($smtpUser) && !empty($smtpPass)) {
            $authResult = self::tryAuthenticatedSmtp($smtpHost, $smtpPort, $smtpUser, $smtpPass, $fromEmail, $fromName, $to, $subject, $htmlBody, $plainBody, $replyEmail, $replyName, $log);
            if ($authResult['success']) {
                return [
                    'success' => true,
                    'transport' => "Authenticated SMTP ({$smtpHost}:{$smtpPort})",
                    'eximId' => $authResult['eximId'],
                    'details' => implode("\n", $log),
                    'error' => ''
                ];
            }
        }

        // --------------------------------------------------------------------
        // Transport 3: Standard PHP mail() Fallback
        // --------------------------------------------------------------------
        if (function_exists('mail')) {
            $msgId = '<' . time() . '.' . md5($to . microtime(true)) . '@ginibengeoservices.com>';
            $boundary = '=_mb_' . md5(uniqid((string)time(), true));

            $headers = "Date: " . date('r') . "\r\n"
                     . "From: {$fromName} <{$fromEmail}>\r\n"
                     . "Reply-To: {$replyName} <{$replyEmail}>\r\n"
                     . "Message-ID: {$msgId}\r\n"
                     . "MIME-Version: 1.0\r\n"
                     . "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n"
                     . "X-Mailer: PHP/" . phpversion();

            $body = "--{$boundary}\r\n"
                  . "Content-Type: text/plain; charset=UTF-8\r\n"
                  . "Content-Transfer-Encoding: 8bit\r\n\r\n"
                  . $plainBody . "\r\n\r\n"
                  . "--{$boundary}\r\n"
                  . "Content-Type: text/html; charset=UTF-8\r\n"
                  . "Content-Transfer-Encoding: 8bit\r\n\r\n"
                  . $htmlBody . "\r\n\r\n"
                  . "--{$boundary}--\r\n";

            $sent = false;
            try {
                $sent = @mail($to, $subject, $body, $headers, "-f {$fromEmail}");
                if (!$sent) {
                    $sent = @mail($to, $subject, $body, $headers);
                }
            } catch (Throwable $e) {
                $log[] = "PHP mail() exception: " . $e->getMessage();
            }

            if ($sent) {
                return [
                    'success' => true,
                    'transport' => 'PHP mail() (sendmail binary)',
                    'eximId' => '',
                    'details' => implode("\n", $log),
                    'error' => ''
                ];
            } else {
                $lastErr = error_get_last();
                $log[] = "PHP mail() returned false. Last error: " . ($lastErr['message'] ?? 'none');
            }
        } else {
            $log[] = "PHP mail() function is disabled in php.ini";
        }

        return [
            'success' => false,
            'transport' => 'Failed all transports',
            'eximId' => '',
            'details' => implode("\n", $log),
            'error' => 'Could not dispatch message through Exim SMTP or PHP mail()'
        ];
    }

    /**
     * Raw SMTP socket communication with Exim
     */
    private static function trySocketSmtp(
        string $host,
        int $port,
        bool $useSsl,
        string $fromEmail,
        string $fromName,
        string $to,
        string $subject,
        string $htmlBody,
        string $plainBody,
        string $replyEmail,
        string $replyName,
        array &$log
    ): array {
        $prefix = $useSsl ? 'ssl://' : 'tcp://';
        $socket = @stream_socket_client("{$prefix}{$host}:{$port}", $errno, $errstr, 4);

        if (!$socket) {
            $log[] = "Socket connect to {$host}:{$port} failed: [{$errno}] {$errstr}";
            return ['success' => false, 'eximId' => ''];
        }

        stream_set_timeout($socket, 5);

        $readResponse = function() use ($socket, &$log): string {
            $response = '';
            while ($line = fgets($socket, 512)) {
                $response .= $line;
                if (isset($line[3]) && $line[3] === ' ') break;
            }
            return trim($response);
        };

        $sendCommand = function(string $cmd) use ($socket, &$log, $readResponse): string {
            fwrite($socket, $cmd . "\r\n");
            $res = $readResponse();
            return $res;
        };

        $banner = $readResponse();
        $log[] = "Banner: {$banner}";
        if (substr($banner, 0, 3) !== '220') {
            fclose($socket);
            return ['success' => false, 'eximId' => ''];
        }

        $ehlo = $sendCommand("EHLO ginibengeoservices.com");
        $log[] = "EHLO: {$ehlo}";
        if (substr($ehlo, 0, 3) !== '250') {
            $helo = $sendCommand("HELO ginibengeoservices.com");
            $log[] = "HELO: {$helo}";
        }

        $mailFrom = $sendCommand("MAIL FROM:<{$fromEmail}>");
        $log[] = "MAIL FROM: {$mailFrom}";
        if (substr($mailFrom, 0, 3) !== '250') {
            $sendCommand("QUIT");
            fclose($socket);
            return ['success' => false, 'eximId' => ''];
        }

        $rcptTo = $sendCommand("RCPT TO:<{$to}>");
        $log[] = "RCPT TO: {$rcptTo}";
        if (substr($rcptTo, 0, 3) !== '250') {
            $sendCommand("QUIT");
            fclose($socket);
            return ['success' => false, 'eximId' => ''];
        }

        $dataResp = $sendCommand("DATA");
        $log[] = "DATA: {$dataResp}";
        if (substr($dataResp, 0, 3) !== '354') {
            $sendCommand("QUIT");
            fclose($socket);
            return ['success' => false, 'eximId' => ''];
        }

        $msgId = '<' . time() . '.' . md5($to . microtime(true)) . '@ginibengeoservices.com>';
        $boundary = '=_gb_' . md5(uniqid((string)time(), true));

        $dataContent = "Date: " . date('r') . "\r\n"
                     . "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <{$fromEmail}>\r\n"
                     . "To: <{$to}>\r\n"
                     . "Reply-To: =?UTF-8?B?" . base64_encode($replyName) . "?= <{$replyEmail}>\r\n"
                     . "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n"
                     . "Message-ID: {$msgId}\r\n"
                     . "MIME-Version: 1.0\r\n"
                     . "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n\r\n"
                     . "--{$boundary}\r\n"
                     . "Content-Type: text/plain; charset=UTF-8\r\n"
                     . "Content-Transfer-Encoding: base64\r\n\r\n"
                     . chunk_split(base64_encode($plainBody)) . "\r\n"
                     . "--{$boundary}\r\n"
                     . "Content-Type: text/html; charset=UTF-8\r\n"
                     . "Content-Transfer-Encoding: base64\r\n\r\n"
                     . chunk_split(base64_encode($htmlBody)) . "\r\n"
                     . "--{$boundary}--\r\n"
                     . "\r\n.";

        fwrite($socket, $dataContent . "\r\n");
        $queuedResp = $readResponse();
        $log[] = "Data Queued: {$queuedResp}";

        $eximId = '';
        if (preg_match('/id=([a-zA-Z0-9\-]+)/', $queuedResp, $matches)) {
            $eximId = $matches[1];
        }

        $sendCommand("QUIT");
        fclose($socket);

        $success = (substr($queuedResp, 0, 3) === '250');
        return ['success' => $success, 'eximId' => $eximId];
    }

    /**
     * Authenticated SMTP over TLS/SSL
     */
    private static function tryAuthenticatedSmtp(
        string $host,
        int $port,
        string $user,
        string $pass,
        string $fromEmail,
        string $fromName,
        string $to,
        string $subject,
        string $htmlBody,
        string $plainBody,
        string $replyEmail,
        string $replyName,
        array &$log
    ): array {
        $useSsl = ($port === 465);
        $prefix = $useSsl ? 'ssl://' : 'tcp://';
        $socket = @stream_socket_client("{$prefix}{$host}:{$port}", $errno, $errstr, 4);

        if (!$socket) {
            $log[] = "Auth SMTP connect to {$host}:{$port} failed: [{$errno}] {$errstr}";
            return ['success' => false, 'eximId' => ''];
        }

        stream_set_timeout($socket, 5);

        $readResponse = function() use ($socket, &$log): string {
            $response = '';
            while ($line = fgets($socket, 512)) {
                $response .= $line;
                if (isset($line[3]) && $line[3] === ' ') break;
            }
            return trim($response);
        };

        $sendCommand = function(string $cmd) use ($socket, &$log, $readResponse): string {
            fwrite($socket, $cmd . "\r\n");
            return $readResponse();
        };

        $banner = $readResponse();
        $log[] = "Auth Banner: {$banner}";

        $ehlo = $sendCommand("EHLO ginibengeoservices.com");
        $log[] = "Auth EHLO: {$ehlo}";

        // If port 587, upgrade to TLS
        if ($port === 587) {
            $startTls = $sendCommand("STARTTLS");
            $log[] = "STARTTLS: {$startTls}";
            if (substr($startTls, 0, 3) === '220') {
                if (!@stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT)) {
                    $log[] = "Crypto handshake failed on port 587";
                    fclose($socket);
                    return ['success' => false, 'eximId' => ''];
                }
                $ehlo2 = $sendCommand("EHLO ginibengeoservices.com");
                $log[] = "Post-TLS EHLO: {$ehlo2}";
            }
        }

        // AUTH LOGIN
        $authResp = $sendCommand("AUTH LOGIN");
        $log[] = "AUTH LOGIN: {$authResp}";
        if (substr($authResp, 0, 3) === '334') {
            $userResp = $sendCommand(base64_encode($user));
            $passResp = $sendCommand(base64_encode($pass));
            $log[] = "AUTH Status: {$passResp}";
            if (substr($passResp, 0, 3) !== '235') {
                $sendCommand("QUIT");
                fclose($socket);
                return ['success' => false, 'eximId' => ''];
            }
        }

        $mailFrom = $sendCommand("MAIL FROM:<{$fromEmail}>");
        $rcptTo = $sendCommand("RCPT TO:<{$to}>");
        if (substr($rcptTo, 0, 3) !== '250') {
            $sendCommand("QUIT");
            fclose($socket);
            return ['success' => false, 'eximId' => ''];
        }

        $dataResp = $sendCommand("DATA");
        if (substr($dataResp, 0, 3) !== '354') {
            $sendCommand("QUIT");
            fclose($socket);
            return ['success' => false, 'eximId' => ''];
        }

        $msgId = '<' . time() . '.' . md5($to . microtime(true)) . '@ginibengeoservices.com>';
        $boundary = '=_gb_' . md5(uniqid((string)time(), true));

        $dataContent = "Date: " . date('r') . "\r\n"
                     . "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <{$fromEmail}>\r\n"
                     . "To: <{$to}>\r\n"
                     . "Reply-To: =?UTF-8?B?" . base64_encode($replyName) . "?= <{$replyEmail}>\r\n"
                     . "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n"
                     . "Message-ID: {$msgId}\r\n"
                     . "MIME-Version: 1.0\r\n"
                     . "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n\r\n"
                     . "--{$boundary}\r\n"
                     . "Content-Type: text/plain; charset=UTF-8\r\n"
                     . "Content-Transfer-Encoding: base64\r\n\r\n"
                     . chunk_split(base64_encode($plainBody)) . "\r\n"
                     . "--{$boundary}\r\n"
                     . "Content-Type: text/html; charset=UTF-8\r\n"
                     . "Content-Transfer-Encoding: base64\r\n\r\n"
                     . chunk_split(base64_encode($htmlBody)) . "\r\n"
                     . "--{$boundary}--\r\n"
                     . "\r\n.";

        fwrite($socket, $dataContent . "\r\n");
        $queuedResp = $readResponse();
        $log[] = "Auth Data Queued: {$queuedResp}";

        $eximId = '';
        if (preg_match('/id=([a-zA-Z0-9\-]+)/', $queuedResp, $matches)) {
            $eximId = $matches[1];
        }

        $sendCommand("QUIT");
        fclose($socket);

        $success = (substr($queuedResp, 0, 3) === '250');
        return ['success' => $success, 'eximId' => $eximId];
    }
}
