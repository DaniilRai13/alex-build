import Seo from '@/components/common/Seo/Seo';
import type { FC } from 'react';
import styles from '../devPage.module.scss';
import page from './AboutPhoto.module.scss';

// Dev-only preview, wired up in App.tsx behind import.meta.env.DEV.

const shots = import.meta.glob(
	'../../../assets/portfolio-remote/**/*.jpg',
	{ eager: true, import: 'default' },
) as Record<string, string>;

/** 'slug/file.jpg' -> the built URL, or undefined if the download is missing. */
const shot = (ref: string) =>
	Object.entries(shots).find(([path]) => path.endsWith(`/${ref}`))?.[1];

interface Candidate {
	ref: string;
	name: string;
	shape: 'альбомный' | 'портретный';
	note: string;
}

const candidates: Candidate[] = [
	{
		ref: 'rekonstrukce-bytu-moderni-kuchyne/main.jpg',
		name: 'Современная кухня, общий план',
		shape: 'альбомный',
		note: '2000×1125, 16:9. Единственный по-настоящему широкий кадр во всём портфолио, который ещё не занят лентой. В полосу 21:9 ложится почти без потерь.',
	},
	{
		ref: 'rekonstrukce-bytu-moderni-kuchyne/2.jpg',
		name: 'Та же кухня, второй ракурс',
		shape: 'альбомный',
		note: '2000×1500, 4:3. Второй и последний свободный альбомный кадр. В полосу режется заметнее, но всё ещё терпимо.',
	},
	{
		ref: 'rekonstrukce-bytu-zelena-kuchyne/main.jpg',
		name: 'Зелёная кухня — сейчас на сайте',
		shape: 'портретный',
		note: '1920×2560. Стоит в блоке сегодня. В полосе 21:9 от кадра остаётся горизонтальная нарезка примерно в треть высоты.',
	},
	{
		ref: 'rekonstrukce-bytu-radova-kuchyne/main.jpg',
		name: 'Кухня в рядовом доме',
		shape: 'портретный',
		note: '1920×2560. Та же проблема с обрезкой, но композиция другая — возможно, переживёт кроп лучше.',
	},
	{
		ref: 'rekonstrukce-bytu-panelak/main.jpg',
		name: 'Панельный дом, интерьер',
		shape: 'портретный',
		note: '1500×2000. Самый «типичный» объект для Теплиц — панелька, то есть ровно то, что заказывают чаще всего.',
	},
	{
		ref: 'rekonstrukce-bytu-zelena-kuchyne/3.jpg',
		name: 'Зелёная кухня, другой ракурс',
		shape: 'портретный',
		note: 'Не обложка, а кадр из галереи проекта. Иногда внутри галереи находится вид удачнее заглавного.',
	},
	{
		ref: 'zatepleni-fasady-panelaku/main.jpg',
		name: 'Фасад в лесах',
		shape: 'портретный',
		note: 'Стоял в блоке до зелёной кухни. Показан, чтобы было видно, почему убрали: стройка в процессе, а не результат.',
	},
];

const AboutPhotoPage: FC = () => (
	<div className={styles.page}>
		<Seo
			title='Фото для блока о компании'
			description='Черновая страница для выбора фотографии из портфолио. Не для публикации.'
			path='/about-photo'
			noindex
		/>

		<header className={styles.intro}>
			<span className={styles.kicker}>черновик · не для публикации</span>
			<h1>Семь кадров из портфолио</h1>
			<p>
				Раскладка та же, что на сайте: на телефоне полоса 21:9 сверху, на
				десктопе колонка 10:9. Слева видно, как кадр ложится в полосу, справа —
				как в колонку.
			</p>
			<p className={styles.warn}>
				Сначала то, что выяснилось при проверке: <b>из 80 снимков портфолио
				альбомных всего три</b>, и один из них уже занят лентой ниже. Остальные
				77 — вертикальные телефонные кадры. Полоса 21:9 вырезает из такого
				снимка горизонтальную ленту примерно в треть высоты — именно поэтому от
				фасадного объекта оставалась одна сетка лесов.
			</p>
			<p>
				То есть выбор здесь не только между кадрами. Если ни один портретный не
				переживает обрезку, вариантов два: взять альбомный (первые два), либо
				поменять форму на телефоне — например на 3:2, тогда портретные кадры
				режутся вдвое мягче, но блок прибавит около 90px высоты.
			</p>
		</header>

		{candidates.map((candidate, index) => {
			const src = shot(candidate.ref);

			return (
				<section className={styles.variant} key={candidate.ref}>
					<div className={styles.head}>
						<span className={styles.num}>
							{String(index + 1).padStart(2, '0')}
						</span>
						<h2>
							{candidate.name}{' '}
							<small
								className={
									candidate.shape === 'альбомный' ? page.good : page.warnTag
								}
							>
								— {candidate.shape}
							</small>
						</h2>
						<p>{candidate.note}</p>
					</div>

					{src ? (
						<div className={page.stage}>
							<div className={page.col}>
								<span className={page.caption}>телефон — полоса 21:9</span>
								<img className={page.band} src={src} alt='' loading='lazy' />
							</div>

							<div className={page.col}>
								<span className={page.caption}>десктоп — колонка 10:9</span>
								<img className={page.deskPhoto} src={src} alt='' loading='lazy' />
							</div>
						</div>
					) : (
						<p className={page.missing}>
							Файл {candidate.ref} не найден — запусти{' '}
							<code>npm run portfolio:fetch</code>.
						</p>
					)}
				</section>
			);
		})}
	</div>
);

export default AboutPhotoPage;
