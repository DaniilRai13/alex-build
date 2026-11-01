/** schema.org type for a served area — a region or a city. */
type RegionType = 'AdministrativeArea' | 'City';

export interface IRegion {
	name: string;
	type: RegionType;
	/**
	 * The home area. Named first everywhere it is shown, because a geo signal
	 * only carries weight where there is evidence behind it — and the portfolio
	 * is in Teplice and the rest of Ústecký kraj. (Until 31 Oct 2026 every
	 * project said Teplice, but that was a placeholder, not the real town.)
	 */
	primary?: boolean;
}

// Where the company actually works. One list feeds both the visible copy and
// the areaServed of the structured data — a geo signal that disagrees with
// itself is worse than none.
//
// The order matters and is not alphabetical. The old list was flat: seven
// regions of equal weight, opening with "po celé České republice" and not
// naming Teplice at all, while the badge in the hero and five page titles all
// said Teplice. Put another way, the one place the work can be proven was the
// one place the list left out.
export const regions: IRegion[] = [
	{ name: 'Teplice', type: 'City', primary: true },
	{ name: 'Ústecký kraj', type: 'AdministrativeArea', primary: true },
	{ name: 'Praha', type: 'City' },
	{ name: 'Středočeský kraj', type: 'AdministrativeArea' },
	{ name: 'Karlovarský kraj', type: 'AdministrativeArea' },
	{ name: 'Liberecký kraj', type: 'AdministrativeArea' },
	{ name: 'Plzeňský kraj', type: 'AdministrativeArea' },
	// Added 1 Nov 2026: the portfolio has jobs in Letohrad and Břeclav.
	{ name: 'Pardubický kraj', type: 'AdministrativeArea' },
	{ name: 'Jihomoravský kraj', type: 'AdministrativeArea' },
	{ name: 'Brno', type: 'City' },
];

export const primaryRegions = regions.filter(region => region.primary);

/** The main towns of the home region, named on the home page as reach, not as finished work. */
export const HOME_TOWNS = ['Teplice', 'Ústí nad Labem', 'Most', 'Chomutov', 'Děčín', 'Litoměřice', 'Louny'];

/**
 * The kraj of every town in the portfolio, so the home page can say how many
 * regions the work spans. A new town missing here is still listed, just not
 * counted towards a region — add it when adding the project.
 */
export const TOWN_REGIONS: Record<string, string> = {
	Teplice: 'Ústecký kraj',
	Chomutov: 'Ústecký kraj',
	'Radonice u Kadaně': 'Ústecký kraj',
	Cheb: 'Karlovarský kraj',
	'Kynšperk nad Ohří': 'Karlovarský kraj',
	Letohrad: 'Pardubický kraj',
	Břeclav: 'Jihomoravský kraj',
};

/**
 * Reads as a sentence under the hero heading. Leads with the home area and
 * treats the rest as reach rather than as an equal claim: "we work everywhere"
 * is what a company with nothing to show says, and it competes against local
 * firms in every one of those places at once.
 */
export const REGIONS_SENTENCE =
	'Nejčastěji pracujeme v Teplicích a v Ústeckém kraji. ' +
	'Zakázky bereme i v dalších částech České republiky – v Praze, ' +
	'Středočeském, Karlovarském, Libereckém, Plzeňském, Pardubickém ' +
	'a Jihomoravském kraji včetně Brna.';
