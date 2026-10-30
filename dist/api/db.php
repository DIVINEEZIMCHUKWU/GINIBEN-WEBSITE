<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * PDO Database Connection Provider
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;

    public static function tryGetConnection(): ?PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_TIMEOUT            => 5,
        ];

        try {
            self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            return self::$instance;
        } catch (Throwable $e) {
            error_log("Database Connection Failed: " . $e->getMessage());
            return null;
        }
    }

    public static function getConnection(): PDO {
        $conn = self::tryGetConnection();
        if ($conn === null) {
            send_json([
                'success' => false,
                'message' => 'Unable to establish secure database connection. Please verify MySQL credentials in cPanel.'
            ], 503);
        }
        return $conn;
    }
}
