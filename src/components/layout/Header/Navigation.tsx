import { animations } from '@/components/common/animation/variants';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { navigateSideProps } from '@/config/routes';
import useIsActiveLink from '@/hooks/useIsActiveLink';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { type FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.scss';
interface INavigation {
	className?: string;
	closeMenu?: () => void;
	activeClassName?: string;
	/**
	 * An icon before each name. The burger menu keeps them; the header's row
	 * reads lighter as words alone.
	 */
	icons?: boolean;
}

const Navigation: FC<INavigation> = ({
	className,
	closeMenu,
	activeClassName,
	icons = true,
}) => {
	const { isActive } = useIsActiveLink();
	return (
		<nav className={cn(styles.nav, className)}>
			{navigateSideProps.map(item => (
				<motion.div key={item.link} variants={animations.navItemVariants}>
					<Link
						to={item.link}
						className={cn(
							styles.navLink,
							{ [styles.navLinkActive]: isActive(item.link) },
							activeClassName,
						)}
						onClick={closeMenu}
					>
						{icons && <Icon icon={item.icon} />}
						<span>{item.name}</span>
					</Link>
				</motion.div>
			))}
		</nav>
	);
};

export default Navigation;
