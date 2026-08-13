import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Seo from '@/components/common/Seo/Seo';
import { company } from '@/config/company';
import { breadcrumbJsonLd } from '@/config/jsonLd';
import { ROUTES, servicePath } from '@/config/routes';
import { getProjectBySlug } from '@/data/portfolio/portfolio.data';
import { REGIONS_SENTENCE } from '@/data/regions.data';
import { services } from '@/data/services.data';
import ServicePreview from './ServicePreview/ServicePreview';
import ServiceSidebar from './ServiceSidebar/ServiceSidebar';
import ServicesHero from './ServicesHero/ServicesHero';
import styles from './ServicesPage.module.scss';

const crumbs = [{ name: 'Domů', href: ROUTES.HOME }, { name: 'Služby' }];

// The overview doubles as a hub: every service is present in the HTML
// (only the active tab used to be rendered) and each links to its detail page.
const itemListJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'ItemList',
	name: 'Služby KartStav',
	itemListElement: services.map((service, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: service.title,
		url: `${company.url}${servicePath(service.slug)}`,
	})),
};

// The most presentable finished shot we have; it doubles as the hero image.
const heroProject = getProjectBySlug('rekonstrukce-paneloveho-bytu');

/** The service the overview opens on — the rest are one click away. */
const featured = services[0];

const ServicesPage = () => {
	return (
		<section className={styles.services}>
			<Seo
				title='Naše služby'
				description='Kompletní i kosmetické rekonstrukce, stavební a řemeslné práce, návrhy interiéru s vizualizacemi. Podívejte se, co pro vás zajistíme.'
				path={ROUTES.SERVICES}
				jsonLd={[breadcrumbJsonLd(crumbs), itemListJsonLd]}
			/>

			<Breadcrumbs items={crumbs} />

			{heroProject && (
				<ServicesHero
					eyebrow='Naše služby'
					heading='Kompletní rekonstrukce bytů a domů'
					text='Postaráme se o celý průběh rekonstrukce od návrhu až po finální dokončení. Kvalitní řemeslná práce, ověřené materiály a dodržené termíny jsou pro nás samozřejmostí.'
					regions={REGIONS_SENTENCE}
					image={heroProject.preview}
					imageAlt={`${heroProject.title} – ${heroProject.location}`}
				/>
			)}

			{/* One service at a time, as in the design. The list on the left is
			    made of links, so picking one opens its own page — every service
			    still has its full copy indexed, just at /services/{slug}. */}
			<div className={styles.board}>
				<ServiceSidebar activeSlug={featured.slug} />

				<ServicePreview
					service={featured}
					ctaTitle={featured.buttonText}
					ctaTo={servicePath(featured.slug)}
					secondaryTitle='Zobrazit realizace'
					secondaryTo={ROUTES.PORTFOLIO}
				/>
			</div>
		</section>
	);
};

export default ServicesPage;
