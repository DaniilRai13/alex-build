import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// The hero apartment, outside React. The model comes from
// 3d/apartment/bake_export.py: every surface already carries its light, baked
// in Blender, so the page only paints textures — that is what lets it look
// like a render and still turn smoothly on a phone.
//
// Imported dynamically from ApartmentModel, so none of three.js reaches the
// prerendered HTML or delays the hero text.

export interface SceneElements {
	stage: HTMLElement;
	canvas: HTMLCanvasElement;
	/** Grip on the before/after seam. */
	seam: HTMLElement;
	/** Room markers by hotspot id; the scene keeps them pinned to the model. */
	markers: Map<string, HTMLElement>;
}

export interface SceneCallbacks {
	onReady: () => void;
	onError: (error: unknown) => void;
	/** The seam crossed the middle: true when most of the flat is renovated. */
	onStateChange: (after: boolean) => void;
	/**
	 * How far the view is from the overview. `closer`: zoomed in, slid along
	 * the floor or flown to a room. `moved`: that, or turned noticeably — any
	 * view the visitor may want a way back from.
	 */
	onViewChange: (view: { closer: boolean; moved: boolean }) => void;
}

export interface SceneOptions {
	modelUrl: string;
	dracoPath: string;
	/** Once loaded: one short camera move from the poster's view to the rest. */
	intro: boolean;
}

export interface ApartmentScene {
	showState: (after: boolean) => void;
	zoom: (factor: number) => void;
	reset: () => void;
	focus: (id: string) => void;
	/** Warms one room's floor; null clears it. */
	highlight: (id: string | null) => void;
	/** Fullscreen on a phone: every touch belongs to the model, none to the page. */
	setFullscreen: (on: boolean) => void;
	dispose: () => void;
}

// Blender (x, y, z) arrives as three (x, z, -y). The flat's middle:
const TARGET = new THREE.Vector3(5.4, 0.3, -3.3);
// START is the poster's camera, so the still and the first live frame match.
// The intro then settles a few degrees round and closer, at REST — the flat
// grows by about a tenth as it comes to rest.
const START = { azimuth: -0.42, polar: 0.78, distance: 28.5 };
const REST = { azimuth: -0.3, polar: 0.76, distance: 25.5 };
// How far the view may slide: the flat's footprint, so a room can be brought
// to the middle but the model can never be pushed off the canvas.
const BOUNDS = { x: [0.3, 10.5], z: [-7.8, 0.6] } as const;
// The seam runs along x, just past both ends of the model.
const SEAM = { min: -0.7, max: 11.5 };
const GLASS_OPACITY = 0.28;
// Vertical field of view in the hero's 6:5 frame (the poster's frame).
const FOV = 32;
const FRAME_ASPECT = 6 / 5;
// On a narrow screen the flat may fill more of the width than in the hero,
// where it shares the frame with the drawings round it.
const NARROW_FILL = 0.78;
// A room opened from its marker is flown to at this distance.
const ROOM_DISTANCE = 16;
// The strip along the frame's bottom that the toggle takes, in pixels.
const BAR_ZONE = 72;
// Room floors as [x0, x1, y0, y1] in Blender metres — the rooms of
// build_apartment.py, inside their walls.
const ROOMS: Record<string, [number, number, number, number]> = {
	Kuchyne: [3.69, 10.8, 0, 3.85],
	Koupelna: [3.69, 6.35, 5.15, 8.0],
	Loznice: [0, 3.51, 0, 3.85],
	Detsky: [0, 3.51, 5.15, 8.0],
	Pracovna: [6.45, 10.8, 5.15, 8.0],
};
const GLOW = { color: 0xf0ac72, opacity: 0.3 };

const easeInOut = (k: number) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2);
const easeOut = (k: number) => 1 - (1 - k) ** 3;

