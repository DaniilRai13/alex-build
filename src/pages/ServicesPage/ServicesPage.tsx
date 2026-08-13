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

			<div className={styles.top}>
				<div className={styles.sticky}>
					{/* The <h1> lives in the hero above, so the sidebar label is a
					    plain paragraph rather than a second heading. */}
					<ServiceSidebar headingAs='p' />
				</div>

				<div className={styles.list}>
					{services.map(service => (
						<ServicePreview
							key={service.id}
							service={service}
							headingHref={servicePath(service.slug)}
							ctaTitle={service.buttonText}
							ctaTo={servicePath(service.slug)}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default ServicesPage;
