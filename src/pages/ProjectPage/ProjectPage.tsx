import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Seo from '@/components/common/Seo/Seo';
import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Image from '@/components/ui/Image/Image';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';
import { company, ORGANIZATION_ID } from '@/config/company';
import { breadcrumbJsonLd } from '@/config/jsonLd';
import { projectPath, ROUTES, servicePath } from '@/config/routes';
import { serviceForCategory } from '@/data/services.data';
import {
	BUILDING_LABELS,
	getProjectBySlug,
	portfolioData,
} from '@/data/portfolio/portfolio.data';
import { categoryLabel } from '@/data/portfolio/portfolioCategories.data';
import { plural } from '@/utils/plural';
import type {
	IPortfolioProject,
	IProjectPhoto,
	PhotoPhase,
} from '@/types/portfolio.interface';
import { useState, type FC, type ReactNode } from 'react';
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

const weeks = (count: number) => `${count} ${plural(count, 'týden', 'týdny', 'týdnů')}`;

/**
 * Story text as the admin stores it: paragraphs separated by a blank line, and
 * a block whose every line starts with "-" or "•" shown as a list — the way
 * people jot down what was done room by room.
 */
const Prose: FC<{ text: string }> = ({ text }) => (
	<div className={styles.prose}>
		{text.split(/\n\s*\n/).map((block, index) => {
			const lines = block
				.split('\n')
				.map(line => line.trim())
				.filter(Boolean);
			const isList = lines.length > 1 && lines.every(line => /^[-•]\s+/.test(line));

			return isList ? (
				<ul key={index}>
					{lines.map(line => (
						<li key={line}>{line.replace(/^[-•]\s+/, '')}</li>
					))}
				</ul>
			) : (
				<p key={index}>{lines.join(' ')}</p>
			);
		})}
	</div>
);

const PHASE_LABEL: Record<PhotoPhase, string> = {
	before: 'Před',
	during: 'Během',
	after: 'Po',
};

interface Stage {
	phase: PhotoPhase;
	heading: string;
	text?: string;
	/** The smaller story fields, under their own h3 inside the stage. */
	notes: { heading: string; text: string }[];
	photos: IProjectPhoto[];
}

/**
 * The case study as three stages of the job — before, the work, the result —
 * the same numbered line the "Jak pracujeme" block on the home page draws for a
 * job not started yet. Photos marked before / during / after in the admin sit
 * in their stage, so the text reads as captions to a sequence of pictures. The
 * brief belongs to the starting point, problems and materials to the work. A
 * stage with neither text nor photos is left out.
 */
const stagesOf = (project: IPortfolioProject): Stage[] => {
	const inPhase = (phase: PhotoPhase) =>
		project.images.filter(photo => photo.phase === phase);
	const { story } = project;
	const notes = (...items: [string, string | undefined][]) =>
		items.flatMap(([heading, text]) => (text ? [{ heading, text }] : []));

	const stages: Stage[] = [
		{
			phase: 'before',
			heading: 'Výchozí stav',
			text: story.before,
			notes: notes(['Co si klient přál', story.brief]),
			photos: inPhase('before'),
		},
		{
			phase: 'during',
			heading: 'Co jsme udělali',
			text: story.work,
			notes: notes(['Na co jsme narazili', story.challenges], ['Materiály', story.materials]),
			photos: inPhase('during'),
		},
		{
			phase: 'after',
			heading: 'Výsledek',
			text: story.result,
			notes: [],
			photos: inPhase('after'),
		},
	];

	return stages.filter(
		stage => stage.text || stage.notes.length > 0 || stage.photos.length > 0,
	);
};

interface Fact {
	icon: IconNames;
	label: string;
	value: ReactNode;
}

