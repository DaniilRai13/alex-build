import type {
	BuildingType,
	IPortfolioProject,
	IProjectPhoto,
	PhotoPhase,
	PortfolioCategory,
} from '@/types/portfolio.interface';
import projectsJson from './projects.json';

/**
 * The shape of projects.json. Declared rather than inferred:
 * TypeScript would type `photos` as one object literal per project, keyed by
 * that project's file names, and nothing could look a photo up by name.
 */
interface IRemoteProject {
	id: string;
	slug: string;
	title: string;
	description: string;
	category: string;
	location: string;
	area: number;
	year: number;
	district?: string | null;
	buildingType?: BuildingType | null;
	layout?: string | null;
	durationWeeks?: number | null;
	story?: Partial<Record<keyof IPortfolioProject['story'], string | null>>;
	testimonial?: { text: string; author: string | null } | null;
	seoTitle?: string | null;
	seoDescription?: string | null;
	preview: string;
	images: string[];
	photos?: Record<string, { caption: string | null; phase: PhotoPhase | null }>;
}

// Through `unknown`: the inferred per-project `photos` literals are not
// comparable to a record, which is the very reason for declaring the shape.
const remote = projectsJson as unknown as IRemoteProject[];

/** null in the JSON becomes an absent property, which is what the pages test for. */
const optional = <T>(value: T | null | undefined): T | undefined => value ?? undefined;

// The projects live in this repository since 1 Nov 2026: projects.json for the
// facts and texts, public/photos/<slug>/ for the photos. They used to be edited
// in the admin and downloaded from Supabase before every build; the owner now
// sends new projects to be added here by hand, and the admin only shows the
// list the site publishes (scripts/export-portfolio.mjs). This module turns the
// JSON into the shape the pages expect.
//
// The original photos are served from public/ as they are, at stable URLs: the
// <img> fallback, what the lightbox shows, and the thumbnails the admin loads
// from the live site.

// Responsive WebP variants produced by scripts/generate-image-variants.mjs.
// A portfolio card is ~380 CSS px wide while the originals are 1500-2560px,
// so without these every card downloads several hundred KB it cannot use.
const allVariants = import.meta.glob(
	'../../assets/generated/photos/**/*.webp',
	{ eager: true, import: 'default' },
) as Record<string, string>;

// "…/generated/photos/some-slug/main-480.webp" -> key "some-slug/main", width 480
const VARIANT_RE = /\/generated\/photos\/(.+)-(\d+)\.webp$/;

const srcSets = new Map<string, string>();

for (const [path, url] of Object.entries(allVariants)) {
	const match = path.match(VARIANT_RE);
	if (!match) continue;

	const [, key, width] = match;
	const candidate = `${url} ${width}w`;

	srcSets.set(key, srcSets.has(key) ? `${srcSets.get(key)}, ${candidate}` : candidate);
}

/** Widths arrive in glob order; srcset is order-independent, so sorting is cosmetic. */
const imageOf = (project: IRemoteProject, file: string): IProjectPhoto => {
	const srcSet = srcSets.get(`${project.slug}/${file.replace(/\.\w+$/, '')}`);

	// The variants are made from the files in public/photos, so a photo with
	// none is a photo listed in projects.json but missing on disk — or added
	// since the variants were last generated. Breaking the build is better than
	// shipping a blank card.
	if (!srcSet)
		throw new Error(
			`Portfolio photo not found: public/photos/${project.slug}/${file}. ` +
				'Check the file, then run "npm run images:variants".',
		);

	const details = project.photos?.[file];

	return {
		src: `/photos/${project.slug}/${file}`,
		srcSet,
		caption: optional(details?.caption),
		phase: optional(details?.phase),
	};
};

