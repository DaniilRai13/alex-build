import type { IResponsiveImage } from '@/types/image.interface';
import type { IService } from '@/types/services.interface';

// Original PNGs (the <img> fallback) and their WebP twins from
// scripts/generate-image-variants.mjs. These illustrations are only ~450px
// wide, so there is nothing to downscale — but PNG to WebP still cuts each
// one from ~200 KB to ~55 KB, and the overview page shows all four at once.
const originals = import.meta.glob('../assets/services/*.png', {
	eager: true,
	import: 'default',
}) as Record<string, string>;

const webp = import.meta.glob('../assets/generated/services/*.webp', {
	eager: true,
	import: 'default',
}) as Record<string, string>;

const byName = (record: Record<string, string>) =>
	new Map(
		Object.entries(record).map(([path, url]) => [
			path.split('/').pop()!.replace(/\.\w+$/, ''),
			url,
		]),
	);

const originalByName = byName(originals);
const webpByName = byName(webp);

const illustration = (name: string): IResponsiveImage => {
	const src = originalByName.get(name);

	// A renamed file should break the build rather than ship a blank panel.
	if (!src) throw new Error(`Service illustration not found: ${name}.png`);

	return { src, srcSet: webpByName.get(name) };
};

const designImg = illustration('design');
const majorImg = illustration('majorRenovation');
const cosmeticImg = illustration('cosmetic');
const turnkey = illustration('turnkey');

