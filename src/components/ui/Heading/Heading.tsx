import cn from 'classnames';
import type { FC, ReactNode } from 'react';
import styles from './Heading.module.scss';

type HeadingTag =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'p'
	| 'span'
	| 'div';

interface IHeading {
	children: ReactNode;
	className?: string;
	/** Semantic tag to render. Defaults to an <h2>. */
	as?: HeadingTag;
}

const Heading: FC<IHeading> = ({ children, className, as: Tag = 'h2' }) => {
	return <Tag className={cn(styles.heading, className)}>{children}</Tag>;
};

export default Heading;