export const portfolioData: IPortfolioProject[] = remote.map(project => ({
	id: project.id,
	slug: project.slug,
	title: project.title,
	description: project.description,
	category: project.category as PortfolioCategory,
	location: project.location,
	district: optional(project.district),
	buildingType: optional(project.buildingType),
	layout: optional(project.layout),
	durationWeeks: optional(project.durationWeeks),
	area: project.area,
	year: project.year,
	story: {
		before: optional(project.story?.before),
		brief: optional(project.story?.brief),
		work: optional(project.story?.work),
		challenges: optional(project.story?.challenges),
		materials: optional(project.story?.materials),
		result: optional(project.story?.result),
	},
	testimonial: project.testimonial
		? { text: project.testimonial.text, author: optional(project.testimonial.author) }
		: undefined,
	seoTitle: optional(project.seoTitle),
	seoDescription: optional(project.seoDescription),
	preview: imageOf(project, project.preview),
	// Preview first, then the rest in the order set in the admin — the same
	// arrangement the hand-written data used.
	images: [
		imageOf(project, project.preview),
		...project.images
			.filter(file => file !== project.preview)
			.map(file => imageOf(project, file)),
	],
}));

/** Look up a project by its URL segment (/portfolio/{slug}). */
export const getProjectBySlug = (slug?: string) =>
	portfolioData.find(project => project.slug === slug);

/**
 * True when the project shows both where it started and where it ended — the
 * pair the "Před a po" badge promises. Read from the stages set in the admin,
 * so the badge appears by itself once a project's photos are marked.
 */
export const hasBeforeAfter = (project: IPortfolioProject) =>
	project.images.some(image => image.phase === 'before') &&
	project.images.some(image => image.phase === 'after');

/**
 * The figures the portfolio page quotes. Counted, never typed: they change
 * every time a project is added in the admin, and a number in the copy that
 * disagrees with the grid under it is worse than no number.
 */
export const portfolioStats = (() => {
	const flats = portfolioData.filter(project => project.category !== 'facade');
	const areas = flats.map(project => project.area);

	return {
		projects: portfolioData.length,
		flats: flats.length,
		// The facade's area is wall surface, not floor — it would swamp the sum.
		flatArea: areas.reduce((sum, area) => sum + area, 0),
		smallestFlat: Math.min(...areas),
		largestFlat: Math.max(...areas),
		photos: portfolioData.reduce((sum, project) => sum + project.images.length, 0),
		beforeAfter: portfolioData.filter(hasBeforeAfter).length,
		// Read from the data rather than typed into the copy: until 1 Nov every
		// project said "Teplice" as a placeholder, and the text claimed it too.
		towns: new Intl.ListFormat('cs', { type: 'conjunction' }).format(
			[...new Set(portfolioData.map(project => project.location))],
		),
	};
})();

const FEATURED_SLUG = 'rekonstrukce-paneloveho-bytu';

/**
 * The most presentable finished shot we have. Pages outside the portfolio use
 * it as their hero image.
 *
 * Falls back to the first project rather than throwing: the slug now lives in
 * a database someone can rename, and an unrelated page losing its hero should
 * not take the whole site down with it.
 */
export const featuredProject = (() => {
	const project = getProjectBySlug(FEATURED_SLUG) ?? portfolioData[0];

	if (!project)
		throw new Error('The portfolio is empty — src/data/portfolio/projects.json has no projects.');

	return project;
})();

/** How many projects the home page shows in its portfolio strip. */
export const HOME_STRIP_SIZE = 4;

/** The projects that strip renders. */
export const homeStripProjects = portfolioData.slice(0, HOME_STRIP_SIZE);

/**
 * Photo for the About block on the home page.
 *
 * Two constraints. It must not be one of the projects the strip below already
 * shows — the same shot twice on one screen reads as a mistake rather than a
 * choice. And it should be finished work: the block is the company introducing
 * itself, so a site mid-scaffolding sells nothing, however honest it is.
 *
 * Named rather than derived, because "the first one the strip skips" happened
 * to land on the facade job. But the name is still checked against the strip,
 * so reordering the portfolio in the admin cannot quietly reintroduce the
 * duplicate — it falls back to the old rule instead.
 */
