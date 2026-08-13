import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Seo from '@/components/common/Seo/Seo';
import { company } from '@/config/company';
import { breadcrumbJsonLd } from '@/config/jsonLd';
import { ROUTES, servicePath } from '@/config/routes';
import { featuredProject } from '@/data/portfolio/portfolio.data';
import { REGIONS_SENTENCE } from '@/data/regions.data';
import { services } from '@/data/services.data';
import { useState } from 'react';
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

const ServicesPage = () => {
	// Switching between four services is filtering, not navigation: doing it
	// through the router meant a page load and a jump back to the top every
	// time. The full pages still exist at /services/{slug} — the panel's own
	// button leads there, and the footer links all four from every page.
	const [active, setActive] = useState(services[0]);

	return (
		<section className={styles.services}>
			<Seo
				title='Naše služby'
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

			<div className={styles.board}>
				<ServiceSidebar activeSlug={active.slug} onSelect={setActive} />

				<ServicePreview
					service={active}
					ctaTitle={active.buttonText}
					ctaTo={servicePath(active.slug)}
					secondaryTitle='Zobrazit realizace'
					secondaryTo={ROUTES.PORTFOLIO}
				/>
			</div>
		</section>
	);
};

export default ServicesPage;
