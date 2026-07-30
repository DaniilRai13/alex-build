import { Suspense, useEffect, type FC } from 'react';
import { Outlet, useLocation } from 'react-router';
import ErrorBoundary from '../common/ErrorBoundary/ErrorBoundary';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import styles from './Layout.module.scss';

const Layout: FC = () => {
	const { pathname, key } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	return (
		<div className={styles.layout}>
			<Header />
			<main className={styles.main}>
				<div className='container'>
					{/* key = jedinečný pro každou navigaci → ErrorBoundary se resetuje
					    při jakémkoli přechodu, i když se pathname nemění (např. změna query). */}
					<ErrorBoundary key={key}>
						<Suspense fallback={<div className={styles.loader} />}>
							<Outlet />
						</Suspense>
					</ErrorBoundary>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