export function mountApartment(
	elements: SceneElements,
	callbacks: SceneCallbacks,
	options: SceneOptions,
): ApartmentScene {
	const { stage, canvas, seam: handle, markers } = elements;
	const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.NoToneMapping; // the bake already went through AgX
	renderer.localClippingEnabled = true;

	const scene = new THREE.Scene();
	// Only the props (plants, vases) are lit live; everything else is baked.
	scene.add(new THREE.HemisphereLight(0xfff4e6, 0xcfc4b2, 2.4));
	const sun = new THREE.DirectionalLight(0xffeedd, 1.6);
	sun.position.set(-6, 14, 8);
	scene.add(sun);

	const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 200);
	const place = (pose: typeof START, target = TARGET) =>
		camera.position
			.copy(target)
			.add(
				new THREE.Vector3().setFromSpherical(
					new THREE.Spherical(pose.distance, pose.polar, pose.azimuth),
				),
			);
	place(START);
	camera.lookAt(TARGET);

	const controls = new OrbitControls(camera, canvas);
	controls.target.copy(TARGET);
	controls.enableDamping = true;
	controls.dampingFactor = 0.08;
	controls.enablePan = true; // right button / two fingers
	controls.screenSpacePanning = false; // slide along the floor, not the screen
	controls.panSpeed = 0.9;
	controls.zoomToCursor = true;
	controls.minPolarAngle = 0.35; // never flat on the floor…
	controls.maxPolarAngle = 1.12; // …and never from underneath
	controls.minDistance = 7;
	controls.maxDistance = 34;
	controls.rotateSpeed = 0.6;
	// OrbitControls claims every touch gesture. Inline on the page, vertical
	// swipes go back to scrolling; fullscreen takes them all (setFullscreen).
	canvas.style.touchAction = 'pan-y';

	// ---- rendering only when something changed: a still model costs nothing,
	// and a laptop showing the hero does not spin its fans.
	let needsRender = true;
	const invalidate = () => {
		needsRender = true;
	};

	// The wheel belongs to the page: only Ctrl + wheel (and trackpad pinch,
	// which browsers report as Ctrl + wheel) reaches the model.
	const onWheel = (e: WheelEvent) => {
		if (!e.ctrlKey) e.stopImmediatePropagation();
	};
	canvas.addEventListener('wheel', onWheel, { capture: true });

	// The part of the frame a visitor can see. The hero lets the frame run
	// under the copy on the left (where the canvas is faded out) and past the
	// window on the right; markers and the seam's grip stay inside this span.
	let visibleLeft = 0;
	let visibleRight = 0;

	// How the flat sits in its frame comes from the page's CSS, which places
	// the poster the same way — one source for both, so the still and the live
	// model always match:
	//   --model-zoom   the flat's size against the frame (camera zoom)
	//   --model-lift   share of the frame's height it sits above the middle
	//   --model-shift  share of the width it moves left, to sit centred
	//   --model-inset  share of the width on the left that is faded out
	const cssNumber = (style: CSSStyleDeclaration, name: string, fallback: number) => {
		const value = parseFloat(style.getPropertyValue(name));
		return Number.isFinite(value) ? value : fallback;
	};

	const resize = () => {
		const { clientWidth: w, clientHeight: h } = stage;
		if (!w || !h) return;
		const style = getComputedStyle(stage);
		visibleLeft = w * cssNumber(style, '--model-inset', 0);
		visibleRight = Math.min(
			w,
			document.documentElement.clientWidth - stage.getBoundingClientRect().left,
		);
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		camera.zoom = cssNumber(style, '--model-zoom', 1);
		// Narrower than the 6:5 frame — a phone held upright, fullscreen — the
		// vertical field widens so the flat keeps its width on screen instead
		// of being cropped at the sides, and the flat may fill a little more of
		// that width the narrower the screen is.
		//
		// Both terms are continuous at 6:5. They used to switch on as soon as
		// the aspect dipped under 1.2, and a hero stage rounded to 784 × 654
		// (1.1988, at 1366 × 768) jumped a fifth closer, cropping the flat.
		const narrow = THREE.MathUtils.clamp(
			(FRAME_ASPECT - camera.aspect) / (FRAME_ASPECT - 0.5),
			0,
			1,
		);
		const fill = THREE.MathUtils.lerp(1, NARROW_FILL, narrow);
		camera.fov =
			camera.aspect < FRAME_ASPECT
				? THREE.MathUtils.radToDeg(
						2 *
							Math.atan(
								(Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * FRAME_ASPECT * fill) /
									camera.aspect,
							),
					)
				: FOV;
		// The whole picture moves; the camera itself does not, so the orbit,
		// the markers and the seam's raycasts all stay in step with it.
		camera.setViewOffset(
			w,
			h,
			w * cssNumber(style, '--model-shift', 0),
			h * cssNumber(style, '--model-lift', 0),
			w,
			h,
		); // updates the projection
		invalidate();
	};
	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(stage);
	// The frame can move without changing size (the window narrows, the
	// layout shifts it); the visible span has to follow.
	window.addEventListener('resize', resize);
	resize();

	// ---- before / after seam. Clipping planes cut both states along x: the
	// renovated flat on one side, the original on the other.
	const keepBefore = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
	const keepAfter = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
	const seamSheet = new THREE.Mesh(
		new THREE.PlaneGeometry(10.6, 2.5),
		new THREE.MeshBasicMaterial({
			color: 0xfff6ea,
			transparent: true,
			opacity: 0.32,
			depthWrite: false,
			side: THREE.DoubleSide,
		}),
	);
	seamSheet.rotation.y = Math.PI / 2;
	const seamEdge = new THREE.Mesh(
		new THREE.BoxGeometry(0.05, 0.05, 10.6),
		new THREE.MeshBasicMaterial({ color: 0xa1322e }),
	);
	scene.add(seamSheet, seamEdge);

	let seam = SEAM.max;
	let after = true;
	const setSeam = (x: number) => {
		seam = THREE.MathUtils.clamp(x, SEAM.min, SEAM.max);
		keepBefore.constant = -seam;
		keepAfter.constant = seam;
		seamSheet.position.set(seam, 1.25, -3.4);
		seamEdge.position.set(seam, 2.5, -3.4);
		const parked = seam <= SEAM.min + 0.3 || seam >= SEAM.max - 0.3;
		seamSheet.visible = seamEdge.visible = !parked;
		// Parked past an end of the flat, the grip is only a way in — the
		// page shows it while the pointer is on the model.
		if (handle.dataset.parked !== String(parked)) handle.dataset.parked = String(parked);
		const nowAfter = seam > (SEAM.min + SEAM.max) / 2;
		if (nowAfter !== after) {
			after = nowAfter;
			callbacks.onStateChange(after);
		}
		invalidate();
	};
	setSeam(SEAM.max);

	// ---- room glow: a warm sheet on each floor, faded in on hover.
	const glows = new Map<string, THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>();
	for (const [id, [x0, x1, y0, y1]] of Object.entries(ROOMS)) {
		const glow = new THREE.Mesh(
			new THREE.PlaneGeometry(x1 - x0, y1 - y0),
			new THREE.MeshBasicMaterial({
				color: GLOW.color,
				transparent: true,
				opacity: 0,
				depthWrite: false,
			}),
		);
		glow.rotation.x = -Math.PI / 2;
		glow.position.set((x0 + x1) / 2, 0.03, -(y0 + y1) / 2);
		glow.visible = false;
		glows.set(id, glow);
		scene.add(glow);
	}
	let lit: string | null = null;
	const fadeGlows = () => {
		let moving = false;
		for (const [id, glow] of glows) {
			const goal = id === lit ? GLOW.opacity : 0;
			const m = glow.material;
			m.opacity += (goal - m.opacity) * 0.18;
			if (Math.abs(goal - m.opacity) < 0.004) m.opacity = goal;
			else moving = true;
			glow.visible = m.opacity > 0;
		}
		return moving;
	};

	// ---- animations, all driven from the one render loop
	let seamAnim: ((now: number) => void) | null = null;
	let flight: ((now: number) => void) | null = null;
	let introTimer = 0;

	const sweepTo = (x: number, ms = 1600, done?: () => void) => {
		const from = seam;
		const t0 = performance.now();
		seamAnim = now => {
			const k = Math.min(1, (now - t0) / ms);
			setSeam(THREE.MathUtils.lerp(from, x, easeInOut(k)));
			if (k === 1) {
				seamAnim = null;
				done?.();
			}
		};
	};

	const stopIntro = () => window.clearTimeout(introTimer);

	const flyTo = (
		target: THREE.Vector3,
		distance: number,
		ms = 900,
		angles?: { azimuth: number; polar: number },
		ease = easeOut,
	) => {
		const fromTarget = controls.target.clone();
		const from = new THREE.Spherical().setFromVector3(
			camera.position.clone().sub(fromTarget),
		);
		const to = from.clone();
		to.radius = distance;
		if (angles) {
			to.theta = angles.azimuth;
			to.phi = angles.polar;
		}
		// Turn the short way round.
		while (to.theta - from.theta > Math.PI) to.theta -= 2 * Math.PI;
		while (from.theta - to.theta > Math.PI) to.theta += 2 * Math.PI;
		const t0 = performance.now();
		flight = now => {
			const k = Math.min(1, (now - t0) / ms);
			const e = ease(k);
			controls.target.lerpVectors(fromTarget, target, e);
			camera.position.copy(controls.target).add(
				new THREE.Vector3().setFromSpherical(
					new THREE.Spherical(
						THREE.MathUtils.lerp(from.radius, to.radius, e),
						THREE.MathUtils.lerp(from.phi, to.phi, e),
						THREE.MathUtils.lerp(from.theta, to.theta, e),
					),
				),
			);
			if (k === 1) flight = null;
		};
	};

	const onControlsStart = () => {
		stopIntro();
		flight = null;
	};
	controls.addEventListener('start', onControlsStart);
	controls.addEventListener('change', invalidate);

	// ---- dragging the seam, by its grip or by the line itself. The pointer
	// is cast onto level planes and the seam follows the x it lands on.
	const levels = [1.2, 2.5].map(h => new THREE.Plane(new THREE.Vector3(0, 1, 0), -h));
	const raycaster = new THREE.Raycaster();
	const hit = new THREE.Vector3();
	const pointer = new THREE.Vector2();
	const castX = (e: PointerEvent, level: THREE.Plane) => {
		const r = canvas.getBoundingClientRect();
		pointer.set(
			((e.clientX - r.left) / r.width) * 2 - 1,
			-((e.clientY - r.top) / r.height) * 2 + 1,
		);
		raycaster.setFromCamera(pointer, camera);
		return raycaster.ray.intersectPlane(level, hit) ? hit.x : null;
	};
	/** Is the pointer on the seam line? The line is 5 cm wide; the grab zone is not. */
	const nearSeam = (e: PointerEvent) =>
		seamSheet.visible &&
		levels.some(level => {
			const x = castX(e, level);
			return x !== null && Math.abs(x - seam) < 0.35;
		});

	let dragging: HTMLElement | null = null;
	const startDrag = (el: HTMLElement, e: PointerEvent) => {
		el.setPointerCapture(e.pointerId);
		dragging = el;
		controls.enabled = false;
		seamAnim = null;
		stopIntro();
		handle.dataset.dragging = 'true';
	};
	const onDragMove = (e: PointerEvent) => {
		if (!dragging?.hasPointerCapture(e.pointerId)) return;
		const x = castX(e, levels[0]);
		if (x !== null) setSeam(x);
	};
	const endDrag = () => {
		dragging = null;
		controls.enabled = true;
		delete handle.dataset.dragging;
	};
	const onHandleDown = (e: PointerEvent) => startDrag(handle, e);
	// Capture phase, so a press on the line never reaches OrbitControls.
	const onCanvasDown = (e: PointerEvent) => {
		if (!nearSeam(e)) return;
		e.stopImmediatePropagation();
		startDrag(canvas, e);
	};
	const onCanvasHover = (e: PointerEvent) => {
		if (dragging || e.buttons) return;
		canvas.style.cursor = nearSeam(e) ? 'ew-resize' : '';
	};
	handle.addEventListener('pointerdown', onHandleDown);
	canvas.addEventListener('pointerdown', onCanvasDown, { capture: true });
	canvas.addEventListener('pointermove', onCanvasHover);
	for (const el of [handle, canvas]) {
		el.addEventListener('pointermove', onDragMove);
		el.addEventListener('pointerup', endDrag);
		el.addEventListener('pointercancel', endDrag);
	}

	// ---- the model
	const anchors = new Map<string, THREE.Object3D>();
	const draco = new DRACOLoader().setDecoderPath(options.dracoPath);
	const loader = new GLTFLoader().setDRACOLoader(draco);
	let disposed = false;

	loader.load(
		options.modelUrl,
		gltf => {
			if (disposed) return;
			gltf.scene.traverse(node => {
				if (node.name.startsWith('HS_')) anchors.set(node.name.slice(3), node);
				if (!(node instanceof THREE.Mesh)) return;
				const src = node.material as THREE.MeshStandardMaterial;
				let material: THREE.Material;
				if (node.name.startsWith('Glass')) {
					material = new THREE.MeshBasicMaterial({
						color: 0xdfe8ea,
						transparent: true,
						opacity: GLASS_OPACITY,
						depthWrite: false,
					});
				} else if (node.name.startsWith('Props')) {
					// Plants and vases keep their own materials and take live light.
					// Cloned: both states share them, but each is clipped differently.
					material = src.clone();
					material.side = THREE.DoubleSide;
				} else if (node.name === 'Underlay') {
					// The hero lays its own drawing sheets under the model (HeroBlueprint);
					// the model's built-in sheet would print a second set of dimensions.
					node.visible = false;
					return;
				} else {
					const shadow = node.name === 'Shadow';
					material = new THREE.MeshBasicMaterial({
						map: src.map,
						transparent: shadow,
						depthWrite: !shadow,
					});
					if (shadow) node.renderOrder = -1;
				}
				if (/Before$/.test(node.name)) material.clippingPlanes = [keepBefore];
				if (/After$/.test(node.name)) material.clippingPlanes = [keepAfter];
				node.material = material;
			});
			scene.add(gltf.scene);
			invalidate();
			callbacks.onReady();

			if (reduced) {
				// No motion wanted: straight to where the intro would have ended.
				place(REST);
				invalidate();
			}
			if (!options.intro || reduced) return;
			// One short settle from the poster's view, and that is all. The
			// intro used to sweep the seam to "before" and back as well: nine
			// seconds of motion, and the first thing a visitor saw after the
			// renovated flat was the old brown one. The toggle under the model
			// says what the comparison is; the visitor starts it.
			introTimer = window.setTimeout(
				() => flyTo(TARGET.clone(), REST.distance, 1600, REST, easeInOut),
				200,
			);
		},
		undefined,
		error => {
			if (!disposed) callbacks.onError(error);
		},
	);

	// ---- per-frame placement of the HTML overlays
	const v = new THREE.Vector3();
	type Box = { x0: number; x1: number; y0: number; y1: number };
	const overlaps = (a: Box, b: Box) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
	const placeMarkers = (w: number, h: number) => {
		const shown: { el: HTMLElement; x: number; y: number; width: number; height: number }[] = [];
		for (const [id, el] of markers) {
			const node = anchors.get(id);
			if (!node) continue;
			node.getWorldPosition(v).project(camera);
			const x = (v.x * 0.5 + 0.5) * w;
			const y = (-v.y * 0.5 + 0.5) * h;
			// Markers that leave the visible frame when zoomed in are hidden, not
			// left hanging over the hero text or tangled with the toggle along
			// the bottom.
			const inside =
				x > visibleLeft + 12 &&
				x < visibleRight - 12 &&
				y > 12 &&
				y < h - BAR_ZONE &&
				v.z < 1;
			el.style.opacity = inside ? '1' : '0';
			el.style.pointerEvents = inside ? 'auto' : 'none';
			shown.push({ el, x, y, width: el.offsetWidth, height: el.offsetHeight });
		}
		// Each label opens to the right of its dot, unless that runs it off the
		// frame or onto a label already placed — then to the left (the dot stays
		// on the anchor). Left to right, so the left one gives way.
		const placed: Box[] = [];
		shown.sort((a, b) => a.x - b.x);
		for (const { el, x, y, width, height } of shown) {
			const right: Box = { x0: x - 11, x1: x - 11 + width, y0: y - 11, y1: y - 11 + height };
			const left: Box = { x0: x + 11 - width, x1: x + 11, y0: right.y0, y1: right.y1 };
			const offFrame = right.x1 > visibleRight - 8;
			const crowded = placed.some(box => overlaps(right, box));
			const flip =
				(offFrame || crowded) &&
				left.x0 > visibleLeft + 4 &&
				!placed.some(box => overlaps(left, box));
			if ((el.dataset.flip === 'true') !== flip) el.dataset.flip = String(flip);
			const box = flip ? left : right;
			placed.push(box);
			el.style.transform = `translate(${box.x0}px, ${box.y0}px)`;
		}
	};
	const placeHandle = (w: number, h: number) => {
		v.set(seam, 2.5, 1.2).project(camera);
		// Its centre at least 40px in from what can be seen: the 44px grip and
		// its shadow clear of the window's edge.
		const x = THREE.MathUtils.clamp(
			(v.x * 0.5 + 0.5) * w,
			visibleLeft + 40,
			Math.max(visibleLeft + 40, visibleRight - 40),
		);
		const y = THREE.MathUtils.clamp((-v.y * 0.5 + 0.5) * h, 24, h - 24);
		handle.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
	};

	// Closer than the overview: zoomed in, slid off the middle, or at a room.
	// Moved: closer, or turned well away from the overview's angle. The intro
	// counts as neither — it starts further out and only a few degrees round.
	let closer = false;
	let moved = false;
	const angle = new THREE.Spherical();
	const checkView = () => {
		angle.setFromVector3(v.copy(camera.position).sub(controls.target));
		const turn = angle.theta - REST.azimuth;
		const nowCloser =
			camera.position.distanceTo(controls.target) < REST.distance - 1 ||
			controls.target.distanceTo(TARGET) > 0.5;
		const nowMoved =
			nowCloser ||
			Math.abs(Math.atan2(Math.sin(turn), Math.cos(turn))) > 0.15 ||
			Math.abs(angle.phi - REST.polar) > 0.1;
		if (nowCloser !== closer || nowMoved !== moved) {
			closer = nowCloser;
			moved = nowMoved;
			callbacks.onViewChange({ closer, moved });
		}
	};

	const clampTarget = () => {
		const t = controls.target;
		const before = t.clone();
		t.x = THREE.MathUtils.clamp(t.x, BOUNDS.x[0], BOUNDS.x[1]);
		t.z = THREE.MathUtils.clamp(t.z, BOUNDS.z[0], BOUNDS.z[1]);
		t.y = TARGET.y;
		// Move the camera with the target so a clamped slide does not tilt it.
		camera.position.add(v.copy(t).sub(before));
	};

	let frame = 0;
	let running = false;
	const tick = (now: number) => {
		const animating = seamAnim !== null || flight !== null;
		seamAnim?.(now);
		flight?.(now);
		const glowing = fadeGlows();
		const moved = controls.update();
		clampTarget();
		if (animating || glowing || moved || needsRender) {
			needsRender = false;
			renderer.render(scene, camera);
			const { clientWidth: w, clientHeight: h } = stage;
			placeMarkers(w, h);
			placeHandle(w, h);
			checkView();
		}
		frame = requestAnimationFrame(tick);
	};
	const start = () => {
		if (running) return;
		running = true;
		needsRender = true;
		frame = requestAnimationFrame(tick);
	};
	const stop = () => {
		running = false;
		cancelAnimationFrame(frame);
	};
	// Scrolled out of view, the loop stops altogether.
	const visibility = new IntersectionObserver(([entry]) =>
		entry.isIntersecting ? start() : stop(),
	);
	visibility.observe(stage);
	start();

	return {
		showState(toAfter) {
			stopIntro();
			sweepTo(toAfter ? SEAM.max : SEAM.min);
		},
		zoom(factor) {
			stopIntro();
			const t = controls.target;
			const next = THREE.MathUtils.clamp(
				camera.position.distanceTo(t) * factor,
				controls.minDistance,
				controls.maxDistance,
			);
			flyTo(t.clone(), next, 350);
		},
		reset() {
			stopIntro();
			flyTo(TARGET.clone(), REST.distance, 900, REST);
		},
		focus(id) {
			const node = anchors.get(id);
			if (!node) return;
			const p = node.getWorldPosition(new THREE.Vector3());
			p.y = TARGET.y;
			stopIntro();
			flyTo(p, ROOM_DISTANCE, 1000, { azimuth: REST.azimuth, polar: 0.72 });
		},
		highlight(id) {
			lit = id;
		},
		setFullscreen(on) {
			canvas.style.touchAction = on ? 'none' : 'pan-y';
			invalidate();
		},
		dispose() {
			disposed = true;
			stopIntro();
			stop();
			visibility.disconnect();
			resizeObserver.disconnect();
			window.removeEventListener('resize', resize);
			canvas.removeEventListener('wheel', onWheel, { capture: true });
			canvas.removeEventListener('pointerdown', onCanvasDown, { capture: true });
			canvas.removeEventListener('pointermove', onCanvasHover);
			handle.removeEventListener('pointerdown', onHandleDown);
			for (const el of [handle, canvas]) {
				el.removeEventListener('pointermove', onDragMove);
				el.removeEventListener('pointerup', endDrag);
				el.removeEventListener('pointercancel', endDrag);
			}
			controls.removeEventListener('start', onControlsStart);
			controls.removeEventListener('change', invalidate);
			controls.dispose();
			draco.dispose();
			scene.traverse(node => {
				if (!(node instanceof THREE.Mesh)) return;
				node.geometry.dispose();
				const materials = Array.isArray(node.material) ? node.material : [node.material];
				for (const m of materials) {
					(m as THREE.MeshBasicMaterial).map?.dispose();
					m.dispose();
				}
			});
			renderer.dispose();
		},
	};
}
