import { ROUTES } from '@/config/routes';
import type { IResponsiveImage } from '@/types/image.interface';
import type { PortfolioCategory } from '@/types/portfolio.interface';
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

/** The house sketch, reused as the artwork of the site-wide CTA banner. */
export const houseSketch = turnkey;

export const services: IService[] = [
	{
		id: 1,
		slug: 'kompletni-rekonstrukce',
		projectCategory: 'renovation',
		title: 'Kompletní rekonstrukce',
		description:
			'Rekonstrukce bytů a domů od demolice až po finální dokončení – vše potřebné pod jednou střechou a s důrazem na kvalitu provedení.',
		seoTitle: 'Kompletní rekonstrukce bytu na klíč – Teplice',
		headline: 'Kompletní rekonstrukce bytu na klíč',
		seoDescription:
			'Kompletní rekonstrukce bytu nebo domu na klíč – od demolice a nových rozvodů přes podlahy a dveře až po finální povrchy. Jeden dodavatel pro celou stavbu.',
		detailHeading: 'Co kompletní rekonstrukce zahrnuje',
		longDescription: [
			{
				heading: 'Co to znamená',
				text: 'Kompletní rekonstrukce znamená, že byt nebo dům rozebereme až na nosné konstrukce a postavíme znovu podle nového dispozičního řešení. Zajišťujeme celý proces pod jednou střechou – od demolice a odvozu suti přes nové příčky, elektroinstalace a rozvody vody až po podlahy, dveře a finální povrchy.',
			},
			{
				heading: 'Proč jeden dodavatel',
				text: 'Protože práce koordinuje jeden dodavatel, jednotlivé profese na sebe navazují bez prostojů a nemusíte domlouvat desítky řemeslníků zvlášť. Před zahájením prací připravíme harmonogram a rozpočet, abyste dopředu věděli, co a kdy se bude dít.',
			},
			{
				heading: 'Kdy to dává smysl',
				text: 'Tento typ rekonstrukce dává smysl u starších bytů s dožilými rozvody, u panelových bytů s nevyhovující dispozicí a všude tam, kde kosmetické úpravy problém neřeší.',
			},
			{
				heading: 'Jak rekonstrukce probíhá',
				text: 'Práce jdou v pevném pořadí, protože každá navazuje na předchozí: demontáž a odvoz suti, nové rozvody elektřiny, vody a odpadu, zdění příček a bytového jádra, omítky a stěrky, obklady a dlažby, podlahy, výmalba a nakonec dveře, kuchyňská linka a zařizovací předměty. Harmonogram dostanete předem, takže víte, kdy která fáze přijde na řadu.',
			},
			{
				heading: 'Typické problémy v panelácích',
				text: 'Ve starších panelových bytech se nejčastěji mění umakartové bytové jádro, hliníkové elektrorozvody a dožilé rozvody vody. Po demontáži se často ukážou nerovné podlahy a stropy, které je potřeba vyrovnat dřív, než přijde nová dlažba nebo podlaha. Do nosných panelů se zasahuje jen po posouzení statikem.',
			},
			{
				heading: 'Co je potřeba vyřídit',
				text: 'Úpravy uvnitř bytu, které nezasahují do nosných konstrukcí ani do společných rozvodů domu, se obvykle obejdou bez stavebního povolení. Výměna stoupaček nebo zásah do nosné stěny ale potřebuje souhlas společenství vlastníků nebo družstva, případně i stavebního úřadu. Co platí pro váš byt, probereme při prohlídce.',
			},
			{
				heading: 'Kolik to stojí',
				text: 'Cena kompletní rekonstrukce závisí hlavně na rozsahu – jestli se mění bytové jádro, rozvody a dispozice – a na zvolených materiálech. Dva byty stejné velikosti se proto mohou cenou výrazně lišit. Pevnou cenu stanovíme po nezávazné prohlídce, spolu s harmonogramem.',
				link: { to: ROUTES.PRICING, label: 'Co ovlivňuje cenu rekonstrukce' },
			},
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
		projectCategory: 'interior',
		title: 'Kosmetické úpravy',
		description:
			'Rychlé a efektivní obnovení interiéru bez rozsáhlých stavebních zásahů. Ideální pro přípravu bytu k pronájmu i zvýšení jeho hodnoty.',
		seoTitle: 'Kosmetické úpravy a renovace bytu – Teplice',
		headline: 'Kosmetické úpravy a renovace bytu',
		seoDescription:
			'Rychlá obnova interiéru bez velkých stavebních zásahů – úpravy stěn, nové podlahy, osvětlení a koupelna. Ideální před pronájmem či prodejem bytu.',
		detailHeading: 'Kdy se kosmetické úpravy vyplatí',
		longDescription: [
			{
				heading: 'Co se mění',
				text: 'Kosmetické úpravy obnoví vzhled bytu bez zásahů do nosných konstrukcí a rozvodů. Vyměníme podlahové krytiny, opravíme a vymalujeme stěny, doplníme osvětlení a upravíme koupelnu – interiér pak působí jako nový za zlomek času i nákladů kompletní rekonstrukce.',
			},
			{
				heading: 'Pro koho to je',
				text: 'Toto řešení volí nejčastěji majitelé, kteří připravují byt k pronájmu nebo prodeji a potřebují zvýšit jeho hodnotu rychle a předvídatelně. Pracovat umíme i v obydleném bytě a práce plánujeme tak, aby vás omezily co nejméně.',
			},
			{
				heading: 'Kde je hranice',
				text: 'Při prohlídce vždy upozorníme, pokud narazíme na problém, který kosmetická úprava nevyřeší – například dožilé rozvody nebo vlhkost. Raději to řekneme předem než v polovině prací.',
			},
			{
				heading: 'Co všechno se dá obnovit',
				text: 'Nové podlahy místo starých parket nebo linolea, oprava a výmalba stěn, nové osvětlení, výměna interiérových dveří, nová kuchyňská linka a úpravy koupelny – výměna obkladů, sprchového koutu nebo umyvadla bez přestavby celého jádra. Rozsah si vybíráte podle toho, co byt opravdu potřebuje.',
			},
			{
				heading: 'Jak práce probíhají',
				text: 'Nejdřív přijde na řadu to, co práší a špiní – opravy stěn a obklady –, potom výmalba a nakonec podlahy, dveře a osvětlení. Hotové povrchy se tak už znovu nepoškodí. Pořadí i termíny najdete v harmonogramu, který dostanete předem.',
			},
			{
				heading: 'Před pronájmem nebo prodejem',
				text: 'Světlé stěny, nové podlahy a čistá koupelna jsou to první, čeho si zájemci o byt všimnou. Obnova povrchů je proto obvykle nejrychlejší cesta, jak byt připravit k pronájmu nebo prodeji, aniž byste museli investovat do kompletní rekonstrukce.',
			},
			{
				heading: 'Kolik to stojí',
				text: 'Kosmetické úpravy vycházejí výrazně levněji než kompletní rekonstrukce, protože se nemění rozvody ani dispozice. Výsledná cena závisí na rozsahu a na materiálech – pevnou cenu stanovíme po nezávazné prohlídce.',
				link: { to: ROUTES.PRICING, label: 'Co ovlivňuje cenu rekonstrukce' },
			},
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
		projectCategory: 'facade',
		title: 'Stavební & řemeslné práce',
		description:
			'Stavební a řemeslné práce od základů přes hrubou stavbu a omítky až po fasády.',
		seoTitle: 'Stavební a řemeslné práce, omítky a fasády – Teplice',
		headline: 'Stavební a řemeslné práce',
		seoDescription:
			'Stavební a řemeslné práce od základů přes hrubou stavbu a omítky až po zateplení a fasády. Novostavby, přístavby i opravy stávajících objektů.',
		detailHeading: 'Jaké stavební a řemeslné práce zajišťujeme',
		longDescription: [
			{
				heading: 'Co zajišťujeme',
				text: 'Zajišťujeme stavební práce v celém rozsahu – základy, hrubou stavbu, vnitřní i vnější omítky a fasády. Pracujeme na novostavbách, přístavbách i na opravách a modernizaci stávajících objektů.',
			},
			{
				heading: 'Proč na tom záleží',
				text: 'Fasáda a omítky nejsou jen otázkou vzhledu: správně provedené souvrství chrání konstrukci před vlhkostí a snižuje náklady na vytápění. Používáme systémová řešení a dodržujeme technologické přestávky, i když to znamená chvíli počkat.',
			},
			{
				heading: 'Co domluvíme předem',
				text: 'Rozsah prací i jejich návaznost dohodneme předem – včetně přístupu na staveniště, skladování materiálu a odvozu odpadu.',
			},
			{
				heading: 'Zateplení a fasády',
				text: 'Zateplovací systém tvoří několik vrstev – lepidlo, izolant, kotvení, výztužná vrstva a finální omítka – a každá má svou technologii i podmínky, za kterých se smí provádět. Ukázkou je zateplení fasády panelového domu na ploše 2 400 m², které najdete v portfoliu i s fotkami z průběhu prací.',
			},
			{
				heading: 'Omítky a vnitřní úpravy',
				text: 'Vnitřní omítky, stěrky a sádrování připravují stěny pro malbu nebo obklad. Na rovnosti podkladu závisí, jak bude vypadat výsledná dlažba, obklad i výmalba – chyby, které se tady udělají, už později nic neschová.',
			},
			{
				heading: 'Jak spolupráce probíhá',
				text: 'Po prohlídce místa dostanete pevnou cenu a harmonogram. Práce koordinuje jeden dodavatel, takže jednotlivé profese na sebe navazují bez prostojů a nemusíte nic domlouvat zvlášť.',
			},
			{
				heading: 'Kolik to stojí',
				text: 'Cena stavebních prací závisí na rozsahu, materiálech a přístupu ke stavbě – u fasády například na výšce domu a lešení. Nabídku připravíme po prohlídce místa.',
				link: { to: ROUTES.PRICING, label: 'Co ovlivňuje cenu' },
			},
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
		seoTitle: 'Návrh interiéru a 3D vizualizace – Teplice',
		headline: 'Návrh interiéru a 3D vizualizace',
		seoDescription:
			'Návrh interiéru s vizualizacemi a projektovou dokumentací – dispoziční řešení, výběr materiálů a podklady, podle kterých se dá stavět.',
		detailHeading: 'Jak probíhá návrh a vizualizace',
		longDescription: [
			{
				heading: 'Co připravíme',
				text: 'Než se začne bourat, má smysl vědět, jak bude výsledek vypadat. Připravíme dispoziční řešení, vizualizace a projektovou dokumentaci, podle které se pak skutečně staví.',
			},
			{
				heading: 'Materiály a povrchy',
				text: 'Součástí návrhu je i výběr materiálů a povrchů – s ohledem na provoz, údržbu i rozpočet. Vizualizace ukáže reálné proporce a barevnost, takže se rozhodujete nad obrázkem, ne nad představou.',
			},
			{
				heading: 'Návrh, nebo i realizace',
				text: 'Návrh zpracujeme samostatně, nebo na něj rovnou navážeme realizací. Druhá varianta šetří čas i peníze, protože projekt a stavba drží pohromadě.',
			},
			{
				heading: 'Jak návrh vzniká',
				text: 'Začíná se zaměřením bytu a rozhovorem o tom, jak v něm chcete žít. Následuje dispoziční řešení, potom vizualizace a výběr materiálů a nakonec dokumentace, podle které se staví.',
			},
			{
				heading: 'Kdy se návrh vyplatí',
				text: 'Hlavně tehdy, když se mění dispozice – spojuje se kuchyně s obývacím pokojem, posouvají se příčky nebo se mění bytové jádro. Změna na papíře nic nestojí, změna během stavby ano.',
			},
			{
				heading: 'Kolik to stojí',
				text: 'Cena návrhu závisí na velikosti bytu a na tom, kolik variant a vizualizací potřebujete. Pokud na návrh navážeme realizací, probereme celkovou cenu společně při prohlídce.',
				link: { to: ROUTES.PRICING, label: 'Co ovlivňuje cenu rekonstrukce' },
			},
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

/**
 * The service a project demonstrates, for the link back from a project page.
 * Lives here rather than beside the portfolio because it searches the services:
 * the mapping is declared once, on the service, and read from both directions.
 */
export const serviceForCategory = (category: PortfolioCategory) =>
	services.find(service => service.projectCategory === category);
