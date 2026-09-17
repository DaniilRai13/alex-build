import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { ROUTES, servicePath } from '@/config/routes';
import { services } from '@/data/services.data';
import cn from 'classnames';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './ServicesIntro.module.scss';

export type IntroStyle =
	| 'now'
	| 'checks'
	| 'bigLead'
	| 'pull'
	| 'facts'
	| 'labels'
	| 'links';

const LEAD = 'Vybíráme řešení pro úkoly jakékoli složitosti – od konceptu až po realizaci.';

const BODY =
	'Celou stavbu vede jeden dodavatel, takže jednotlivé profese na sebe navazují bez prostojů a vy nedomlouváte desítky řemeslníků zvlášť. Před zahájením prací připravíme harmonogram i rozpočet — dopředu tedy víte, co a kdy se bude dít.';

/** The three promises the second paragraph makes, split out. */
const PROMISES = [
	{ icon: 'BadgeCheck' as const, text: 'Jeden dodavatel pro celou stavbu' },
	{ icon: 'CalendarCheck' as const, text: 'Harmonogram i rozpočet předem' },
	{ icon: 'ShieldCheck' as const, text: '2 roky záruka na veškeré práce' },
];

const Cta: FC = () => (
	<Button
		title='Všechny služby'
		className={styles.button}
		to={ROUTES.SERVICES}
	/>
);

const ServicesIntroVariant: FC<{ variant: IntroStyle }> = ({ variant }) => (
	<div className={cn(styles.intro, styles[variant])}>
		<span className={styles.eyebrow}>Co nabízíme</span>
		<Heading className={styles.heading}>Naše služby</Heading>

		{variant === 'labels' ? (
			<>
				<p className={styles.label}>Co děláme</p>
				<Subtitle className={styles.description}>{LEAD}</Subtitle>
				<p className={styles.label}>Jak to vedeme</p>
				<p className={styles.body}>{BODY}</p>
			</>
		) : (
			<Subtitle className={styles.description}>{LEAD}</Subtitle>
		)}

		{variant === 'now' && <p className={styles.body}>{BODY}</p>}
		{variant === 'bigLead' && <p className={styles.body}>{BODY}</p>}

		{variant === 'checks' && (
			<ul className={styles.checks}>
				{PROMISES.map(item => (
					<li key={item.text}>
						<Icon icon={item.icon} size={18} />
						{item.text}
					</li>
				))}
			</ul>
		)}

		{variant === 'pull' && <p className={styles.pullQuote}>{BODY}</p>}

		{variant === 'facts' && (
			<>
				<p className={styles.body}>{BODY}</p>
				<ul className={styles.facts}>
					<li>
						<b>40+</b> projektů
					</li>
					<li>
						<b>2 roky</b> záruka
					</li>
					<li>
						<b>Pevná</b> cena
					</li>
				</ul>
			</>
		)}

		{variant === 'links' && (
			<ul className={styles.links}>
				{services.map(service => (
					<li key={service.slug}>
						<Link to={servicePath(service.slug)}>
							<Icon icon={service.icon} size={16} />
							{service.title}
							<Icon icon='ArrowUpRight' size={14} className={styles.arrow} />
						</Link>
					</li>
				))}
			</ul>
		)}

		<Cta />
	</div>
);

export default ServicesIntroVariant;
