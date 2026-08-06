import type { Transition } from 'framer-motion';

const defaultTransition: Transition = {
	duration: 0.6,
	delay:0.3,
	ease: [0.22, 1, 0.36, 1],
};

const slowTransition: Transition = {
	duration: 0.9,
	delay:0.3,
	ease: [0.22, 1, 0.36, 1],
};

export const animationTransition = {
	defaultTransition,
	slowTransition,
};
