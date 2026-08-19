import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Seo from '@/components/common/Seo/Seo';
import Heading from '@/components/ui/Heading/Heading';
import { company, ORGANIZATION_ID } from '@/config/company';
import { breadcrumbJsonLd } from '@/config/jsonLd';
import { ROUTES, servicePath } from '@/config/routes';
import { getServiceBySlug } from '@/data/services.data';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import ServicePreview from './ServicePreview/ServicePreview';
import ServiceSidebar from './ServiceSidebar/ServiceSidebar';
import styles from './ServiceDetailPage.module.scss';

const ServiceDetailPage: FC = () => {
	const { slug } = useParams();
	const service = getServiceBySlug(slug);
	if (!service) return <NotFoundPage />;

	const url = servicePath(service.slug);
	const crumbs = [
		{ name: 'Domů', href: ROUTES.HOME },
		{ name: 'Služby', href: ROUTES.SERVICES },
		{ name: service.title },
	];

	const serviceJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: service.title,
		description: service.seoDescription,
		url: `${company.url}${url}`,
		serviceType: service.title,
		provider: { '@id': ORGANIZATION_ID },
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: service.title,
			itemListElement: service.features.map(feature => ({
				'@type': 'Offer',
				itemOffered: { '@type': 'Service', name: feature },
			})),
		},
	};

	return (
		<section className={styles.detail}>
			<Seo
				title={service.seoTitle}
				description={service.seoDescription}
				path={url}
				jsonLd={[breadcrumbJsonLd(crumbs), serviceJsonLd]}
			/>

			<Breadcrumbs items={crumbs} />

			<div className={styles.board}>
				<ServiceSidebar activeSlug={service.slug} />

				<ServicePreview
					service={service}
					headingAs='h1'
					secondaryTitle='Zobrazit realizace'
					secondaryTo={ROUTES.PORTFOLIO}
					priority
				/>
			</div>

			<div className={styles.text}>
				<Heading as='h2' className={styles.textHeading}>
					{service.detailHeading}
				</Heading>

				{service.longDescription.map(paragraph => (
					<p className={styles.paragraph} key={paragraph.slice(0, 40)}>
						{paragraph}
					</p>
				))}
			</div>
		</section>
	);
};

export default ServiceDetailPage;
