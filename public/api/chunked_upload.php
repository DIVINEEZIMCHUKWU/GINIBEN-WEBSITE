<?php
/**
 * GiniBen & Partners GEOSERVICES LTD (ginibengeoservices.com)
 * Chunked Media & Video Upload Handler for Truehost cPanel Hosting
 * 
 * Bypasses PHP upload_max_filesize and post_max_size limits on shared hosting
 * by receiving large videos in small 1.5MB slices and stitching them into /uploads/.
 */

require_once __DIR__ . '/config.php';

// Disable execution time limit for stitching large files
@set_time_limit(600);
@ini_set('memory_limit', '256M');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'POST method required for chunked upload.'], 405);
}

// Read parameters
$chunkIndex = isset($_POST['chunkIndex']) ? (int)$_POST['chunkIndex'] : -1;
$totalChunks = isset($_POST['totalChunks']) ? (int)$_POST['totalChunks'] : -1;
$fileId = isset($_POST['fileId']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['fileId']) : '';
$originalName = isset($_POST['fileName']) ? basename($_POST['fileName']) : 'video.mp4';

if ($chunkIndex < 0 || $totalChunks <= 0 || empty($fileId)) {
    send_json([
        'success' => false,
        'message' => 'Invalid chunk upload parameters (chunkIndex, totalChunks, fileId are required).'
    ], 400);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    send_json([
        'success' => false,
        'message' => 'Chunk data was not received or an upload error occurred.'
    ], 400);
}

// Target uploads directory
$uploadDir = dirname(__DIR__) . '/uploads/';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

// Temporary file for assembling chunks
$tempFilePath = $uploadDir . 'tmp_' . $fileId . '.part';

// Append current chunk to temporary file
$chunkData = file_get_contents($_FILES['file']['tmp_name']);
if ($chunkData === false) {
    send_json(['success' => false, 'message' => 'Failed to read chunk data.'], 500);
}

$appendResult = file_put_contents($tempFilePath, $chunkData, FILE_APPEND | LOCK_EX);
if ($appendResult === false) {
    send_json(['success' => false, 'message' => 'Failed to write chunk to temporary server file.'], 500);
}

// Check if this was the last chunk
$isLastChunk = ($chunkIndex >= $totalChunks - 1);

if ($isLastChunk) {
    // Determine extension
    $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $allowed = ['mp4', 'webm', 'mov', 'm4v', '3gp', 'mkv', 'avi', 'jpg', 'jpeg', 'png', 'webp'];
    if (!in_array($ext, $allowed, true)) {
        $ext = 'mp4';
    }

    // Final unique filename
    $finalFilename = 'giniben_video_' . date('Ymd_His') . '_' . substr(bin2hex(random_bytes(4)), 0, 8) . '.' . $ext;
    $finalFilePath = $uploadDir . $finalFilename;

    if (@rename($tempFilePath, $finalFilePath)) {
        @chmod($finalFilePath, 0644);
        $publicUrl = '/uploads/' . $finalFilename;
        $fileSizeBytes = filesize($finalFilePath);

        // Clean up any stale temp files older than 6 hours
        $files = @glob($uploadDir . 'tmp_*.part');
        if (is_array($files)) {
            $now = time();
            foreach ($files as $f) {
                if (is_file($f) && ($now - filemtime($f) > 21600)) {
                    @unlink($f);
                }
            }
        }

        send_json([
            'success' => true,
            'url' => $publicUrl,
            'filename' => $finalFilename,
            'size' => $fileSizeBytes,
            'message' => 'Video successfully assembled and stored on server.'
        ], 201);
    } else {
        send_json([
            'success' => false,
            'message' => 'Failed to finalize assembled video file on server.'
        ], 500);
    }
} else {
    // Chunk received successfully
    send_json([
        'success' => true,
        'chunkIndex' => $chunkIndex,
        'totalChunks' => $totalChunks,
        'message' => "Chunk {$chunkIndex} of {$totalChunks} saved."
    ], 200);
}
