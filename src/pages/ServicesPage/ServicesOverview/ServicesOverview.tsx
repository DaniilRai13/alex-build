import Button from '@/components/ui/Button/Button';
import Image from '@/components/ui/Image/Image';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { servicePath } from '@/config/routes';
import { services } from '@/data/services.data';
import type { IService } from '@/types/services.interface';
import cn from 'classnames';
import {
	useEffect,
	useRef,
	useState,
	type FC,
	type ReactElement,
} from 'react';
import { Link } from 'react-router-dom';
import styles from './ServicesOverview.module.scss';

interface Props {
	/**
	 * <h2> on /services, where each service is a section of the page; <h3> on
	 * the dev preview, where the headings around it already are the <h2>s.
	 */
	headingAs?: 'h2' | 'h3';
}

/**
 * All four services at once: the lead one as a dark panel, the other three as
 * cards beside it — side-on cards on a tablet, a swipeable strip on a phone.
 *
 * Replaced a tabbed board that rendered only the open service, so three of the
 * four descriptions were not in the HTML at all and Google never saw them. The
 * strip is plain CSS scroll-snap for the same reason: every card is in the
 * markup, and the only script is the dots under it.
 */
const ServicesOverview: FC<Props> = ({ headingAs = 'h2' }) => {
	const [lead, ...rest] = services;

	return (
		<div className={styles.block}>
			<article className={styles.lead}>
				<div className={styles.leadText}>
					<div className={styles.head}>
						<span className={styles.badge}>
							<Icon icon={lead.icon} size={22} />
						</span>
						<Title service={lead} as={headingAs} />
					</div>

					<p className={styles.desc}>{lead.description}</p>

					<ul className={styles.features}>
						{lead.features.map(feature => (
							<li key={feature}>{feature}</li>
						))}
					</ul>

					<Button
						title={lead.buttonText}
						className={styles.button}
						to={servicePath(lead.slug)}
					/>
				</div>

				{/* Wrapped: Image renders a <picture> with display: contents, and
				    bare in this grid its <source> would take the second column. */}
				{lead.img && (
					<div className={styles.art}>
						<Image
							src={lead.img.src}
							srcSet={lead.img.srcSet}
							alt=''
							className={styles.sketch}
						/>
					</div>
				)}
			</article>

			<Strip>
				{rest.map(service => (
					<article key={service.slug} className={styles.card}>
						<div className={styles.head}>
							<span className={styles.badge}>
								<Icon icon={service.icon} size={19} />
							</span>
							<Title service={service} as={headingAs} />
						</div>

						<p className={styles.desc}>{service.description}</p>

						<ul className={styles.features}>
							{service.features.map(feature => (
								<li key={feature}>{feature}</li>
							))}
						</ul>

						<Link className={styles.more} to={servicePath(service.slug)}>
							{service.buttonText}
							<Icon icon='ArrowRight' size={16} />
						</Link>
					</article>
				))}
			</Strip>
		</div>
	);
};

export default ServicesOverview;

// The service name is the link to its page.
const Title: FC<{ service: IService; as: 'h2' | 'h3' }> = ({
	service,
	as: H,
}) => (
	<H className={styles.title}>
		<Link to={servicePath(service.slug)}>{service.title}</Link>
	</H>
);

/**
 * The row of cards. From tablets up it is a plain grid — three columns, or a
 * stack of side-on cards — and the dots are hidden by CSS. On phones it is the
 * strip: the dots follow the scroll and jump to a card when tapped.
 */
const Strip: FC<{ children: ReactElement[] }> = ({ children }) => {
	const track = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);

	useEffect(() => {
		const element = track.current;
		if (!element) return;

		let frame = 0;
		const update = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const cards = [...element.children] as HTMLElement[];
				const max = element.scrollWidth - element.clientWidth;

				// At the far end the last card cannot reach the start edge — on
				// a tablet two or three are in view by then — so the end of the
				// track counts as the last card.
				if (element.scrollLeft >= max - 4) {
					setActive(cards.length - 1);
					return;
				}

				const start = element.getBoundingClientRect().left;
				const padding = parseFloat(getComputedStyle(element).paddingLeft);
				const distances = cards.map(card =>
					Math.abs(card.getBoundingClientRect().left - start - padding),
				);
				setActive(distances.indexOf(Math.min(...distances)));
			});
		};

		element.addEventListener('scroll', update, { passive: true });
		return () => {
			element.removeEventListener('scroll', update);
			cancelAnimationFrame(frame);
		};
	}, []);

	const goTo = (index: number) => {
		const element = track.current;
		const card = element?.children[index] as HTMLElement | undefined;
		if (!element || !card) return;

		// From the rendered boxes rather than offsetLeft, which is measured from
		// the offset parent and knows nothing about the track's own scroll.
		const padding = parseFloat(getComputedStyle(element).paddingLeft);
		const offset =
			card.getBoundingClientRect().left - element.getBoundingClientRect().left;
		element.scrollTo({
			left: element.scrollLeft + offset - padding,
			behavior: 'smooth',
		});
	};

	return (
		<div className={styles.restWrap}>
			<div ref={track} className={styles.rest}>
				{children}
			</div>

			<div className={styles.dots}>
				{children.map((child, index) => (
					<button
						key={child.key}
						type='button'
						className={cn(styles.dot, index === active && styles.dotActive)}
						aria-label={`${index + 1} / ${children.length}`}
						aria-current={index === active ? 'true' : undefined}
						onClick={() => goTo(index)}
					/>
				))}
			</div>
		</div>
	);
};
