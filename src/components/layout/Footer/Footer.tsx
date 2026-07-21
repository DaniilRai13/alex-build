import { Icon } from '@/components/ui/LucidIcon/Icon';
import { contacts } from '@/data/contacts.data';
import { services } from '@/data/services.data';
import { useState, type FC } from 'react';
import Logo from '../../ui/Logo/Logo';
import Navigation from '../Header/Navigation';
import styles from './Footer.module.scss';
import FooterAccordionSection from './FooterAccordionSection/FooterAccordionSection';
import { Link } from 'react-router-dom';

type FooterSection = 'services' | 'links' | 'contacts';

const Footer: FC = () => {
	const currentYear = new Date().getFullYear();

	const [openSection, setOpenSection] = useState<FooterSection | null>(null);
	const toggleSection = (section: FooterSection) => {
		setOpenSection(prev => (prev === section ? null : section));
	};

	return (
		<footer className={styles.footer}>
			<div className='container'>
				<div className={styles.footerInner}>
					<div className={styles.grid}>
						<FooterAccordionSection>
							<Logo />
							<p className={styles.description}>
								Více než jen rekonstrukce. Navrhujeme, plánujeme a realizujeme
								interiéry, které spojují estetiku, kvalitu a dlouhou životnost.
							</p>
						</FooterAccordionSection>
						<FooterAccordionSection
							title='RYCHLÉ ODKAZY'
							isOpen={openSection === 'links'}
							onToggle={() => toggleSection('links')}
						>
							<Navigation
								className={styles.footerNav}
								activeClassName={styles.footerActiveLink}
							/>
						</FooterAccordionSection>
						<FooterAccordionSection
							title='SLUŽBY'
							isOpen={openSection === 'services'}
							onToggle={() => toggleSection('services')}
						>
							<ul className={styles.services}>
								{services.map(service => (
									<li className={styles.serviceTitle} key={service.icon}>
										<Icon icon={service.icon} />
										{service.title}
									</li>
								))}
							</ul>
						</FooterAccordionSection>

						<FooterAccordionSection
							title='KONTAKTY'
							isOpen={openSection === 'contacts'}
							onToggle={() => toggleSection('contacts')}
						>
							<ul className={styles.contacts}>
								{contacts.map(contact => (
									<li key={contact.label}>
										<Icon icon={contact.icon} size={18} />
										{contact.type === 'link' ? (
											<a href={contact.href}>{contact.label}</a>
										) : (
											<span>{contact.label}</span>
										)}
									</li>
								))}
							</ul>
						</FooterAccordionSection>
					</div>
					<div className={styles.bottom}>
						<p>© {currentYear} Nemovitosti. Všechna práva vyhrazena..</p>
						<div className={styles.bottomLinks}>
							<Link to='/privacy'>Zásady ochrany osobních údajů</Link>
							<Link to='/terms'>Uživatelská smlouva</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
