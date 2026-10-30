import { Icon } from '@/components/ui/LucidIcon/Icon';
import { ROUTES } from '@/config/routes';
import { heroRooms, type IHeroRoom } from '@/data/hero3d.data';
import cn from 'classnames';
import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './ApartmentModel.module.scss';
import type { ApartmentScene } from './apartmentScene';

const MODEL_URL = '/models/apartment.glb';
const POSTER_URL = '/models/apartment-poster.webp';
const DRACO_PATH = '/draco/';

type Status = 'poster' | 'loading' | 'ready' | 'error';

const isPhone = () => matchMedia('(max-width: 768px)').matches;

/**
 * Phones and data-saver connections get the still picture and a button:
 * three.js plus the model is ~3.5 MB, and inline on a narrow screen a canvas
 * that answers to touch competes with scrolling the page. On a phone the
 * button opens the model fullscreen instead.
 */
const shouldAutoLoad = () => {
	const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
		.connection;
	return !isPhone() && !connection?.saveData;
};

/** Waits until the page has finished loading and the browser has a spare moment. */
const whenIdle = (run: () => void) => {
	const later = () =>
		typeof window.requestIdleCallback === 'function'
			? window.requestIdleCallback(run, { timeout: 2500 })
			: window.setTimeout(run, 300); // Safari has no requestIdleCallback
	if (document.readyState === 'complete') later();
	else window.addEventListener('load', later, { once: true });
};

