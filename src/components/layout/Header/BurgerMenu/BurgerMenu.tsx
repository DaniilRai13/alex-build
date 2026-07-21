import Button from '@/components/ui/Button/Button';
import { ROUTES } from '@/config/routes';
import { AnimatePresence, motion } from 'framer-motion';
import { type FC } from 'react';
import Navigation from '../Navigation';
import styles from './BurgerMenu.module.scss';
import { animations } from '@/components/common/animation/variants';

interface BurgerMenuProps {
	isMenuOpen: boolean;
	closeMenu: () => void;
}

const BurgerMenu: FC<BurgerMenuProps> = ({ isMenuOpen, closeMenu }) => {
	return (
		<AnimatePresence>
			{isMenuOpen && (
				<>
					<motion.div
						className={styles.overlay}
						variants={animations.overlayVariants}
						initial='hidden'
						animate='visible'
						exit='exit'
						onClick={closeMenu}
					/>
					<motion.div
						className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}
						variants={animations.menuVariants}
						initial='hidden'
						animate='visible'
						exit='exit'
					>
						<Button
							className={styles.closeButton}
							onClick={closeMenu}
							icon={'X'}
							iconSize={30}
						/>
						<motion.div className={styles.mobileNav} variants={animations.navVariants}>
							<Navigation className={styles.burgerNav} closeMenu={closeMenu} />
							<Button
								title='Požádejte o zavolání'
								icon='Phone'
								className={styles.mobileActionBtn}
								onClick={closeMenu}
								to={ROUTES.CONTACTS}
							/>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default BurgerMenu;
