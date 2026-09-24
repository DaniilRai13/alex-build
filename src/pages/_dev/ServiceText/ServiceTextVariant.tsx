import Image from '@/components/ui/Image/Image';
import { portfolioData } from '@/data/portfolio/portfolio.data';
import { services } from '@/data/services.data';
import cn from 'classnames';
import type { FC } from 'react';
import styles from './ServiceTextVariant.module.scss';

export type TextStyle =
	| 'now'
	| 'subheads'
	| 'steps'
	| 'callout'
	| 'bigLead'
	| 'photo'
	| 'light'
	| 'combo';

const service = services[0];
const [intro, why, whenTo] = service.longDescription;

// Kickers for the subhead variants. Each paragraph already does a different
// job — what it is, why one contractor, who it is for — and these only name
// the job it was already doing. If the variant wins they belong in
// services.data.ts beside longDescription, not here.
const KICKERS = ['Co to znamená', 'Proč jeden dodavatel', 'Kdy to dává smysl'];

// The sequence buried in the first paragraph: "od demolice a odvozu suti přes
// nové příčky, elektroinstalace a rozvody vody až po podlahy, dveře a finální
// povrchy". Nothing new is written here — it is the same content, lifted out
// of the prose so it can be scanned.
const STEPS = [
	'Demolice a odvoz suti',
	'Nové příčky',
	'Elektroinstalace',
	'Rozvody vody',
	'Podlahy a dveře',
	'Finální povrchy',
];

const photo = portfolioData[0];

/**
 * The long-form panel from the service detail page, rebuilt so each option can
 * restructure it freely. Real copy from services.data, so line counts and
 * column widths match what the decision will be applied to.
 */
const ServiceTextVariant: FC<{ style: TextStyle }> = ({ style }) => {
	// 'light' carries both devices on purpose: the question it asks is how the
	// whole treatment behaves on a pale surface, not whether pale alone is
	// enough.
	const withSteps = style === 'steps' || style === 'combo' || style === 'light';
	const withCallout =
		style === 'callout' || style === 'combo' || style === 'light';

	const heading = (
		<h2 className={styles.heading}>{service.detailHeading}</h2>
	);

	const body = (
		<>
			{style === 'subheads' ? (
				[intro, why, whenTo].map((text, i) => (
					<div className={styles.section} key={text.slice(0, 30)}>
						<span className={styles.kicker}>{KICKERS[i]}</span>
						<p className={styles.paragraph}>{text}</p>
					</div>
				))
			) : (
				<>
					<p className={cn(styles.paragraph, style === 'bigLead' && styles.lead)}>
						{intro}
					</p>

					{withSteps && (
						<ol className={styles.steps}>
							{STEPS.map((step, i) => (
								<li className={styles.step} key={step}>
									<span className={styles.stepNum}>{i + 1}</span>
									{step}
								</li>
							))}
						</ol>
					)}

					<p className={styles.paragraph}>{why}</p>

					{withCallout ? (
						<p className={styles.callout}>{whenTo}</p>
					) : (
						<p className={styles.paragraph}>{whenTo}</p>
					)}
				</>
			)}
		</>
	);

	if (style === 'photo') {
		return (
			<div className={cn(styles.text, styles.photo)}>
				<div className={styles.photoCopy}>
					{heading}
					{body}
				</div>

				<div className={styles.photoFrame}>
					<Image
						src={photo.preview.src}
						srcSet={photo.preview.srcSet}
						sizes='(max-width: 900px) 100vw, 320px'
						alt={`${photo.title} – ${photo.location}`}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className={cn(styles.text, style === 'light' && styles.light)}>
			{heading}
			{body}
		</div>
	);
};

export default ServiceTextVariant;
