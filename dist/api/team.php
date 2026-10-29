<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Team Members API Endpoint (GET, POST, DELETE)
 * Supports full CRUD for leadership and technical geoscience team profiles.
 */

require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Self-healing table check
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `team_members` (
          `id` VARCHAR(64) NOT NULL,
          `name` VARCHAR(150) NOT NULL,
          `title` VARCHAR(180) NOT NULL,
          `role` VARCHAR(150) NOT NULL,
          `credentials` VARCHAR(255) NULL,
          `experience_years` VARCHAR(100) NULL,
          `affiliations_json` TEXT NULL,
          `bio` TEXT NOT NULL,
          `image` TEXT NOT NULL,
          `is_placeholder` TINYINT(1) NOT NULL DEFAULT 0,
          `sort_order` INT NOT NULL DEFAULT 0,
          `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          INDEX `idx_team_sort` (`sort_order`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
} catch (Exception $e) {
    error_log("team_members table check warning: " . $e->getMessage());
}

if ($method === 'GET') {
    // 1. Fetch all team members
    try {
        $stmt = $pdo->query("SELECT * FROM `team_members` ORDER BY `sort_order` ASC, `created_at` ASC");
        $rawMembers = $stmt->fetchAll();

        $members = array_map(function($m) {
            $affiliations = [];
            if (!empty($m['affiliations_json'])) {
                $decoded = json_decode($m['affiliations_json'], true);
                if (is_array($decoded)) {
                    $affiliations = $decoded;
                }
            }
            return [
                'id' => $m['id'],
                'name' => $m['name'],
                'title' => $m['title'],
                'role' => $m['role'],
                'credentials' => $m['credentials'] ?? '',
                'experienceYears' => $m['experience_years'] ?? '',
                'affiliations' => $affiliations,
                'bio' => $m['bio'],
                'image' => $m['image'],
                'isPlaceholder' => (bool)$m['is_placeholder'],
                'order' => (int)$m['sort_order']
            ];
        }, $rawMembers);

        send_json(['success' => true, 'data' => $members, 'total' => count($members)]);
    } catch (Exception $e) {
        send_json(['success' => false, 'message' => $e->getMessage(), 'data' => []], 500);
    }

} elseif ($method === 'POST') {
    // 2. Add or Update Team Member
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!is_array($data) || empty($data['name']) || empty($data['title'])) {
        send_json(['success' => false, 'message' => 'Team member name and title are required.'], 400);
    }

    $id = trim($data['id'] ?? ('team-' . round(microtime(true) * 1000)));
    $name = trim($data['name']);
    $title = trim($data['title']);
    $role = trim($data['role'] ?? $title);
    $credentials = trim($data['credentials'] ?? '');
    $experienceYears = trim($data['experienceYears'] ?? '');
    $bio = trim($data['bio'] ?? '');
    $image = trim($data['image'] ?? '');
    $sortOrder = (int)($data['order'] ?? 0);

    $affiliationsJson = '[]';
    if (!empty($data['affiliations']) && is_array($data['affiliations'])) {
        $affiliationsJson = json_encode(array_values($data['affiliations']), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO `team_members` (
                `id`, `name`, `title`, `role`, `credentials`, `experience_years`,
                `affiliations_json`, `bio`, `image`, `sort_order`
            ) VALUES (
                :id, :name, :title, :role, :credentials, :experience_years,
                :affiliations_json, :bio, :image, :sort_order
            ) ON DUPLICATE KEY UPDATE
                `name` = VALUES(`name`),
                `title` = VALUES(`title`),
                `role` = VALUES(`role`),
                `credentials` = VALUES(`credentials`),
                `experience_years` = VALUES(`experience_years`),
                `affiliations_json` = VALUES(`affiliations_json`),
                `bio` = VALUES(`bio`),
                `image` = VALUES(`image`),
                `sort_order` = VALUES(`sort_order`)
        ");

        $success = $stmt->execute([
            ':id' => $id,
            ':name' => $name,
            ':title' => $title,
            ':role' => $role,
            ':credentials' => $credentials,
            ':experience_years' => $experienceYears,
            ':affiliations_json' => $affiliationsJson,
            ':bio' => $bio,
            ':image' => $image,
            ':sort_order' => $sortOrder
        ]);

        if ($success) {
            send_json(['success' => true, 'message' => 'Team member saved successfully in database.', 'id' => $id]);
        } else {
            send_json(['success' => false, 'message' => 'Failed to save team member in database.'], 500);
        }
    } catch (Exception $e) {
        send_json(['success' => false, 'message' => $e->getMessage()], 500);
    }

} elseif ($method === 'DELETE') {
    // 3. Delete Team Member
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);
        $id = $data['id'] ?? '';
    }

    if (empty($id)) {
        send_json(['success' => false, 'message' => 'Team member ID is required for deletion.'], 400);
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM `team_members` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);
        send_json(['success' => true, 'message' => 'Team member deleted successfully from database.']);
    } catch (Exception $e) {
        send_json(['success' => false, 'message' => $e->getMessage()], 500);
    }

} else {
    send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
