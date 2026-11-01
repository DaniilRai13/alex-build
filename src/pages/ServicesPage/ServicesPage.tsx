import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Seo from '@/components/common/Seo/Seo';
import { company } from '@/config/company';
import { breadcrumbJsonLd } from '@/config/jsonLd';
import { ROUTES, servicePath } from '@/config/routes';
import { featuredProject } from '@/data/portfolio/portfolio.data';
import { REGIONS_SENTENCE } from '@/data/regions.data';
import { services } from '@/data/services.data';
import ServicesHero from './ServicesHero/ServicesHero';
import ServicesOverview from './ServicesOverview/ServicesOverview';

const crumbs = [{ name: 'Domů', href: ROUTES.HOME }, { name: 'Služby' }];

// The overview doubles as a hub: every service is in the HTML with its
// description, list and a link to its detail page.
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

const ServicesPage = () => (
	<section>
		<Seo
			title='Služby – rekonstrukce bytů a domů Teplice'
			description='Kompletní i kosmetické rekonstrukce, stavební a řemeslné práce, návrhy interiéru s vizualizacemi. Podívejte se, co pro vás zajistíme.'
			path={ROUTES.SERVICES}
			jsonLd={[breadcrumbJsonLd(crumbs), itemListJsonLd]}
		/>

		<Breadcrumbs items={crumbs} />

		<ServicesHero
			eyebrow='Naše služby'
			heading='Kompletní rekonstrukce bytů a domů'
			text='Postaráme se o celý průběh rekonstrukce od návrhu až po finální dokončení. Kvalitní řemeslná práce, ověřené materiály a dodržené termíny jsou pro nás samozřejmostí.'
			regions={REGIONS_SENTENCE}
			image={featuredProject.preview}
			imageAlt={`${featuredProject.title} – ${featuredProject.location}`}
		/>

		<ServicesOverview />
	</section>
);

export default ServicesPage;
