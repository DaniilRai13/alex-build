import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';
import { servicePath } from '@/config/routes';
import type { IFaqItem } from '@/data/faq.data';

// Copy of /cenik. No figures: the owner has not given any prices yet, so the
// page explains what the price depends on and how it is set — the questions
// people search with ("kolik stojí rekonstrukce bytu"). When the figures
// arrive, they go in as a section of their own and the "per square metre" FAQ
// below has to be rewritten.
//
// Every promise here is one the site already makes: the free, no-obligation
// viewing and quote, the fixed price with a schedule, one contractor.

export const PRICING_LEAD =
	'Cenu rekonstrukce bytu neurčuje jen počet metrů čtverečních. Záleží na tom, co se v bytě mění, v jakém stavu jsou rozvody a jaké materiály si vyberete. Proto ji stanovujeme až po nezávazné prohlídce – zato pevně, bez skrytých poplatků a spolu s harmonogramem.';

export const pricingSteps: { title: string; text: string }[] = [
	{
		title: 'Poptávka',
		text: 'Zavoláte nebo napíšete pár vět o bytě a o tom, co chcete změnit. Pomůže dispozice, plocha a několik fotek současného stavu.',
	},
	{
		title: 'Nezávazná prohlídka',
		text: 'Podíváme se na stav bytu, rozvodů a podlah a probereme vaše představy i rozpočet. Cenovou nabídku pak připravíme zdarma.',
	},
	{
		title: 'Pevná cena a harmonogram',
		text: 'Dostanete cenu bez skrytých poplatků a harmonogram prací – dopředu víte, co a kdy se bude dít a kolik to bude stát.',
	},
];

export const pricingFactors: { icon: IconNames; title: string; text: string }[] = [
	{
		icon: 'House',
		title: 'Rozsah prací',
		text: 'Výmalba a nové podlahy jsou jiná položka než byt rozebraný až na nosné konstrukce. Největší rozdíl dělá to, jestli jde o kosmetické úpravy, nebo kompletní rekonstrukci.',
	},
	{
		icon: 'Drill',
		title: 'Bytové jádro a rozvody',
		text: 'Výměna umakartového jádra za zděnou koupelnu a nové rozvody vody, odpadu a elektřiny patří k nejpracnějším částem rekonstrukce v paneláku – a k těm, které se nevyplatí odkládat.',
	},
	{
		icon: 'PencilRuler',
		title: 'Plocha a dispozice',
		text: 'Plocha určuje množství materiálu i práce, stejně důležité je ale, kolik stěn se mění. Posunutí příček nebo spojení kuchyně s obývacím pokojem znamená další bourání i zdění.',
	},
	{
		icon: 'BrickWall',
		title: 'Stav bytu',
		text: 'Nerovné podlahy a stěny, staré parkety nebo vlhkost se ukážou při prohlídce. Čím víc práce se skrývá pod povrchem, tím víc se promítne do ceny.',
	},
	{
		icon: 'PaintRoller',
		title: 'Materiály a vybavení',
		text: 'Obklady, dlažba, podlahy, dveře, sanita i kuchyňská linka mají široké cenové rozpětí. Vybrat je dřív, než začne stavba, je nejjednodušší způsob, jak mít rozpočet pod kontrolou.',
	},
	{
		icon: 'Image',
		title: 'Návrh a vizualizace',
		text: 'Když se mění dispozice, vyplatí se mít návrh předem. Je to položka navíc, ale ušetří změny během stavby, které bývají dražší než samotný návrh.',
	},
];

export const pricingCompare: { title: string; text: string; to: string }[] = [
	{
		title: 'Kosmetické úpravy',
		text: 'Obnova bez zásahu do rozvodů a nosných konstrukcí: podlahy, výmalba, osvětlení, dveře, úpravy koupelny. Vhodné před pronájmem či prodejem nebo tam, kde jsou rozvody v pořádku.',
		to: servicePath('kosmeticke-upravy'),
	},
	{
		title: 'Kompletní rekonstrukce',
		text: 'Byt rozebraný až na nosné konstrukce: nové rozvody, příčky, bytové jádro, podlahy a povrchy. Vyšší investice, po které je byt na dlouhá léta vyřešený.',
		to: servicePath('kompletni-rekonstrukce'),
	},
];

export const pricingTips: { title: string; text: string }[] = [
	{
		title: 'Rozhodněte se předem',
		text: 'Změny během stavby jsou nejdražší. Čím víc je rozhodnuto před začátkem – dispozice, materiály, umístění zásuvek a světel – tím přesnější je nabídka.',
	},
	{
		title: 'Jeden dodavatel pro celou stavbu',
		text: 'Když práce koordinuje jedna firma, profese na sebe navazují bez prostojů a nikdo si nepřehazuje odpovědnost. Prostoje a opravy po cizích řemeslnících stojí peníze.',
	},
	{
		title: 'Nešetřete na tom, co je schované',
		text: 'Rozvody a hydroizolace se po obložení už snadno opravit nedají. Ušetřit se dá spíš na vybavení, které jde kdykoli vyměnit.',
	},
];

export const faqPricing: IFaqItem[] = [
	{
		q: 'Kolik stojí rekonstrukce bytu 2+1 v paneláku?',
		a: 'Záleží hlavně na tom, jestli se mění bytové jádro a rozvody, nebo jde jen o obnovu povrchů – dva byty stejné velikosti se proto mohou cenou výrazně lišit. Konkrétní částku vám řekneme po nezávazné prohlídce, jako pevnou cenu s harmonogramem.',
	},
	{
		q: 'Proč neuvádíte cenu za metr čtvereční?',
		a: 'U rekonstrukce bytu cena za m² mnoho neřekne: nejdražší položky – bytové jádro, rozvody, změny dispozice – na ploše nezávisí. Raději dáme pevnou cenu pro váš konkrétní byt než orientační číslo, které se pak změní.',
	},
	{
		q: 'Je prohlídka a cenová nabídka zdarma?',
		a: 'Ano. Prohlídka je nezávazná a cenovou nabídku připravíme zdarma.',
	},
	{
		q: 'Může se cena během prací změnit?',
		a: 'Cena je pevná. Změní se jen tehdy, když se po vzájemné dohodě změní rozsah prací – například když se rozhodnete přidat další místnost.',
	},
];
