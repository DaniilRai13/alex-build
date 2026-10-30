import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';
import { projectPath, ROUTES, servicePath } from '@/config/routes';
import { getProjectBySlug } from '@/data/portfolio/portfolio.data';

/**
 * A room of the hero apartment. `id` is the hotspot node in the model
 * (HS_<id>, placed by 3d/apartment/build_apartment.py).
 */
export interface IHeroRoom {
	id: string;
	/** Name on the room's marker. */
	label: string;
	title: string;
	text: string;
	/** What was done there — the checklist on the room's card. */
	works: string[];
	link: { to: string; label: string };
	/**
	 * Marked by its dot alone; the name shows on hover. Four names on the
	 * model are plenty — a fifth turned it into a labelled diagram.
	 */
	dotOnly?: boolean;
}

/**
 * Where a room's card sends the visitor: the finished job that shows the same
 * change, when that project still exists. The slugs live in the admin app and
 * can be renamed there, so a missing one falls back to the portfolio rather
 * than to a dead link.
 */
const project = (slug: string) =>
	getProjectBySlug(slug)
		? { to: projectPath(slug), label: 'Podívejte se na realizaci' }
		: { to: ROUTES.PORTFOLIO, label: 'Podívejte se na realizace' };

const service = (slug: string) => ({
	to: servicePath(slug),
	label: 'Více o službě',
});

export const heroRooms: IHeroRoom[] = [
	{
		id: 'Kuchyne',
		label: 'Kuchyně s obývákem',
		title: 'Spojení kuchyně s obývákem',
		text: 'Příčku mezi kuchyní a pokojem jsme odstranili. Z tmavé kuchyně a malého pokoje je jeden světlý prostor s jídelnou.',
		works: ['Nová dispozice', 'Kuchyňská linka na míru', 'Nové podlahy', 'Osvětlení'],
		link: project('rekonstrukce-paneloveho-bytu'),
	},
	{
		id: 'Koupelna',
		label: 'Koupelna',
		title: 'Zděná koupelna místo jádra',
		text: 'Umakartové jádro a spíž nahradila zděná koupelna s vanou, sprchovým koutem a závěsným WC.',
		works: ['Demontáž umakartového jádra', 'Zděná koupelna', 'Obklady a dlažba', 'Nové rozvody'],
		link: project('rekonstrukce-bytu-kuchyne-koupelna'),
	},
	{
		id: 'Loznice',
		label: 'Ložnice',
		title: 'Ložnice s vestavěnou skříní',
		text: 'Skříň na míru využije celou stěnu, nová podlaha sjednotí byt do jednoho celku.',
		works: ['Vestavěná skříň', 'Nová podlaha', 'Výmalba'],
		link: service('kosmeticke-upravy'),
		dotOnly: true,
	},
	{
		id: 'Detsky',
		label: 'Dětský pokoj',
		title: 'Dětský pokoj',
		text: 'Psací stůl u okna, knihovna a úložné prostory — místo, které s dítětem poroste.',
		works: ['Místo na učení u okna', 'Knihovna', 'Úložné prostory'],
		link: service('navrhy-a-vizualizace'),
	},
	{
		id: 'Pracovna',
		label: 'Pracovna',
		title: 'Pracovna',
		text: 'Z nevyužitého pokoje je klidná pracovna s knihovnou a křeslem na čtení.',
		works: ['Nové využití pokoje', 'Knihovna na míru', 'Osvětlení'],
		link: service('kompletni-rekonstrukce'),
	},
];

export interface IHeroFeature {
	icon: IconNames;
	/** The fact itself, set bold. */
	value: string;
	label: string;
}

/**
 * The trust row under the hero buttons: three facts, not four cards. The
 * figures repeat statistics.data.ts and advantages.data.ts on purpose —
 * change them in all three or in none.
 */
export const heroFeatures: IHeroFeature[] = [
	{ icon: 'House', value: '40+', label: 'dokončených projektů' },
	{ icon: 'ShieldCheck', value: '2 roky', label: 'záruka na práci' },
	{ icon: 'PencilRuler', value: 'Návrh → realizace', label: 'vše pod jednou střechou' },
];
