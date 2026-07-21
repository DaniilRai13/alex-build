import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ROUTES } from './config/routes';
import ContactPage from './pages/ContactPage/ContactPage';
import MainPage from './pages/MainPage/MainPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import PortfolioPage from './pages/PortfolioPage/PortfolioPage';
import ServicesPage from './pages/ServicesPage/ServicesPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import TermsPage from './pages/legal/TermsPage';

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