export const services: IService[] = [
	{
		id: 1,
		slug: 'kompletni-rekonstrukce',
		title: 'Kompletní rekonstrukce',
		description:
			'Rekonstrukce bytů a domů od demolice až po finální dokončení – vše potřebné pod jednou střechou a s důrazem na kvalitu provedení.',
		seoTitle: 'Kompletní rekonstrukce bytů a domů',
		seoDescription:
			'Kompletní rekonstrukce bytu nebo domu na klíč – od demolice a nových rozvodů přes podlahy a dveře až po finální povrchy. Jeden dodavatel pro celou stavbu.',
		detailHeading: 'Co kompletní rekonstrukce zahrnuje',
		longDescription: [
			'Kompletní rekonstrukce znamená, že byt nebo dům rozebereme až na nosné konstrukce a postavíme znovu podle nového dispozičního řešení. Zajišťujeme celý proces pod jednou střechou – od demolice a odvozu suti přes nové příčky, elektroinstalace a rozvody vody až po podlahy, dveře a finální povrchy.',
			'Protože práce koordinuje jeden dodavatel, jednotlivé profese na sebe navazují bez prostojů a nemusíte domlouvat desítky řemeslníků zvlášť. Před zahájením prací připravíme harmonogram a rozpočet, abyste dopředu věděli, co a kdy se bude dít.',
			'Tento typ rekonstrukce dává smysl u starších bytů s dožilými rozvody, u panelových bytů s nevyhovující dispozicí a všude tam, kde kosmetické úpravy problém neřeší.',
		],
		icon: 'Drill',
		buttonText: 'Více informací',
		features: [
			'Demoliční práce',
			'Elektro a instalatérství',
			'Stěny, podlahy a dveře',
			'Zateplení a střecha',
			'Ostatní stavební práce',
		],
		img: majorImg,
	},
	{
		id: 2,
		slug: 'kosmeticke-upravy',
		title: 'Kosmetické úpravy',
		description:
			'Rychlé a efektivní obnovení interiéru bez rozsáhlých stavebních zásahů. Ideální pro přípravu bytu k pronájmu i zvýšení jeho hodnoty.',
		seoTitle: 'Kosmetické úpravy a rychlá obnova interiéru',
		seoDescription:
			'Rychlá obnova interiéru bez velkých stavebních zásahů – úpravy stěn, nové podlahové krytiny, osvětlení a úpravy koupelny. Ideální před pronájmem nebo prodejem bytu.',
		detailHeading: 'Kdy se kosmetické úpravy vyplatí',
		longDescription: [
			'Kosmetické úpravy obnoví vzhled bytu bez zásahů do nosných konstrukcí a rozvodů. Vyměníme podlahové krytiny, opravíme a vymalujeme stěny, doplníme osvětlení a upravíme koupelnu – interiér pak působí jako nový za zlomek času i nákladů kompletní rekonstrukce.',
			'Toto řešení volí nejčastěji majitelé, kteří připravují byt k pronájmu nebo prodeji a potřebují zvýšit jeho hodnotu rychle a předvídatelně. Pracovat umíme i v obydleném bytě a práce plánujeme tak, aby vás omezily co nejméně.',
			'Při prohlídce vždy upozorníme, pokud narazíme na problém, který kosmetická úprava nevyřeší – například dožilé rozvody nebo vlhkost. Raději to řekneme předem než v polovině prací.',
		],
		icon: 'PaintRoller',
		buttonText: 'Více informací',
		features: [
			'Úpravy stěn',
			'Výměna podlahových krytin',
			'Osvětlení',
			'Úpravy v koupelně',
		],
		img: cosmeticImg,
	},
	{
		id: 3,
		slug: 'stavebni-a-remeslne-prace',
		title: 'Stavební & řemeslné práce',
		description:
			'Stavební a řemeslné práce od základů přes hrubou stavbu a omítky až po fasády.',
		seoTitle: 'Stavební a řemeslné práce, omítky a fasády',
		seoDescription:
			'Stavební a řemeslné práce od základů přes hrubou stavbu a omítky až po zateplení a fasády. Novostavby, přístavby i opravy stávajících objektů.',
		detailHeading: 'Jaké stavební a řemeslné práce zajišťujeme',
		longDescription: [
			'Zajišťujeme stavební práce v celém rozsahu – základy, hrubou stavbu, vnitřní i vnější omítky a fasády. Pracujeme na novostavbách, přístavbách i na opravách a modernizaci stávajících objektů.',
			'Fasáda a omítky nejsou jen otázkou vzhledu: správně provedené souvrství chrání konstrukci před vlhkostí a snižuje náklady na vytápění. Používáme systémová řešení a dodržujeme technologické přestávky, i když to znamená chvíli počkat.',
			'Rozsah prací i jejich návaznost dohodneme předem – včetně přístupu na staveniště, skladování materiálu a odvozu odpadu.',
		],
		icon: 'BrickWall',
		buttonText: 'Více informací',
		features: ['Základy', 'Hrubá stavba', 'Omítky', 'Fasády'],
		img: turnkey,
	},
	{
		id: 4,
		slug: 'navrhy-a-vizualizace',
		title: 'Návrhy & vizualizace',
		description:
			'Promyšlený návrh prostoru s vizualizacemi a kompletní projektovou dokumentací.',
		seoTitle: 'Návrh interiéru, vizualizace a projektová dokumentace',
		seoDescription:
			'Návrh interiéru s vizualizacemi a projektovou dokumentací – dispoziční řešení, výběr materiálů a podklady, podle kterých se dá stavět.',
		detailHeading: 'Jak probíhá návrh a vizualizace',
		longDescription: [
			'Než se začne bourat, má smysl vědět, jak bude výsledek vypadat. Připravíme dispoziční řešení, vizualizace a projektovou dokumentaci, podle které se pak skutečně staví.',
			'Součástí návrhu je i výběr materiálů a povrchů – s ohledem na provoz, údržbu i rozpočet. Vizualizace ukáže reálné proporce a barevnost, takže se rozhodujete nad obrázkem, ne nad představou.',
			'Návrh zpracujeme samostatně, nebo na něj rovnou navážeme realizací. Druhá varianta šetří čas i peníze, protože projekt a stavba drží pohromadě.',
		],
		icon: 'PencilRuler',
		buttonText: 'Více informací',
		features: [
			'Dispoziční řešení',
			'Vizualizace',
			'Projektová dokumentace',
			'Výběr správného materiálu',
		],
		img: designImg,
	},
];

/** Look up a service by its URL segment. */
export const getServiceBySlug = (slug?: string) =>
	services.find(service => service.slug === slug);
