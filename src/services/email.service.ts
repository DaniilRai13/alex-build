import type { FormValues } from '@/types/contactInfo.interface';
import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
	throw new Error(
		'Chybí konfigurace EmailJS. Zkontrolujte proměnné VITE_EMAILJS_* v souboru .env',
	);
}

export const emailService = {
	send: (data: FormValues) =>
		emailjs.send(
			SERVICE_ID,
			TEMPLATE_ID,
			{
				name: data.name,
				email: data.email,
				phone: data.phone,
				message: data.message,
			},
			PUBLIC_KEY,
		),
};
