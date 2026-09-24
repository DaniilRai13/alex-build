/**
 * Questions customers arrive with, answered on the service pages.
 *
 * Every answer here restates something the site already promises — the service
 * copy in services.data.ts, the guarantee and fixed price in statistics.data.ts,
 * the region named on the home page. Nothing below is a new commitment, which
 * is the whole point: an FAQ is where a promise gets read literally, and the
 * answers feed FAQPage structured data that Google may show in the results.
 *
 * Questions that would be worth answering but are NOT here, because nobody has
 * committed to them yet — they need the client's word before they can ship:
 *   - how long a renovation takes (the single most searched question)
 *   - whether a permit or an ohlášení is needed, and who files it
 *   - the payment schedule, deposits and stage payments
 *   - price ranges per m²
 */

export interface IFaqItem {
	q: string;
	a: string;
}

/**
 * The home page set. Deliberately not a copy of the service pages: someone who
 * lands here has not chosen a service yet, so these answer the questions that
 * come before that choice — what you do at all, which of the two renovations I
 * need, how the whole thing runs. Only the geography, the price and the
 * guarantee overlap, and those are worth repeating on the strongest page.
 */
export const faqHome: IFaqItem[] = [
	{
		q: 'Jaké práce zajišťujete?',
		a: 'Kompletní rekonstrukce bytů a domů, kosmetické úpravy interiéru, stavební a řemeslné práce včetně omítek a fasád, a návrhy interiéru s vizualizacemi a projektovou dokumentací.',
	},
	{
		q: 'Kompletní rekonstrukce, nebo stačí kosmetické úpravy?',
		a: 'Kompletní rekonstrukce dává smysl u starších bytů s dožilými rozvody a u panelových bytů s nevyhovující dispozicí — byt se rozebere až na nosné konstrukce. Kosmetické úpravy do konstrukcí ani rozvodů nezasahují a obnoví vzhled za zlomek času i nákladů. Při prohlídce vám řekneme, co ve vašem případě problém skutečně vyřeší.',
	},
	{
		q: 'Jak u vás probíhá spolupráce?',
		a: 'Ve čtyřech krocích: zanecháte poptávku nebo nám zavoláte, upřesníme si úkoly, přání a rozpočet, připravíme řešení a dohodneme podrobnosti, a pak se pustíme do práce a doprovázíme projekt až do předání.',
	},
	{
		q: 'Musím si jednotlivé řemeslníky shánět sám?',
		a: 'Ne. Celou stavbu koordinuje jeden dodavatel, takže profese na sebe navazují bez prostojů a vy nedomlouváte desítky řemeslníků zvlášť.',
	},
	{
		q: 'Můžu v bytě během prací bydlet?',
		a: 'U kosmetických úprav ano — práce naplánujeme tak, aby vás omezily co nejméně. U kompletní rekonstrukce to možné není, protože byt jde až na nosné konstrukce.',
	},
	{
		q: 'Jak stanovujete cenu?',
		a: 'Po nezávazné prohlídce. Cena je pevná, bez skrytých poplatků, a spolu s ní dostanete harmonogram — dopředu tedy víte, co a kdy se bude dít a kolik to bude stát.',
	},
	{
		q: 'Kde působíte?',
		a: 'Pracujeme v Teplicích a v celém Ústeckém kraji, po dohodě i v dalších městech České republiky. Většina našich realizací je z Teplic a okolí.',
	},
];

/** Asked on every service page, after the service-specific ones. */
const shared: IFaqItem[] = [
	{
		q: 'Kde působíte?',
		a: 'Pracujeme v Teplicích a v celém Ústeckém kraji, po dohodě i v dalších městech České republiky. Většina našich realizací je z Teplic a okolí.',
	},
	{
		q: 'Jakou dostanu záruku?',
		a: 'Na veškeré provedené práce poskytujeme záruku 2 roky. Používáme ověřené materiály a dodržujeme technologické postupy, i když to někdy znamená chvíli počkat.',
	},
	{
		q: 'Jak je to s cenou?',
		a: 'Cenu stanovíme po nezávazné prohlídce a je pevná — bez skrytých poplatků. Spolu s cenou dostanete i harmonogram, takže dopředu víte, co a kdy se bude dít.',
	},
];

