<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Fieldwork Images API Endpoint (GET, POST, DELETE)
 */

require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // 1. Fetch all images
    $stmt = $pdo->query("SELECT * FROM gallery_images ORDER BY sort_order ASC, created_at DESC");
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

    send_json(['success' => true, 'data' => $images]);

} elseif ($method === 'POST') {
    // 2. Add or Update Image
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!is_array($data) || empty($data['title']) || empty($data['url'])) {
        send_json(['success' => false, 'message' => 'Image title and URL are required.'], 400);
    }

    $id = trim($data['id'] ?? ('img-' . time()));
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

    $stmt = $pdo->prepare("
        INSERT INTO gallery_images (
            id, title, url, caption, category, alt, is_hero, 
            sort_order, location, show_on_homepage, show_on_projects, show_on_gallery
        ) VALUES (
            :id, :title, :url, :caption, :category, :alt, :is_hero,
            :sort_order, :location, :show_on_homepage, :show_on_projects, :show_on_gallery
        ) ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            url = VALUES(url),
            caption = VALUES(caption),
            category = VALUES(category),
            alt = VALUES(alt),
            is_hero = VALUES(is_hero),
            sort_order = VALUES(sort_order),
            location = VALUES(location),
            show_on_homepage = VALUES(show_on_homepage),
            show_on_projects = VALUES(show_on_projects),
            show_on_gallery = VALUES(show_on_gallery)
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
        send_json(['success' => true, 'message' => 'Image saved successfully.', 'id' => $id]);
    } else {
        send_json(['success' => false, 'message' => 'Failed to save image.'], 500);
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

    $stmt = $pdo->prepare("DELETE FROM gallery_images WHERE id = :id");
    $stmt->execute([':id' => $id]);

    send_json(['success' => true, 'message' => 'Image deleted successfully.']);

} else {
    send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
