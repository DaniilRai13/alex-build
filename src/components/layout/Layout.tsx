import { useEffect, type FC } from 'react';
import { Outlet, useLocation } from 'react-router';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import styles from './Layout.module.scss';

const Layout: FC = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	return (
		<div className={styles.layout}>
			<Header />
			<main className={styles.main}>
				<div className='container'>
					<Outlet />
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
