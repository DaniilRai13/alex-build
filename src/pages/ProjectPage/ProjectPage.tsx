import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Seo from '@/components/common/Seo/Seo';
import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Image from '@/components/ui/Image/Image';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { company, ORGANIZATION_ID } from '@/config/company';
import { breadcrumbJsonLd } from '@/config/jsonLd';
import { projectPath, ROUTES } from '@/config/routes';
import { getProjectBySlug, portfolioData } from '@/data/portfolio/portfolio.data';
import { useState, type FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import styles from './ProjectPage.module.scss';

/** Meta description has to stay short — one sentence of the project copy. */
const metaDescription = (text: string) => {
	if (text.length <= 155) return text;

	const cut = text.slice(0, 155);
	const lastSpace = cut.lastIndexOf(' ');

	return `${cut.slice(0, lastSpace > 0 ? lastSpace : cut.length)}…`;
};

const ProjectPage: FC = () => {
	const { slug } = useParams();
	const project = getProjectBySlug(slug);

	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	// An unknown slug renders the 404 page instead of an empty shell, so a
	// mistyped URL never turns into an indexable soft 404.
	if (!project) return <NotFoundPage />;

	const url = projectPath(project.slug);
	const [cover, ...gallery] = project.images;

	const crumbs = [
		{ name: 'Domů', href: ROUTES.HOME },
		{ name: 'Portfolio', href: ROUTES.PORTFOLIO },
		{ name: project.title },
	];

	const projectJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: project.title,
		description: project.description,
		url: `${company.url}${url}`,
		image: project.images.map(image => `${company.url}${image.src}`),
		dateCreated: String(project.year),
		locationCreated: {
			'@type': 'Place',
			name: project.location,
		},
		creator: { '@id': ORGANIZATION_ID },
	};

	// Neighbouring projects keep every detail page linked from at least two
	// others, so crawlers reach all of them without relying on the sitemap.
	const related = portfolioData
		.filter(item => item.slug !== project.slug)
		.slice(0, 3);

	return (
		<article className={styles.project}>
			<Seo
				title={project.title}
				description={metaDescription(project.description)}
				path={url}
				image={project.preview.src}
				jsonLd={[breadcrumbJsonLd(crumbs), projectJsonLd]}
			/>

			<Breadcrumbs items={crumbs} />

			<header className={styles.header}>
				<span className={styles.category}>{project.categoryLabel}</span>

				<Heading as='h1' className={styles.title}>
					{project.title}
				</Heading>

				<dl className={styles.meta}>
					<div>
						<dt>
							<Icon icon='MapPin' size={16} />
							Místo
						</dt>
						<dd>{project.location}</dd>
					</div>
					<div>
						<dt>Plocha</dt>
						<dd>{project.area} m²</dd>
					</div>
					<div>
						<dt>Rok realizace</dt>
						<dd>{project.year}</dd>
					</div>
				</dl>
			</header>

			<div className={styles.body}>
				<button
					className={styles.cover}
					type='button'
					onClick={() => setLightboxIndex(0)}
					aria-label='Otevřít fotogalerii projektu'
				>
					<Image
						src={cover.src}
						srcSet={cover.srcSet}
						sizes='(max-width: 1024px) 100vw, 55vw'
						alt={`${project.title} – ${project.location}`}
						priority
					/>
				</button>

				<div className={styles.description}>
					<Heading as='h2' className={styles.descriptionHeading}>
						O projektu
					</Heading>

					<p>{project.description}</p>

					<Button
						title='Chci podobnou rekonstrukci'
						className={styles.cta}
						to={ROUTES.CONTACTS}
					/>
				</div>
			</div>

			{gallery.length > 0 && (
				<section className={styles.gallerySection}>
					<Heading as='h2' className={styles.galleryHeading}>
						Fotogalerie realizace
					</Heading>

					{/* Every photo is a real <img> in the HTML, so image search can
					    index them — the gallery used to live only inside a modal. */}
					<ul className={styles.gallery}>
						{gallery.map((image, index) => (
							<li key={image.src}>
								<button
									type='button'
									className={styles.galleryItem}
									onClick={() => setLightboxIndex(index + 1)}
									aria-label={`Zvětšit fotografii ${index + 2}`}
								>
									<Image
										src={image.src}
										srcSet={image.srcSet}
										sizes='(max-width: 768px) 45vw, (max-width: 1200px) 33vw, 25vw'
										alt={`${project.title} – fotografie ${index + 2} z ${project.images.length}`}
									/>
								</button>
							</li>
						))}
					</ul>
				</section>
			)}

			<section className={styles.related}>
				<Heading as='h2' className={styles.relatedHeading}>
					Další realizace
				</Heading>

				<ul className={styles.relatedList}>
					{related.map(item => (
						<li key={item.slug}>
							<Link className={styles.relatedLink} to={projectPath(item.slug)}>
								<Image
									src={item.preview.src}
									srcSet={item.preview.srcSet}
									sizes='(max-width: 768px) 45vw, 25vw'
									alt={item.title}
								/>
								<span className={styles.relatedTitle}>{item.title}</span>
								<span className={styles.relatedMeta}>
									{item.location} • {item.area} m²
								</span>
							</Link>
						</li>
					))}
				</ul>

				<Button
					title='Zobrazit celé portfolio'
					className={styles.portfolioLink}
					to={ROUTES.PORTFOLIO}
				/>
			</section>

			{lightboxIndex !== null && (
				<Lightbox
					open
					close={() => setLightboxIndex(null)}
					index={lightboxIndex}
					slides={project.images.map(image => ({ src: image.src }))}
					plugins={[Zoom, Fullscreen]}
				/>
			)}
		</article>
	);
};

export default ProjectPage;