const ProjectPage: FC = () => {
	const { slug } = useParams();
	const project = getProjectBySlug(slug);

	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	// An unknown slug renders the 404 page instead of an empty shell, so a
	// mistyped URL never turns into an indexable soft 404.
	if (!project) return <NotFoundPage />;

	const url = projectPath(project.slug);
	const service = serviceForCategory(project.category);

	const place = project.district
		? `${project.location} – ${project.district}`
		: project.location;
	const building = project.buildingType && BUILDING_LABELS[project.buildingType];

	const stages = stagesOf(project);
	const untagged = project.images.filter(photo => !photo.phase);

	// The stages regroup the photos, so a photo's place on the page is not its
	// index in project.images — which is what the lightbox opens at.
	const lightboxIndexOf = new Map(project.images.map((image, index) => [image.src, index]));

	const altOf = (photo: IProjectPhoto) =>
		photo.caption ??
		`${project.title} – fotografie ${(lightboxIndexOf.get(photo.src) ?? 0) + 1} z ${project.images.length}`;

	// When the admin has no title of its own for Google: the area and the city,
	// which searches name and which also keep nine similar titles apart. The
	// city is skipped when the title already carries it ("Teplice – Teplice").
	const title =
		project.seoTitle ??
		(project.title.includes(project.location)
			? `${project.title} – ${project.area} m²`
			: `${project.title} – ${project.area} m², ${project.location}`);

	const crumbs = [
		{ name: 'Domů', href: ROUTES.HOME },
		{ name: 'Portfolio', href: ROUTES.PORTFOLIO },
		{ name: project.title },
	];

	const facts: Fact[] = [
		{ icon: 'MapPin', label: 'Místo', value: place },
		...(building ? [{ icon: 'Building2' as const, label: 'Typ domu', value: building }] : []),
		...(project.layout
			? [{ icon: 'House' as const, label: 'Dispozice', value: project.layout }]
			: []),
		{ icon: 'PencilRuler', label: 'Plocha', value: `${project.area} m²` },
		...(project.durationWeeks
			? [{ icon: 'Clock' as const, label: 'Délka realizace', value: weeks(project.durationWeeks) }]
			: []),
		{ icon: 'CalendarCheck', label: 'Rok realizace', value: project.year },
		// The way back from the work to the thing you can order: a visitor
		// impressed by a project gets the service one click away, in the list of
		// facts they are already reading.
		...(service
			? [
					{
						icon: 'Drill' as const,
						label: 'Služba',
						value: <Link to={servicePath(service.slug)}>{service.title}</Link>,
					},
				]
			: []),
	];

	const projectJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: project.title,
		description: project.description,
		url: `${company.url}${url}`,
		image: project.images.map(image =>
			image.caption
				? {
						'@type': 'ImageObject',
						contentUrl: `${company.url}${image.src}`,
						caption: image.caption,
					}
				: `${company.url}${image.src}`,
		),
		dateCreated: String(project.year),
		locationCreated: {
			'@type': 'Place',
			name: place,
		},
		creator: { '@id': ORGANIZATION_ID },
		...(service
			? {
					about: {
						'@type': 'Service',
						name: service.title,
						url: `${company.url}${servicePath(service.slug)}`,
					},
				}
			: {}),
	};

	// Same kind of work first: someone reading about a bathroom wants another
	// bathroom, not the facade that happens to be next in the list. Every detail
	// page still ends up linked from at least two others, so crawlers reach all
	// of them without relying on the sitemap.
	const others = portfolioData.filter(item => item.slug !== project.slug);
	const related = [
		...others.filter(item => item.category === project.category),
		...others.filter(item => item.category !== project.category),
	].slice(0, 3);

	const photoGrid = (photos: IProjectPhoto[], className: string) => (
		// Every photo is a real <img> in the HTML, so image search can index
		// them — the gallery used to live only inside a modal.
		<ul className={className}>
			{photos.map(photo => {
				const index = lightboxIndexOf.get(photo.src) ?? 0;

				return (
					<li key={photo.src}>
						<figure className={styles.figure}>
							<button
								type='button'
								className={styles.frame}
								onClick={() => setLightboxIndex(index)}
								aria-label={`Zvětšit fotografii ${index + 1}`}
							>
								<Image
									src={photo.src}
									srcSet={photo.srcSet}
									sizes='(max-width: 768px) 62vw, 22vw'
									alt={altOf(photo)}
								/>
							</button>
							{photo.caption && <figcaption>{photo.caption}</figcaption>}
						</figure>
					</li>
				);
			})}
		</ul>
	);

	const stageContent = (stage: Stage) => (
		<>
			<span className={styles.eyebrow}>{PHASE_LABEL[stage.phase]}</span>
			<Heading as='h2' className={styles.h2}>
				{stage.heading}
			</Heading>

			{stage.text && <Prose text={stage.text} />}
			{stage.notes.map(note => (
				<div key={note.heading} className={styles.note}>
					<Heading as='h3' className={styles.h3}>
						{note.heading}
					</Heading>
					<Prose text={note.text} />
				</div>
			))}
			{stage.photos.length > 0 && photoGrid(stage.photos, styles.photos)}
		</>
	);

	return (
		<article className={styles.project}>
			<Seo
				title={title}
				description={project.seoDescription ?? metaDescription(project.description)}
				path={url}
				image={project.preview.src}
				ogType='article'
				jsonLd={[breadcrumbJsonLd(crumbs), projectJsonLd]}
			/>

			<Breadcrumbs items={crumbs} />

			<header className={styles.head}>
				<div>
					<span className={styles.eyebrow}>{categoryLabel(project.category)}</span>
					{/* The town in the heading: "rekonstrukce bytu Chomutov" is how the
					    long-tail searches for these pages are worded. */}
					<Heading as='h1' className={styles.title}>
						{project.title.includes(project.location)
							? project.title
							: `${project.title}, ${project.location}`}
					</Heading>
					<p className={styles.lead}>{project.description}</p>
				</div>

				<div className={styles.card}>
					<dl className={styles.facts}>
						{facts.map(fact => (
							<div key={fact.label}>
								<dt>
									<Icon icon={fact.icon} size={16} />
									<span>{fact.label}</span>
								</dt>
								<dd>{fact.value}</dd>
							</div>
						))}
					</dl>
					<Button
						title='Chci podobnou rekonstrukci'
						className={styles.cta}
						to={ROUTES.CONTACTS}
					/>
				</div>
			</header>

			{/* A line of one stage is just decoration, so a project with only
			    "after" photos gets plain sections instead. */}
			{stages.length > 1 ? (
				<ol className={styles.timeline}>
					{stages.map((stage, index) => (
						<li className={styles.stage} key={stage.phase}>
							<span className={styles.marker} aria-hidden='true'>
								{index + 1}
							</span>
							<div className={styles.content}>{stageContent(stage)}</div>
						</li>
					))}
				</ol>
			) : (
				stages.map(stage => (
					<section className={styles.section} key={stage.phase}>
						{stageContent(stage)}
					</section>
				))
			)}

			{untagged.length > 0 && (
				<section className={styles.section}>
					<Heading as='h2' className={styles.h2}>
						{stages.length > 0 ? 'Další fotografie' : 'Fotogalerie realizace'}
					</Heading>

					{photoGrid(untagged, styles.gallery)}
				</section>
			)}

			{project.testimonial && (
				<section className={styles.section}>
					<Heading as='h2' className={styles.h2}>
						Slovy klienta
					</Heading>

					<figure className={styles.testimonial}>
						<blockquote>
							<p>„{project.testimonial.text}“</p>
						</blockquote>
						{project.testimonial.author && (
							<figcaption>{project.testimonial.author}</figcaption>
						)}
					</figure>
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
					slides={project.images.map(image => ({
						src: image.src,
						alt: image.caption,
					}))}
					plugins={[Zoom, Fullscreen]}
				/>
			)}
		</article>
	);
};

export default ProjectPage;
