<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Consultation Enquiry Endpoint (Public Submission & Admin Review)
 */

require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // 1. Process Consultation Enquiry Submission
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!is_array($data)) {
        send_json(['success' => false, 'message' => 'Invalid JSON payload.'], 400);
    }

    $fullName = trim($data['fullName'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $company = trim($data['company'] ?? '');
    $serviceOfInterest = trim($data['serviceOfInterest'] ?? '');
    $projectLocation = trim($data['projectLocation'] ?? '');
    $subject = trim($data['subject'] ?? '');
    $message = trim($data['message'] ?? '');

    // Validation
    if (empty($fullName) || empty($email) || empty($serviceOfInterest) || empty($message)) {
        send_json([
            'success' => false,
            'message' => 'Please fill in all required fields (Name, Email, Service of Interest, and Message).'
        ], 422);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        send_json([
            'success' => false,
            'message' => 'Please provide a valid corporate or personal email address.'
        ], 422);
    }

    // Generate unique reference code
    $refNumber = 'GB-' . date('Y') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);

    $stmt = $pdo->prepare("
        INSERT INTO enquiries (
            reference_number, full_name, company, email, phone, 
            service_of_interest, project_location, subject, message, 
            status, ip_address, user_agent, created_at
        ) VALUES (
            :ref, :name, :company, :email, :phone, 
            :service, :location, :subject, :msg, 
            'new', :ip, :ua, NOW()
        )
    ");

    $success = $stmt->execute([
        ':ref'      => $refNumber,
        ':name'     => $fullName,
        ':company'  => $company,
        ':email'    => $email,
        ':phone'    => $phone,
        ':service'  => $serviceOfInterest,
        ':location' => $projectLocation,
        ':subject'  => $subject ?: 'Consultation Enquiry',
        ':msg'      => $message,
        ':ip'       => $ip,
        ':ua'       => $userAgent
    ]);

    if ($success) {
        send_json([
            'success' => true,
            'referenceNumber' => $refNumber,
            'message' => 'Your consultation enquiry has been recorded securely. Our lead geoscientists will review your specifications.'
        ], 201);
    } else {
        send_json(['success' => false, 'message' => 'Failed to record enquiry in database.'], 500);
    }
} elseif ($method === 'GET') {
    // 2. Fetch enquiries (Admin authorized)
    $stmt = $pdo->query("SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 100");
    $enquiries = $stmt->fetchAll();
    send_json(['success' => true, 'data' => $enquiries]);
} else {
    send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
