<?php
// Endpoint pro odeslání kontaktního formuláře e-mailem.
// Posílá z adresy na VLASTNÍ doméně přímo ze serveru Forpsi → SPF sedí a zpráva
// končí ve Doručené (na rozdíl od externí služby, kterou spam filtr odmítal).

header('Content-Type: application/json; charset=utf-8');

// --- Kam a odkud posílat. Adresy musí být na doméně webu kvůli doručitelnosti. ---
$TO = 'info@kartstav.cz';       // schránka, kam chodí poptávky
$FROM = 'info@kartstav.cz';     // odesílatel (na vlastní doméně)
$FROM_NAME = 'KartStav web';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['ok' => false, 'error' => 'Method Not Allowed']);
	exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
	$data = $_POST;
}

// Odstraní CR/LF – ochrana proti injekci e-mailových hlaviček.
$clean = static function ($value): string {
	return trim(str_replace(["\r", "\n"], ' ', (string) $value));
};

$name = $clean($data['name'] ?? '');
$email = $clean($data['email'] ?? '');
$phone = $clean($data['phone'] ?? '');
$message = trim((string) ($data['message'] ?? ''));

if ($name === '' && $email === '' && $phone === '' && $message === '') {
	http_response_code(400);
	echo json_encode(['ok' => false, 'error' => 'Prázdný formulář.']);
	exit;
}

$subject = 'Nová poptávka z webu' . ($name !== '' ? ': ' . $name : '');

$body = "Nová poptávka z kontaktního formuláře:\n\n"
	. 'Jméno:   ' . ($name ?: '—') . "\n"
	. 'Telefon: ' . ($phone ?: '—') . "\n"
	. 'E-mail:  ' . ($email ?: '—') . "\n\n"
	. "Zpráva:\n" . ($message !== '' ? $message : '—') . "\n";

// UTF-8 kódování hlaviček (diakritika ve jménu / předmětu).
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$encodedFromName = '=?UTF-8?B?' . base64_encode($FROM_NAME) . '?=';

$headers = [
	'MIME-Version: 1.0',
	'Content-Type: text/plain; charset=UTF-8',
	'Content-Transfer-Encoding: 8bit',
	'From: ' . $encodedFromName . ' <' . $FROM . '>',
];
// Reply-To = e-mail návštěvníka → v poště jde rovnou „Odpovědět".
if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
	$headers[] = 'Reply-To: ' . $email;
}

// -f nastaví envelope-from (Return-Path) kvůli SPF zarovnání.
$ok = @mail(
	$TO,
	$encodedSubject,
	$body,
	implode("\r\n", $headers),
	'-f' . $FROM
);

if (!$ok) {
	http_response_code(502);
	echo json_encode(['ok' => false, 'error' => 'Nepodařilo se odeslat e-mail.']);
	exit;
}

echo json_encode(['ok' => true]);
