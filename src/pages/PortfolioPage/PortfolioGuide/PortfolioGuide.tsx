import Heading from '@/components/ui/Heading/Heading';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { projectPath } from '@/config/routes';
import { portfolioData } from '@/data/portfolio/portfolio.data';
import { primaryRegions, TOWN_REGIONS } from '@/data/regions.data';
import type { IPortfolioProject } from '@/types/portfolio.interface';
import cn from 'classnames';
import { useId, useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './PortfolioGuide.module.scss';

const bySlug = (slugs: string[]) =>
	slugs
		.map(slug => portfolioData.find(project => project.slug === slug))
		.filter((project): project is IPortfolioProject => !!project);

const facade = portfolioData.find(project => project.category === 'facade');

// Every claim below is in the description of at least one of the projects it
// links to. Nothing here is general renovation advice: the point of the text is
// that each sentence can be checked against a photo.
const parts = [
	{
		title: 'Bytové jádro a koupelna',
		text: 'Původní bytové jádro bouráme a místo něj stavíme zděnou koupelnu s vanou nebo sprchovým koutem, často s velkoformátovým obkladem. Jinde stačí koupelnu kompletně přepracovat – nové obklady, vana a podlaha.',
		projects: bySlug([
			'rekonstrukce-bytu-kuchyne-koupelna',
			'rekonstrukce-bytu-zelena-kuchyne',
			'rekonstrukce-bytu-moderni-kuchyne',
			'rekonstrukce-bytu-koupelna',
		]),
	},
	{
		title: 'Kuchyň',
		text: 'Novou kuchyň má téměř každý byt v portfoliu a žádná není stejná: bílý lesk s dřevodekorem, betonový dekor s černou pracovní deskou, pastelově zelená s obkladem cihličkou nebo bílé lesklé skříňky s dřevěným obkladem a LED podsvícením.',
		projects: bySlug([
			'rekonstrukce-bytu-zelena-kuchyne',
			'rekonstrukce-bytu-radova-kuchyne',
			'rekonstrukce-bytu-panelak',
		]),
	},
	{
		title: 'Podlahy, příčky a rozvody',
		text: 'Kde je potřeba, rozebereme byt až na nosné konstrukce: postavíme nové příčky z pórobetonu a uděláme novou elektroinstalaci i rozvody vody. Podlahy vyrovnáme a položíme vinyl nebo velkoformátovou dlažbu v dekoru dřeva.',
		projects: bySlug(['rekonstrukce-paneloveho-bytu', 'rekonstrukce-bytu-koupelna']),
	},
	...(facade
		? [
				{
					title: 'Fasády a zateplení',
					text: `Kromě bytů zateplujeme i bytové domy. Na panelovém domě jsme postavili lešení, provedli zateplovací systém a novou povrchovou úpravu – celkem ${facade.area.toLocaleString('cs')} m² fasády.`,
					projects: [facade],
				},
			]
		: []),
];

// The projects by kraj, the home region first, then the busiest.
const HOME = primaryRegions.find(region => region.type === 'AdministrativeArea')?.name;
const regions = Object.entries(
	portfolioData.reduce<Record<string, IPortfolioProject[]>>((all, project) => {
		const region = TOWN_REGIONS[project.location] ?? 'Další místa';
		(all[region] ??= []).push(project);

		return all;
	}, {}),
).sort(([a, x], [b, y]) => Number(b === HOME) - Number(a === HOME) || y.length - x.length);

const ProjectLink: FC<{ project: IPortfolioProject }> = ({ project }) => (
	<Link to={projectPath(project.slug)} className={styles.projectLink}>
		<span>{project.title}</span>
		<small>
			{project.location} · {project.area.toLocaleString('cs')} m²
		</small>
	</Link>
);

/**
 * The projects by kraj. On a phone each kraj folds, the home region open; the
 * list stays in the HTML either way, only hidden. From tablet width up every
 * kraj is a card and the toggles do nothing visible.
 */
const RegionList: FC = () => {
	const id = useId();
	const [open, setOpen] = useState<string[]>(() => regions.slice(0, 1).map(([region]) => region));

	const toggle = (region: string) =>
		setOpen(list =>
			list.includes(region) ? list.filter(item => item !== region) : [...list, region],
		);

	return (
		<div className={styles.regions}>
			{regions.map(([region, projects], index) => {
				const isOpen = open.includes(region);

				return (
					<div key={region} className={cn(styles.region, { [styles.regionOpen]: isOpen })}>
						<Heading as='h3' className={styles.regionTitle}>
							<button
								type='button'
								className={styles.regionToggle}
								aria-expanded={isOpen}
								aria-controls={`${id}-${index}`}
								onClick={() => toggle(region)}
							>
								{region}
								<span className={styles.regionCount}>{projects.length}</span>
								<Icon icon='ChevronDown' size={20} className={styles.chevron} />
							</button>
						</Heading>
						<ul id={`${id}-${index}`} className={styles.links}>
							{projects.map(project => (
								<li key={project.slug}>
									<ProjectLink project={project} />
								</li>
							))}
						</ul>
					</div>
				);
			})}
		</div>
	);
};

/**
 * Text for the portfolio as a whole, under the sections: what a renovation
 * here is made of, and where the jobs were. Both link straight to the
 * projects, with the work and the town in the link text.
 */
const PortfolioGuide: FC = () => (
	<>
		<section id='co-zahrnuje-rekonstrukce' className={styles.block}>
			<div className={styles.head}>
				<Heading as='h2' className={styles.title}>
					Co obvykle zahrnuje rekonstrukce bytu
				</Heading>
				<p className={styles.intro}>
					Rozsah prací je u každého bytu jiný, opakují se v něm ale stejné části. U každé
					najdete realizace, kde je vidět na fotografiích.
				</p>
			</div>

			<div className={styles.parts}>
				{parts.map(part => (
					<article key={part.title} className={styles.part}>
						<Heading as='h3' className={styles.partTitle}>
							{part.title}
						</Heading>
						<p>{part.text}</p>
						<ul className={styles.links}>
							{part.projects.map(project => (
								<li key={project.slug}>
									<ProjectLink project={project} />
								</li>
							))}
						</ul>
					</article>
				))}
			</div>
		</section>

		<section id='kde-jsme-pracovali' className={styles.block}>
			<div className={styles.head}>
				<Heading as='h2' className={styles.title}>
					Kde jsme pracovali
				</Heading>
				<p className={styles.intro}>
					Doma jsme v Teplicích a v Ústeckém kraji, za zakázkami ale jezdíme i dál. Realizace
					z portfolia podle kraje:
				</p>
			</div>

			<RegionList />
		</section>
	</>
);

export default PortfolioGuide;
