import { contactValidation } from '@/config/contactValidation';
import { mailService } from '@/services/mail.service';
import { telegramService } from '@/services/telegram.service';
import type { FormValues } from '@/types/contactInfo.interface';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Button from '../Button/Button';
import Notification from '../Notification/Notification';
import styles from './ContactForm.module.scss';

type SubmitStatus = 'idle' | 'success' | 'error';

const messages = {
	success: 'Děkujeme! Vaše zpráva byla odeslána.',
	error: 'Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.',
};

const ContactForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<FormValues>();

	const [status, setStatus] = useState<SubmitStatus>('idle');

	const onSubmit: SubmitHandler<FormValues> = async data => {
		setStatus('idle');

		const results = await Promise.allSettled([
			mailService.send(data),
			telegramService.send(data),
		]);

		results
			.filter(result => result.status === 'rejected')
			.forEach(result => console.error(result.reason));

		// Úspěch, pokud prošel aspoň jeden kanál (e-mail nebo Telegram).
		if (results.some(result => result.status === 'fulfilled')) {
			reset();
			setStatus('success');
		} else {
			setStatus('error');
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
				<div className={styles.row}>
					<div className={styles.field}>
						<input
							placeholder='Vaše jméno'
							{...register('name', contactValidation.name)}
						/>

						{errors.name && <span>{errors.name.message}</span>}
					</div>

					<div className={styles.field}>
						<input
							placeholder='E-mail'
							{...register('email', contactValidation.email)}
						/>
						{errors.email && <span>{errors.email.message}</span>}
					</div>
				</div>

				<div className={styles.field}>
					<input
						placeholder='Telefon'
						{...register('phone', contactValidation.phone)}
					/>
					{errors.phone && <span>{errors.phone.message}</span>}
				</div>

				<div className={styles.field}>
					<textarea
						rows={6}
						placeholder='Řekněte nám o svém projektu'
						{...register('message')}
					/>
				</div>
				<Button
					type='submit'
					title={isSubmitting ? 'Odesílání…' : 'Odeslat zprávu'}
					disabled={isSubmitting}
				/>
			</form>

			<Notification
				type={status === 'error' ? 'error' : 'success'}
				message={status === 'error' ? messages.error : messages.success}
				isOpen={status !== 'idle'}
				onClose={() => setStatus('idle')}
			/>
		</>
	);
};

export default ContactForm;
