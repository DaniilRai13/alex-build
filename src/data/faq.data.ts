import { COMPLETED_PROJECTS } from '@/config/company';

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
 * need. Only the geography, the price and the guarantee overlap, and those are
 * worth repeating on the strongest page.
 *
 * "Jak u vás probíhá spolupráce?" is gone: its answer listed the four steps
 * that the home page now shows as a block of their own, a few screens above.
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
		a: 'Pracujeme v Teplicích a v celém Ústeckém kraji, po dohodě i v dalších městech České republiky.',
	},
];

/**
 * The portfolio page set: what someone looking through finished jobs wants to
 * know before trusting them. Same rule as above — the geography repeats the
 * home page, the choice between services repeats the service copy.
 */
export const faqPortfolio: IFaqItem[] = [
	{
		q: 'Jsou fotografie z vašich skutečných zakázek?',
		a: 'Ano. Všechny fotografie jsou z bytů a domů, na kterých jsme pracovali, včetně snímků z průběhu prací.',
	},
	{
		q: 'Můžu vidět, jak byt vypadal před rekonstrukcí?',
		a: 'U většiny realizací ano. Na stránce projektu najdete fotografie původního stavu, průběhu prací i výsledku, každou s popisem toho, co na ní je.',
	},
	{
		q: 'Kde jste tyto zakázky realizovali?',
		a: `V různých městech Česka – místo je uvedené u každé realizace. Nejčastěji pracujeme v Teplicích a v celém Ústeckém kraji, po dohodě i jinde v České republice. V portfoliu je jen výběr z více než ${COMPLETED_PROJECTS} dokončených zakázek.`,
	},
	{
		q: 'Jakou službu si objednat, když chci podobný výsledek?',
		a: 'Pokud se mění bytové jádro, rozvody nebo dispozice, jde o kompletní rekonstrukci. Když stačí nové podlahy, výmalba, osvětlení a úpravy koupelny, vystačíte s kosmetickými úpravami. Při nezávazné prohlídce vám řekneme, co ve vašem případě dává smysl.',
	},
];

/** Asked on every service page, after the service-specific ones. */
const shared: IFaqItem[] = [
	{
		q: 'Kde působíte?',
		a: 'Pracujeme v Teplicích a v celém Ústeckém kraji, po dohodě i v dalších městech České republiky.',
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
		{
			q: 'Jak dlouho kompletní rekonstrukce trvá?',
			a: 'Záleží na velikosti bytu a na rozsahu prací – hlavně na tom, jestli se mění bytové jádro a dispozice. Přesný harmonogram dostanete spolu s cenovou nabídkou po prohlídce.',
		},
		{
			q: 'Potřebuji k rekonstrukci bytu povolení?',
			a: 'U úprav uvnitř bytu, které nezasahují do nosných konstrukcí ani do společných rozvodů domu, obvykle ne. Výměna stoupaček nebo zásah do nosné stěny ale vyžaduje souhlas SVJ nebo družstva, případně i stavebního úřadu. Probereme to při prohlídce.',
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
		{
			q: 'Jak dlouho kosmetické úpravy trvají?',
			a: 'Výrazně kratší dobu než kompletní rekonstrukce, protože se nebourá a nemění se rozvody. Konkrétní termíny najdete v harmonogramu, který dostanete s nabídkou.',
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
		{
			q: 'Zateplujete i panelové domy?',
			a: 'Ano. V portfoliu najdete zateplení fasády panelového domu na ploše 2 400 m², včetně fotek z průběhu prací.',
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
		{
			q: 'Musím mít přesnou představu předem?',
			a: 'Nemusíte. Stačí vědět, co vám v současném bytě nevyhovuje a jak v něm chcete žít. Varianty řešení připravíme a vizualizace pomůže mezi nimi vybrat.',
		},
	],
};

/** Service-specific questions first, then the three shared ones. */
export const faqForService = (slug: string): IFaqItem[] => [
	...(byService[slug] ?? []),
	...shared,
];
