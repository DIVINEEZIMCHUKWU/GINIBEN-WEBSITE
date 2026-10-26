<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Production Database & Application Configuration
 * Host: Truehost Shared Hosting / cPanel
 *
 * NOTE: For production, set DB credentials matching your cPanel MySQL Database.
 */

// Error reporting: Hide errors from public output, log securely
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

// Security Headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

// Database Credentials (Update with your Truehost cPanel MySQL details)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'ginibeng_geoservices');
define('DB_USER', getenv('DB_USER') ?: 'ginibeng_dbuser');
define('DB_PASS', getenv('DB_PASS') ?: 'ReplaceWithSecurePassword2026!');
define('DB_CHARSET', 'utf8mb4');

// Allowed Origins (CORS)
$allowed_origins = [
    'https://ginibengeoservices.com',
    'https://www.ginibengeoservices.com',
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
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
