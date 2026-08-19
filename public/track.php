<?php
// Records one page view in Supabase.
//
// The website is static files on Forpsi, so the count has to come from
// somewhere at runtime. It goes through this file rather than straight from
// the browser for three reasons, all of which matter:
//
//   * the key stays here. A browser-side insert would need a key in the
//     bundle, and anyone could then write whatever they liked;
//   * the IP address and User-Agent are only knowable server-side — a page
//     cannot learn its own visitor's address, and without it there is no way
//     to tell one visitor from ten page refreshes;
//   * a request to our own domain is not blocked by ad blockers, which do
//     block calls to known analytics hosts.
//
// Nothing here may ever break the page: every failure answers 204 and stops.
// A missing statistic is not worth an error on a customer's screen.

require __DIR__ . '/analytics-lib.php';

// No body, and nothing to tell the caller: the browser fires this with
// sendBeacon and never looks at the answer.
$done = static function (): void {
	http_response_code(204);
	exit;
};

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	$done();
}

// Same-origin only. Not a real defence — a header is trivially forged — but it
// costs nothing and keeps the endpoint out of reach of every scanner that
// stumbles across it.
$host = (string) ($_SERVER['HTTP_HOST'] ?? '');
$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? ''));
if ($origin !== '' && strcasecmp((string) parse_url($origin, PHP_URL_HOST), $host) !== 0) {
	$done();
}

$config = analytics_config();
if ($config === null) {
	$done();
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
	$done();
}

// -- what was opened ----------------------------------------------------------

// The query string goes first: it is where personal data turns up by accident
// (?email=…), and no report here needs it.
$path = (string) strtok((string) ($data['path'] ?? ''), '?#');
if ($path === '' || $path[0] !== '/' || strlen($path) > 200) {
	$done();
}

// -- where they came from ------------------------------------------------------

$referrerHost = null;
$referrer = (string) ($data['referrer'] ?? '');
if ($referrer !== '') {
	$parsed = parse_url($referrer, PHP_URL_HOST);

	// Our own pages are not a source: moving around the site would otherwise
	// drown out the search engines that actually bring people here.
	if (is_string($parsed) && $parsed !== '' && strcasecmp($parsed, $host) !== 0) {
		$referrerHost = substr((string) preg_replace('/^www\./i', '', $parsed), 0, 253);
	}
}

// -- store ---------------------------------------------------------------------

$visitor = visitor_fingerprint($config['salt']);

supabase_insert($config, 'page_views', [
	'path' => $path,
	'visitor_hash' => $visitor['hash'],
	'referrer_host' => $referrerHost,
	'device' => $visitor['device'],
	'is_bot' => $visitor['is_bot'],
]);

$done();