const byService: Record<string, IFaqItem[]> = {
	'kompletni-rekonstrukce': [
		{
			q: 'Co všechno kompletní rekonstrukce zahrnuje?',
			a: 'Byt nebo dům rozebereme až na nosné konstrukce a postavíme znovu podle nového dispozičního řešení: demolice a odvoz suti, nové příčky, elektroinstalace a rozvody vody, podlahy, dveře a finální povrchy.',
		},
		{
			q: 'Musím si sám shánět jednotlivé řemeslníky?',
			a: 'Ne. Celou stavbu koordinuje jeden dodavatel, takže jednotlivé profese na sebe navazují bez prostojů a vy nedomlouváte desítky řemeslníků zvlášť.',
		},
		{
			q: 'Kdy má kompletní rekonstrukce smysl?',
			a: 'U starších bytů s dožilými rozvody, u panelových bytů s nevyhovující dispozicí a všude tam, kde kosmetické úpravy problém neřeší.',
		},
	],

	'kosmeticke-upravy': [
		{
			q: 'Co kosmetické úpravy zahrnují?',
			a: 'Výměnu podlahových krytin, opravu a vymalování stěn, doplnění osvětlení a úpravy koupelny — bez zásahů do nosných konstrukcí a rozvodů.',
		},
		{
			q: 'Můžu v bytě během prací bydlet?',
			a: 'Ano, pracovat umíme i v obydleném bytě. Práce naplánujeme tak, aby vás omezily co nejméně.',
		},
		{
			q: 'Kdy se kosmetická úprava nevyplatí?',
			a: 'Když je problém hlubší — dožilé rozvody nebo vlhkost. Při prohlídce na to vždy upozorníme předem, ne v polovině prací.',
		},
		{
			q: 'Hodí se to před pronájmem nebo prodejem bytu?',
			a: 'Ano, je to nejčastější důvod. Interiér působí jako nový za zlomek času i nákladů kompletní rekonstrukce, což zvyšuje hodnotu bytu rychle a předvídatelně.',
		},
	],

	'stavebni-a-remeslne-prace': [
		{
			q: 'Jaké stavební práce zajišťujete?',
			a: 'Základy, hrubou stavbu, vnitřní i vnější omítky a fasády. Pracujeme na novostavbách, přístavbách i na opravách a modernizaci stávajících objektů.',
		},
		{
			q: 'Proč je u fasády důležité provedení, a ne jen vzhled?',
			a: 'Správně provedené souvrství chrání konstrukci před vlhkostí a snižuje náklady na vytápění. Proto používáme systémová řešení a dodržujeme technologické přestávky.',
		},
		{
			q: 'Kdo řeší staveniště a odvoz odpadu?',
			a: 'My. Rozsah prací i jejich návaznost dohodneme předem — včetně přístupu na staveniště, skladování materiálu a odvozu odpadu.',
		},
	],

	'navrhy-a-vizualizace': [
		{
			q: 'Co je součástí návrhu?',
			a: 'Dispoziční řešení, vizualizace a projektová dokumentace, podle které se pak skutečně staví. Součástí je i výběr materiálů a povrchů s ohledem na provoz, údržbu i rozpočet.',
		},
		{
			q: 'Můžu si nechat zpracovat jen návrh, bez realizace?',
			a: 'Ano. Návrh zpracujeme samostatně, nebo na něj rovnou navážeme realizací — druhá varianta šetří čas i peníze, protože projekt a stavba drží pohromadě.',
		},
		{
			q: 'K čemu je vizualizace, když mám půdorys?',
			a: 'Vizualizace ukáže reálné proporce a barevnost, takže se rozhodujete nad obrázkem, ne nad představou. Změnit něco v této fázi je nesrovnatelně levnější než na stavbě.',
		},
	],
};

/** Service-specific questions first, then the three shared ones. */
export const faqForService = (slug: string): IFaqItem[] => [
	...(byService[slug] ?? []),
	...shared,
];
