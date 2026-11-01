import heroJpg from '@/assets/hero/living-room.jpg';
import type { IResponsiveImage } from '@/types/image.interface';

// WebP widths from scripts/generate-image-variants.mjs ("hero" group).
const webp = import.meta.glob('../assets/generated/hero/living-room-*.webp', {
	eager: true,
	import: 'default',
}) as Record<string, string>;

/**
 * The home page's first screen. A stock photo on purpose: the owner wanted a
 * banner prettier than any phone shot from a site, and nearly every portfolio
 * photo is a portrait while the banner is twice as wide as it is tall.
 *
 * Source: unsplash.com/photos/a-living-room-with-a-couch-and-a-table-Wc-yOnh8PFw
 * (Unsplash License — commercial use, no credit required).
 *
 * Never caption or link it as the company's work — passing stock off as your
 * own job is misleading advertising under Czech law. The real projects sit in
 * the card beside it instead.
 */
export const heroImage: IResponsiveImage & { alt: string } = {
	src: heroJpg,
	srcSet: Object.entries(webp)
		.map(([path, url]) => `${url} ${path.match(/-(\d+)\.webp$/)?.[1]}w`)
		.join(', '),
	alt: 'Světlý obývací pokoj s cihlově červenou pohovkou a dřevěným stolkem',
};
