import type { IService } from '@/types/services.interface';
import designImg from '@/assets/services/design.png';
import majorImg from '@/assets/services/majorRenovation.png';
import cosmeticImg from '@/assets/services/cosmetic.png';
import turnkey from '@/assets/services/turnkey.png';

export const services: IService[] = [
	{
		id: 1,
		title: 'Kompletní rekonstrukce',
		description:
			'Rekonstrukce bytů a domů od demolice až po finální dokončení – vše potřebné pod jednou střechou a s důrazem na kvalitu provedení.',
		icon: 'Drill',
		buttonText: 'Více informací',
		features: [
			'Demoliční práce',
			'Elektro a instalatérství',
			'Stěny, podlahy a dveře',
			'Zateplení a střecha',
			'Ostatní stavební práce',
		],
		img: majorImg,
	},
	{
		id: 2,
		title: 'Kosmetické úpravy',
		description:
			'Rychlé a efektivní obnovení interiéru bez rozsáhlých stavebních zásahů. Ideální pro přípravu bytu k pronájmu i zvýšení jeho hodnoty.',
		icon: 'PaintRoller',
		buttonText: 'Více informací',
		features: [
			'Úpravy stěn',
			'Výměna podlahových krytin',
			'Osvětlení',
			'Úpravy v koupelně',
		],
		img: cosmeticImg,
	},
	{
		id: 3,
		title: 'Stavební & řemeslné práce',
		description:
			'Stavební a řemeslné práce od základů přes hrubou stavbu a omítky až po fasády.',
		icon: 'BrickWall',
		buttonText: 'Více informací',
		features: ['Základy', 'Hrubá stavba', 'Omítky', 'Fasády'],
		img: turnkey,
	},
	{
		id: 4,
		title: 'Návrhy & vizualizace',
		description:
			'Promyšlený návrh prostoru s vizualizacemi a kompletní projektovou dokumentací.',
		icon: 'PencilRuler',
		buttonText: 'Více informací',
		features: [
			'Dispoziční řešení',
			'Vizualizace',
			'Projektová dokumentace',
			'Výběr správného materiálu',
		],
		img: designImg,
	},
];
