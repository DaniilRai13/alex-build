import cn from 'classnames';
import type { FC, ReactNode } from 'react';
import styles from './Subtitle.module.scss';

interface ISubtitle {
	children: ReactNode;
	className?: string;
}

const Subtitle: FC<ISubtitle> = ({ children, className }) => {
	return <div className={cn(styles.subtitle, className)}>{children}</div>;
};

export default Subtitle;
