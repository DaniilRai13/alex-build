import {
	ArrowLeft,
	ArrowUpRight,
	BrickWall,
	Building2,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	CircleCheck,
	CircleX,
	Clock,
	Drill,
	House,
	Image,
	Info,
	Mail,
	MapPin,
	Menu,
	PaintRoller,
	PencilRuler,
	Phone,
	RotateCcw,
	X,
	type LucideIcon,
	type LucideProps,
} from 'lucide-react';
import type { FC } from 'react';

// Registr jen skutečně použitých ikon – aby se do bundlu nedostal celý lucide.
const iconMap = {
	ArrowLeft,
	ArrowUpRight,
	BrickWall,
	Building2,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	CircleCheck,
	CircleX,
	Clock,
	Drill,
	House,
	Image,
	Info,
	Mail,
	MapPin,
	Menu,
	PaintRoller,
	PencilRuler,
	Phone,
	RotateCcw,
	X,
} satisfies Record<string, LucideIcon>;

export type IconNames = keyof typeof iconMap;

type IconProps = { icon: IconNames } & LucideProps;

export const Icon: FC<IconProps> = ({ icon, size, ...props }) => {
	const LucideIcon = iconMap[icon];

	return <LucideIcon {...props} size={size} />;
};
