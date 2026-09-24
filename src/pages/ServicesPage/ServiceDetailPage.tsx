import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Faq from '@/components/common/Faq/Faq';
import Seo from '@/components/common/Seo/Seo';
import Heading from '@/components/ui/Heading/Heading';
import { company, ORGANIZATION_ID } from '@/config/company';
import { breadcrumbJsonLd, faqJsonLd } from '@/config/jsonLd';
import { ROUTES, servicePath } from '@/config/routes';
import { faqForService } from '@/data/faq.data';
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
	const faq = faqForService(service.slug);
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
				jsonLd={[breadcrumbJsonLd(crumbs), serviceJsonLd, faqJsonLd(faq)]}
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

				{/*
					Each paragraph under its own kicker. The three always do three
					different jobs — what it is, why it works that way, who it is
					for — and run as identical grey blocks a reader has to wade
					through to find the one that applies to them.

					The kicker is a <b>, not an <h3>: these name paragraphs inside
					one section, and putting them in the page outline would bury
					the h2 they belong to under three siblings.
				*/}
				{service.longDescription.map(({ heading, text }) => (
					<div className={styles.section} key={heading}>
						<b className={styles.kicker}>{heading}</b>
						<p className={styles.paragraph}>{text}</p>
					</div>
				))}
			</div>

			<Faq items={faq} />
		</section>
	);
};

export default ServiceDetailPage;
