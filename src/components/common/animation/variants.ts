import type { Variants } from 'framer-motion';

const container: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const fadeLeft: Variants = {
	hidden: {
		opacity: 0,
		x: -80,
	},
	visible: {
		opacity: 1,
		x: 0,
	},
};

const fadeRight: Variants = {
	hidden: {
		opacity: 0,
		x: 80,
	},
	visible: {
		opacity: 1,
		x: 0,
	},
};

const fadeUp: Variants = {
	hidden: {
		opacity: 0,
		y: 60,
	},
	visible: {
		opacity: 1,
		y: 0,
	},
};

const fadeDown: Variants = {
	hidden: {
		opacity: 0,
		y: -60,
	},
	visible: {
		opacity: 1,
		y: 0,
	},
};

const scaleIn: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.9,
	},
	visible: {
		opacity: 1,
		scale: 1,
	},
};
// The mobile menu slides in from the right edge, over the dimmed page.
const drawerVariants: Variants = {
	hidden: { x: '100%' },
	visible: { x: 0, transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } },
	exit: { x: '100%', transition: { duration: 0.25, ease: 'easeIn' } },
};

const overlayVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.2 } },
	exit: { opacity: 0, transition: { duration: 0.2 } },
};

const navItemVariants: Variants = {
	hidden: { opacity: 0, y: 15 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export const animations = {
	container,
	fadeLeft,
	fadeRight,
	fadeUp,
	fadeDown,
	scaleIn,
	drawerVariants,
	overlayVariants,
	navItemVariants
};
