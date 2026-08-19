// Tells the server that a page was opened. The endpoint is our own PHP file on
// Forpsi (public/track.php), not an analytics host: a request to a third party
// is what ad blockers stop, and the key that writes to the database has to stay
// on the server anyway.
//
// Nothing identifying is sent from here — not even an id. The server derives a
// daily, salted hash from the IP and User-Agent it already sees, which is why
// this needs no cookie and the site needs no consent banner.
const ENDPOINT = '/track.php';

/** Set this in the console on your own devices so your visits are not counted. */
const OPT_OUT_KEY = 'kartstav:notrack';

const isOptedOut = () => {
	try {
		return localStorage.getItem(OPT_OUT_KEY) !== null;
	} catch {
		// Private mode, or storage disabled entirely. Not a reason to skip the
		// count — only a reason not to crash reading it.
		return false;
	}
};

export const trackPageView = (path: string) => {
	// Prerendering runs this module in Node, and `npm run dev` would otherwise
	// fill the table with the developer's own reloads.
	if (typeof window === 'undefined' || import.meta.env.DEV) return;

	if (isOptedOut()) return;

	const body = JSON.stringify({
		path,
		// Only used to derive the source host; the server drops our own domain
		// and keeps nothing else from it.
		referrer: document.referrer || '',
	});

	// sendBeacon hands the request to the browser and returns immediately — it
	// survives the page being closed and cannot delay a navigation. Text, not
	// JSON, as the blob type: a JSON content type would make this a preflighted
	// cross-origin-style request in some browsers, and beacons cannot preflight.
	try {
		if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: 'text/plain' }))) {
			return;
		}
	} catch {
		// Falls through to fetch below.
	}

	// Older Safari, and the case where the beacon queue is full.
	void fetch(ENDPOINT, {
		method: 'POST',
		body,
		keepalive: true,
		// Analytics must never surface as a broken promise on a customer's page.
	}).catch(() => {});
};
