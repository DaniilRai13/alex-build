import Button from '@/components/ui/Button/Button';
import Image from '@/components/ui/Image/Image';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { ROUTES, servicePath } from '@/config/routes';
import { services } from '@/data/services.data';
import ServicePreview from '@/pages/ServicesPage/ServicePreview/ServicePreview';
import ServiceSidebar from '@/pages/ServicesPage/ServiceSidebar/ServiceSidebar';
import type { IService } from '@/types/services.interface';
import cn from 'classnames';
import {
	useEffect,
	useRef,
	useState,
	type FC,
	type MouseEvent,
} from 'react';
import { Link } from 'react-router-dom';
import styles from './ServicesAllVariant.module.scss';

export type ServicesAllStyle =
	| 'now'
	| 'grid'
	| 'rail'
	| 'zigzag'
	| 'catalog'
	| 'featured';

/**
 * Ways to put all four services on /services at once. Only "now" renders the
 * live components; the rest are stand-ins with their own styles, so trying a
 * layout never touches what the overview and the detail pages render.
 *
 * Real copy from services.data, so line counts and heights are the ones the
 * decision would ship with. Service names are <h3> because the variant title
 * above each mockup is the <h2>; on the real page they would be <h2>.
 */
const ServicesAllVariant: FC<{ style: ServicesAllStyle }> = ({ style }) => {
	switch (style) {
		case 'now':
			return <NowVariant />;
		case 'grid':
			return <GridVariant />;
		case 'rail':
			return <RailVariant />;
		case 'zigzag':
			return <ZigzagVariant />;
		case 'catalog':
			return <CatalogVariant />;
		case 'featured':
			return <FeaturedVariant />;
	}
};

export default ServicesAllVariant;

// ─── Shared pieces ───────────────────────────────────────────────────────────

const Title: FC<{ service: IService }> = ({ service }) => (
	<h3 className={styles.title}>
		<Link to={servicePath(service.slug)}>{service.title}</Link>
	</h3>
);

const Features: FC<{ service: IService; twoCol?: boolean }> = ({
	service,
	twoCol = false,
}) => (
	<ul className={cn(styles.features, twoCol && styles.twoCol)}>
		{service.features.map(feature => (
			<li key={feature}>{feature}</li>
		))}
	</ul>
);

const More: FC<{ service: IService }> = ({ service }) => (
	<Link className={styles.more} to={servicePath(service.slug)}>
		{service.buttonText}
		<Icon icon='ArrowRight' size={16} />
	</Link>
);

const Sketch: FC<{ service: IService; className?: string }> = ({
	service,
	className = styles.sketch,
}) =>
	service.img ? (
		<Image
			src={service.img.src}
			srcSet={service.img.srcSet}
			alt=''
			className={className}
		/>
	) : null;

// ─── 00 · As it is today ─────────────────────────────────────────────────────

// The live board, live components: the baseline has to be the real thing.
const NowVariant: FC = () => {
	const [active, setActive] = useState(services[0]);

	return (
		<div className={styles.now}>
			<ServiceSidebar activeSlug={active.slug} onSelect={setActive} />
			<ServicePreview
				service={active}
				ctaTitle={active.buttonText}
				ctaTo={servicePath(active.slug)}
				secondaryTitle='Zobrazit realizace'
				secondaryTo={ROUTES.PORTFOLIO}
			/>
		</div>
	);
};

// ─── 01 · 2×2 grid ───────────────────────────────────────────────────────────

const GridVariant: FC = () => (
	<div className={styles.grid}>
		{services.map(service => (
			<article key={service.slug} className={styles.gridCard}>
				<Sketch service={service} />
				<span className={styles.badge}>
					<Icon icon={service.icon} size={22} />
				</span>
				<Title service={service} />
				<p className={styles.desc}>{service.description}</p>
				<Features service={service} twoCol />
				<More service={service} />
			</article>
		))}
	</div>
);

// ─── 02 · Rail kept, services stacked ────────────────────────────────────────

