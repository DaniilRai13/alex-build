import Seo from '@/components/common/Seo/Seo';
import { useEffect, type CSSProperties, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from '../devPage.module.scss';
import ServicesOverview from '@/pages/ServicesPage/ServicesOverview/ServicesOverview';
import page from './ServicesFeaturedPage.module.scss';

// Dev-only preview, wired up in App.tsx behind import.meta.env.DEV.

const PATH = '/services-featured';

// The widths the layout changes at: phone (one column, strip), tablet (strip,
// sketch behind the copy), small laptop (three columns, tightest).
const frames = [
	{ label: 'Телефон', w: 390, h: 844, scale: 0.75 },
	{ label: 'Планшет', w: 768, h: 1024, scale: 0.48 },
	{ label: 'Ноутбук', w: 1024, h: 768, scale: 0.45 },
];

// Measured in Edge on 31 Oct. Variant 05 was measured on /services-all, whose
// page adds its own 1rem gutter, so it ran 32px narrower — a few lines taller
// on a phone, nowhere near the difference the layout makes.
const heights = [
	{ screen: 'Телефон 390', before: 1779, after: 791 },
	{ screen: 'Планшет 768', before: 1529, after: 957 },
	{ screen: 'Ноутбук 1024', before: 856, after: 747 },
	{ screen: 'Окно 1568', before: 815, after: 699 },
];

const ServicesFeaturedPage: FC = () => {
	const [params] = useSearchParams();
	const isFrame = params.has('frame');

	// Inside a frame a scrollbar would eat 15px of a 390px "phone".
	useEffect(() => {
		if (!isFrame) return;
		document.documentElement.style.scrollbarWidth = 'none';
		return () => {
			document.documentElement.style.scrollbarWidth = '';
		};
	}, [isFrame]);

	const seo = (
		<Seo
			title='Услуги: главная + три'
			description='Черновая страница: вариант 05 со всех услуг, доработанный под разные экраны. Не для публикации.'
			path={PATH}
			noindex
		/>
	);

	if (isFrame) {
		return (
			<div className={page.bare}>
				{seo}
				<ServicesOverview />
			</div>
		);
	}

	return (
		<div className={styles.page}>
			{seo}

			<div className={styles.intro}>
				<span className={styles.kicker}>Черновик</span>
				<h1>Вариант 05, доработанный</h1>
				<p>
					Kompletní rekonstrukce — тёмной панелью, три остальные услуги —
					компактными карточками. Где три в ряд не помещаются, карточки
					становятся каруселью.
				</p>
			</div>

			<section className={page.live}>
				<div className={page.sectionHead}>
					<h2>На этом экране</h2>
					<p>
						Живой блок на ширине вашего окна. Сузьте окно — раскладка меняется
						на 950px и 640px.
					</p>
				</div>
				<ServicesOverview headingAs='h3' />
			</section>

			<section>
				<div className={page.sectionHead}>
					<h2>На других экранах</h2>
					<p>
						Настоящие окна нужного размера, уменьшенные, чтобы поместились
						рядом. Внутри можно листать и нажимать точки.
					</p>
				</div>

				<div className={page.frames}>
					{frames.map(frame => (
						<figure key={frame.w} className={page.frame}>
							<div
								className={page.screen}
								style={
									{
										'--w': frame.w,
										'--h': frame.h,
										'--s': frame.scale,
									} as CSSProperties
								}
							>
								<iframe
									src={`${PATH}?frame`}
									title={`${frame.label} ${frame.w}×${frame.h}`}
									loading='lazy'
								/>
							</div>
							<figcaption className={page.caption}>
								<span>
									<b>{frame.label}</b> {frame.w}×{frame.h}
								</span>
								{/* A window of the frame's own size: a plain new tab would
								    show the frame at full desktop width. */}
								<a
									href={`${PATH}?frame`}
									onClick={event => {
										event.preventDefault();
										window.open(
											`${PATH}?frame`,
											`frame-${frame.w}`,
											`popup,width=${frame.w},height=${frame.h}`,
										);
									}}
								>
									открыть окном
								</a>
							</figcaption>
						</figure>
					))}
				</div>
			</section>

			<section>
				<div className={page.sectionHead}>
					<h2>Что изменилось против варианта 05</h2>
				</div>

				<ul className={page.changes}>
					<li>
						<b>Иконка рядом с названием</b>, а не над ним — у тёмной панели
						тоже, для единообразия. Отступы и шрифты у карточек плотнее.
					</li>
					<li>
						<b>Телефон, до 640px — карусель.</b> Видно край следующей карточки,
						это и есть подсказка «листай». Точки внизу показывают, где вы, и
						листают по нажатию. Карусель на чистом CSS: все три карточки
						остаются в HTML, для Google страница та же.
					</li>
					<li>
						<b>Планшет, 641–950px — карточки на боку.</b> Слева название,
						описание и ссылка, справа пункты; три карточки стопкой. Карусель
						здесь пробовал: на 768px видно две карточки и треть третьей,
						листать почти некуда, а средняя точка недостижима.
					</li>
					<li>
						<b>Тёмная панель.</b> На планшете эскиз уходит бледно за текст
						вместо пустого тёмного поля справа. На телефоне эскиз убран, пункты
						в одну колонку, кнопка во всю ширину.
					</li>
				</ul>

				<table className={page.table}>
					<thead>
						<tr>
							<th>Высота блока</th>
							<th>Вариант 05</th>
							<th>Доработанный</th>
						</tr>
					</thead>
					<tbody>
						{heights.map(row => (
							<tr key={row.screen}>
								<td>{row.screen}</td>
								<td>{row.before}px</td>
								<td>{row.after}px</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</div>
	);
};

export default ServicesFeaturedPage;
