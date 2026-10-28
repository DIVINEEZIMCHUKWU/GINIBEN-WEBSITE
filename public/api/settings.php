<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Company Settings & Password Endpoint (GET, POST)
 * Synchronizes company coordinates, phones, emails, and admin passwords in MySQL.
 */

require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Self-healing table check
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `company_settings` (
          `setting_key` VARCHAR(100) NOT NULL,
          `setting_value` LONGTEXT NOT NULL,
          `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`setting_key`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
} catch (Exception $e) {
    error_log("company_settings table check warning: " . $e->getMessage());
}

if ($method === 'GET') {
    // 1. Fetch all company settings
    try {
        $stmt = $pdo->query("SELECT `setting_key`, `setting_value` FROM `company_settings`");
        $rawSettings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

        // Hide master password hash from public response
        unset($rawSettings['admin_password_hash']);

        send_json(['success' => true, 'data' => $rawSettings]);
    } catch (Exception $e) {
        send_json(['success' => false, 'message' => $e->getMessage(), 'data' => []], 500);
    }

} elseif ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!is_array($data)) {
        send_json(['success' => false, 'message' => 'Invalid JSON payload.'], 400);
    }

    // 2. Action: Verify or Change Password
    if (!empty($data['action']) && $data['action'] === 'change_password') {
        $currentPass = trim($data['currentPassword'] ?? '');
        $newPass = trim($data['newPassword'] ?? '');

        try {
            $stmt = $pdo->prepare("SELECT `setting_value` FROM `company_settings` WHERE `setting_key` = 'admin_password'");
            $stmt->execute();
            $stored = $stmt->fetchColumn() ?: 'Giniben123';

            if ($currentPass !== $stored) {
                send_json(['success' => false, 'message' => 'Current password does not match.'], 403);
            }

            if (strlen($newPass) < 6) {
                send_json(['success' => false, 'message' => 'New password must be at least 6 characters.'], 400);
            }

            $updateStmt = $pdo->prepare("
                INSERT INTO `company_settings` (\`setting_key\`, \`setting_value\`)
                VALUES ('admin_password', :pass)
                ON DUPLICATE KEY UPDATE \`setting_value\` = :pass
            ");
            $updateStmt->execute([':pass' => $newPass]);

            send_json(['success' => true, 'message' => 'Administrator password successfully updated in database.']);
        } catch (Exception $e) {
            send_json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // 3. Action: Update Coordinates (Bulk or single)
    try {
        $stmt = $pdo->prepare("
            INSERT INTO `company_settings` (\`setting_key\`, \`setting_value\`)
            VALUES (:key, :val)
            ON DUPLICATE KEY UPDATE \`setting_value\` = :val2
        ");

        if (isset($data['settings']) && is_array($data['settings'])) {
            foreach ($data['settings'] as $k => $v) {
                $stmt->execute([':key' => $k, ':val' => (string)$v, ':val2' => (string)$v]);
            }
        } elseif (isset($data['key']) && isset($data['value'])) {
            $stmt->execute([':key' => $data['key'], ':val' => (string)$data['value'], ':val2' => (string)$data['value']]);
        }

        send_json(['success' => true, 'message' => 'Company settings saved successfully in MySQL.']);
    } catch (Exception $e) {
        send_json(['success' => false, 'message' => $e->getMessage()], 500);
    }

} else {
    send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
