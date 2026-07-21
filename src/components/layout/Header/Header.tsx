import Button from '@/components/ui/Button/Button';
import { useCallback, useEffect, useState, type FC } from 'react';
import Logo from '../../ui/Logo/Logo';
import BurgerMenu from './BurgerMenu/BurgerMenu';
import styles from './Header.module.scss';
import Navigation from './Navigation';

const Header: FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
	const closeMenu = useCallback(() => setIsMenuOpen(false), []);

	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [isMenuOpen]);

	return (
		<>
			<header className={styles.header}>
				<div className={`container ${styles.headerContainer}`}>
					<div className={styles.headerInner}>
						<Logo />
						<Navigation closeMenu={closeMenu} />
						<Button
							className={styles.menuButton}
							onClick={toggleMenu}
							icon={'Menu'}
						/>
					</div>
				</div>
			</header>
			<BurgerMenu isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
		</>
	);
};

export default Header;
