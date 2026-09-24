/** schema.org type for a served area — a region or a city. */
type RegionType = 'AdministrativeArea' | 'City';

export interface IRegion {
	name: string;
	type: RegionType;
	/**
	 * The home area. Named first everywhere it is shown, because a geo signal
	 * only carries weight where there is evidence behind it — and every one of
	 * the nine projects is in Teplice.
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
	{ name: 'Brno', type: 'City' },
];

export const primaryRegions = regions.filter(region => region.primary);

/**
 * Reads as a sentence under the hero heading. Leads with the home area and
 * treats the rest as reach rather than as an equal claim: "we work everywhere"
 * is what a company with nothing to show says, and it competes against local
 * firms in every one of those places at once.
 */
export const REGIONS_SENTENCE =
	'Nejčastěji pracujeme v Teplicích a v Ústeckém kraji. ' +
	'Zakázky bereme i v dalších částech České republiky – v Praze, ' +
	'Středočeském, Karlovarském, Libereckém a Plzeňském kraji a v Brně.';
