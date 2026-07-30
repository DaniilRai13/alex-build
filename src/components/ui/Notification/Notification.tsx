import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, type FC } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../LucidIcon/Icon';
import type { IconNames } from '../LucidIcon/LucidIcons.types';
import styles from './Notification.module.scss';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
	type?: NotificationType;
	message: string;
	isOpen: boolean;
	onClose: () => void;
	duration?: number;
}

const typeIcon: Record<NotificationType, IconNames> = {
	success: 'CircleCheck',
	error: 'CircleX',
	info: 'Info',
};

const Notification: FC<NotificationProps> = ({
	type = 'info',
	message,
	isOpen,
	onClose,
	duration = 4500,
}) => {
	const onCloseRef = useRef(onClose);

useEffect(() => {
	onCloseRef.current = onClose;
}, [onClose]);

	useEffect(() => {
		if (!isOpen || duration <= 0) return;
		const id = setTimeout(() => onCloseRef.current(), duration);
		return () => clearTimeout(id);
	}, [isOpen, duration, message]);

	return createPortal(
		<div className={styles.viewport}>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className={cn(styles.toast, styles[type])}
						role={type === 'error' ? 'alert' : 'status'}
						initial={{ opacity: 0, x: 40, scale: 0.96 }}
						animate={{ opacity: 1, x: 0, scale: 1 }}
						exit={{ opacity: 0, x: 40, scale: 0.96 }}
						transition={{ duration: 0.25, ease: 'easeOut' }}
					>
						<span className={styles.icon}>
							<Icon icon={typeIcon[type]} size={22} />
						</span>
						<p className={styles.message}>{message}</p>
						<button
							type='button'
							className={styles.close}
							onClick={onClose}
							aria-label='Zavřít'
						>
							<Icon icon='X' size={18} />
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>,
		document.body,
	);
};

export default Notification;
