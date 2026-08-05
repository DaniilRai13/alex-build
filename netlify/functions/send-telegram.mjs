// Netlify Function (v2): přijme data z kontaktního formuláře a pošle je
// do Telegramu přes Bot API. Token a chat_id jsou v env proměnných na
// serveru (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) – do prohlížeče se nedostanou.

const escapeHtml = (value = '') =>
	String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

export default async req => {
	if (req.method !== 'POST') {
		return new Response('Method Not Allowed', { status: 405 });
	}

	const token = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TELEGRAM_CHAT_ID;

	if (!token || !chatId) {
		return Response.json(
			{ ok: false, error: 'Chybí konfigurace Telegramu na serveru.' },
			{ status: 500 },
		);
	}

	let data;
	try {
		data = await req.json();
	} catch {
		return Response.json({ ok: false, error: 'Neplatná data.' }, { status: 400 });
	}

	const { name, email, phone, message } = data ?? {};
	if (!name && !phone && !email && !message) {
		return Response.json(
			{ ok: false, error: 'Prázdný formulář.' },
			{ status: 400 },
		);
	}

	const text = [
		'🔔 <b>Nová poptávka z webu</b>',
		'',
		`👤 <b>Jméno:</b> ${escapeHtml(name) || '—'}`,
		`📧 <b>E-mail:</b> ${escapeHtml(email) || '—'}`,
		`📞 <b>Telefon:</b> ${escapeHtml(phone) || '—'}`,
		'💬 <b>Zpráva:</b>',
		escapeHtml(message) || '—',
	].join('\n');

	const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			chat_id: chatId,
			text,
			parse_mode: 'HTML',
			disable_web_page_preview: true,
		}),
	});

	if (!tgRes.ok) {
		const detail = await tgRes.text();
		return Response.json(
			{ ok: false, error: 'Telegram odmítl zprávu.', detail },
			{ status: 502 },
		);
	}

	return Response.json({ ok: true });
};
