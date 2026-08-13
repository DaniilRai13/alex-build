import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Seo from '@/components/common/Seo/Seo';
import Heading from '@/components/ui/Heading/Heading';
import { company } from '@/config/company';
import { breadcrumbJsonLd } from '@/config/jsonLd';
import { ROUTES, servicePath } from '@/config/routes';
import { getServiceBySlug, services } from '@/data/services.data';
import type { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import ServicePreview from './ServicePreview/ServicePreview';
import ServiceSidebar from './ServiceSidebar/ServiceSidebar';
import styles from './ServiceDetailPage.module.scss';

const ServiceDetailPage: FC = () => {
	const { slug } = useParams();
	const service = getServiceBySlug(slug);

	// An unknown slug renders the 404 page instead of an empty shell, so a
	// mistyped URL never turns into an indexable soft 404.
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
		provider: { '@id': `${company.url}/#organization` },
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: service.title,
			itemListElement: service.features.map(feature => ({
				'@type': 'Offer',
				itemOffered: { '@type': 'Service', name: feature },
			})),
		},
	};

	const otherServices = services.filter(item => item.slug !== service.slug);

	return (
		<section className={styles.detail}>
			<Seo
				title={service.seoTitle}
				description={service.seoDescription}
				path={url}
				jsonLd={[breadcrumbJsonLd(crumbs), serviceJsonLd]}
			/>

			<Breadcrumbs items={crumbs} />

			<div className={styles.top}>
				<div className={styles.sticky}>
					{/* The sidebar precedes the <h1> in the DOM, so its label stays a
					    plain <p> — a heading here would sit above the page title. */}
					<ServiceSidebar
						activeSlug={service.slug}
						headingAs='p'
						description='Přejděte na další oblast, která vás zajímá.'
					/>
				</div>

				<div className={styles.content}>
					<ServicePreview
						service={service}
						headingAs='h1'
						secondaryTitle='Zobrazit realizace'
						secondaryTo={ROUTES.PORTFOLIO}
						priority
					/>

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

					<div className={styles.related}>
						<Heading as='h2' className={styles.relatedHeading}>
							Další služby
						</Heading>

						<ul className={styles.relatedList}>
							{otherServices.map(item => (
								<li key={item.slug}>
									<Link
										className={styles.relatedLink}
										to={servicePath(item.slug)}
									>
										<strong>{item.title}</strong>
										<span>{item.description}</span>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ServiceDetailPage;
