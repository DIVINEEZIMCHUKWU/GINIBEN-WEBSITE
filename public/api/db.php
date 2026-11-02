<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * PDO Database Connection Provider
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;
    private static ?string $lastError = null;

    public static function getLastError(): ?string {
        return self::$lastError;
    }

    public static function tryGetConnection(): ?PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_TIMEOUT            => 5,
        ];

        // Attempt primary host then alternate (localhost socket vs 127.0.0.1 TCP)
        $configuredHost = defined('DB_HOST') ? DB_HOST : 'localhost';
        $hosts = array_values(array_unique([$configuredHost, 'localhost', '127.0.0.1']));

        foreach ($hosts as $host) {
            try {
                $port = ($host === '127.0.0.1') ? ';port=3306' : '';
                $dsn = "mysql:host={$host}{$port};dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
                self::$lastError = null;
                return self::$instance;
            } catch (Throwable $e) {
                self::$lastError = "Host [{$host}]: " . $e->getMessage();
                error_log("Database Connection Failed ({$host}): " . $e->getMessage());
            }
        }

        return null;
    }

    public static function getConnection(): PDO {
        $conn = self::tryGetConnection();
        if ($conn === null) {
            send_json([
                'success' => false,
                'message' => 'Unable to establish secure database connection. ' . (self::$lastError ?? 'Verify MySQL credentials in cPanel.')
            ], 503);
        }
        return $conn;
    }
}
