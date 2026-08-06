import type { FormValues } from '@/types/contactInfo.interface';

// Posílá data formuláře na PHP endpoint (Forpsi/Apache), který odešle e-mail
// z adresy na vlastní doméně. Díky tomu zpráva nekončí ve spamu.
const ENDPOINT = '/send-mail.php';

export const mailService = {
	send: async (data: FormValues) => {
		const res = await fetch(ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			throw new Error(`Email notification failed (${res.status})`);
		}

		return res.json();
	},
};
