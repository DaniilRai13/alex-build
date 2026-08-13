import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Seo from '@/components/common/Seo/Seo';
import { company } from '@/config/company';
import { breadcrumbJsonLd } from '@/config/jsonLd';
import { ROUTES, servicePath } from '@/config/routes';
import { services } from '@/data/services.data';
import ServicePreview from './ServicePreview/ServicePreview';
import ServiceSidebar from './ServiceSidebar/ServiceSidebar';
import styles from './ServicesPage.module.scss';

const crumbs = [
	{ name: 'Domů', href: ROUTES.HOME },
	{ name: 'Služby' },
];

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
	return (
		<section className={styles.services}>
			<Seo
				title='Naše služby'
				description='Kompletní i kosmetické rekonstrukce, stavební a řemeslné práce, návrhy interiéru s vizualizacemi. Podívejte se, co pro vás zajistíme.'
				path={ROUTES.SERVICES}
				jsonLd={[breadcrumbJsonLd(crumbs), itemListJsonLd]}
			/>

			<Breadcrumbs items={crumbs} />

			<div className={styles.top}>
				<div className={styles.sticky}>
					<ServiceSidebar headingAs='h1' />
				</div>

				<div className={styles.list}>
					{services.map((service, index) => (
						<ServicePreview
							key={service.id}
							service={service}
							headingHref={servicePath(service.slug)}
							ctaTitle={service.buttonText}
							ctaTo={servicePath(service.slug)}
							priority={index === 0}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default ServicesPage;
