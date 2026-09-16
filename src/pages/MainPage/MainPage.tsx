import Faq from '@/components/common/Faq/Faq';
import Seo from '@/components/common/Seo/Seo';
import { company, ORGANIZATION_ID } from '@/config/company';
import { faqJsonLd } from '@/config/jsonLd';
import { ROUTES } from '@/config/routes';
import { faqHome } from '@/data/faq.data';
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
				title='Váš partner pro rekonstrukce bytů – Teplice'
				description='Kompletní i kosmetické rekonstrukce bytů a domů v Teplicích, stavební a řemeslné práce, fasády a návrhy interiérů. Pevná cena bez skrytých poplatků.'
				path={ROUTES.HOME}
				jsonLd={[websiteJsonLd, faqJsonLd(faqHome)]}
			/>
			<HeroSection />
			<AboutSection />
			<ServicesSection />
			<PortfolioSection />
			{/* Last before the site-wide CTA banner: objections answered right
			    where the visitor is about to decide whether to write. */}
			<Faq items={faqHome} />
		</div>
	);
};

export default MainPage;
