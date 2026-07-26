import type { IPortfolioProject } from '@/types/portfolio.interface';

import main from '@/assets/portfolio/project1/main.jpg';
import after1 from '@/assets/portfolio/project1/after1.jpg';
import after2 from '@/assets/portfolio/project1/after2.jpg';
import after3 from '@/assets/portfolio/project1/after3.jpg';
import after4 from '@/assets/portfolio/project1/after4.jpg';
import after5 from '@/assets/portfolio/project1/after5.jpg';
import before1 from '@/assets/portfolio/project1/before1.jpg';
import before2 from '@/assets/portfolio/project1/before2.jpg';
import before3 from '@/assets/portfolio/project1/before3.jpg';
import before4 from '@/assets/portfolio/project1/before4.jpg';

export const portfolioData: IPortfolioProject[] = [
	{
		id: 1,
		slug: 'rekonstrukce-paneloveho-bytu',

		title: 'Rekonstrukce panelového bytu',

		description:
			'Kompletní rekonstrukce panelového bytu na klíč. Byt jsme rozebrali až ' +
			'na nosné konstrukce – demontáž původních příček, podlah i rozvodů. ' +
			'Postavili jsme nové příčky z pórobetonu, provedli nové elektroinstalace ' +
			'a rozvody vody, vyrovnali podlahy a položili velkoformátovou dlažbu v ' +
			'dekoru dřeva. Výsledkem je světlý moderní interiér: kuchyně kombinující ' +
			'bílý lesk s dubem a keramickým obkladem, obývací část s jídelním koutem, ' +
			'klidná ložnice a koupelna s mramorovým dekorem Calacatta. Vše s důrazem ' +
			'na kvalitní řemeslné zpracování a detail.',

		category: 'renovation',
		categoryLabel: 'Rekonstrukce',

		location: 'Teplice',
		area: 40,
		year: 2025,

		preview: main,

		images: [
			main,
			after1,
			after2,
			after3,
			after4,
			after5,
			before1,
			before2,
			before3,
			before4,
		],
	},
];