const RailVariant: FC = () => {
	const [active, setActive] = useState(services[0].slug);
	const sections = useRef<Record<string, HTMLElement | null>>({});
	const nav = useRef<HTMLElement>(null);

	useEffect(() => {
		// A thin band across the upper middle of the viewport: whichever service
		// is crossing it is the one being read.
		const observer = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					const slug = (entry.target as HTMLElement).dataset.slug;
					if (entry.isIntersecting && slug) setActive(slug);
				}
			},
			{ rootMargin: '-35% 0px -60% 0px' },
		);

		for (const element of Object.values(sections.current)) {
			if (element) observer.observe(element);
		}

		return () => observer.disconnect();
	}, []);

	// On phones the rail is a strip wider than the screen: keep the lit item
	// inside it. Scrolls the strip only — scrollIntoView would move the page too.
	useEffect(() => {
		const strip = nav.current;
		const item = strip?.querySelector<HTMLElement>('[aria-current]');
		if (!strip || !item || strip.scrollWidth <= strip.clientWidth) return;

		const offset =
			item.getBoundingClientRect().left - strip.getBoundingClientRect().left;
		strip.scrollTo({ left: strip.scrollLeft + offset - 16, behavior: 'smooth' });
	}, [active]);

	// Scrolls instead of letting the hash change: the router would treat a new
	// hash as navigation, and the URL has nothing to gain from it.
	const jump = (event: MouseEvent, slug: string) => {
		event.preventDefault();
		sections.current[slug]?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
		setActive(slug);
	};

	return (
		<div className={styles.railBoard}>
			<aside className={styles.rail}>
				<nav
					ref={nav}
					className={styles.railNav}
					aria-label='Seznam služeb'
				>
					{services.map(service => (
						<a
							key={service.slug}
							href={`#sluzba-${service.slug}`}
							className={cn(
								styles.railItem,
								active === service.slug && styles.railActive,
							)}
							aria-current={active === service.slug ? 'true' : undefined}
							onClick={event => jump(event, service.slug)}
						>
							<Icon icon={service.icon} size={20} />
							<span>{service.title}</span>
						</a>
					))}
				</nav>
			</aside>

			<div className={styles.stack}>
				{services.map(service => (
					<section
						key={service.slug}
						id={`sluzba-${service.slug}`}
						data-slug={service.slug}
						ref={element => {
							sections.current[service.slug] = element;
						}}
						className={styles.stackItem}
					>
						<Sketch service={service} />
						<Title service={service} />
						<p className={styles.desc}>{service.description}</p>
						<Features service={service} twoCol />
						<More service={service} />
					</section>
				))}
			</div>
		</div>
	);
};

// ─── 03 · Zigzag ─────────────────────────────────────────────────────────────

const ZigzagVariant: FC = () => (
	<div className={styles.zigzag}>
		{services.map((service, i) => (
			<article
				key={service.slug}
				className={cn(styles.zigRow, i % 2 === 1 && styles.zigFlip)}
			>
				<div className={styles.zigArt}>
					<Sketch service={service} className='' />
				</div>

				<div className={styles.zigText}>
					<span className={styles.zigNum}>
						{String(i + 1).padStart(2, '0')} /{' '}
						{String(services.length).padStart(2, '0')}
					</span>
					<Title service={service} />
					<p className={styles.desc}>{service.description}</p>
					<Features service={service} twoCol />
					<More service={service} />
				</div>
			</article>
		))}
	</div>
);

// ─── 04 · Catalogue rows ─────────────────────────────────────────────────────

const CatalogVariant: FC = () => (
	<div className={styles.catalog}>
		{services.map((service, i) => (
			<article key={service.slug} className={styles.catRow}>
				<span className={styles.catNum}>
					{String(i + 1).padStart(2, '0')}
				</span>

				<div>
					<div className={styles.catTitle}>
						<Icon icon={service.icon} size={20} />
						<Title service={service} />
					</div>
					<p className={styles.desc}>{service.description}</p>
				</div>

				<Features service={service} />

				{/* The name already links there; this one is a pointer, so it stays
				    out of the tab order and the accessibility tree. */}
				<Link
					className={styles.catArrow}
					to={servicePath(service.slug)}
					tabIndex={-1}
					aria-hidden
				>
					<Icon icon='ArrowRight' size={18} />
				</Link>
			</article>
		))}
	</div>
);

// ─── 05 · Lead service + three ───────────────────────────────────────────────

const FeaturedVariant: FC = () => {
	const [lead, ...rest] = services;

	return (
		<div className={styles.featured}>
			<article className={styles.featMain}>
				<div>
					<Title service={lead} />
					<p className={styles.desc}>{lead.description}</p>
					<Features service={lead} twoCol />
					<Button
						title={lead.buttonText}
						className={styles.button}
						to={servicePath(lead.slug)}
					/>
				</div>
				<div className={styles.featArt}>
					<Sketch service={lead} className='' />
				</div>
			</article>

			<div className={styles.featRest}>
				{rest.map(service => (
					<article key={service.slug} className={styles.featCard}>
						<span className={styles.badge}>
							<Icon icon={service.icon} size={22} />
						</span>
						<Title service={service} />
						<p className={styles.desc}>{service.description}</p>
						<Features service={service} />
						<More service={service} />
					</article>
				))}
			</div>
		</div>
	);
};
