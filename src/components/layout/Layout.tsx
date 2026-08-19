import { organizationJsonLd } from '@/config/jsonLd';
import { ROUTES } from '@/config/routes';
import { trackPageView } from '@/services/analytics.service';
import { useEffect, type FC } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Head } from 'vite-react-ssg';
import CtaBanner from '../common/CtaBanner/CtaBanner';
import ErrorBoundary from '../common/ErrorBoundary/ErrorBoundary';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import styles from './Layout.module.scss';

const Layout: FC = () => {
	const { pathname, key } = useLocation();

	// The contact page is the destination the banner points at — repeating the
	// call to action above its own form would only get in the way.
	const showCta = pathname !== ROUTES.CONTACTS;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	// Every page passes through this layout, and react-router navigations never
	// reload the document — so counting here is the only place that sees both
	// the first visit and every move around the site afterwards.
	useEffect(() => {
		trackPageView(pathname);
	}, [pathname]);

	return (
		<div className={styles.layout}>
			{/* One organisation entity per page, built from config/company.ts. */}
			<Head>
				<script type='application/ld+json'>
					{JSON.stringify(organizationJsonLd)}
				</script>
			</Head>

			<Header />
			<main className={styles.main}>
				<div className='container'>
					{/* key = jedinečný pro každou navigaci → ErrorBoundary se resetuje
					    při jakémkoli přechodu, i když se pathname nemění (např. změna query). */}
					<ErrorBoundary key={key}>
						<Outlet />
					</ErrorBoundary>

					{showCta && <CtaBanner />}
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
