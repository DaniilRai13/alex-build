<?php
// 1) Copy this file as `analytics-config.php` (same folder).
// 2) Fill in the values from Supabase → Project Settings → API.
// 3) `analytics-config.php` is in .gitignore, so the key never reaches git.
//    It is uploaded to the hosting with the site; PHP runs on the server and
//    its source is never sent to a browser.
//
// The SERVICE key, not the anon key. Writing analytics has to happen with
// something the visitor does not hold — otherwise anyone could forge rows.
// This is exactly why the write goes through PHP instead of straight from the
// browser: a service key in a JS bundle would hand over the whole database.
//
// `salt` is any long random string. It is mixed into the visitor hash so that
// nobody who somehow got the table could take a list of IP addresses and check
// which of them visited. Change it and yesterday's visitors simply become
// uncountable — never a leak, just a gap.

return [
	'url' => 'https://YOUR-PROJECT.supabase.co',
	'key' => 'PASTE_THE_SERVICE_ROLE_KEY',
	'salt' => 'PASTE_A_LONG_RANDOM_STRING',
];
