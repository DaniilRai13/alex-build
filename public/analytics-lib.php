<?php
// Shared server side of the site statistics: the config, the visitor
// fingerprint, and one row into Supabase.
//
// Used by track.php (page views) and by the two form endpoints (leads). None
// of it may ever fail loudly: a page view that went uncounted is invisible, a
// contact form that broke because of a counter is not.

if (!function_exists('analytics_config')) {
	/** @return array<string,string>|null Null when the site has no analytics configured. */
	function analytics_config(): ?array
	{
		$config = @include __DIR__ . '/analytics-config.php';

		if (!is_array($config) || empty($config['url']) || empty($config['key']) || empty($config['salt'])) {
			return null;
		}

		return $config;
	}

	/**
	 * Who is asking, in a form that cannot be turned back into a person.
	 *
	 * The hash covers IP + User-Agent + today's date + a secret salt:
	 *   * the same visitor refreshing a page produces the same value, so
	 *     "visitors" means people and not page loads;
	 *   * the value changes at midnight, so nobody can be followed from one
	 *     day to the next — which is exactly what keeps this a count rather
	 *     than a record about someone;
	 *   * the address itself is never stored, and the salt makes it useless to
	 *     try a list of known addresses against the table.
	 *
	 * REMOTE_ADDR, never X-Forwarded-For: that header is set by the caller, and
	 * a forgeable input would let one client look like a crowd.
	 *
	 * @return array{hash:string,device:string,is_bot:bool}
	 */
	function visitor_fingerprint(string $salt): array
	{
		$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
		$agent = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');

		$device = 'desktop';
		if (preg_match('/iPad|Tablet|PlayBook|Silk/i', $agent)) {
			$device = 'tablet';
		} elseif (preg_match('/Mobi|Android|iPhone|iPod|Windows Phone/i', $agent)) {
			$device = 'mobile';
		}

		return [
			'hash' => hash('sha256', $ip . '|' . $agent . '|' . gmdate('Y-m-d') . '|' . $salt),
			'device' => $device,
			// Recorded rather than dropped: without the flag there is no way to
			// tell later whether a quiet week was real or a crawler was noisy.
			'is_bot' => (bool) preg_match(
				'/bot|crawl|spider|slurp|search|index|monitor|preview|headless|lighthouse|curl|wget|python-requests|facebookexternalhit|whatsapp|telegrambot/i',
				$agent
			),
		];
	}

	/**
	 * One row into one table, over the Supabase REST API.
	 *
	 * @param array<string,string> $config
	 * @param array<string,mixed> $row
	 */
	function supabase_insert(array $config, string $table, array $row): bool
	{
		$url = rtrim((string) $config['url'], '/') . '/rest/v1/' . rawurlencode($table);
		$payload = json_encode($row, JSON_UNESCAPED_UNICODE);
		if ($payload === false) {
			return false;
		}

		$headers = [
			'Content-Type: application/json',
			'apikey: ' . $config['key'],
			'Authorization: Bearer ' . $config['key'],
			// Nothing to read back, and asking for the row costs a round trip
			// of data that would be thrown away.
			'Prefer: return=minimal',
		];

		// Short on purpose: someone is waiting on this request, and a database
		// that has not answered in five seconds is not going to save the page.
		$timeout = 5;
		$code = 0;

		if (function_exists('curl_init')) {
			$ch = curl_init($url);
			curl_setopt_array($ch, [
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_POST => true,
				CURLOPT_HTTPHEADER => $headers,
				CURLOPT_POSTFIELDS => $payload,
				CURLOPT_TIMEOUT => $timeout,
				CURLOPT_CONNECTTIMEOUT => $timeout,
			]);
			curl_exec($ch);
			$code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
			curl_close($ch);
		} else {
			$context = stream_context_create([
				'http' => [
					'method' => 'POST',
					'header' => implode("\r\n", $headers) . "\r\n",
					'content' => $payload,
					'timeout' => $timeout,
					'ignore_errors' => true,
				],
			]);

			@file_get_contents($url, false, $context);

			if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
				$code = (int) $m[1];
			}
		}

		return $code >= 200 && $code < 300;
	}

	/**
	 * Records that the contact form was sent. Called by both form endpoints,
	 * each with its own channel, so a message that reached Telegram but not
	 * e-mail shows up as one delivered and one failed rather than vanishing.
	 *
	 * No name, e-mail or message text: that content is already in the inbox,
	 * and a second copy in the database would be personal data we would have
	 * to look after without learning anything from it.
	 */
	function record_lead(string $channel, bool $delivered, ?string $path): void
	{
		$config = analytics_config();
		if ($config === null) {
			return;
		}

		$visitor = visitor_fingerprint($config['salt']);

		// Bots do not fill in contact forms; anything that looks like one here
		// is a spam script, and counting it would flatter the conversion rate.
		if ($visitor['is_bot']) {
			return;
		}

		$path = is_string($path) ? (string) strtok($path, '?#') : '';

		supabase_insert($config, 'leads', [
			'path' => ($path !== '' && $path[0] === '/') ? substr($path, 0, 200) : null,
			'visitor_hash' => $visitor['hash'],
			'device' => $visitor['device'],
			'channel' => $channel,
			'delivered' => $delivered,
		]);
	}
}
