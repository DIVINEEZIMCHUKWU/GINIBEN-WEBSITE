<?php
/**
 * GiniBen & Partners GEOSERVICES LTD (ginibengeoservices.com)
 * Production Configuration & .env File Loader for Truehost cPanel
 */

// Error handling: log securely, hide display from production visitors
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

// Security Headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

// Function to load .env file if it exists
function load_env_file(): void {
    $possible_paths = [
        dirname(__DIR__, 2) . '/.env',
        __DIR__ . '/.env',
        __DIR__ . '/../.env'
    ];

    foreach ($possible_paths as $env_file) {
        if (file_exists($env_file) && is_readable($env_file)) {
            $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || str_starts_with($line, '#')) {
                    continue;
                }
                if (str_contains($line, '=')) {
                    [$key, $val] = explode('=', $line, 2);
                    $key = trim($key);
                    $val = trim($val, " \t\n\r\0\x0B\"'");
                    if (!isset($_SERVER[$key]) && !isset($_ENV[$key])) {
                        putenv("$key=$val");
                        $_ENV[$key] = $val;
                        $_SERVER[$key] = $val;
                    }
                }
            }
            break;
        }
    }
}

load_env_file();

// Database Constants (populated from .env or fallback for cPanel)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'xjtqwpkd_ginibeng_geoservices');
define('DB_USER', getenv('DB_USER') ?: 'xjtqwpkd_ginibeng_dbuser');
define('DB_PASS', getenv('DB_PASS') ?: 'Giniben@2026$');
define('DB_CHARSET', getenv('DB_CHARSET') ?: 'utf8mb4');

// Notification recipients are configurable in the live .env file.
function get_notification_email(string $key, string $default): string {
    $value = getenv($key);
    if ($value === false || $value === '') {
        return $default;
    }
    if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
        error_log("Invalid {$key} value in .env; using the configured default recipient.");
        return $default;
    }
    return $value;
}

define('ADMIN_NOTIFICATION_EMAIL', get_notification_email('ADMIN_NOTIFICATION_EMAIL', 'info@ginibengeoservices.com'));
define('ADMIN_FORWARD_EMAIL_1', get_notification_email('ADMIN_FORWARD_EMAIL_1', 'benukwuteyinor@yahoomail.com'));
define('ADMIN_FORWARD_EMAIL_2', get_notification_email('ADMIN_FORWARD_EMAIL_2', 'gpgl.geoservices@gmail.com'));

// Allowed Origins (CORS)
$allowed_origins = [
    'https://ginibengeoservices.com',
    'https://www.ginibengeoservices.com',
    'http://localhost:3000',
    'http://localhost:5173'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true) || empty($origin)) {
    if (!empty($origin)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        header("Access-Control-Allow-Origin: *");
    }
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// JSON Output Helper with aggressive no-cache headers for instant synchronization
function send_json($data, int $status_code = 200): void {
    http_response_code($status_code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0');
    header('Pragma: no-cache');
    header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

// Global Exception Handler
set_exception_handler(function(Throwable $e) {
    error_log('[GiniBen API Error]: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    send_json([
        'success' => false,
        'message' => 'An internal server error occurred. Please contact the administrator.'
    ], 500);
});
