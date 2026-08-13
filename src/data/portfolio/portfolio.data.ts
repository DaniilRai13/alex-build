import type { IResponsiveImage } from '@/types/image.interface';
import type { IPortfolioProject } from '@/types/portfolio.interface';

// Original photos: the <img> fallback and what the lightbox shows.
const allImages = import.meta.glob('../../assets/portfolio/**/*.{jpg,png}', {
	eager: true,
	import: 'default',
}) as Record<string, string>;

// Responsive WebP variants produced by scripts/generate-image-variants.mjs.
// A portfolio card is ~380 CSS px wide while the originals are 1500-2560px,
// so without these every card downloads several hundred KB it cannot use.
const allVariants = import.meta.glob(
	'../../assets/generated/portfolio/**/*.webp',
	{ eager: true, import: 'default' },
) as Record<string, string>;

// "…/generated/portfolio/project1/main-480.webp" -> key "project1/main", width 480
const VARIANT_RE = /\/generated\/portfolio\/(.+)-(\d+)\.webp$/;

const srcSets = new Map<string, string>();

for (const [path, url] of Object.entries(allVariants)) {
	const match = path.match(VARIANT_RE);
	if (!match) continue;

	const [, key, width] = match;
	const candidate = `${url} ${width}w`;

	srcSets.set(key, srcSets.has(key) ? `${srcSets.get(key)}, ${candidate}` : candidate);
}

/** Widths arrive in glob order; srcset is order-independent, so sorting is cosmetic. */
const imageOf = (folder: string, file: string): IResponsiveImage => {
	const path = `../../assets/portfolio/${folder}/${file}`;
	const src = allImages[path];

	// A typo in a filename should break the build, not ship a missing photo.
	if (!src) throw new Error(`Portfolio image not found: ${path}`);

	return { src, srcSet: srcSets.get(`${folder}/${file.replace(/\.\w+$/, '')}`) };
};

/** Photos of one project, naturally sorted (1, 2, 10…), preview first. */
const galleryOf = (folder: string, preview: IResponsiveImage): IResponsiveImage[] => {
	const rest = Object.keys(allImages)
		.filter(path => path.includes(`/portfolio/${folder}/`))
		.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
		.map(path => imageOf(folder, path.split('/').pop() as string))
		.filter(image => image.src !== preview.src);

	return [preview, ...rest];
};

const preview1 = imageOf('project1', 'main.jpg');
const preview2 = imageOf('project2', 'main.jpg');
const preview3 = imageOf('project3', 'main.jpg');
const preview4 = imageOf('project4', 'main.jpg');
const preview5 = imageOf('project5', 'main.jpg');
// project6 is a flat renovation — the preview shows the interior, not the facade.
const preview6 = imageOf('project6', '17.jpg');
const preview7 = imageOf('project7', 'main.jpg');
const preview8 = imageOf('project8', 'main.jpg');
const preview9 = imageOf('project9', 'main.jpg');

