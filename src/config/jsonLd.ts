import type { JsonLd } from '@/components/common/Seo/Seo';
import { company } from '@/config/company';

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
