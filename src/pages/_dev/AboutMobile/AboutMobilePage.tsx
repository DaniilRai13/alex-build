import Seo from '@/components/common/Seo/Seo';
import cn from 'classnames';
import type { FC } from 'react';
import styles from '../devPage.module.scss';
import AboutMobileVariant, { type MobileStyle } from './AboutMobileVariant';
import page from './AboutMobilePage.module.scss';

// Dev-only preview, wired up in App.tsx behind import.meta.env.DEV.

interface Variant {
	name: string;
	style: MobileStyle;
	note: string;
	plus: string;
	minus: string;
}

const variants: Variant[] = [
	{
		name: 'Как сейчас',
		style: 'now',
		note: 'Текст, цифры сеткой 2×2, кнопка, фото внизу во всю ширину.',
		plus: 'Ничего не надо менять.',
		minus: 'На 768px фото разрастается до 460px — выше всего текста над ним, и стоит в самом низу, куда долистывают немногие. На 390px фото терпимо, но подписи у цифр переносятся на две строки.',
	},
	{
		name: 'Фото сверху и ниже',
		style: 'photoTop',
		note: 'Фото открывает блок, пропорции 2:1 вместо 16:10.',
		plus: 'Работа видна сразу, а не после трёх экранов текста. Пропорции 2:1 экономят около 45px высоты.',
		minus: 'Отодвигает заголовок вниз. На телефоне человек и так пришёл с первого экрана с фотографией — второе подряд может быть лишним.',
	},
	{
		name: 'Цифры в одну колонку',
		style: 'statsList',
		note: 'Сетка 2×2 разворачивается в список из четырёх строк во всю ширину.',
		plus: 'Подписи перестают переноситься, каждая цифра читается с одного взгляда. Самая аккуратная типографика из семи.',
		minus: 'Четыре строки вместо двух — блок прибавляет около 60px.',
	},
	{
		name: 'Цифры плотнее, без колец',
		style: 'statsTight',
		note: 'Сетка 2×2 сохраняется, но иконки без красных кругов и мельче, шрифты чуть меньше.',
		plus: 'Экономит высоту, не ломая композицию. Иконки перестают спорить с кнопкой за красный цвет.',
		minus: 'Подписи всё ещё переносятся. Без кругов иконки теряются на фоне.',
	},
	{
		name: 'Фото баннером под заголовком',
		style: 'banner',
		note: 'Фото становится подложкой: надзаголовок и заголовок лежат поверх с затемнением, как в герое.',
		plus: 'Самый выигрышный по высоте — фото и заголовок занимают одно место. Приём уже есть на сайте, первый экран устроен так же.',
		minus: 'Второй затемнённый баннер подряд после героя. И заголовок белым поверх фото читается хуже, чем чёрным по бежевому.',
	},
	{
		name: 'Цифры прокруткой вбок',
		style: 'statsScroll',
		note: 'Четыре цифры в один ряд плашками с горизонтальной прокруткой, ряд уходит за край экрана.',
		plus: 'Экономит больше всего высоты — одна строка вместо двух рядов. Прокрутка вбок на сайте уже используется, в ленте портфолио на телефоне.',
		minus: 'Четвёртую цифру не увидят те, кто не догадается пролистать. Для «2 года гарантии» это плохое место.',
	},
	{
		name: 'Всё сжато',
		style: 'compact',
		note: 'Фото узкой полосой 21:9 сверху, цифры одной строкой в колонку, кнопка во всю ширину.',
		plus: 'Самый короткий блок из всех. Кнопка во всю ширину — попасть пальцем проще всего.',
		minus: 'Фото 21:9 почти ничего не показывает, от кухни останется полоса. Кандидат, если решим, что фото на телефоне не нужно вовсе.',
	},
];

const AboutMobilePage: FC = () => (
	<div className={styles.page}>
		<Seo
			title='Блок «О компании» на телефоне'
			description='Черновая страница для сравнения мобильных раскладок блока о компании. Не для публикации.'
			path='/about-mobile'
			noindex
		/>

		<header className={styles.intro}>
			<span className={styles.kicker}>черновик · не для публикации</span>
			<h1>Семь раскладок блока на телефоне</h1>
			<p>
				Каждая раскладка показана в двух рамках: <b>768px</b> — сама точка, на
				которой блок складывается в одну колонку, и <b>390px</b> — обычный
				телефон. Между ними блок ведёт себя по-разному, и смотреть надо оба
				края диапазона.
			</p>
			<p className={styles.warn}>
				Проблемы на двух ширинах разные. На <b>768px</b> места хватает всему,
				кроме фотографии: во всю ширину при 16:10 она вырастает до{' '}
				<b>460px</b> — это выше, чем весь текст над ней. На <b>390px</b> фото
				становится терпимым (224px), зато подписи у цифр перестают помещаться:
				на колонку остаётся около 170px, и «Dokončených projektů» и «záruka na
				veškeré práce» переносятся на две строки.
			</p>
		</header>

		{variants.map((variant, index) => (
			<section className={styles.variant} key={variant.name}>
				<div className={styles.head}>
					<span className={styles.num}>
						{String(index + 1).padStart(2, '0')}
					</span>
					<h2>{variant.name}</h2>
					<p>{variant.note}</p>
				</div>

				<div className={page.stage}>
					<div className={cn(page.frame, page.wide)}>
						<span className={page.caption}>768px — сама точка перелома</span>
						<div className={page.screen}>
							<AboutMobileVariant variant={variant.style} />
						</div>
					</div>

					<div className={cn(page.frame, page.narrow)}>
						<span className={page.caption}>390px — телефон</span>
						<div className={page.screen}>
							<AboutMobileVariant variant={variant.style} />
						</div>
					</div>
				</div>

				<dl className={styles.notes}>
					<div className={styles.plus}>
						<dt>Даёт</dt>
						<dd>{variant.plus}</dd>
					</div>
					<div className={styles.minus}>
						<dt>Риск</dt>
						<dd>{variant.minus}</dd>
					</div>
				</dl>
			</section>
		))}
	</div>
);

export default AboutMobilePage;
