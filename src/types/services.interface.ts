import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';

export interface IService {
	id: number;
	title: string;
	description: string;
	icon: IconNames;
	features: string[];
	buttonText: string;
	img?: string;
}
