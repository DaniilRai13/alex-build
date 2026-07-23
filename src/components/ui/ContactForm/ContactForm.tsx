import { contactValidation } from '@/config/contactValidation';
import { emailService } from '@/services/email.service';
import type { FormValues } from '@/types/contactInfo.interface';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Button from '../Button/Button';
import styles from './ContactForm.module.scss';

type SubmitStatus = 'idle' | 'success' | 'error';

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
		try {
			await emailService.send(data);
			reset();
			setStatus('success');
		} catch (error) {
			console.error(error);
			setStatus('error');
		}
	};
	return (
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

			{status === 'success' && (
				<p role='status' style={{ color: '#2e7d32', marginTop: 12 }}>
					Děkujeme! Vaše zpráva byla odeslána.
				</p>
			)}
			{status === 'error' && (
				<p role='alert' style={{ color: '#c62828', marginTop: 12 }}>
					Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.
				</p>
			)}
		</form>
	);
};

export default ContactForm;