const ApartmentModel: FC = () => {
	const stageRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const seamRef = useRef<HTMLButtonElement>(null);
	const markers = useRef(new Map<string, HTMLElement>());
	const sceneRef = useRef<ApartmentScene | null>(null);

	const [status, setStatus] = useState<Status>('poster');
	const [wanted, setWanted] = useState(false);
	const [fullscreen, setFullscreen] = useState(false);
	const [after, setAfter] = useState(true);
	const [room, setRoom] = useState<IHeroRoom | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);
	// Zoomed in or at a room, the caption steps aside; moved in any way
	// (turned too), the view controls stay out, so the way back is in sight.
	const [view, setView] = useState({ closer: false, moved: false });

	const start = useCallback(() => {
		setWanted(true);
		setStatus(current => (current === 'poster' ? 'loading' : current));
	}, []);

	// Decide on mount whether the 3D starts by itself; otherwise it waits
	// for the "Prozkoumat" button.
	useEffect(() => {
		if (shouldAutoLoad()) whenIdle(start);
	}, [start]);

	const openRoom = useCallback((r: IHeroRoom) => {
		setRoom(r);
		sceneRef.current?.focus(r.id);
	}, []);

	useEffect(() => {
		if (!wanted) return;
		let scene: ApartmentScene | null = null;
		let cancelled = false;

		import('./apartmentScene')
			.then(({ mountApartment }) => {
				if (cancelled || !stageRef.current || !canvasRef.current || !seamRef.current)
					return;
				scene = mountApartment(
					{
						stage: stageRef.current,
						canvas: canvasRef.current,
						seam: seamRef.current,
						markers: markers.current,
					},
					{
						onReady: () => setStatus('ready'),
						onError: error => {
							console.error(error);
							setStatus('error');
						},
						onStateChange: setAfter,
						onViewChange: setView,
					},
					{ modelUrl: MODEL_URL, dracoPath: DRACO_PATH, intro: true },
				);
				sceneRef.current = scene;
			})
			.catch(error => {
				console.error(error);
				if (!cancelled) setStatus('error');
			});

		return () => {
			cancelled = true;
			scene?.dispose();
			sceneRef.current = null;
		};
	}, [wanted]);

	// The floor under a room warms while it is pointed at or open.
	useEffect(() => {
		sceneRef.current?.highlight(hovered ?? room?.id ?? null);
	}, [hovered, room, status]);

	// Fullscreen: the page stops scrolling underneath, Esc closes.
	useEffect(() => {
		sceneRef.current?.setFullscreen(fullscreen);
		if (!fullscreen) return;
		const { overflow } = document.body.style;
		document.body.style.overflow = 'hidden';
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFullscreen(false);
		window.addEventListener('keydown', onKey);
		return () => {
			document.body.style.overflow = overflow;
			window.removeEventListener('keydown', onKey);
		};
	}, [fullscreen, status]);

	const explore = () => {
		if (isPhone()) setFullscreen(true);
		start();
	};

	const markerRef = useCallback(
		(id: string) => (el: HTMLButtonElement | null) => {
			if (el) markers.current.set(id, el);
			else markers.current.delete(id);
		},
		[],
	);

	const reset = () => {
		setRoom(null);
		sceneRef.current?.reset();
	};

	// The red segment moves on the click itself. The scene reports the state
	// only once the seam crosses the middle, most of a second later — the
	// toggle answered late. The report still sets it when the seam is dragged.
	const showState = (toAfter: boolean) => {
		setAfter(toAfter);
		sceneRef.current?.showState(toAfter);
	};

	const ready = status === 'ready';
	const hoverProps = (id: string) => ({
		onMouseEnter: () => setHovered(id),
		onMouseLeave: () => setHovered(null),
		onFocus: () => setHovered(id),
		onBlur: () => setHovered(null),
	});

	return (
		<div
			className={cn(
				styles.root,
				ready && styles.ready,
				fullscreen && styles.fullscreen,
				(view.closer || room) && styles.closer,
				(view.moved || room) && styles.moved,
				room && styles.roomOpen,
			)}
		>
			{/* A design, not a finished job — the room cards link to the real
			    ones. Saying so keeps the model honest. */}
			<p className={styles.note}>
				Interaktivní 3D model
				<small>Prohlédněte si návrh bytu</small>
				<svg viewBox='0 0 60 40' aria-hidden='true'>
					<path d='M56 4C46 22 30 32 8 34' />
					<path d='M16 27l-8 7 10 3' />
				</svg>
			</p>

			<div ref={stageRef} className={styles.stage}>
				{/* The still is the first paint and the fallback. It is the same
				    camera as the 3D, so the swap is a fade, not a jump. */}
				<img
					className={styles.poster}
					src={POSTER_URL}
					alt='3D model bytu po rekonstrukci: kuchyně s obývákem, koupelna, ložnice, dětský pokoj a pracovna'
					width={1200}
					height={1000}
					fetchPriority='high'
				/>
				<canvas ref={canvasRef} className={styles.canvas} aria-hidden='true' />

				{status === 'poster' && (
					<button className={styles.explore} onClick={explore}>
						<Icon icon='ChevronsLeftRight' size={18} />
						Prozkoumat 3D model
					</button>
				)}
				{status === 'loading' && (
					<span className={styles.loading}>Načítám 3D model…</span>
				)}

				{ready &&
					heroRooms.map(r => (
						<button
							key={r.id}
							ref={markerRef(r.id)}
							className={cn(
								styles.marker,
								r.dotOnly && styles.dotOnly,
								(hovered === r.id || room?.id === r.id) && styles.active,
							)}
							onClick={() => openRoom(r)}
							{...hoverProps(r.id)}
						>
							<i aria-hidden='true' />
							<span>{r.label}</span>
						</button>
					))}

				<button
					ref={seamRef}
					className={styles.seam}
					aria-label='Posuňte hranici mezi původním stavem a rekonstrukcí'
					tabIndex={ready ? 0 : -1}
				>
					<Icon icon='ChevronsLeftRight' size={20} />
				</button>

				<div className={styles.bar}>
					{/* data-after slides the red segment from one state to the other. */}
					<div
						className={styles.toggle}
						role='group'
						aria-label='Stav bytu'
						data-after={after}
					>
						<button aria-pressed={!after} onClick={() => showState(false)}>
							Původní stav
						</button>
						<button aria-pressed={after} onClick={() => showState(true)}>
							Po rekonstrukci
						</button>
					</div>
					{/* The view's own controls, beside the toggle and only while the
					    model is being looked at or has been moved: on the frame's
					    right edge the zoom sat under the seam's grip, and at rest
					    they made the bar a configurator. */}
					<div className={styles.view}>
						<div className={styles.zoom}>
							<button aria-label='Oddálit' onClick={() => sceneRef.current?.zoom(1 / 0.75)}>
								<Icon icon='Minus' size={18} />
							</button>
							<button aria-label='Přiblížit' onClick={() => sceneRef.current?.zoom(0.75)}>
								<Icon icon='Plus' size={18} />
							</button>
						</div>
						<button className={styles.reset} aria-label='Zpět na celý byt' onClick={reset}>
							<Icon icon='Rotate3d' size={19} strokeWidth={1.6} />
						</button>
					</div>
				</div>

				<div className={cn(styles.card, room && ready && styles.open)} aria-live='polite'>
					{room && (
						<>
							{/* Closing the card goes back to the whole flat: left at
							    the room, half the markers were out of the frame and
							    the way back was a control that shows only on hover. */}
							<button className={styles.closeCard} aria-label='Zavřít' onClick={reset}>
								×
							</button>
							<h3>{room.title}</h3>
							<p>{room.text}</p>
							<ul className={styles.works}>
								{room.works.map(work => (
									<li key={work}>{work}</li>
								))}
							</ul>
							<div className={styles.actions}>
								<Link to={room.link.to}>{room.link.label} →</Link>
								<Link to={ROUTES.CONTACTS}>Chci podobnou</Link>
							</div>
						</>
					)}
				</div>

				{fullscreen && (
					<button
						className={styles.closeFull}
						aria-label='Zavřít 3D model'
						onClick={() => setFullscreen(false)}
					>
						×
					</button>
				)}
			</div>
		</div>
	);
};

export default ApartmentModel;
