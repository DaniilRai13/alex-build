import Seo from '@/components/common/Seo/Seo';
import { company, ORGANIZATION_ID } from '@/config/company';
import { ROUTES } from '@/config/routes';
import { type FC } from 'react';
import AboutSection from './AboutSection/AboutSection';
import HeroSection from './HeroSection/HeroSection';
import { PortfolioSection } from './PortfolioSection/PortfolioSection';
import ServicesSection from './ServicesSection/ServicesSection';

// Names the site itself for search engines; the company entity that owns it
// is declared once in index.html and referenced here by @id.
const websiteJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': `${company.url}/#website`,
	name: company.name,
	alternateName: company.brand,
	url: company.url,
	inLanguage: 'cs-CZ',
	publisher: { '@id': ORGANIZATION_ID },
};

const MainPage: FC = () => {
	return (
		<div>
			<Seo
				title='Váš partner pro rekonstrukce bytů a domů'
				description='Kompletní i kosmetické rekonstrukce bytů a domů, stavební a řemeslné práce, fasády a návrhy interiérů. Pevná cena bez skrytých poplatků.'
				path={ROUTES.HOME}
				jsonLd={websiteJsonLd}
			/>
			<HeroSection />
			<AboutSection />
			<ServicesSection />
			<PortfolioSection />
		</div>
	);
};

export default MainPage;