const ABOUT_SLUG = 'rekonstrukce-bytu-radova-kuchyne';

export const aboutProject = (() => {
	const chosen = getProjectBySlug(ABOUT_SLUG);
	const clashesWithStrip = homeStripProjects.some(
		project => project.slug === ABOUT_SLUG,
	);

	if (chosen && !clashesWithStrip) return chosen;

	return portfolioData[HOME_STRIP_SIZE] ?? featuredProject;
})();

/**
 * One hand-picked photo of one project, or nothing. The admin can rename or
 * delete either, and a chosen shot that has gone should cost the page that
 * shot — not break the build the way a file missing from the manifest does.
 */
const namedPhoto = (slug: string, file: string) => {
	const raw = remote.find(project => project.slug === slug);
	const project = getProjectBySlug(slug);

	if (!raw || !project) return undefined;
	if (raw.preview !== file && !raw.images.includes(file)) return undefined;

	return { project, photo: imageOf(raw, file) };
};

/**
 * The "Naše realizace" card on the home page's first screen: projects neither
 * the About block nor the strip below shows, since the same project on two
 * consecutive screens reads as a mistake. Flats only — a facade in a 64px
 * square is just a wall.
 */
export const heroProjects = [
	...portfolioData.slice(HOME_STRIP_SIZE),
	...portfolioData.slice(0, HOME_STRIP_SIZE),
]
	.filter(project => project.category !== 'facade' && project.slug !== aboutProject.slug)
	.slice(0, 3);

/**
 * The before-and-after pair on the home page: the same room from the same
 * spot, worn parquet and then the new floor. Picked by hand because a pair
 * only works when the angle matches, and nothing in the data says which photos
 * show the same corner. When either photo is gone the pair is too, and the
 * section with it — two unrelated shots side by side would prove nothing.
 */
export const beforeAfter = (() => {
	const before = namedPhoto('rekonstrukce-bytu-panelak', '4.jpg');
	const after = namedPhoto('rekonstrukce-bytu-panelak', '6.jpg');

	if (!before || !after) return undefined;

	return { project: before.project, before: before.photo, after: after.photo };
})();

/** "other" is a fact the admin can record but not one worth printing. */
export const BUILDING_LABELS: Partial<Record<BuildingType, string>> = {
	panel: 'Panelový dům',
	brick: 'Cihlový dům',
	house: 'Rodinný dům',
};

/**
 * What a project card prints under its title: where, which layout, what kind
 * of building, how big. Only what the admin has filled in — most projects have
 * no layout or building type yet, and a card must not guess them.
 */
export const projectFacts = (project: IPortfolioProject): string[] => {
	const building = project.buildingType && BUILDING_LABELS[project.buildingType];

	return [
		project.district ? `${project.location} – ${project.district}` : project.location,
		project.layout,
		building?.toLowerCase(),
		`${project.area} m²`,
	].filter((fact): fact is string => Boolean(fact));
};

/** How many projects the portfolio holds in each town, most first. */
export const projectsByLocation: [location: string, count: number][] =
	Object.entries(
		portfolioData.reduce<Record<string, number>>((counts, project) => {
			counts[project.location] = (counts[project.location] ?? 0) + 1;

			return counts;
		}, {}),
	).sort(([, a], [, b]) => b - a);

/**
 * The projects that demonstrate a service. Feeds the links between a service
 * and the work that proves it: there were none in either direction, so anyone
 * convinced by a service page had no way to see it done, and anyone impressed
 * by a project had no way to order it.
 *
 * Returns nothing for a service with no category, rather than falling back to
 * recent projects — a service page that shows unrelated work is worse than one
 * that shows none.
 */
export const projectsForCategory = (
	category?: PortfolioCategory,
	limit = 3,
): IPortfolioProject[] =>
	category
		? portfolioData.filter(project => project.category === category).slice(0, limit)
		: [];
