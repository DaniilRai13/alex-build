import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Faq from '@/components/common/Faq/Faq';
import SectionHead from '@/components/common/SectionHead/SectionHead';
import Seo from '@/components/common/Seo/Seo';
import Heading from '@/components/ui/Heading/Heading';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { breadcrumbJsonLd, faqJsonLd } from '@/config/jsonLd';
import { ROUTES } from '@/config/routes';
import {
	faqPricing,
	PRICING_LEAD,
	pricingCompare,
	pricingFactors,
	pricingSteps,
	pricingTips,
} from '@/data/pricing.data';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './PricingPage.module.scss';

const crumbs = [{ name: 'Domů', href: ROUTES.HOME }, { name: 'Kolik stojí rekonstrukce' }];

// What the price of a renovation depends on and how it is set. Written for the
// "kolik stojí rekonstrukce bytu" searches while the owner's figures are still
// missing — see pricing.data.ts.
const PricingPage: FC = () => (
	<article className={styles.pricing}>
		<Seo
			title='Kolik stojí rekonstrukce bytu – jak počítáme cenu'
			description='Na čem závisí cena rekonstrukce bytu: rozsah prací, bytové jádro a rozvody, dispozice, stav bytu a materiály. Pevnou cenu s harmonogramem stanovíme po nezávazné prohlídce.'
			path={ROUTES.PRICING}
			jsonLd={[breadcrumbJsonLd(crumbs), faqJsonLd(faqPricing)]}
		/>

		<Breadcrumbs items={crumbs} />

		<header className={styles.header}>
			<span className={styles.subtitle}>Cena</span>
			<Heading as='h1' className={styles.title}>
				Kolik stojí rekonstrukce bytu
			</Heading>
			<p className={styles.lead}>{PRICING_LEAD}</p>
		</header>

		<section className={styles.section}>
			<SectionHead className={styles.head} eyebrow='Postup' title='Jak vzniká cena' />
			<ol className={styles.steps}>
				{pricingSteps.map((step, index) => (
					<li key={step.title}>
						<span className={styles.stepNum}>{index + 1}</span>
						<b>{step.title}</b>
						<p>{step.text}</p>
					</li>
				))}
			</ol>
		</section>

		<section className={styles.section}>
			<SectionHead
				className={styles.head}
				eyebrow='Co rozhoduje'
				title='Co ovlivňuje cenu rekonstrukce'
				lead='Šest věcí, na které se při prohlídce díváme a které se v nabídce promítnou nejvíc.'
			/>
			<ul className={styles.factors}>
				{pricingFactors.map(factor => (
					<li key={factor.title}>
						<Icon icon={factor.icon} size={22} className={styles.factorIcon} />
						<b>{factor.title}</b>
						<p>{factor.text}</p>
					</li>
				))}
			</ul>
		</section>

		<section className={styles.section}>
			<SectionHead
				className={styles.head}
				eyebrow='Rozsah'
				title='Kosmetické úpravy, nebo kompletní rekonstrukce?'
				lead='Největší rozdíl v ceně dělá rozsah. Co který přístup zahrnuje:'
			/>
			<div className={styles.compare}>
				{pricingCompare.map(item => (
					<Link key={item.title} to={item.to} className={styles.compareCard}>
						<b>{item.title}</b>
						<p>{item.text}</p>
						<span className={styles.more}>
							Více o službě
							<Icon icon='ArrowRight' size={16} aria-hidden='true' />
						</span>
					</Link>
				))}
			</div>
		</section>

		<section className={styles.section}>
			<SectionHead className={styles.head} eyebrow='Rady' title='Jak udržet rozpočet pod kontrolou' />
			<ul className={styles.tips}>
				{pricingTips.map(tip => (
					<li key={tip.title}>
						<Icon icon='CircleCheck' size={20} className={styles.tipIcon} />
						<div>
							<b>{tip.title}</b>
							<p>{tip.text}</p>
						</div>
					</li>
				))}
			</ul>
		</section>

		<Faq items={faqPricing} title='Časté dotazy k ceně' />
	</article>
);

export default PricingPage;
