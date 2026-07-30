import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ROUTES } from './config/routes';

// Stránky se načítají líně – každá je vlastní chunk (code-splitting).
const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage/PortfolioPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage/ServicesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage'));

function App() {
	return (
		<Routes>
			<Route path={ROUTES.HOME} element={<Layout />}>
				<Route index element={<MainPage />} />
				<Route path={ROUTES.PORTFOLIO} element={<PortfolioPage />} />
				<Route path={ROUTES.SERVICES} element={<ServicesPage />} />
				<Route path={ROUTES.CONTACTS} element={<ContactPage />} />
				<Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
				<Route path={ROUTES.TERMS} element={<TermsPage />} />
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
}

export default App;
