import Heading from '@/components/ui/Heading/Heading';
import Image from '@/components/ui/Image/Image';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';
import type { IResponsiveImage } from '@/types/image.interface';
import type { FC } from 'react';
import styles from './ServicesHero.module.scss';

interface Advantage {
	icon: IconNames;
	title: string;
	text: string;
}

// Numbers match statistics.data.ts on the home page — a visitor comparing the
// two pages must not find two different warranty lengths.
const advantages: Advantage[] = [
	{ icon: 'Award', title: 'Zkušenosti', text: '40+ dokončených projektů' },
	{ icon: 'BadgeCheck', title: 'Kvalita', text: 'Ověřené materiály' },
	{ icon: 'CalendarCheck', title: 'Termíny', text: 'Dodržujeme domluvu' },
	{ icon: 'ShieldCheck', title: 'Záruka', text: '2 roky na veškeré práce' },
];

interface Props {
	eyebrow: string;
	heading: string;
	/** The overview owns the page <h1>; detail pages pass a lower level. */
	headingAs?: 'h1' | 'h2';
	text: string;
	/** Regions the company works in — the geo signal, kept out of the <h1>. */
	regions?: string;
	image: IResponsiveImage;
	imageAlt: string;
}

const ServicesHero: FC<Props> = ({
	eyebrow,
	heading,
	headingAs = 'h1',
	text,
	regions,
	image,
	imageAlt,
}) => (
	<section className={styles.hero}>
		<div className={styles.content}>
			<span className={styles.eyebrow}>{eyebrow}</span>

			<Heading as={headingAs} className={styles.heading}>
				{heading}
			</Heading>

			<p className={styles.text}>{text}</p>

			{regions && <p className={styles.regions}>{regions}</p>}

			<ul className={styles.advantages}>
				{advantages.map(item => (
					<li className={styles.advantage} key={item.title}>
						<span className={styles.advantageIcon}>
							<Icon icon={item.icon} size={20} />
						</span>
						<span className={styles.advantageTitle}>{item.title}</span>
						<span className={styles.advantageText}>{item.text}</span>
					</li>
				))}
			</ul>
		</div>

		<div className={styles.figure}>
			<Image
				src={image.src}
				srcSet={image.srcSet}
				sizes='(max-width: 1024px) 100vw, 40vw'
				alt={imageAlt}
				priority
			/>
		</div>
	</section>
);

export default ServicesHero;
