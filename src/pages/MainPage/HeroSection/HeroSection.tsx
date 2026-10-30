import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { ROUTES } from '@/config/routes';
import { heroFeatures } from '@/data/hero3d.data';
import { primaryRegions } from '@/data/regions.data';
import { type FC } from 'react';
import { Link } from 'react-router-dom';
import ApartmentModel from './ApartmentModel/ApartmentModel';
import HeroBlueprint from './HeroBlueprint/HeroBlueprint';
import styles from './HeroSection.module.scss';

// One composition, not two columns: the 3D flat is the subject and the copy
// sits beside it, on the same ground. Three grid areas — copy, proof, model —
// so a phone can read the whole pitch before it reaches the model.
const HeroSection: FC = () => {
	return (
		<section className={styles.hero}>
			<HeroBlueprint className={styles.blueprint} />

			{/*
				A plain div with a CSS entrance, not motion.div. framer-motion's
				initial state is serialised into the prerendered HTML, so this
				block used to arrive as style="opacity:0" and the <h1> — the
				page's LCP element — stayed invisible until 324 KB of vendor and
				framer-motion had downloaded, parsed and hydrated. The measured
				LCP was six seconds for a heading that was in the HTML all along.

				The CSS keyframes animate transform only. The text is painted at
				full opacity on the first frame, so LCP fires when the browser
				paints rather than when React catches up.
			*/}
			<div className={styles.copy}>
				{/*
					What, then where — one quiet line of context, not a badge. The
					geography is built from the same list that feeds areaServed, so
					the hero and the structured data cannot drift apart.
				*/}
				<p className={styles.eyebrow}>
					{['Rekonstrukce bytů', ...primaryRegions.map(region => region.name)].join(
						' · ',
					)}
				</p>

				{/*
					No forced line break: the heading is set in a fluid clamp, so a
					<br /> that lands well on a laptop splits it mid-thought on a
					phone. text-wrap: balance lets the browser pick the point.
				*/}
				<Heading as='h1' className={styles.title}>
					Rekonstrukce bytů, které dávají smysl
					<span className={styles.dot}>.</span>
				</Heading>
				<Subtitle className={styles.description}>
					Proměníme váš byt v moderní a funkční domov. Navrhneme novou
					dispozici, zrealizujeme ji a postaráme se o vše — v Ústeckém kraji
					i v dalších městech České republiky.
				</Subtitle>

				{/* One primary action; the services are a quiet link beside it. */}
				<div className={styles.actions}>
					<Button
						title='Získat nezávaznou konzultaci'
						icon='ArrowRight'
						iconSize={18}
						className={styles.primary}
						to={ROUTES.CONTACTS}
					/>
					<Link to={ROUTES.SERVICES} className={styles.secondary}>
						Naše služby
						<Icon icon='ArrowRight' size={16} aria-hidden='true' />
					</Link>
				</div>
			</div>

			<div className={styles.proof}>
				<ul className={styles.features}>
					{heroFeatures.map(feature => (
						<li key={feature.value}>
							<Icon
								icon={feature.icon}
								size={20}
								strokeWidth={1.5}
								className={styles.featureIcon}
								aria-hidden='true'
							/>
							<span>
								<strong>{feature.value}</strong>
								{feature.label}
							</span>
						</li>
					))}
				</ul>
			</div>

			<div className={styles.visual}>
				<ApartmentModel />
			</div>

			{/* The model is a sample; this is where the real jobs are. On the
			    bottom edge of the first screen, as a scroll cue. */}
			<Link to={ROUTES.PORTFOLIO} className={styles.more}>
				<Icon icon='ChevronDown' size={16} aria-hidden='true' />
				Prohlédněte si naše realizace
			</Link>
		</section>
	);
};

export default HeroSection;
