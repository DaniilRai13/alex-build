import Seo from '@/components/common/Seo/Seo';
import cn from 'classnames';
import type { FC } from 'react';
import { Head } from 'vite-react-ssg';
import styles from '../devPage.module.scss';
import TextVariant, { type TextStyle } from './TextVariant';

// Dev-only preview, wired up in App.tsx behind import.meta.env.DEV.

const FONTS =
	'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&family=Inter:wght@400;600;700&family=Manrope:wght@400;600;700&family=Source+Sans+3:wght@400;600;700&display=swap';

interface Variant {
	name: string;
	style: TextStyle;
	note: string;
	plus: string;
	minus: string;
}

const variants: Variant[] = [
	{
		name: 'Как сейчас',
		style: 'now',
		note: 'Ровно то, что на сайте: междустрочный 1.2, разрядка 1px, цвет #64748b. Показан для сравнения — дальше видно, сколько из «не нравится шрифт» на самом деле про эти три значения.',
		plus: 'Ничего.',
		minus: 'Междустрочный 1.2 и разрядка 1px — настройки для заголовка, применённые к тексту абзаца. Цвет даёт 3,84:1 на фоне страницы, при норме 4,5:1 для основного текста.',
	},
	{
		name: 'Только починка, шрифт тот же',
		style: 'fixed',
		note: 'Те же системные буквы, но междустрочный 1.65, разрядка убрана, цвет тёплый #5c5349 — 6,08:1.',
		plus: 'Без единого нового шрифта разница уже заметная. Это и есть проверка, в шрифте ли дело.',
		minus: 'Если не нравятся сами буквы — не поможет, вид останется системным.',
	},
	{
		name: 'Inter — как и задумано',
		style: 'inter',
		note: 'Тот шрифт, который прописан в стилях сайта, но никогда не загружался. Здесь подключён по-настоящему.',
		plus: 'Ровно то, что было задумано автором вёрстки. Нейтральный, отлично читается мелко, полная чешская диакритика.',
		minus: 'Самый узнаваемый шрифт последних лет — его ставят очень многие, характера почти не добавляет.',
	},
	{
		name: 'IBM Plex Sans',
		style: 'plex',
		note: 'Инженерная гарнитура: чуть суше, с техническим характером.',
		plus: 'Смысловое попадание для строительной компании — так набирают техническую документацию. Отличается от того, что у всех.',
		minus: 'Суховат для текста, который должен вызывать доверие и тепло.',
	},
	{
		name: 'Source Sans 3',
		style: 'source',
		note: 'Гуманистическая гарнитура, рассчитанная на длинные тексты.',
		plus: 'Самая читаемая из четырёх на абзацах. Мягче Inter, спокойнее Plex — хорошо ляжет на будущие кейсы проектов и блог.',
		minus: 'Нейтральна до незаметности. Характера не добавит, но и не помешает.',
	},
	{
		name: 'Manrope',
		style: 'manrope',
		note: 'Геометричная, современная, с заметно круглыми формами.',
		plus: 'Самая «дизайнерская» из четырёх — сразу выглядит сделанной, а не собранной по умолчанию.',
		minus: 'Геометрия хуже читается в длинных абзацах. Хороша для заголовков и коротких лидов, на кейсах устанет.',
	},
	{
		name: 'Крупнее и темнее',
		style: 'bigger',
		note: 'Inter, но 1.15rem, междустрочный 1.7 и тёплый графит #4a423a вместо серого — 7,96:1.',
		plus: 'Текст перестаёт быть подписью и становится равноправной частью блока. Лучший вариант для людей за сорок — а это и есть те, кто заказывает ремонт.',
		minus: 'Блоки станут выше. На главной это плюс, на плотных страницах надо смотреть отдельно.',
	},
];

const TextVariantsPage: FC = () => (
	<div className={styles.page}>
		<Head>
			<link rel='preconnect' href='https://fonts.googleapis.com' />
			<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
			<link rel='stylesheet' href={FONTS} />
		</Head>

		<Seo
			title='Варианты набора текста'
			description='Черновая страница для сравнения шрифта и настроек абзацев. Не для публикации.'
			path='/text-variants'
			noindex
		/>

		<header className={styles.intro}>
			<span className={styles.kicker}>черновик · не для публикации</span>
			<h1>Семь вариантов набора текста</h1>
			<p className={styles.warn}>
				Сначала главное: <strong>Inter на сайте не загружается</strong>. В
				стилях он прописан, но ни ссылки на Google Fonts, ни{' '}
				<code>@font-face</code>, ни файлов шрифтов в сборке нет. Браузер падает
				на фолбэк — на Windows это Segoe UI, на маке San Francisco, на Android
				Roboto. То есть сейчас ты смотришь не на выбранный шрифт, а на
				системный, и у каждого посетителя он свой.
			</p>
			<p>
				Второе: у абзацев стоит междустрочный <code>1.2</code> и разрядка{' '}
				<code>1px</code>. Это настройки заголовка, применённые к тексту — отсюда
				ощущение тесноты. И цвет <code>#64748b</code> даёт 3,84:1 на фоне
				страницы при норме 4,5:1, то есть формально не проходит по читаемости.
			</p>
			<p>
				Поэтому первые два варианта — без новых шрифтов вообще: они показывают,
				сколько из проблемы решается тремя значениями. Дальше четыре гарнитуры
				на выбор и один вариант с укрупнением.
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

				<TextVariant variant={variant.style} />

				<dl className={cn(styles.notes)}>
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

export default TextVariantsPage;
