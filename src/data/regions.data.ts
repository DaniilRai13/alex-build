/** schema.org type for a served area — a region or a city. */
type RegionType = 'AdministrativeArea' | 'City';

export interface IRegion {
	name: string;
	type: RegionType;
}

// Where the company actually works. One list feeds both the visible copy and
// the areaServed of the structured data — a geo signal that disagrees with
// itself is worse than none.
export const regions: IRegion[] = [
	{ name: 'Ústecký kraj', type: 'AdministrativeArea' },
	{ name: 'Středočeský kraj', type: 'AdministrativeArea' },
	{ name: 'Karlovarský kraj', type: 'AdministrativeArea' },
	{ name: 'Liberecký kraj', type: 'AdministrativeArea' },
	{ name: 'Plzeňský kraj', type: 'AdministrativeArea' },
	{ name: 'Praha', type: 'City' },
	{ name: 'Brno', type: 'City' },
];

/** Reads as a sentence under the hero heading. */
export const REGIONS_SENTENCE =
	'Působíme po celé České republice – nejčastěji v Ústeckém, Středočeském, ' +
	'Karlovarském, Libereckém a Plzeňském kraji, v Praze a v Brně.';
