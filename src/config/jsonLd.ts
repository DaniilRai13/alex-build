import type { JsonLd } from '@/components/common/Seo/Seo';
import { company, ORGANIZATION_ID } from '@/config/company';
import { regions } from '@/data/regions.data';

/**
 * The company itself, rendered once per page from Layout. It used to be a
 * literal <script> in index.html, which meant the address, phone and IČO were
 * written twice and could drift apart from config/company.ts.
 */
export const organizationJsonLd: JsonLd = {
	'@context': 'https://schema.org',
	'@type': 'GeneralContractor',
	'@id': ORGANIZATION_ID,
	name: company.name,
	alternateName: company.brand,
	identifier: company.id,
	url: company.url,
	logo: `${company.url}/favicon-512.png`,
	image: `${company.url}/og-image.jpg`,
	priceRange: '$$',
	telephone: company.phone,
	email: company.email,
	address: {
		'@type': 'PostalAddress',
		streetAddress: company.postalAddress.street,
		postalCode: company.postalAddress.postalCode,
		addressLocality: company.postalAddress.city,
		addressCountry: company.postalAddress.country,
	},
	areaServed: regions.map(region => ({
		'@type': region.type,
		name: region.name,
	})),
	openingHoursSpecification: [
		{
			'@type': 'OpeningHoursSpecification',
			dayOfWeek: [
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
			],
			opens: company.openingHours.opens,
			closes: company.openingHours.closes,
		},
	],
};

export interface Crumb {
	name: string;
	/** Omitted on the last (current) crumb. */
	href?: string;
}

/** BreadcrumbList structured data — pass the result to <Seo jsonLd>. */
export const breadcrumbJsonLd = (items: Crumb[]): JsonLd => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: items.map((item, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: item.name,
		...(item.href ? { item: `${company.url}${item.href}` } : {}),
	})),
});
