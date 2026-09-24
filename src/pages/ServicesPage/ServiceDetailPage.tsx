import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Enquiry from '@/components/common/Enquiry/Enquiry';
import Faq from '@/components/common/Faq/Faq';
import Seo from '@/components/common/Seo/Seo';
import Heading from '@/components/ui/Heading/Heading';
import { company, ORGANIZATION_ID } from '@/config/company';
import { breadcrumbJsonLd, faqJsonLd } from '@/config/jsonLd';
import Image from '@/components/ui/Image/Image';
import { projectPath, ROUTES, servicePath } from '@/config/routes';
import { projectsForCategory } from '@/data/portfolio/portfolio.data';
import { faqForService } from '@/data/faq.data';
import { getServiceBySlug } from '@/data/services.data';
import type { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
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
	const projects = projectsForCategory(service.projectCategory);
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

			{/*
				The work that proves the service, between the description and the
				questions: read what it is, see it done, then ask. Rendered only
				when the service has matching projects — showing unrelated work
				would be worse than showing none, and the design service has no
				built evidence in the portfolio yet.
			*/}
			{projects.length > 0 && (
				<section className={styles.projects}>
					<Heading as='h2' className={styles.projectsHeading}>
						Realizace této služby
					</Heading>

					<ul className={styles.projectList}>
						{projects.map(project => (
							<li key={project.slug}>
								<Link
									className={styles.projectLink}
									to={projectPath(project.slug)}
								>
									<Image
										src={project.preview.src}
										srcSet={project.preview.srcSet}
										sizes='(max-width: 768px) 90vw, 30vw'
										alt={`${project.title} – ${project.location}`}
									/>
									<span className={styles.projectTitle}>{project.title}</span>
									<span className={styles.projectMeta}>
										{project.location} • {project.area} m²
									</span>
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}

			<Faq items={faq} />

			<Enquiry
				title={`Zajímá vás ${service.title.toLowerCase()}?`}
			/>
		</section>
	);
};

export default ServiceDetailPage;
