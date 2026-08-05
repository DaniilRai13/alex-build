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
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			throw new Error(`Telegram notification failed (${res.status})`);
		}

		return res.json();
	},
};
