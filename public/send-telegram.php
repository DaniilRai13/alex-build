<?php
// Endpoint pro odeslání dat z kontaktního formuláře do Telegramu.
// Token a chat_id se čtou z `telegram-config.php` (mimo git, mimo prohlížeč).
// Nahrává se na hosting spolu s webem; PHP běží na serveru, do prohlížeče
// se jeho zdroj neposílá.

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['ok' => false, 'error' => 'Method Not Allowed']);
	exit;
}

$config = @include __DIR__ . '/telegram-config.php';
if (!is_array($config) || empty($config['token']) || empty($config['chat_id'])) {
	http_response_code(500);
	echo json_encode(['ok' => false, 'error' => 'Chybí konfigurace Telegramu na serveru.']);
	exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
	$data = $_POST;
}

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));

if ($name === '' && $email === '' && $phone === '' && $message === '') {
	http_response_code(400);
	echo json_encode(['ok' => false, 'error' => 'Prázdný formulář.']);
	exit;
}

$esc = static function (string $value): string {
	return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
};

$text = "🔔 <b>Nová poptávka z webu</b>\n\n"
	. '👤 <b>Jméno:</b> ' . ($esc($name) ?: '—') . "\n"
	. '📧 <b>E-mail:</b> ' . ($esc($email) ?: '—') . "\n"
	. '📞 <b>Telefon:</b> ' . ($esc($phone) ?: '—') . "\n"
	. "💬 <b>Zpráva:</b>\n" . ($esc($message) ?: '—');

$payload = json_encode([
	'chat_id' => $config['chat_id'],
	'text' => $text,
	'parse_mode' => 'HTML',
	'disable_web_page_preview' => true,
]);

$url = 'https://api.telegram.org/bot' . $config['token'] . '/sendMessage';

$httpCode = 0;
$response = false;

if (function_exists('curl_init')) {
	$ch = curl_init($url);
	curl_setopt_array($ch, [
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_POST => true,
		CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
		CURLOPT_POSTFIELDS => $payload,
		CURLOPT_TIMEOUT => 15,
	]);
	$response = curl_exec($ch);
	$httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
} else {
	$context = stream_context_create([
		'http' => [
			'method' => 'POST',
			'header' => "Content-Type: application/json\r\n",
			'content' => $payload,
			'timeout' => 15,
			'ignore_errors' => true,
		],
	]);
	$response = @file_get_contents($url, false, $context);
	if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
		$httpCode = (int) $m[1];
	}
}

if ($response === false || $httpCode >= 300 || $httpCode === 0) {
	http_response_code(502);
	echo json_encode(['ok' => false, 'error' => 'Telegram odmítl zprávu.']);
	exit;
}

echo json_encode(['ok' => true]);
