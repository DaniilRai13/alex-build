import Seo from '@/components/common/Seo/Seo';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { projectPath } from '@/config/routes';
import { aboutProject } from '@/data/portfolio/portfolio.data';
import cn from 'classnames';
import type { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from '../devPage.module.scss';
import page from './AboutCaption.module.scss';

// Dev-only preview, wired up in App.tsx behind import.meta.env.DEV.

const p = aboutProject;
const META = `${p.location} · ${p.area} m² · ${p.year}`;

/** The photo at both shapes the block uses, with whatever overlay on top. */
const Shot: FC<{ children?: ReactNode; className?: string }> = ({
	children,
	className,
}) => (
	<div className={page.stage}>
		<div className={page.col}>
			<span className={page.caption}>десктоп — 10:9</span>
			<figure className={cn(page.frame, page.desk, className)}>
				<img src={p.preview.src} alt='' loading='lazy' />
				{children}
			</figure>
		</div>

		<div className={page.col}>
			<span className={page.caption}>телефон — полоса 21:9</span>
			<figure className={cn(page.frame, page.band, className)}>
				<img src={p.preview.src} alt='' loading='lazy' />
				{children}
			</figure>
		</div>
	</div>
);

interface Variant {
	name: string;
	note: string;
	plus: string;
	minus: string;
	render: ReactNode;
}

const variants: Variant[] = [
	{
		name: 'Подпись на градиенте снизу',
		note: 'Название объекта и данные под ним, поверх затемнения от прозрачного к чёрному.',
		plus: 'Самый привычный приём, фото почти не теряется. Город, площадь и год — это доказательство, а не украшение.',
		minus: 'На светлой части кадра градиент всё равно приходится делать плотным, иначе текст тонет.',
		render: (
			<figcaption className={cn(page.overlay, page.gradient)}>
				<b>{p.title}</b>
				<span>{META}</span>
			</figcaption>
		),
	},
	{
		name: 'Сплошная плашка снизу',
		note: 'Та же подпись, но на непрозрачной тёмной полосе, а не на градиенте.',
		plus: 'Читается при любом кадре — от фотографии ничего не зависит. Самый надёжный вариант.',
		minus: 'Полоса съедает нижнюю часть снимка целиком. На полосе 21:9 это заметная доля кадра.',
		render: (
			<figcaption className={cn(page.overlay, page.solid)}>
				<b>{p.title}</b>
				<span>{META}</span>
			</figcaption>
		),
	},
	{
		name: 'Бейдж в углу',
		note: 'Только город и год, маленькой плашкой в верхнем углу.',
		plus: 'Минимум перекрытия — фотографию видно целиком. Город на виду, а это тот самый гео-сигнал.',
		minus: 'Не говорит, что это за объект. Для доказательства маловато.',
		render: (
			<figcaption className={cn(page.overlay, page.badge)}>
				<Icon icon='MapPin' size={14} />
				{p.location} · {p.year}
			</figcaption>
		),
	},
	{
		name: 'Подпись со ссылкой на проект',
		note: 'Как первый вариант, но вся карточка — ссылка на страницу объекта, со стрелкой.',
		plus: 'Единственный, который что-то даёт поиску: ссылка с главной на страницу проекта с названием в тексте. Сейчас таких связей нет — блок услуг и портфолио соединены только подвалом.',
		minus: 'Фотография становится кликабельной, а рядом уже есть кнопка «Zobrazit realizace» — два действия рядом конкурируют.',
		render: (
			<Link className={page.link} to={projectPath(p.slug)}>
				<figcaption className={cn(page.overlay, page.gradient)}>
					<b>{p.title}</b>
					<span>{META}</span>
					<Icon icon='ArrowUpRight' size={18} className={page.arrow} />
				</figcaption>
			</Link>
		),
	},
	{
		name: 'Цифра поверх кадра',
		note: 'Вместо подписи — «40+ dokončených projektů» крупно в углу.',
		plus: 'Самое сильное сообщение из всех, и видно его сразу. Цифра работает как заголовок.',
		minus: 'Дублирует карточку, которая стоит тут же рядом. И теряется связь фото с конкретным объектом.',
		render: (
			<figcaption className={cn(page.overlay, page.bigNumber)}>
				<b>40+</b>
				<span>dokončených projektů</span>
			</figcaption>
		),
	},
	{
		name: 'Бейдж сверху и подпись снизу',
		note: 'Категория работ в верхнем углу, данные объекта внизу.',
		plus: 'Два уровня: что за работа и где она сделана. «Kosmetika» подсказывает, что не каждый ремонт — полная переборка.',
		minus: 'Больше всего перекрытия. На полосе 21:9 два элемента почти смыкаются.',
		render: (
			<>
				<figcaption className={cn(page.overlay, page.badge)}>
					{p.categoryLabel}
				</figcaption>
				<figcaption className={cn(page.overlay, page.gradient)}>
					<b>{p.title}</b>
					<span>{META}</span>
				</figcaption>
			</>
		),
	},
	{
		name: 'Подпись под фотографией',
		note: 'Текста поверх нет вовсе — данные объекта строкой под кадром, как подпись в журнале.',
		plus: 'Фотография не тронута, текст читается идеально при любом освещении кадра. Ничего не нужно затемнять.',
		minus: 'Прибавляет высоты блоку и не решает исходную задачу — кадр остаётся «пустым».',
		render: null,
	},
];

const AboutCaptionPage: FC = () => (
	<div className={styles.page}>
		<Seo
			title='Подпись на фото в блоке о компании'
			description='Черновая страница для выбора надписи на фотографии. Не для публикации.'
			path='/about-caption'
			noindex
		/>

		<header className={styles.intro}>
			<span className={styles.kicker}>черновик · не для публикации</span>
			<h1>Семь способов подписать фотографию</h1>
			<p>
				Текст во всех вариантах берётся из данных проекта, а не придуман:
				название, город, площадь и год лежат в карточке объекта и подставляются
				сами. Сменится фото — сменится и подпись.
			</p>
			<p>
				Сейчас там <b>{p.title}</b>, {META}.
			</p>
			<p className={styles.warn}>
				Подпись здесь не про красоту. Фотография без неё — украшение; с
				названием, городом и годом она становится доказательством: конкретный
				объект, конкретные Теплице, конкретный год. Это то же самое, что даёт
				alt-текст поиску, только для человека.
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

				{variant.render ? (
					<Shot>{variant.render}</Shot>
				) : (
					<>
						<Shot />
						<p className={page.below}>
							<b>{p.title}</b> · {META}
						</p>
					</>
				)}

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

export default AboutCaptionPage;
