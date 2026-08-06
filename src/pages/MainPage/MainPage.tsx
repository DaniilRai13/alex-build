import Seo from '@/components/common/Seo/Seo';
import { type FC } from 'react';
import AboutSection from './AboutSection/AboutSection';
import CTASection from './CTASection/CTASection';
import HeroSection from './HeroSection/HeroSection';
import { PortfolioSection } from './PortfolioSection/PortfolioSection';
import ServicesSection from './ServicesSection/ServicesSection';

const MainPage: FC = () => {
	return (
		<div>
			<Seo
				title='Rekonstrukce a design interiérů'
				description='Kompletní rekonstrukce bytů a domů na klíč – návrh interiéru, kosmetické i kompletní rekonstrukce, pokládka podlah a instalatérské práce. Pevná cena bez skrytých poplatků.'
				path='/'
			/>
			<HeroSection />
			<AboutSection />
			<ServicesSection />
			<PortfolioSection />
			<CTASection />
		</div>
	);
};

export default MainPage;
