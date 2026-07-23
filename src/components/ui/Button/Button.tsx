import cn from 'classnames';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../LucidIcon/Icon';
import type { ButtonProps } from './Button.interface';
import styles from './Button.module.scss';
const Button: FC<ButtonProps> = ({
	title,
	disabled = false,
	loading = false,
	onClick,
	type = 'button',
	className = '',
	icon,
	iconSize,
	to,
	href,
	target = '_self',
}) => {
	const content = (
		<>
			{title && <h3 className={styles.title}>{title}</h3>}
			{icon && <Icon icon={icon} size={iconSize} />}
		</>
	);
	const buttonClasses = cn(styles.button, className);
	if (to && !disabled && !loading) {
		return (
			<Link to={to} className={buttonClasses} onClick={onClick}>
				{content}
			</Link>
		);
	}

	if (href && !disabled && !loading) {
		return (
			<a
				href={href}
				target={target}
				rel={target === '_blank' ? 'noopener noreferrer' : undefined}
				className={buttonClasses}
			>
				{content}
			</a>
		);
	}

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled || loading}
			className={cn(styles.button, className)}
		>
			{content}
		</button>
	);
};

export default Button;
