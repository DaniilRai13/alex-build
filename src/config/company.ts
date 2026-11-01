// Real company details. Used on the legal pages (privacy policy, terms),
// in the footer and in the structured data (schema.org).
export const company = {
	name: 'KartStav Development s.r.o.',
	brand: 'KartStav',
	/** One-line form for the footer and the legal pages. */
	address: 'Čenětická 2413/1a, Chodov, 149 00 Praha',
	/** Same address split up, the way schema.org PostalAddress wants it. */
	postalAddress: {
		street: 'Čenětická 2413/1a, Chodov',
		postalCode: '149 00',
		city: 'Praha',
		country: 'CZ',
	},
	id: '29883229',
	email: 'info@kartstav.cz',
	phone: '+420774896027',
	/** Matches the opening hours shown in contacts.data.ts. */
	openingHours: { opens: '09:00', closes: '18:00' },
	domain: 'kartstav.cz',
	url: 'https://kartstav.cz',
};

/**
 * Jobs finished in total, confirmed by the owner on 1 Nov 2026. The portfolio
 * shows a selection of them, and the copy says so wherever both appear.
 */
export const COMPLETED_PROJECTS = 40;

/** Formats +420774896027 as +420 774 896 027. */
export const displayPhone = company.phone.replace(
	/^(\+\d{3})(\d{3})(\d{3})(\d{3})$/,
	'$1 $2 $3 $4',
);

/** Anchor the per-page entities (services, projects) point at. */
export const ORGANIZATION_ID = `${company.url}/#organization`;
