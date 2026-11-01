import type { PortfolioCategory } from '@/types/portfolio.interface';

type ProjectCategory = Exclude<PortfolioCategory, 'all'>;

export interface IPortfolioSection {
	category: ProjectCategory;
	/** Fragment id: the jump links at the top of /portfolio point at it. */
	anchor: string;
	/** Badge on the project page and the home page photo. */
	label: string;
	/** <h2> of the section on /portfolio. */
	title: string;
	/** Says what this kind of job is, so the section is more than a row of photos. */
	intro: string;
}

/**
 * The portfolio grouped by the service each job demonstrates, in the order the
 * page shows them.
 *
 * The labels used to come from the admin ("BYT", "Kosmetika", "Fasáda") —
 * words nobody searches for and that did not match the names of the services
 * the projects link to. The site now names its own categories, here, once.
 */
export const portfolioSections: IPortfolioSection[] = [
	{
		category: 'renovation',
		anchor: 'kompletni-rekonstrukce',
		label: 'Kompletní rekonstrukce',
		title: 'Kompletní rekonstrukce bytů',
		intro:
			'Byty rozebrané až na nosné konstrukce a postavené znovu – nové příčky a rozvody, koupelna místo původního bytového jádra, kuchyně i podlahy. Dává to smysl u starších a panelových bytů, kde kosmetická úprava problém neřeší.',
	},
	{
		category: 'interior',
		anchor: 'kosmeticke-upravy',
		label: 'Kosmetické úpravy',
		title: 'Kosmetické úpravy bytů',
		intro:
			'Rychlejší obnova bez zásahu do nosných konstrukcí: nové podlahy, kuchyňská linka, dveře, osvětlení a úpravy koupelny. Byt působí jako nový za zlomek času i nákladů kompletní rekonstrukce.',
	},
	{
		category: 'facade',
		anchor: 'fasady',
		label: 'Fasáda',
		title: 'Fasády a zateplení',
		intro:
			'Zateplení a obnova fasád panelových domů – od lešení přes zateplovací systém po finální povrchovou úpravu. Správně provedené zateplení snižuje náklady na vytápění a chrání konstrukci domu.',
	},
];

/** The badge text for a project's category. */
export const categoryLabel = (category: PortfolioCategory) =>
	portfolioSections.find(section => section.category === category)?.label ?? '';
