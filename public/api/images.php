<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Fieldwork Images API Endpoint (GET, POST, DELETE)
 * Supports full CRUD for 104+ verified fieldwork, drilling, and exploration images.
 */

require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Self-healing table check
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `gallery_images` (
          `id` VARCHAR(64) NOT NULL,
          `title` VARCHAR(255) NOT NULL,
          `url` TEXT NOT NULL,
          `caption` TEXT NULL,
          `category` VARCHAR(60) NOT NULL DEFAULT 'geology',
          `alt` VARCHAR(255) NULL,
          `is_hero` TINYINT(1) NOT NULL DEFAULT 0,
          `sort_order` INT NOT NULL DEFAULT 0,
          `location` VARCHAR(150) NULL,
          `show_on_homepage` TINYINT(1) NOT NULL DEFAULT 1,
          `show_on_projects` TINYINT(1) NOT NULL DEFAULT 1,
          `show_on_gallery` TINYINT(1) NOT NULL DEFAULT 1,
          `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          INDEX `idx_img_cat` (`category`),
          INDEX `idx_img_sort` (`sort_order`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
} catch (Exception $e) {
    error_log("gallery_images table check warning: " . $e->getMessage());
}

if ($method === 'GET') {
    // 1. Fetch all gallery images
    try {
        $stmt = $pdo->query("SELECT * FROM `gallery_images` ORDER BY `sort_order` ASC, `created_at` DESC");
        $rawImages = $stmt->fetchAll();

        $images = array_map(function($img) {
            return [
                'id' => $img['id'],
                'title' => $img['title'],
                'url' => $img['url'],
                'caption' => $img['caption'] ?? '',
                'category' => $img['category'],
                'alt' => $img['alt'] ?? $img['title'],
                'isHero' => (bool)$img['is_hero'],
                'order' => (int)$img['sort_order'],
                'location' => $img['location'] ?? '',
                'showOnHomepage' => (bool)$img['show_on_homepage'],
                'showOnProjects' => (bool)$img['show_on_projects'],
                'showOnGallery' => (bool)$img['show_on_gallery']
            ];
        }, $rawImages);

        send_json(['success' => true, 'data' => $images, 'total' => count($images)]);
    } catch (Exception $e) {
        send_json(['success' => false, 'message' => $e->getMessage(), 'data' => []], 500);
    }

} elseif ($method === 'POST') {
    // 2. Add or Update Image
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!is_array($data) || empty($data['title']) || empty($data['url'])) {
        send_json(['success' => false, 'message' => 'Image title and URL are required.'], 400);
    }

    $id = trim($data['id'] ?? ('img-' . round(microtime(true) * 1000)));
    $title = trim($data['title']);
    $url = trim($data['url']);
    $caption = trim($data['caption'] ?? '');
    $category = trim($data['category'] ?? 'geology');
    $alt = trim($data['alt'] ?? $title);
    $isHero = !empty($data['isHero']) ? 1 : 0;
    $order = (int)($data['order'] ?? 0);
    $location = trim($data['location'] ?? '');
    $showOnHomepage = isset($data['showOnHomepage']) ? ($data['showOnHomepage'] ? 1 : 0) : 1;
    $showOnProjects = isset($data['showOnProjects']) ? ($data['showOnProjects'] ? 1 : 0) : 1;
    $showOnGallery = isset($data['showOnGallery']) ? ($data['showOnGallery'] ? 1 : 0) : 1;

    try {
        $stmt = $pdo->prepare("
            INSERT INTO `gallery_images` (
                `id`, `title`, `url`, `caption`, `category`, `alt`, `is_hero`, 
                `sort_order`, `location`, `show_on_homepage`, `show_on_projects`, `show_on_gallery`
            ) VALUES (
                :id, :title, :url, :caption, :category, :alt, :is_hero,
                :sort_order, :location, :show_on_homepage, :show_on_projects, :show_on_gallery
            ) ON DUPLICATE KEY UPDATE
                `title` = VALUES(`title`),
                `url` = VALUES(`url`),
                `caption` = VALUES(`caption`),
                `category` = VALUES(`category`),
                `alt` = VALUES(`alt`),
                `is_hero` = VALUES(`is_hero`),
                `sort_order` = VALUES(`sort_order`),
                `location` = VALUES(`location`),
                `show_on_homepage` = VALUES(`show_on_homepage`),
                `show_on_projects` = VALUES(`show_on_projects`),
                `show_on_gallery` = VALUES(`show_on_gallery`)
        ");

        $success = $stmt->execute([
            ':id' => $id,
            ':title' => $title,
            ':url' => $url,
            ':caption' => $caption,
            ':category' => $category,
            ':alt' => $alt,
            ':is_hero' => $isHero,
            ':sort_order' => $order,
            ':location' => $location,
            ':show_on_homepage' => $showOnHomepage,
            ':show_on_projects' => $showOnProjects,
            ':show_on_gallery' => $showOnGallery
        ]);

        if ($success) {
            send_json(['success' => true, 'message' => 'Image saved successfully in database.', 'id' => $id]);
        } else {
            send_json(['success' => false, 'message' => 'Failed to save image in database.'], 500);
        }
    } catch (Exception $e) {
        send_json(['success' => false, 'message' => $e->getMessage()], 500);
    }

} elseif ($method === 'DELETE') {
    // 3. Delete Image
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);
        $id = $data['id'] ?? '';
    }

    if (empty($id)) {
        send_json(['success' => false, 'message' => 'Image ID is required for deletion.'], 400);
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM `gallery_images` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);
        send_json(['success' => true, 'message' => 'Image deleted successfully from database.']);
    } catch (Exception $e) {
        send_json(['success' => false, 'message' => $e->getMessage()], 500);
    }

} else {
    send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
