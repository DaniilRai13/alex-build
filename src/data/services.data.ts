import type { IService } from '@/types/services.interface';
import designImg from '@/assets/services/design.png';
import majorImg from '@/assets/services/majorRenovation.png';
import cosmeticImg from '@/assets/services/cosmetic.png';
import turnkey from '@/assets/services/turnkey.png';
import flooringInstall from '@/assets/services/flooringInstall.png';
import plumbing from '@/assets/services/plumbing.png';
export const services: IService[] = [
	{
		id: 1,
		title: 'Návrh interiéru',
		description:
			'Navrhujeme moderní a funkční interiéry, které odrážejí váš životní styl a vytvářejí příjemné prostředí pro každodenní život.',
		icon: 'Brush',
		buttonText: 'Více informací',
		features: [
			'Dispoziční řešení',
			'3D vizualizace',
			'Projektová dokumentace',
			'Výběr materiálů',
			'Autorský dozor',
		],
		img: designImg,
	},
	{
		id: 2,
		title: 'Kompletní rekonstrukce',
		description:
			'Komplexní rekonstrukce bytů a domů od demolice až po finální dokončení s důrazem na kvalitu provedení.',
		icon: 'Hammer',
		buttonText: 'Více informací',
		features: [
			'Demoliční práce',
			'Elektroinstalace a rozvody',
			'Vyrovnání stěn a podlah',
			'Dokončovací práce',
			'Kontrola kvality',
		],
		img: majorImg,
	},
	{
		id: 3,
		title: 'Kosmetická rekonstrukce',
		description:
			'Rychlé a efektivní obnovení interiéru bez rozsáhlých stavebních zásahů.',
		icon: 'Paintbrush',
		buttonText: 'Více informací',
		features: [
			'Malování stěn',
			'Tapetování',
			'Výměna podlahových krytin',
			'Montáž lišt',
			'Instalace osvětlení',
		],
		img: cosmeticImg,
	},
	{
		id: 4,
		title: 'Rekonstrukce na klíč',
		description:
			'Postaráme se o celý průběh rekonstrukce – od návrhu přes realizaci až po předání hotového interiéru.',
		icon: 'House',
		buttonText: 'Více informací',
		features: [
			'Návrh projektu',
			'Nákup materiálů',
			'Kompletní realizace',
			'Koordinace prací',
			'Předání hotového díla',
		],
		img: turnkey,
	},
	{
		id: 5,
		title: 'Pokládka podlah',
		description:
			'Profesionální pokládka všech typů podlahových krytin s důrazem na precizní provedení.',
		icon: 'LayoutGrid',
		buttonText: 'Více informací',
		features: [
			'Laminátové podlahy',
			'Dřevěné podlahy',
			'Vinylové podlahy',
			'Dlažba a obklady',
			'Podlahové vytápění',
		],
		img: flooringInstall,
	},
	{
		id: 6,
		title: 'Instalatérské práce',
		description:
			'Montáž a modernizace vodovodních a kanalizačních rozvodů včetně instalace sanitární techniky.',
		icon: 'Wrench',
		buttonText: 'Více informací',
		features: [
			'Rozvody vody',
			'Montáž sanitární techniky',
			'Instalace WC a umyvadel',
			'Připojení spotřebičů',
			'Kontrola těsnosti systému',
		],
		img: plumbing,
	},
];

// // services.ts

// import type { LucideIcon } from 'lucide-react';
// import {
// 	Brush,
// 	Hammer,
// 	Home,
// 	Paintbrush2,
// 	Ruler,
// 	LayoutGrid,
// } from 'lucide-react';

// export interface Service {
// 	id: number;
// 	title: string;
// 	description: string;
// 	icon: LucideIcon;
// 	features: string[];
// 	buttonText: string;
// }

// export const services: Service[] = [
// 	{
// 		id: 1,
// 		title: 'Дизайн интерьера',
// 		description:
// 			'Создаем современные и функциональные интерьеры, которые отражают ваш стиль жизни и делают пространство максимально комфортным.',
// 		icon: Brush,
// 		buttonText: 'Подробнее',
// 		features: [
// 			'Планировочное решение',
// 			'3D-визуализация',
// 			'Рабочая документация',
// 			'Подбор материалов',
// 			'Авторский надзор',
// 		],
// 	},
// 	{
// 		id: 2,
// 		title: 'Капитальный ремонт',
// 		description:
// 			'Полный комплекс строительных и отделочных работ с заменой инженерных коммуникаций и современными технологиями.',
// 		icon: Hammer,
// 		buttonText: 'Подробнее',
// 		features: [
// 			'Демонтаж помещений',
// 			'Замена электрики и сантехники',
// 			'Выравнивание стен и пола',
// 			'Чистовая отделка',
// 			'Контроль качества',
// 		],
// 	},
// 	{
// 		id: 3,
// 		title: 'Косметический ремонт',
// 		description:
// 			'Быстрое обновление интерьера без масштабной перепланировки и сложных строительных работ.',
// 		icon: Paintbrush2,
// 		buttonText: 'Подробнее',
// 		features: [
// 			'Покраска стен',
// 			'Поклейка обоев',
// 			'Замена покрытий',
// 			'Монтаж плинтусов',
// 			'Установка освещения',
// 		],
// 	},
// 	{
// 		id: 4,
// 		title: 'Ремонт под ключ',
// 		description:
// 			'Полностью берем на себя все этапы ремонта — от проекта и закупки материалов до финальной уборки.',
// 		icon: Home,
// 		buttonText: 'Подробнее',
// 		features: [
// 			'Разработка проекта',
// 			'Закупка материалов',
// 			'Полный цикл работ',
// 			'Контроль сроков',
// 			'Сдача готового объекта',
// 		],
// 	},
// 	{
// 		id: 5,
// 		title: 'Укладка напольных покрытий',
// 		description:
// 			'Профессиональный монтаж любых видов напольных покрытий с соблюдением технологии укладки.',
// 		icon: LayoutGrid,
// 		buttonText: 'Подробнее',
// 		features: [
// 			'Ламинат',
// 			'Паркетная доска',
// 			'Кварц-винил',
// 			'Керамогранит',
// 			'Монтаж теплого пола',
// 		],
// 	},
// 	{
// 		id: 6,
// 		title: 'Сантехнические работы',
// 		description:
// 			'Монтаж и замена инженерных коммуникаций для надежной и долговечной эксплуатации квартиры.',
// 		icon: Ruler,
// 		buttonText: 'Подробнее',
// 		features: [
// 			'Разводка труб',
// 			'Установка сантехники',
// 			'Монтаж инсталляций',
// 			'Подключение бытовой техники',
// 			'Проверка герметичности',
// 		],
// 	},
// ];
