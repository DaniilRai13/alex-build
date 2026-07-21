import type { INavigateSideProps } from '@/config/routes';
import { icons, type LucideProps } from 'lucide-react';
import type { FC } from 'react';

type IconProps = Pick<INavigateSideProps, 'icon'> & LucideProps;

export const Icon: FC<IconProps> = ({ icon,size, ...props }) => {
	const LucideIcon = icons[icon];

	return <LucideIcon {...props} size={size}/>;
};
