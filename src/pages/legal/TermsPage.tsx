import { termsSections } from '@/data/legal/terms.data';
import { type FC } from 'react';
import LegalPage from './LegalPage';

const TermsPage: FC = () => {
	return (
		<LegalPage
			title='Podmínky použití'
			seoDescription='Podmínky použití webových stránek – pravidla používání, duševní vlastnictví a omezení odpovědnosti.'
			path='/terms'
			lastUpdated='20. 7. 2026'
			intro='Tyto podmínky upravují používání tohoto webu. Jeho návštěvou a používáním s nimi vyjadřujete souhlas.'
			sections={termsSections}
		/>
	);
};

export default TermsPage;