export const portfolioData: IPortfolioProject[] = [
	{
		id: 1,
		slug: 'rekonstrukce-paneloveho-bytu',
		title: 'Rekonstrukce panelového bytu',
		description:
			'Kompletní rekonstrukce panelového bytu na klíč. Byt jsme rozebrali až ' +
			'na nosné konstrukce – demontáž původních příček, podlah i rozvodů. ' +
			'Postavili jsme nové příčky z pórobetonu, provedli nové elektroinstalace ' +
			'a rozvody vody, vyrovnali podlahy a položili velkoformátovou dlažbu v ' +
			'dekoru dřeva. Výsledkem je světlý moderní interiér: kuchyně kombinující ' +
			'bílý lesk s dubem a keramickým obkladem, obývací část s jídelním koutem, ' +
			'klidná ložnice a koupelna s mramorovým dekorem Calacatta.',
		category: 'renovation',
		categoryLabel: 'BYT',
		location: 'Teplice',
		area: 40,
		year: 2025,
		preview: preview1,
		images: galleryOf('project1', preview1),
	},
	{
		id: 2,
		slug: 'kompaktni-byt-rekonstrukce',
		title: 'Kompaktní byt po rekonstrukci',
		description:
			'Rekonstrukce kompaktního bytu připraveného k okamžitému nastěhování. ' +
			'Nová kuchyňská linka v kombinaci bílé a dřevodekoru s efektním obkladem, ' +
			'koupelna s vanou a béžovým velkoformátovým obkladem, nové podlahy, dveře ' +
			'a světlé čisté prostory.',
		category: 'interior',
		categoryLabel: 'Kosmetika',
		location: 'Teplice',
		area: 32,
		year: 2024,
		preview: preview2,
		images: galleryOf('project2', preview2),
	},
	{
		id: 3,
		slug: 'rekonstrukce-bytu-koupelna',
		title: 'Rekonstrukce bytu s novou koupelnou',
		description:
			'Rekonstrukce bytu s výměnou podlah, obkladů a kompletním přepracováním ' +
			'koupelny. Nová vana, obklady v přírodních tónech a nové vinylové podlahy ' +
			'proměnily zastaralý byt v příjemné bydlení. Součástí fotogalerie je i ' +
			'původní stav před rekonstrukcí.',
		category: 'renovation',
		categoryLabel: 'BYT',
		location: 'Teplice',
		area: 54,
		year: 2024,
		preview: preview3,
		images: galleryOf('project3', preview3),
	},
	{
		id: 4,
		slug: 'rekonstrukce-bytu-kuchyne-koupelna',
		title: 'Rekonstrukce bytu a koupelny',
		description:
			'Rekonstrukce bytu včetně nové kuchyně a koupelny. Původní bytové jádro ' +
			'jsme nahradili novou zděnou koupelnou, osadili kuchyňskou linku a ' +
			'položili nové podlahy. Fotografie zachycují i průběh stavebních prací.',
		category: 'renovation',
		categoryLabel: 'BYT',
		location: 'Teplice',
		area: 46,
		year: 2023,
		preview: preview4,
		images: galleryOf('project4', preview4),
	},
	{
		id: 5,
		slug: 'zatepleni-fasady-panelaku',
		title: 'Zateplení fasády panelového domu',
		description:
			'Zateplení a rekonstrukce fasády panelového domu. Montáž lešení, ' +
			'zateplovací systém a nová povrchová úprava fasády. Zateplení snižuje ' +
			'náklady na vytápění a prodlužuje životnost celého objektu.',
		category: 'facade',
		categoryLabel: 'Fasáda',
		location: 'Teplice',
		area: 2400,
		year: 2024,
		preview: preview5,
		images: galleryOf('project5', preview5),
	},
	{
		id: 6,
		slug: 'rekonstrukce-bytu-panelak',
		title: 'Rekonstrukce bytu v panelovém domě',
		description:
			'Rekonstrukce bytu v panelovém domě. Nová kuchyňská linka s betonovým ' +
			'dekorem a černou pracovní deskou, koupelna se sprchovým koutem, nové ' +
			'podlahy a světlé stěny. Byt se nachází v domě, na kterém probíhala i ' +
			'obnova fasády.',
		category: 'interior',
		categoryLabel: 'Kosmetika',
		location: 'Teplice',
		area: 30,
		year: 2025,
		preview: preview6,
		images: galleryOf('project6', preview6),
	},
	{
		id: 7,
		slug: 'rekonstrukce-bytu-zelena-kuchyne',
		title: 'Kompletní rekonstrukce bytu',
		description:
			'Kompletní rekonstrukce bytu od demontáže původního jádra až po finální ' +
			'detaily. Nová kuchyň v jemném pastelově zeleném odstínu s bílým obkladem ' +
			'cihličkou, koupelna se sprchovým koutem a novými podlahami. Součástí ' +
			'galerie je i původní stav před rekonstrukcí.',
		category: 'renovation',
		categoryLabel: 'BYT',
		location: 'Teplice',
		area: 44,
		year: 2024,
		preview: preview7,
		images: galleryOf('project7', preview7),
	},
	{
		id: 8,
		slug: 'rekonstrukce-bytu-moderni-kuchyne',
		title: 'Rekonstrukce bytu s novou kuchyní',
		description:
			'Rekonstrukce bytu s novou kuchyní a koupelnou. Kuchyňská linka kombinuje ' +
			'bílý lesk, dřevodekor a černou pracovní desku se dřezem, koupelna je ' +
			'obložena velkoformátovou dlažbou v dekoru šedého mramoru se závěsným WC. ' +
			'Fotogalerie zachycuje i průběh prací a původní stav.',
		category: 'renovation',
		categoryLabel: 'BYT',
		location: 'Teplice',
		area: 38,
		year: 2025,
		preview: preview8,
		images: galleryOf('project8', preview8),
	},
	{
		id: 9,
		slug: 'rekonstrukce-bytu-radova-kuchyne',
		title: 'Rekonstrukce bytu s řadovou kuchyní',
		description:
			'Rekonstrukce bytu s moderní řadovou kuchyní. Bílé lesklé skříňky, ' +
			'dřevěný obklad s LED podsvícením a betonová pracovní deska s černým ' +
			'dřezem, nové podlahy a koupelna s velkoformátovou dlažbou. Světlý a ' +
			'čistý interiér připravený k bydlení.',
		category: 'interior',
		categoryLabel: 'Kosmetika',
		location: 'Teplice',
		area: 50,
		year: 2025,
		preview: preview9,
		images: galleryOf('project9', preview9),
	},
];

/** Look up a project by its URL segment (/project/{slug}). */
export const getProjectBySlug = (slug?: string) =>
	portfolioData.find(project => project.slug === slug);

const FEATURED_SLUG = 'rekonstrukce-paneloveho-bytu';

/**
 * The most presentable finished shot we have. Pages outside the portfolio use
 * it as their hero image, so it lives here rather than as a slug string spelled
 * out in a component — renaming the project then breaks the build, not the page.
 */
export const featuredProject = (() => {
	const project = getProjectBySlug(FEATURED_SLUG);

	if (!project) throw new Error(`Featured project not found: ${FEATURED_SLUG}`);

	return project;
})();
