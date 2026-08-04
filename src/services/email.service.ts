import type { FormValues } from '@/types/contactInfo.interface';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const emailService = {
	// emailjs se načítá dynamicky – knihovna je jen pro prohlížeč (SSR-safe)
	// a nezatěžuje úvodní bundle.
	send: async (data: FormValues) => {
		if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
			throw new Error(
				'Chybí konfigurace EmailJS. Zkontrolujte proměnné VITE_EMAILJS_* v souboru .env',
			);
		}

		const { default: emailjs } = await import('@emailjs/browser');

		return emailjs.send(
			SERVICE_ID,
			TEMPLATE_ID,
			{
				name: data.name,
				email: data.email,
				phone: data.phone,
				message: data.message,
			},
			PUBLIC_KEY,
		);
	},
};
