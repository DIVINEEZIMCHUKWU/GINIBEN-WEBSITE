<?php
/**
 * GiniBen & Partners GEOSERVICES LTD
 * Consultation Enquiry Endpoint (GET, POST, PUT, DELETE)
 */

require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // 1. Fetch enquiries for Admin
    $stmt = $pdo->query("SELECT * FROM consultation_enquiries ORDER BY created_at DESC LIMIT 200");
    $rawEnquiries = $stmt->fetchAll();

    $enquiries = array_map(function($e) {
        return [
            'id' => $e['id'],
            'referenceNumber' => $e['reference_number'],
            'fullName' => $e['full_name'],
            'company' => $e['company'] ?? '',
            'email' => $e['email'],
            'phone' => $e['phone'] ?? '',
            'serviceOfInterest' => $e['service_of_interest'],
            'projectLocation' => $e['project_location'] ?? '',
            'subject' => $e['subject'],
            'message' => $e['message'],
            'status' => $e['status'],
            'createdAt' => $e['created_at']
        ];
    }, $rawEnquiries);

    send_json(['success' => true, 'data' => $enquiries]);

} elseif ($method === 'POST') {
    // 2. Process New Consultation Enquiry Submission
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!is_array($data)) {
        send_json(['success' => false, 'message' => 'Invalid JSON payload.'], 400);
    }

    $id = trim($data['id'] ?? ('enq-' . time()));
    $fullName = trim($data['fullName'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $company = trim($data['company'] ?? '');
    $serviceOfInterest = trim($data['serviceOfInterest'] ?? '');
    $projectLocation = trim($data['projectLocation'] ?? '');
    $subject = trim($data['subject'] ?? '');
    $message = trim($data['message'] ?? '');
    $status = trim($data['status'] ?? 'new');

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

    // Generate unique reference code if not provided
    $refNumber = trim($data['referenceNumber'] ?? ('GB-' . date('Y') . '-' . rand(1000, 9999)));
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);

    $stmt = $pdo->prepare("
        INSERT INTO consultation_enquiries (
            id, reference_number, full_name, company, email, phone, 
            service_of_interest, project_location, subject, message, 
            status, ip_address, user_agent, created_at
        ) VALUES (
            :id, :ref, :name, :company, :email, :phone, 
            :service, :location, :subject, :msg, 
            :status, :ip, :ua, NOW()
        ) ON DUPLICATE KEY UPDATE
            status = VALUES(status),
            full_name = VALUES(full_name),
            company = VALUES(company),
            phone = VALUES(phone)
    ");

    $success = $stmt->execute([
        ':id'       => $id,
        ':ref'      => $refNumber,
        ':name'     => $fullName,
        ':company'  => $company,
        ':email'    => $email,
        ':phone'    => $phone,
        ':service'  => $serviceOfInterest,
        ':location' => $projectLocation,
        ':subject'  => $subject ?: 'Consultation Enquiry',
        ':msg'      => $message,
        ':status'   => $status,
        ':ip'       => $ip,
        ':ua'       => $userAgent
    ]);

    // Send server-side notification email if enabled on host
    @mail(
        'info@ginibengeoservices.com',
        "New Technical Consultation: {$serviceOfInterest} [{$refNumber}]",
        "Reference: {$refNumber}\nName: {$fullName}\nEmail: {$email}\nPhone: {$phone}\nCompany: {$company}\nLocation: {$projectLocation}\nService: {$serviceOfInterest}\n\nMessage:\n{$message}",
        "From: noreply@ginibengeoservices.com\r\nReply-To: {$email}\r\nCc: benukwutevinor@yahoo.com, gpg1.geoservices@gmail.com\r\nX-Mailer: PHP/" . phpversion()
    );

    if ($success) {
        send_json([
            'success' => true,
            'id' => $id,
            'referenceNumber' => $refNumber,
            'message' => 'Consultation enquiry recorded successfully.'
        ], 201);
    } else {
        send_json(['success' => false, 'message' => 'Failed to record enquiry in database.'], 500);
    }

} elseif ($method === 'PUT') {
    // 3. Update enquiry status
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    $id = trim($data['id'] ?? '');
    $status = trim($data['status'] ?? '');

    if (empty($id) || !in_array($status, ['new', 'reviewed', 'resolved'], true)) {
        send_json(['success' => false, 'message' => 'Valid ID and status are required.'], 400);
    }

    $stmt = $pdo->prepare("UPDATE consultation_enquiries SET status = :status WHERE id = :id");
    $stmt->execute([':status' => $status, ':id' => $id]);

    send_json(['success' => true, 'message' => 'Status updated successfully.']);

} elseif ($method === 'DELETE') {
    // 4. Delete enquiry or Clear All
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);
        $id = $data['id'] ?? '';
    }

    if ($id === 'ALL' || (!empty($_GET['all']) && $_GET['all'] === 'true')) {
        $pdo->query("TRUNCATE TABLE consultation_enquiries");
        send_json(['success' => true, 'message' => 'All enquiries cleared successfully.']);
    } elseif (!empty($id)) {
        $stmt = $pdo->prepare("DELETE FROM consultation_enquiries WHERE id = :id");
        $stmt->execute([':id' => $id]);
        send_json(['success' => true, 'message' => 'Enquiry deleted successfully.']);
    } else {
        send_json(['success' => false, 'message' => 'Enquiry ID is required.'], 400);
    }

} else {
    send_json(['success' => false, 'message' => 'Method not allowed.'], 405);
}
