import type { IProcessStep } from '@/types/contactInfo.interface';

export const workStepsData: IProcessStep[] = [
	{
		id: 1,
		title: 'Poptávka',
		description: 'Zanecháte poptávku na webu nebo nás kontaktujete.',
	},
	{
		id: 2,
		title: 'Diskuze',
		description: 'Upřesníme úkoly, přání a rozpočet projektu.',
	},
	{
		id: 3,
		title: 'Obchodní nabídka',
		description: 'Připravíme řešení a dohodneme podrobnosti.',
	},
	{
		id: 4,
		title: 'Realizace',
		description: 'Pustíme se do práce a doprovázíme projekt až do předání.',
	},
];
