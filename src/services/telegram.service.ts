import type { FormValues } from '@/types/contactInfo.interface';

// Posílá data formuláře na PHP endpoint (Forpsi/Apache), který je předá do
// Telegramu. Token bota zůstává na serveru (telegram-config.php), do
// prohlížeče se nedostane.
const ENDPOINT = '/send-telegram.php';

export const telegramService = {
	send: async (data: FormValues) => {
		const res = await fetch(ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			// The page the form was sent from. Ignored by the delivery itself —
			// it is what lets the statistics say which page earns enquiries.
			body: JSON.stringify({ ...data, path: window.location.pathname }),
		});

		if (!res.ok) {
			throw new Error(`Telegram notification failed (${res.status})`);
		}

		return res.json();
	},
};
