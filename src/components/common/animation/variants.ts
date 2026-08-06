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
const navVariants: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const menuVariants: Variants = {
	hidden: { opacity: 0, y: -40, scale: 0.98 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: 'spring',
			duration: 0.5,
			bounce: 0.35,
		},
	},
	exit: {
		y: -40,
		opacity: 0,
		scale: 0.97,
		transition: { duration: 0.3, ease: 'easeInOut' },
	},
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
	navVariants,
	menuVariants,
	overlayVariants,
	navItemVariants
};
