import Heading from '@/components/ui/Heading/Heading';
import Image from '@/components/ui/Image/Image';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { advantages } from '@/data/advantages.data';
import { featuredProject } from '@/data/portfolio/portfolio.data';
import { statisticsData } from '@/data/statistics.data';
import { workStepsData } from '@/data/workSteps.data';
import cn from 'classnames';
import type { FC, ReactNode } from 'react';
import AboutCard from '@/pages/MainPage/AboutSection/AboutCard/AboutCard';
// The live section's stylesheet, so the two-column shell and the stat cards in
// these variants are the ones on the home page rather than a lookalike.
import live from '@/pages/MainPage/AboutSection/AboutSection.module.scss';
import styles from './AboutVariants.module.scss';
import { CARD_NOTES, FAQ, P1, P2, P3 } from './AboutVariants.content';

const TITLE = 'O společnosti';

/** Heading plus however many paragraphs a variant wants in the left column. */
const Copy: FC<{ paragraphs?: string[]; children?: ReactNode }> = ({
	paragraphs = [P1],
	children,
}) => (
	<div className={live.infoText}>
		<Heading className={live.infoTitle}>{TITLE}</Heading>
		{paragraphs.map((paragraph, index) =>
			index === 0 ? (
				<Subtitle className={live.infoSubtitle} key={paragraph.slice(0, 20)}>
					{paragraph}
				</Subtitle>
			) : (
				<p className={styles.extra} key={paragraph.slice(0, 20)}>
					{paragraph}
				</p>
			),
		)}
		{children}
	</div>
);

const StatCards: FC<{ row?: boolean }> = ({ row = false }) => (
	<section className={cn(live.stats, row && styles.statsRow)}>
		{statisticsData.map(item => (
			<AboutCard key={item.title} item={item} />
		))}
	</section>
);

/** The live two-column shell: copy on the left, whatever a variant puts right. */
const Shell: FC<{ left: ReactNode; right: ReactNode }> = ({ left, right }) => (
	<div className={live.aboutSection}>
		<section className={live.info}>
			<div className={live.infoContainer}>{left}</div>
		</section>
		{right}
	</div>
);

// --- 01 ---------------------------------------------------------------------
export const ThreeParagraphs: FC = () => (
	<Shell left={<Copy paragraphs={[P1, P2, P3]} />} right={<StatCards />} />
);

// --- 02 ---------------------------------------------------------------------
export const WithAdvantages: FC = () => (
	<Shell
		left={
			<Copy paragraphs={[P1, P2]}>
				<ul className={styles.advantages}>
					{advantages.map(item => (
						<li key={item.title}>
							<Icon icon={item.icon} size={20} />
							<strong>{item.title}</strong>
							<span>{item.text}</span>
						</li>
					))}
				</ul>
			</Copy>
		}
		right={<StatCards />}
	/>
);

// --- 03 ---------------------------------------------------------------------
export const FullWidthCopy: FC = () => (
	<div className={live.aboutSection}>
		<section className={cn(live.info, styles.wideInfo)}>
			<div className={live.infoContainer}>
				<Heading className={live.infoTitle}>{TITLE}</Heading>
				<div className={styles.columns}>
					<Subtitle className={live.infoSubtitle}>{P1}</Subtitle>
					<p className={styles.extra}>{P2}</p>
					<p className={styles.extra}>{P3}</p>
				</div>
			</div>
		</section>
		<StatCards row />
	</div>
);

// --- 04 ---------------------------------------------------------------------
export const WithProcess: FC = () => (
	<Shell
		left={<Copy paragraphs={[P1, P2, P3]} />}
		right={
			<section className={styles.process}>
				<Heading as='h3' className={styles.blockTitle}>
					Jak pracujeme
				</Heading>
				<ol className={styles.steps}>
					{workStepsData.map(step => (
						<li key={step.id}>
							<span className={styles.stepNum}>{step.id}</span>
							<div>
								<strong>{step.title}</strong>
								<span>{step.description}</span>
							</div>
						</li>
					))}
				</ol>
			</section>
		}
	/>
);

// --- 05 ---------------------------------------------------------------------
export const WithPhoto: FC = () => (
	<div>
		<Shell
			left={<Copy paragraphs={[P1, P2, P3]} />}
			right={
				<section className={styles.photo}>
					<Image
						src={featuredProject.preview.src}
						srcSet={featuredProject.preview.srcSet}
						alt={`${featuredProject.title} – ${featuredProject.location}`}
						className={styles.photoImg}
					/>
					<figcaption className={styles.caption}>
						{featuredProject.title} · {featuredProject.location} ·{' '}
						{featuredProject.area} m² · {featuredProject.year}
					</figcaption>
				</section>
			}
		/>
		<StatCards row />
	</div>
);

// --- 06 ---------------------------------------------------------------------
export const ExpandedCards: FC = () => (
	<Shell
		left={<Copy paragraphs={[P1, P2]} />}
		right={
			<section className={live.stats}>
				{statisticsData.map(item => (
					<div className={styles.bigCard} key={item.title}>
						<b>{item.title}</b>
						<span className={styles.bigSub}>{item.sub}</span>
						{CARD_NOTES[item.title] && (
							<span className={styles.bigNote}>{CARD_NOTES[item.title]}</span>
						)}
					</div>
				))}
			</section>
		}
	/>
);

// --- 07 ---------------------------------------------------------------------
export const WithFaq: FC = () => (
	<div>
		<Shell
			left={<Copy paragraphs={[P1, P2, P3]} />}
			right={
				<section className={styles.faq}>
					<Heading as='h3' className={styles.blockTitle}>
						Časté dotazy
					</Heading>
					<dl>
						{FAQ.map(item => (
							<div key={item.q}>
								<dt>{item.q}</dt>
								<dd>{item.a}</dd>
							</div>
						))}
					</dl>
				</section>
			}
		/>
		<StatCards row />
	</div>
);
