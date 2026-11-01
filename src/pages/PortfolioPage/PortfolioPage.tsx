import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Faq from '@/components/common/Faq/Faq';
import Seo from '@/components/common/Seo/Seo';
import Heading from '@/components/ui/Heading/Heading';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { company } from '@/config/company';
import { breadcrumbJsonLd, faqJsonLd } from '@/config/jsonLd';
import { projectPath, ROUTES, servicePath } from '@/config/routes';
import { faqPortfolio } from '@/data/faq.data';
import { portfolioData, portfolioStats } from '@/data/portfolio/portfolio.data';
import { portfolioSections } from '@/data/portfolio/portfolioCategories.data';
import { serviceForCategory } from '@/data/services.data';
import { plural } from '@/utils/plural';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import PortfolioGrid from './PortfolioGrid/PortfolioGrid';
import styles from './PortfolioPage.module.scss';

const crumbs = [{ name: 'Domů', href: ROUTES.HOME }, { name: 'Portfolio' }];

const itemListJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'ItemList',
	name: 'Realizace KartStav',
	numberOfItems: portfolioData.length,
	itemListElement: portfolioData.map((project, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: project.title,
		url: `${company.url}${projectPath(project.slug)}`,
	})),
};

// One section per kind of job, each with what that job is and a way to order
// it. The page used to be a heading, one sentence and a filter over the grid:
// 68 words of its own, which read to a search engine as a list of links. The
// filter buttons are now links to the sections, so nothing is hidden from the
// HTML any more.
const sections = portfolioSections
	.map(section => ({
		...section,
		projects: portfolioData.filter(project => project.category === section.category),
		service: serviceForCategory(section.category),
	}))
	.filter(section => section.projects.length > 0);

const PortfolioPage: FC = () => {
	const stats = portfolioStats;

	return (
		<section className={styles.portfolio}>
			<Seo
				title='Realizace: rekonstrukce bytů před a po – Teplice'
				description='Dokončené rekonstrukce bytů z Teplic s fotkami před, během i po: nová bytová jádra, koupelny, kuchyně a podlahy. U každé realizace popis prací, plocha a rok.'
				path={ROUTES.PORTFOLIO}
				jsonLd={[breadcrumbJsonLd(crumbs), itemListJsonLd, faqJsonLd(faqPortfolio)]}
			/>

			<Breadcrumbs items={crumbs} />

			<div className={styles.header}>
				<span className={styles.subtitle}>Portfolio</span>

				<Heading as='h1' className={styles.title}>
					Naše realizace – rekonstrukce bytů v Teplicích
				</Heading>

				<div className={styles.description}>
					<p>
						Na této stránce najdete naše dokončené zakázky, většinou z Teplic:{' '}
						{stats.flats} {plural(stats.flats, 'byt', 'byty', 'bytů')} o velikosti{' '}
						{stats.smallestFlat} až {stats.largestFlat} m² a zateplení fasády. Každá
						realizace má vlastní stránku s popisem prací, plochou, rokem dokončení a
						fotografiemi, u kterých je napsáno, co přesně vidíte.
					</p>
					<p>
						V bytech nejčastěji stavíme nové kuchyně, pokládáme podlahy a předěláváme
						koupelny – často včetně výměny původního bytového jádra. U{' '}
						{stats.beforeAfter} {plural(stats.beforeAfter, 'realizace', 'realizací', 'realizací')}{' '}
						ukazujeme i stav před rekonstrukcí a průběh prací, takže je vidět nejen
						výsledek, ale i to, co je pod ním.
					</p>
				</div>
			</div>

			<ul className={styles.stats}>
				<li>
					<strong>{stats.projects}</strong>
					{plural(stats.projects, 'realizace', 'realizace', 'realizací')}
				</li>
				<li>
					<strong>{stats.flatArea} m²</strong>
					rekonstruovaných bytů
				</li>
				<li>
					<strong>{stats.photos}</strong>
					{plural(stats.photos, 'fotografie', 'fotografie', 'fotografií')} s popisem
				</li>
				<li>
					<strong>{stats.beforeAfter}×</strong>
					před a po
				</li>
			</ul>

			<nav className={styles.jump} aria-label='Realizace podle služby'>
				{sections.map(section => (
					<a key={section.anchor} className={styles.jumpLink} href={`#${section.anchor}`}>
						{section.title}
						<span className={styles.jumpCount}>{section.projects.length}</span>
					</a>
				))}
			</nav>

			{sections.map((section, index) => (
				<section key={section.anchor} id={section.anchor} className={styles.section}>
					<div className={styles.sectionHead}>
						<Heading as='h2' className={styles.sectionTitle}>
							{section.title}
						</Heading>
						<p className={styles.sectionIntro}>{section.intro}</p>
						{section.service && (
							<Link className={styles.serviceLink} to={servicePath(section.service.slug)}>
								Více o službě {section.service.title}
								<Icon icon='ArrowRight' size={16} aria-hidden='true' />
							</Link>
						)}
					</div>

					{/* Only the first section's first card is above the fold. */}
					<PortfolioGrid projects={section.projects} priorityFirst={index === 0} />
				</section>
			))}

			<Faq items={faqPortfolio} title='Časté dotazy k realizacím' />
		</section>
	);
};

export default PortfolioPage;
