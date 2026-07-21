// FooterAccordionSection.tsx
import Heading from '@/components/ui/Heading/Heading';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { type FC, type ReactNode } from 'react';
import styles from './FooterAccordionSection.module.scss';

interface FooterAccordionSectionProps {
	title?: string;
	isOpen?: boolean;
	onToggle?: () => void;
	children: ReactNode;
}

const FooterAccordionSection: FC<FooterAccordionSectionProps> = ({
	title,
	isOpen,
	onToggle,
	children,
}) => {
	if (!title || !onToggle) {
		return <div className={styles.section}>{children}</div>;
	}

	return (
		<div className={styles.section} onClick={onToggle}>
			<div className={styles.sectionHeading}>
				<Heading className={styles.title} as='h3'>{title}</Heading>
				<span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>
					<Icon icon='ChevronDown' />
				</span>
			</div>
			<div className={isOpen ? styles.open : styles.close}>{children}</div>
		</div>
	);
};

export default FooterAccordionSection;
