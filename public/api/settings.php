<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Website Settings Endpoint
 */

require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM website_settings");
    $rawSettings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    send_json(['success' => true, 'settings' => $rawSettings]);
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data) || empty($data['key']) || !isset($data['value'])) {
        send_json(['success' => false, 'message' => 'Invalid setting parameters.'], 400);
    }

    $stmt = $pdo->prepare("
        INSERT INTO website_settings (setting_key, setting_value, updated_at)
        VALUES (:key, :val, NOW())
        ON DUPLICATE KEY UPDATE setting_value = :val2, updated_at = NOW()
    ");

    $stmt->execute([
        ':key'  => $data['key'],
        ':val'  => $data['value'],
        ':val2' => $data['value']
    ]);

    send_json(['success' => true, 'message' => 'Setting updated successfully.']);
} else {
    send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
