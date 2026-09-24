import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { ROUTES } from '@/config/routes';
import img from '@assets/hero-bg.jpg';
import { type FC } from 'react';
import styles from './HeroSection.module.scss';
import { primaryRegions } from '@/data/regions.data';

const HeroSection: FC = () => {
	return (
		<div className={styles.banner}>
			<img
				className={styles.image}
				src={img}
				alt='Moderní přízemní rodinný dům s cihlovou fasádou a prosklenými vchodovými dveřmi'
				fetchPriority='high'
			/>
			<div className={styles.overlay} />
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
			<div className={styles.content}>
				{/*
					The badge carries the geography so the heading can stay the line
					it has always been. Naming the town in both would put "Teplice"
					twice in two adjacent elements.
				*/}
				<span className={styles.badge}>
					{/*
						Built from the same list that feeds areaServed rather than typed
						here, so the badge and the structured data cannot drift apart —
						which is exactly what had happened: this said Teplice while the
						markup opened with "po celé České republice".
					*/}
					{primaryRegions.map(region => region.name).join(' · ')}
				</span>

				{/*
					No forced line break: the heading is set in a fluid clamp, so a
					<br /> that lands well on a laptop splits it mid-thought on a
					phone. text-wrap: balance lets the browser pick the point.
				*/}
				<Heading as='h1' className={styles.title}>
					Vaše první volba pro kompletní stavby a rekonstrukce.
				</Heading>
				<Subtitle className={styles.description}>
					Měníme vaše představy v realitu s důrazem na poctivé řemeslo a
					špičkový výsledek. Působíme v Ústeckém kraji i v dalších městech
					České republiky.
				</Subtitle>
			</div>
			<div className={styles.buttonContainer}>
				{/* Same reason as above: the call to action is on the first
				    screen and must not wait for hydration to become visible. */}
				<div className={styles.buttonIn}>
					<Button
						title='Získat konzultaci'
						className={styles.button}
						to={ROUTES.CONTACTS}
					/>
				</div>
			</div>
		</div>
	);
};

export default HeroSection;
