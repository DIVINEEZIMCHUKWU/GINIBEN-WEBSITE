<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Direct Media File Upload Handler for Truehost cPanel Hosting
 * Supports Image and Video Uploads directly into /uploads/
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'POST method required for file upload.'], 405);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errorMsg = 'No file was uploaded or an upload error occurred.';
    if (isset($_FILES['file']['error'])) {
        switch ($_FILES['file']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $errorMsg = 'The uploaded file exceeds the max upload limit on the server.';
                break;
            case UPLOAD_ERR_PARTIAL:
                $errorMsg = 'The file was only partially uploaded.';
                break;
            case UPLOAD_ERR_NO_FILE:
                $errorMsg = 'No file was received.';
                break;
        }
    }
    send_json(['success' => false, 'message' => $errorMsg], 400);
}

$file = $_FILES['file'];
$fileName = basename($file['name']);
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

// Allowed extensions for images and field recordings
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'mp4', 'webm', 'mov'];
if (!in_array($fileExt, $allowedExtensions, true)) {
    send_json([
        'success' => false,
        'message' => 'Unsupported file format. Supported formats: JPG, PNG, WEBP, GIF, MP4, WEBM, MOV.'
    ], 415);
}

// Upload directory on cPanel
$uploadDir = dirname(__DIR__) . '/uploads/';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

// Generate unique, sanitized filename
$uniqueName = 'giniben_' . date('Ymd_His') . '_' . substr(bin2hex(random_bytes(4)), 0, 8) . '.' . $fileExt;
$targetPath = $uploadDir . $uniqueName;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    // Generate public URL relative to domain root
    $publicUrl = '/uploads/' . $uniqueName;

    send_json([
        'success' => true,
        'url' => $publicUrl,
        'filename' => $uniqueName,
        'message' => 'File successfully uploaded and stored on server.'
    ], 201);
} else {
    send_json([
        'success' => false,
        'message' => 'Failed to move uploaded file to server directory. Please check cPanel folder permissions.'
    ], 500);
}
