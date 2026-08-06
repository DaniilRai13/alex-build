import type { IconNames } from '../LucidIcon/LucidIcons.types';

export interface ButtonProps {
	title?: string;

	disabled?: boolean;
	loading?: boolean;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	className?: string;
	icon?: IconNames;
	iconSize?: number;
  to?: string; 
	href?: string; 
	target?: '_blank' | '_self' | '_parent' | '_top';

}
