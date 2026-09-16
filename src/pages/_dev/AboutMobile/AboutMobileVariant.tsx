import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Image from '@/components/ui/Image/Image';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { ROUTES } from '@/config/routes';
import { aboutProject } from '@/data/portfolio/portfolio.data';
import { statisticsData } from '@/data/statistics.data';
import cn from 'classnames';
import type { FC } from 'react';
import styles from './AboutMobile.module.scss';

export type MobileStyle =
	| 'now'
	| 'photoTop'
	| 'statsList'
	| 'statsTight'
	| 'banner'
	| 'statsScroll'
	| 'compact';

const TEXT =
	'Specializujeme se na kompletní rekonstrukce bytů a domů. Spojujeme kvalitní řemeslné zpracování, moderní design a individuální přístup, abychom vytvořili interiéry, které budou sloužit mnoho let.';

const Photo: FC<{ className?: string }> = ({ className }) => (
	<Image
		src={aboutProject.preview.src}
		srcSet={aboutProject.preview.srcSet}
		sizes='390px'
		alt={`${aboutProject.title} – ${aboutProject.location}`}
		className={cn(styles.photo, className)}
	/>
);

const Stats: FC = () => (
	<div className={styles.stats}>
		{statisticsData.map(item => (
			<div className={styles.stat} key={item.title}>
				<span className={styles.icon}>
					<Icon icon={item.icon} size={18} />
				</span>
				<b className={styles.value}>{item.title}</b>
				<span className={styles.label}>{item.sub}</span>
			</div>
		))}
	</div>
);

const Cta: FC = () => (
	<Button
		title='Zobrazit realizace'
		className={styles.button}
		to={ROUTES.PORTFOLIO}
	/>
);

/** Rendered inside a 390px frame, so these are the phone layouts as they read. */
const AboutMobileVariant: FC<{ variant: MobileStyle }> = ({ variant }) => {
	if (variant === 'banner') {
		return (
			<section className={cn(styles.block, styles.banner)}>
				<div className={styles.bannerMedia}>
					<Photo />
					<div className={styles.bannerCopy}>
						<span className={styles.eyebrow}>O společnosti</span>
						<Heading className={styles.title}>Kdo jsme a co děláme</Heading>
					</div>
				</div>

				<Subtitle className={styles.text}>{TEXT}</Subtitle>
				<Stats />
				<Cta />
			</section>
		);
	}

	const photoFirst = variant === 'photoTop' || variant === 'compact';

	return (
		<section className={cn(styles.block, styles[variant])}>
			{photoFirst && <Photo />}

			<span className={styles.eyebrow}>O společnosti</span>
			<Heading className={styles.title}>Kdo jsme a co děláme</Heading>
			<Subtitle className={styles.text}>{TEXT}</Subtitle>

			<Stats />
			<Cta />

			{!photoFirst && <Photo />}
		</section>
	);
};

export default AboutMobileVariant;
