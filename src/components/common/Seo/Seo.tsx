import { company } from '@/config/company';
import type { FC } from 'react';
import { Head } from 'vite-react-ssg';

const SITE_NAME = company.brand;
const SITE_URL = company.url;
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SeoProps {
	title: string;
	description: string;
	path: string;
	image?: string;
}

const Seo: FC<SeoProps> = ({ title, description, path, image }) => {
	const url = `${SITE_URL}${path}`;
	const fullTitle = `${title} | ${SITE_NAME}`;
	const ogImage = image ?? DEFAULT_OG_IMAGE;

	return (
		<Head>
			<title>{fullTitle}</title>
			<meta name='description' content={description} />
			<link rel='canonical' href={url} />

			{/* Open Graph — соцсети и мессенджеры */}
			<meta property='og:type' content='website' />
			<meta property='og:locale' content='cs_CZ' />
			<meta property='og:site_name' content={SITE_NAME} />
			<meta property='og:title' content={fullTitle} />
			<meta property='og:description' content={description} />
			<meta property='og:url' content={url} />
			<meta property='og:image' content={ogImage} />

			{/* Twitter / X */}
			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:title' content={fullTitle} />
			<meta name='twitter:description' content={description} />
			<meta name='twitter:image' content={ogImage} />
		</Head>
	);
};

export default Seo;
