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
        __DIR__ . '/.env',
        __DIR__ . '/../.env',
        __DIR__ . '/../../.env',
        dirname(__DIR__, 2) . '/.env'
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
define('DB_NAME', getenv('DB_NAME') ?: 'ginibeng_geoservices');
define('DB_USER', getenv('DB_USER') ?: 'ginibeng_dbuser');
define('DB_PASS', getenv('DB_PASS') ?: 'ReplaceWithYourCPanelDbPassword2026!');
define('DB_CHARSET', getenv('DB_CHARSET') ?: 'utf8mb4');

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

// JSON Output Helper
function send_json($data, int $status_code = 200): void {
    http_response_code($status_code);
    header('Content-Type: application/json; charset=utf-8');
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
