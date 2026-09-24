import type { IResponsiveImage } from '@/types/image.interface';
import type {
	IPortfolioProject,
	PortfolioCategory,
} from '@/types/portfolio.interface';
import remote from './portfolio.remote.json';

// The projects themselves are edited in the admin app and downloaded before
// every build by scripts/fetch-portfolio.mjs — this module only turns that
// download into the shape the pages already expect. Nothing here talks to the
// network: by the time Vite runs, the photos are ordinary files on disk.

// Original photos: the <img> fallback and what the lightbox shows.
const allImages = import.meta.glob(
	'../../assets/portfolio-remote/**/*.{jpg,jpeg,png,webp}',
	{ eager: true, import: 'default' },
) as Record<string, string>;

// Responsive WebP variants produced by scripts/generate-image-variants.mjs.
// A portfolio card is ~380 CSS px wide while the originals are 1500-2560px,
// so without these every card downloads several hundred KB it cannot use.
const allVariants = import.meta.glob(
	'../../assets/generated/portfolio-remote/**/*.webp',
	{ eager: true, import: 'default' },
) as Record<string, string>;

// "…/generated/portfolio-remote/some-slug/main-480.webp" -> key "some-slug/main", width 480
const VARIANT_RE = /\/generated\/portfolio-remote\/(.+)-(\d+)\.webp$/;

const srcSets = new Map<string, string>();

for (const [path, url] of Object.entries(allVariants)) {
	const match = path.match(VARIANT_RE);
	if (!match) continue;

	const [, key, width] = match;
	const candidate = `${url} ${width}w`;

	srcSets.set(key, srcSets.has(key) ? `${srcSets.get(key)}, ${candidate}` : candidate);
}

/** Widths arrive in glob order; srcset is order-independent, so sorting is cosmetic. */
const imageOf = (slug: string, file: string): IResponsiveImage => {
	const path = `../../assets/portfolio-remote/${slug}/${file}`;
	const src = allImages[path];

	// A photo listed in the manifest but missing on disk means the download was
	// interrupted. Breaking the build is better than shipping a blank card.
	if (!src)
		throw new Error(
			`Portfolio image not found: ${path}. Run "npm run portfolio:fetch" to download it.`,
		);

	return { src, srcSet: srcSets.get(`${slug}/${file.replace(/\.\w+$/, '')}`) };
};

export const portfolioData: IPortfolioProject[] = remote.map(project => ({
	id: project.id,
	slug: project.slug,
	title: project.title,
	description: project.description,
	category: project.category as PortfolioCategory,
	categoryLabel: project.categoryLabel,
	location: project.location,
	area: project.area,
	year: project.year,
	preview: imageOf(project.slug, project.preview),
	// Preview first, then the rest in the order set in the admin — the same
	// arrangement the hand-written data used.
	images: [
		imageOf(project.slug, project.preview),
		...project.images
			.filter(file => file !== project.preview)
			.map(file => imageOf(project.slug, file)),
	],
}));

/** Look up a project by its URL segment (/portfolio/{slug}). */
export const getProjectBySlug = (slug?: string) =>
	portfolioData.find(project => project.slug === slug);

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
		throw new Error('The portfolio is empty — scripts/fetch-portfolio.mjs found no projects.');

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
