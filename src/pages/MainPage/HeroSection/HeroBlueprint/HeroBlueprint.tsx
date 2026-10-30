import type { FC, ReactNode } from 'react';

// A drawing under the hero — the plan the renovation starts from. Drawn from
// the same numbers as the 3D model (3d/apartment/build_apartment.py), so the
// plan on paper is the flat standing on it. Plain SVG: sharp at any size, a
// few kilobytes, and in the prerendered HTML without any script.
//
// Lines only. It is a texture behind the model, not a drawing to read: the
// dimension chains, room names, grid bubbles and a second "window detail"
// sheet it used to carry were legible on a large screen and competed with
// the model standing on them.

// Full-strength ink: the hero shows the drawing at a few per cent opacity, so
// the lines are faint on the page while staying crisp.
const INK = '#4a423a';
const INK_SOFT = '#6e655b';
// Fills that must hide the lines behind them take the page's own colour.
const PAPER = '#eae7dc';

// The flat, in metres (x along the facade, y into the building).
const W = 10.8;
const D = 8;
const EXT = 0.3;
const WALLS: [number, number, number, number][] = [
	// x0, y0, x1, y1 — partitions of the renovated flat
	[3.6, 0, 3.6, D],
	[0, 3.9, 3.6, 3.9],
	[9.55, 3.9, W, 3.9],
	[0, 5.1, W, 5.1],
	[6.4, 5.1, 6.4, D],
];
// Door swings: hinge point, radius, start angle, sweep (degrees, SVG y down).
const DOORS: [number, number, number, number][] = [
	[3.35, 3.9, 0.8, 180],
	[3.35, 5.1, 0.8, 180],
	[6.25, 5.1, 0.8, 180],
	[7.0, 5.1, 0.8, 0],
];
const WINDOWS: [number, number, number, number][] = [
	[0.9, -EXT, 2.7, -EXT],
	[5.25, -EXT, 6.85, -EXT],
	[8.0, -EXT, 10.0, -EXT],
	[0.9, D + EXT, 2.7, D + EXT],
	[7.6, D + EXT, 9.8, D + EXT],
];

/**
 * A drawing laid on the page, slightly turned. No paper, no frame: the lines
 * sit straight on the hero's ground, so nothing reads as a card or a box.
 */
const Sheet: FC<{
	x: number;
	y: number;
	w: number;
	h: number;
	rotate: number;
	children: ReactNode;
}> = ({ x, y, w, h, rotate, children }) => (
	<g transform={`rotate(${rotate} ${x + w / 2} ${y + h / 2})`}>
		<g transform={`translate(${x} ${y})`}>{children}</g>
	</g>
);

/** Plan of the renovated flat at `s` px per metre, origin at the inner corner. */
const Plan: FC<{ s: number }> = ({ s }) => (
	<g>
		{/* Outer panel walls: two lines with the wall between them hatched. */}
		<path
			d={`M${-EXT * s} ${-EXT * s}h${(W + 2 * EXT) * s}v${(D + 2 * EXT) * s}h${-(W + 2 * EXT) * s}Z
			    M0 0v${D * s}h${W * s}v${-D * s}Z`}
			fill='url(#bp-hatch)'
			fillRule='evenodd'
			stroke={INK}
			strokeWidth={1.2}
		/>
		{WALLS.map(([x0, y0, x1, y1], i) => (
			<line
				key={i}
				x1={x0 * s}
				y1={y0 * s}
				x2={x1 * s}
				y2={y1 * s}
				stroke={INK}
				strokeWidth={0.12 * s}
				strokeLinecap='square'
				opacity={0.75}
			/>
		))}
		{WINDOWS.map(([x0, y0, x1], i) => (
			<g key={i} stroke={INK} strokeWidth={0.8}>
				<rect x={x0 * s} y={(y0 - EXT / 2) * s} width={(x1 - x0) * s} height={EXT * s} fill={PAPER} />
				<line x1={x0 * s} y1={y0 * s} x2={x1 * s} y2={y0 * s} />
			</g>
		))}
		{DOORS.map(([hx, hy, r, start], i) => {
			const a = (start * Math.PI) / 180;
			const b = a + Math.PI / 2;
			const x1 = hx + r * Math.cos(a);
			const y1 = hy + r * Math.sin(a);
			const x2 = hx + r * Math.cos(b);
			const y2 = hy + r * Math.sin(b);
			return (
				<g key={i} fill='none' stroke={INK} strokeWidth={0.7}>
					<line x1={hx * s} y1={hy * s} x2={x2 * s} y2={y2 * s} />
					<path
						d={`M${x1 * s} ${y1 * s}A${r * s} ${r * s} 0 0 1 ${x2 * s} ${y2 * s}`}
						strokeDasharray='3 2'
					/>
				</g>
			);
		})}
	</g>
);

interface IHeroBlueprint {
	className?: string;
}

const HeroBlueprint: FC<IHeroBlueprint> = ({ className }) => (
	<svg
		className={className}
		viewBox='0 0 1600 760'
		preserveAspectRatio='xMidYMid slice'
		aria-hidden='true'
		focusable='false'
	>
		<defs>
			<pattern id='bp-hatch' width='6' height='6' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'>
				<line x1='0' y1='0' x2='0' y2='6' stroke={INK_SOFT} strokeWidth={0.8} />
			</pattern>
		</defs>

		{/* One drawing: the plan, under the model. */}
		<Sheet x={700} y={90} w={900} h={690} rotate={-3}>
			<g transform='translate(170 150)'>
				<Plan s={52} />
			</g>
		</Sheet>
	</svg>
);

export default HeroBlueprint;
