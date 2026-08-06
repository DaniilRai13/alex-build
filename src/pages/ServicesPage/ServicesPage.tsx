import { useState } from 'react';
import ServicePreview from './ServicePreview/ServicePreview';
import ServiceSidebar from './ServiceSidebar/ServiceSidebar';
import styles from './ServicesPage.module.scss';
import { services } from '@/data/services.data';
import Seo from '@/components/common/Seo/Seo';

const ServicesPage = () => {
	const [activeService, setActiveService] = useState(services[0]);
	return (
		<section className={styles.services}>
			<Seo
				title='Naše služby'
				description='Návrh interiéru, kompletní i kosmetická rekonstrukce, rekonstrukce na klíč, pokládka podlah a instalatérské práce. Zjistěte více o našich službách.'
				path='/services'
			/>
			<div className={styles.top}>
				<ServiceSidebar
					activeId={activeService.id}
					onSelect={setActiveService}
				/>

				<ServicePreview service={activeService} />
			</div>

			{/* <Advantages /> */}

			{/* <CTA /> */}
		</section>
	);
};

export default ServicesPage;
