<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Project Videos API Endpoint (GET, POST, DELETE)
 * Supports full CRUD for field exploration and drilling video records.
 */

require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Self-healing table check
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `project_videos` (
          `id` VARCHAR(64) NOT NULL,
          `title` VARCHAR(255) NOT NULL,
          `subtitle` VARCHAR(255) NULL,
          `drive_view_url` TEXT NOT NULL,
          `drive_preview_url` TEXT NOT NULL,
          `thumbnail` TEXT NOT NULL,
          `description` TEXT NULL,
          `is_vertical` TINYINT(1) NOT NULL DEFAULT 1,
          `orientation` VARCHAR(20) NOT NULL DEFAULT 'vertical',
          `show_on_homepage` TINYINT(1) NOT NULL DEFAULT 1,
          `show_on_projects` TINYINT(1) NOT NULL DEFAULT 1,
          `show_on_gallery` TINYINT(1) NOT NULL DEFAULT 1,
          `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
} catch (Exception $e) {
    error_log("project_videos table check warning: " . $e->getMessage());
}

if ($method === 'GET') {
    // 1. Fetch all videos
    try {
        $stmt = $pdo->query("SELECT * FROM `project_videos` ORDER BY `created_at` ASC");
        $rawVideos = $stmt->fetchAll();

        $videos = array_map(function($v) {
            return [
                'id' => $v['id'],
                'title' => $v['title'],
                'subtitle' => $v['subtitle'] ?? '',
                'driveViewUrl' => $v['drive_view_url'],
                'drivePreviewUrl' => $v['drive_preview_url'],
                'thumbnail' => $v['thumbnail'],
                'description' => $v['description'] ?? '',
                'isVertical' => (bool)$v['is_vertical'],
                'orientation' => $v['orientation'] ?? 'vertical',
                'showOnHomepage' => (bool)$v['show_on_homepage'],
                'showOnProjects' => (bool)$v['show_on_projects'],
                'showOnGallery' => (bool)$v['show_on_gallery']
            ];
        }, $rawVideos);

        send_json(['success' => true, 'data' => $videos, 'total' => count($videos)]);
    } catch (Exception $e) {
        send_json(['success' => false, 'message' => $e->getMessage(), 'data' => []], 500);
    }

} elseif ($method === 'POST') {
    // 2. Add or Update Video
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!is_array($data) || empty($data['title']) || empty($data['driveViewUrl'])) {
        send_json(['success' => false, 'message' => 'Video title and URL are required.'], 400);
    }

    $id = trim($data['id'] ?? ('vid-' . round(microtime(true) * 1000)));
    $title = trim($data['title']);
    $subtitle = trim($data['subtitle'] ?? '');
    $driveViewUrl = trim($data['driveViewUrl']);
    $drivePreviewUrl = trim($data['drivePreviewUrl'] ?? $driveViewUrl);
    $thumbnail = trim($data['thumbnail'] ?? '');
    $description = trim($data['description'] ?? '');
    $isVertical = isset($data['isVertical']) ? ($data['isVertical'] ? 1 : 0) : 1;
    $orientation = trim($data['orientation'] ?? 'vertical');
    $showOnHomepage = isset($data['showOnHomepage']) ? ($data['showOnHomepage'] ? 1 : 0) : 1;
    $showOnProjects = isset($data['showOnProjects']) ? ($data['showOnProjects'] ? 1 : 0) : 1;
    $showOnGallery = isset($data['showOnGallery']) ? ($data['showOnGallery'] ? 1 : 0) : 1;

    // Convert Drive view link to embeddable preview if applicable
    if (strpos($drivePreviewUrl, 'drive.google.com/file/d/') !== false) {
        preg_match('/\/file\/d\/([a-zA-Z0-9_-]+)/', $drivePreviewUrl, $matches);
        if (!empty($matches[1])) {
            $drivePreviewUrl = "https://drive.google.com/file/d/{$matches[1]}/preview";
        }
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO `project_videos` (
                `id`, `title`, `subtitle`, `drive_view_url`, `drive_preview_url`, `thumbnail`,
                `description`, `is_vertical`, `orientation`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`
            ) VALUES (
                :id, :title, :subtitle, :drive_view_url, :drive_preview_url, :thumbnail,
                :description, :is_vertical, :orientation, :show_on_homepage, :show_on_projects, :show_on_gallery
            ) ON DUPLICATE KEY UPDATE
                `title` = VALUES(`title`),
                `subtitle` = VALUES(`subtitle`),
                `drive_view_url` = VALUES(`drive_view_url`),
                `drive_preview_url` = VALUES(`drive_preview_url`),
                `thumbnail` = VALUES(`thumbnail`),
                `description` = VALUES(`description`),
                `is_vertical` = VALUES(`is_vertical`),
                `orientation` = VALUES(`orientation`),
                `show_on_homepage` = VALUES(`show_on_homepage`),
                `show_on_projects` = VALUES(`show_on_projects`),
                `show_on_gallery` = VALUES(`show_on_gallery`)
        ");

        $success = $stmt->execute([
            ':id' => $id,
            ':title' => $title,
            ':subtitle' => $subtitle,
            ':drive_view_url' => $driveViewUrl,
            ':drive_preview_url' => $drivePreviewUrl,
            ':thumbnail' => $thumbnail,
            ':description' => $description,
            ':is_vertical' => $isVertical,
            ':orientation' => $orientation,
            ':show_on_homepage' => $showOnHomepage,
            ':show_on_projects' => $showOnProjects,
            ':show_on_gallery' => $showOnGallery
        ]);

        if ($success) {
            send_json(['success' => true, 'message' => 'Video saved successfully in database.', 'id' => $id]);
        } else {
            send_json(['success' => false, 'message' => 'Failed to save video in database.'], 500);
        }
    } catch (Exception $e) {
        send_json(['success' => false, 'message' => $e->getMessage()], 500);
    }

} elseif ($method === 'DELETE') {
    // 3. Delete Video
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);
        $id = $data['id'] ?? '';
    }

    if (empty($id)) {
        send_json(['success' => false, 'message' => 'Video ID is required for deletion.'], 400);
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM `project_videos` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);
        send_json(['success' => true, 'message' => 'Video deleted successfully from database.']);
    } catch (Exception $e) {
        send_json(['success' => false, 'message' => $e->getMessage()], 500);
    }

} else {
    send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
