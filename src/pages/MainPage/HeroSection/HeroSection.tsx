import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Image from '@/components/ui/Image/Image';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { company, displayPhone } from '@/config/company';
import { projectPath, ROUTES } from '@/config/routes';
import { heroImage } from '@/data/hero.data';
import { heroProjects, portfolioStats } from '@/data/portfolio/portfolio.data';
import { type FC } from 'react';
import { preload } from 'react-dom';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.scss';

const HeroSection: FC = () => {
	// Inside the <picture> that Image renders for the WebP variants React does
	// not preload the image by itself, so the biggest image on the first screen
	// would wait for the stylesheet. Asked for explicitly; vite.config.ts moves
	// React's preloads into <head>.
	if (heroImage.srcSet)
		preload(heroImage.src, {
			as: 'image',
			imageSrcSet: heroImage.srcSet,
			imageSizes: '100vw',
			type: 'image/webp',
			fetchPriority: 'high',
		});

	return (
		<div className={styles.banner}>
			<Image
				className={styles.image}
				src={heroImage.src}
				srcSet={heroImage.srcSet}
				sizes='100vw'
				alt={heroImage.alt}
				priority
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
					What the company does and where, in the words people search for.
					No forced line break: the heading is set in a fluid clamp, so a
					<br /> that lands well on a laptop splits it mid-thought on a
					phone. text-wrap: balance lets the browser pick the point. The
					&nbsp;s only keep "v" and "a" off the end of a line, which Czech
					typesetting does not allow.
				*/}
				<Heading as='h1' className={styles.title}>
					Rekonstrukce bytů na klíč v&nbsp;Teplicích a&nbsp;okolí
				</Heading>
				<Subtitle className={styles.description}>
					Kompletní rekonstrukce i kosmetické úpravy bytů a domů – od návrhu
					až po předání. Celou zakázku vede jeden dodavatel a pevnou cenu
					i harmonogram znáte ještě před zahájením prací.
				</Subtitle>
				<div className={styles.actions}>
					<Button
						title='Získat konzultaci'
						className={styles.button}
						to={ROUTES.CONTACTS}
					/>
					<a className={styles.phone} href={`tel:${company.phone}`}>
						<Icon icon='Phone' size={18} aria-hidden='true' />
						{displayPhone}
					</a>
				</div>
			</div>

			{/*
				The photo above is stock and says so by saying nothing: it links
				nowhere and claims no project. The proof is this card — real jobs,
				one click from the first screen.
			*/}
			<aside className={styles.proof} aria-label='Naše realizace'>
				<div className={styles.proofHead}>
					<span>Naše realizace</span>
					<Link to={ROUTES.PORTFOLIO}>
						Všech {portfolioStats.projects}
						<Icon icon='ArrowRight' size={14} aria-hidden='true' />
					</Link>
				</div>
				<ul>
					{heroProjects.map(project => (
						<li key={project.slug}>
							<Link to={projectPath(project.slug)}>
								<Image
									src={project.preview.src}
									srcSet={project.preview.srcSet}
									sizes='64px'
									alt=''
								/>
								<span>
									<b>{project.title}</b>
									<span className={styles.place}>{project.location} · </span>
									{project.area} m²
								</span>
							</Link>
						</li>
					))}
					{/* On a phone the card turns into a row of circles and the
					    "Všech 9" link in its head becomes the last circle. */}
					<li className={styles.proofAll}>
						<Link to={ROUTES.PORTFOLIO}>
							<span className={styles.proofCount}>{portfolioStats.projects}</span>
							všechny
						</Link>
					</li>
				</ul>
			</aside>
		</div>
	);
};

export default HeroSection;
