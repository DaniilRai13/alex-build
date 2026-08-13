import Seo from '@/components/common/Seo/Seo';
import Heading from '@/components/ui/Heading/Heading';
import type { LegalSection } from '@/types/legal.interface';
import { type FC } from 'react';
import styles from './LegalPage.module.scss';

interface LegalPageProps {
	title: string;
	seoDescription: string;
	path: string;
	lastUpdated: string;
	intro?: string;
	sections: LegalSection[];
}

const LegalPage: FC<LegalPageProps> = ({
	title,
	seoDescription,
	path,
	lastUpdated,
	intro,
	sections,
}) => {
	return (
		<section className={styles.legal}>
			<Seo title={title} description={seoDescription} path={path} />

			<div className={styles.header}>
				<Heading as='h1' className={styles.title}>
					{title}
				</Heading>
				<p className={styles.updated}>Poslední aktualizace: {lastUpdated}</p>
			</div>

			{intro && <p className={styles.intro}>{intro}</p>}

			<div className={styles.content}>
				{sections.map((section, index) => (
					<div className={styles.section} key={section.heading}>
						<h2 className={styles.sectionTitle}>
							<span className={styles.num}>{index + 1}.</span>
							{section.heading}
						</h2>
						{section.paragraphs.map((paragraph, i) => (
							<p className={styles.paragraph} key={i}>
								{paragraph}
							</p>
						))}
					</div>
				))}
			</div>
		</section>
	);
};

export default LegalPage;
