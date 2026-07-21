import { privacySections } from '@/data/legal/privacy.data';
import { type FC } from 'react';
import LegalPage from './LegalPage';

const PrivacyPage: FC = () => {
	return (
		<LegalPage
			title='Zásady ochrany osobních údajů'
			seoDescription='Zásady ochrany osobních údajů – jaké údaje zpracováváme, k jakému účelu a jaká máte práva.'
			path='/privacy'
			lastUpdated='20. 7. 2026'
			intro='Ochrana vašich osobních údajů je pro nás důležitá. V těchto zásadách vysvětlujeme, jaké údaje shromažďujeme prostřednictvím tohoto webu, k jakému účelu je zpracováváme a jaká máte práva.'
			sections={privacySections}
		/>
	);
};

export default PrivacyPage;
