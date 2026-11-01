import logo from '@/assets/logo-on-dark.png';
import { animations } from '@/components/common/animation/variants';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { company, displayPhone } from '@/config/company';
import { ROUTES, servicePath } from '@/config/routes';
import { contacts } from '@/data/contacts.data';
import { services } from '@/data/services.data';
import useIsActiveLink from '@/hooks/useIsActiveLink';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BurgerMenu.module.scss';

interface BurgerMenuProps {
	isMenuOpen: boolean;
	closeMenu: () => void;
}

type Tab = 'pages' | 'services';

const TABS: [Tab, string][] = [
	['pages', 'Menu'],
	['services', 'Služby'],
];

// Služby has a tab of its own, so the page list leaves it out and takes
// Ceník instead, which the header has no room for.
const PAGES = [
	{ name: 'Domov', link: ROUTES.HOME },
	{ name: 'Portfolio', link: ROUTES.PORTFOLIO },
	{ name: 'Ceník', link: ROUTES.PRICING },
	{ name: 'Kontakt', link: ROUTES.CONTACTS },
];

const HOURS = contacts.find(item => item.icon === 'Clock')?.label;

/**
 * The drawer itself. It mounts each time the menu opens, so it starts on the
 * tab that holds the current page.
 */
const Drawer: FC<{ closeMenu: () => void }> = ({ closeMenu }) => {
	const { pathname } = useLocation();
	const { isActive } = useIsActiveLink();
	const [tab, setTab] = useState<Tab>(() =>
		pathname.startsWith(ROUTES.SERVICES) ? 'services' : 'pages',
	);
	const closeRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		closeRef.current?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') closeMenu();
		};
		window.addEventListener('keydown', onKeyDown);

		return () => window.removeEventListener('keydown', onKeyDown);
	}, [closeMenu]);

	const current = (link: string) => (isActive(link) ? 'page' : undefined);

	return (
		<motion.div
			className={styles.drawer}
			role='dialog'
			aria-modal='true'
			aria-label='Menu'
			variants={animations.drawerVariants}
			initial='hidden'
			animate='visible'
			exit='exit'
		>
			<div className={styles.top}>
				<Link
					to={ROUTES.HOME}
					className={styles.brand}
					aria-label='KartStav – domů'
					onClick={closeMenu}
				>
					<img src={logo} alt='KartStav' />
				</Link>
				<button
					ref={closeRef}
					type='button'
					className={styles.close}
					aria-label='Zavřít menu'
					onClick={closeMenu}
				>
					<Icon icon='X' size={22} />
				</button>
			</div>

			<div className={styles.tabs} role='tablist'>
				{TABS.map(([id, label]) => (
					<button
						key={id}
						type='button'
						role='tab'
						aria-selected={tab === id}
						className={cn(styles.tab, { [styles.tabActive]: tab === id })}
						onClick={() => setTab(id)}
					>
						{label}
					</button>
				))}
			</div>

			<div className={styles.body} role='tabpanel'>
				<nav aria-label={tab === 'pages' ? 'Stránky' : 'Služby'}>
					{tab === 'pages' ? (
						<ul className={styles.rows}>
							{PAGES.map(item => (
								<li key={item.link}>
									<Link
										to={item.link}
										className={cn(styles.row, { [styles.rowActive]: isActive(item.link) })}
										aria-current={current(item.link)}
										onClick={closeMenu}
									>
										{item.name}
										<Icon icon='ArrowRight' size={18} />
									</Link>
								</li>
							))}
						</ul>
					) : (
						<>
							<Link
								to={ROUTES.SERVICES}
								className={styles.allServices}
								aria-current={current(ROUTES.SERVICES)}
								onClick={closeMenu}
							>
								Všechny služby
								<Icon icon='ArrowRight' size={18} />
							</Link>
							<ul className={styles.rows}>
								{services.map(service => {
									const link = servicePath(service.slug);

									return (
										<li key={service.slug}>
											<Link
												to={link}
												className={cn(styles.serviceRow, {
													[styles.serviceRowActive]: isActive(link),
												})}
												aria-current={current(link)}
												onClick={closeMenu}
											>
												<span className={styles.iconTile}>
													<Icon icon={service.icon} size={19} />
												</span>
												{service.title}
											</Link>
										</li>
									);
								})}
							</ul>
						</>
					)}
				</nav>
			</div>

			<div className={styles.footer}>
				<div className={styles.footerRow}>
					<a href={`mailto:${company.email}`} className={styles.mail}>
						<Icon icon='Mail' size={17} />
						{company.email}
					</a>
					{HOURS && (
						<span className={styles.hours}>
							<Icon icon='Clock' size={15} />
							{HOURS}
						</span>
					)}
				</div>
				<a href={`tel:${company.phone}`} className={styles.call}>
					<Icon icon='Phone' size={18} />
					{displayPhone}
				</a>
			</div>
		</motion.div>
	);
};

/**
 * The mobile menu: a dark drawer from the right over the dimmed page, with the
 * pages and the services on two tabs, and the phone number always at the
 * bottom.
 */
const BurgerMenu: FC<BurgerMenuProps> = ({ isMenuOpen, closeMenu }) => (
	<AnimatePresence>
		{isMenuOpen && (
			<>
				<motion.div
					key='overlay'
					className={styles.overlay}
					variants={animations.overlayVariants}
					initial='hidden'
					animate='visible'
					exit='exit'
					onClick={closeMenu}
				/>
				<Drawer key='drawer' closeMenu={closeMenu} />
			</>
		)}
	</AnimatePresence>
);

export default BurgerMenu;
