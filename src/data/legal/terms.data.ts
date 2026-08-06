import { company } from '@/config/company';
import type { LegalSection } from '@/types/legal.interface';

export const termsSections: LegalSection[] = [
	{
		heading: 'Úvodní ustanovení',
		paragraphs: [
			`Tyto podmínky použití upravují pravidla používání webových stránek ${company.domain} provozovaných společností ${company.name} (dále jen „provozovatel“).`,
			'Návštěvou a používáním tohoto webu vyjadřujete souhlas s těmito podmínkami. Pokud s nimi nesouhlasíte, web prosím nepoužívejte.',
		],
	},
	{
		heading: 'Používání webu',
		paragraphs: [
			'Obsah tohoto webu má informativní charakter a slouží k seznámení s nabízenými službami. Nepředstavuje závaznou nabídku ve smyslu právních předpisů, není-li výslovně uvedeno jinak.',
			'Zavazujete se web nepoužívat způsobem, který by mohl narušit jeho provoz, bezpečnost nebo práva provozovatele či třetích osob.',
		],
	},
	{
		heading: 'Duševní vlastnictví',
		paragraphs: [
			'Veškerý obsah webu, zejména texty, fotografie, grafika a logo, je chráněn autorským právem a je majetkem provozovatele nebo je užíván se souhlasem oprávněných osob.',
			'Jakékoli kopírování, šíření nebo jiné užití obsahu bez předchozího písemného souhlasu provozovatele není dovoleno.',
		],
	},
	{
		heading: 'Omezení odpovědnosti',
		paragraphs: [
			'Provozovatel vynakládá přiměřené úsilí, aby informace na webu byly aktuální a správné, nenese však odpovědnost za případné nepřesnosti, chyby nebo neúplnost obsahu.',
			'Provozovatel neodpovídá za škody vzniklé v souvislosti s používáním webu ani za jeho případnou dočasnou nedostupnost.',
		],
	},
	{
		heading: 'Odkazy na weby třetích stran',
		paragraphs: [
			'Web může obsahovat odkazy na stránky třetích stran. Provozovatel nenese odpovědnost za jejich obsah ani za zásady ochrany osobních údajů těchto stránek.',
		],
	},
	{
		heading: 'Kontaktní formulář',
		paragraphs: [
			'Odesláním kontaktního formuláře souhlasíte se zpracováním poskytnutých údajů za účelem vyřízení vaší poptávky v souladu se Zásadami ochrany osobních údajů.',
		],
	},
	{
		heading: 'Změny podmínek',
		paragraphs: [
			'Provozovatel si vyhrazuje právo tyto podmínky kdykoli změnit. Aktuální znění je vždy dostupné na této stránce a nabývá účinnosti okamžikem zveřejnění.',
		],
	},
	{
		heading: 'Kontakt',
		paragraphs: [
			`V případě dotazů k těmto podmínkám nás kontaktujte na e-mailu ${company.email}.`,
		],
	},
];
