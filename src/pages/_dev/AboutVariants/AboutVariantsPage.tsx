import Seo from '@/components/common/Seo/Seo';
import { advantages } from '@/data/advantages.data';
import { statisticsData } from '@/data/statistics.data';
import { workStepsData } from '@/data/workSteps.data';
import cn from 'classnames';
import type { FC, ReactNode } from 'react';
import styles from '../devPage.module.scss';
import {
	ExpandedCards,
	FullWidthCopy,
	ThreeParagraphs,
	WithAdvantages,
	WithFaq,
	WithPhoto,
	WithProcess,
} from './AboutVariants';
import { CARD_NOTES, FAQ, P1, P2, P3 } from './AboutVariants.content';

// Dev-only preview, wired up in App.tsx behind import.meta.env.DEV.

const words = (...parts: string[]) =>
	parts.join(' ').trim().split(/\s+/).filter(Boolean).length;

const CARD_WORDS = words(
	...statisticsData.flatMap(item => [item.title, item.sub]),
);

/** What the block contributes today: one paragraph plus four card labels. */
const CURRENT = words(P1) + CARD_WORDS;

interface Variant {
	name: string;
	note: string;
	plus: string;
	minus: string;
	seo: string;
	words: number;
	render: ReactNode;
}

const variants: Variant[] = [
	{
		name: 'Три абзаца',
		note: 'Пустоту под текстом заполняют ещё два абзаца: кто ведёт стройку и где мы работаем. Карточки не трогаем.',
		plus: 'Самое простое изменение. Левая колонка перестаёт быть наполовину пустой, а блок начинает что-то рассказывать, а не декларировать.',
		minus: 'Ничего кроме текста не добавляется. Визуально блок остаётся прежним.',
		seo: 'Второй абзац пересказывает то, что уже написано на странице комплексной реконструкции, третий приносит города — Teplice, Ústí nad Labem, Most, Děčín. Это средний слой запросов, которого на главной нет.',
		words: words(P1, P2, P3) + CARD_WORDS,
		render: <ThreeParagraphs />,
	},
	{
		name: 'Текст и преимущества',
		note: 'Два абзаца, под ними четыре преимущества с иконками из advantages.data.ts. Этот массив сейчас показывается только на странице услуг.',
		plus: 'Готовые данные, писать нечего. Иконки оживляют пустую колонку, и получается симметрия: слева качественные доводы, справа цифры.',
		minus: 'Преимущества намеренно дублируют цифры в карточках — «40+ проектов» и «2 года гарантии» окажутся на экране дважды.',
		seo: 'Прибавка небольшая, зато формулировки разные: «Ověřené materiály», «Dodržujeme domluvu» — фразы, которых на главной нет ни в каком виде.',
		words:
			words(P1, P2) +
			CARD_WORDS +
			words(...advantages.flatMap(item => [item.title, item.text])),
		render: <WithAdvantages />,
	},
	{
		name: 'Текст во всю ширину',
		note: 'Перекомпоновка: заголовок и три абзаца в две колонки на всю ширину, карточки уходят в один ряд под ними.',
		plus: 'Тексту достаётся вся ширина, читать удобнее, чем узкой колонкой. Четыре карточки в ряд выглядят собраннее, чем сетка 2×2.',
		minus: 'Блок становится выше. Теряется нынешний контраст «текст слева, цифры справа».',
		seo: 'Столько же текста, сколько в первом варианте, но весь он в начале блока — это чуть выгоднее по расположению.',
		words: words(P1, P2, P3) + CARD_WORDS,
		render: <FullWidthCopy />,
	},
	{
		name: 'Процесс вместо цифр',
		note: 'Справа вместо статистики — четыре шага из workSteps.data.ts. Сейчас они живут только на странице контактов.',
		plus: 'Отвечает на вопрос «как это вообще будет происходить», который человек задаёт раньше, чем смотрит на цифры. Готовые данные.',
		minus: 'Цифры уходят с главной совсем — а «40+ проектов» и «2 года гарантии» это самое весомое, что есть. Возможно, их надо вернуть отдельным рядом.',
		seo: 'Связный текст про этапы работ. Плюс основа под разметку HowTo, если позже захочется.',
		words:
			words(P1, P2, P3) +
			words(...workStepsData.flatMap(step => [step.title, step.description])),
		render: <WithProcess />,
	},
	{
		name: 'Текст и фотография',
		note: 'Справа настоящий объект из портфолио с подписью — город, площадь, год. Карточки в ряд под блоком.',
		plus: 'Единственный вариант, где блок «о нас» показывает работу, а не слова о ней. Подпись с городом и площадью читается как доказательство.',
		minus: 'Блок вырастает сильнее всех. Фотография дублирует портфолио, которое идёт ниже на той же странице.',
		seo: 'Подпись «Rekonstrukce panelového bytu · Teplice · 40 m² · 2025» — локальный сигнал в тексте, плюс осмысленный alt для поиска по картинкам.',
		words: words(P1, P2, P3) + CARD_WORDS + 8,
		render: <WithPhoto />,
	},
	{
		name: 'Развёрнутые карточки',
		note: 'У каждой цифры появляется третья строка с пояснением. Текст слева — два абзаца.',
		plus: 'Цифры перестают быть голыми. «Pevná cena» с пояснением «stanovíme ji po prohlídce a držíme ji» звучит как обязательство, а не как лозунг.',
		minus: 'Пояснения я написал сам — это новые обещания клиенту, а не переформулировка. Нужно согласование с Алексом.',
		seo: 'Прибавка скромная, но карточки — самое заметное место блока, и текст в них читается и человеком, и роботом.',
		words:
			words(P1, P2) + CARD_WORDS + words(...Object.values(CARD_NOTES)),
		render: <ExpandedCards />,
	},
	{
		name: 'Текст и частые вопросы',
		note: 'Справа вместо карточек три вопроса с ответами, карточки в ряд под блоком.',
		plus: 'Снимает возражения там, где человек только начал читать про компанию. Ответы короткие и конкретные.',
		minus: 'Вопросы про сроки и приёмку — обещания. Их надо согласовать. И блок дублирует FAQ, если он появится на страницах услуг.',
		seo: 'Единственный вариант с разметкой FAQPage: вопросы и ответы уже разделены, остаётся JSON-LD. Шанс на расширенный сниппет в выдаче.',
		words:
			words(P1, P2, P3) +
			CARD_WORDS +
			words(...FAQ.flatMap(item => [item.q, item.a])),
		render: <WithFaq />,
	},
];

const AboutVariantsPage: FC = () => (
	<div className={styles.page}>
		<Seo
			title='Варианты блока «O společnosti»'
			description='Черновая страница для сравнения вариантов блока о компании. Не для публикации.'
			path='/about-variants'
			noindex
		/>

		<header className={styles.intro}>
			<span className={styles.kicker}>черновик · не для публикации</span>
			<h1>Семь вариантов блока «O společnosti»</h1>
			<p>
				Сейчас блок — один абзац и четыре карточки, {CURRENT} слов на всё. На
				ноутбуке левая колонка заканчивается примерно на половине высоты сетки
				справа: под текстом остаётся пустое место размером с сам текст.
			</p>
			<p>
				Часть содержания уже написана и просто не показывается на главной. В{' '}
				<code>advantages.data.ts</code> лежат четыре преимущества, в{' '}
				<code>workSteps.data.ts</code> — четыре шага процесса; и то и другое
				сейчас видно только на других страницах.
			</p>
			<p className={styles.warn}>
				Счётчик слов считается по реальным строкам. Абзацы P2 и P3 — пересказ
				того, что уже написано на страницах услуг, их можно брать как есть.
				Пояснения к карточкам (вариант 06) и ответы на вопросы (вариант 07)
				написаны заново и требуют согласования: это обещания клиенту.
			</p>
		</header>

		{variants.map((variant, index) => (
			<section className={styles.variant} key={variant.name}>
				<div className={styles.head}>
					<span className={styles.num}>
						{String(index + 1).padStart(2, '0')}
					</span>
					<h2>
						{variant.name}{' '}
						<small>
							— {variant.words} слов ({variant.words >= CURRENT ? '+' : ''}
							{variant.words - CURRENT})
						</small>
					</h2>
					<p>{variant.note}</p>
				</div>

				{variant.render}

				<dl className={cn(styles.notes, styles.notes3)}>
					<div className={styles.plus}>
						<dt>Даёт</dt>
						<dd>{variant.plus}</dd>
					</div>
					<div className={styles.minus}>
						<dt>Риск</dt>
						<dd>{variant.minus}</dd>
					</div>
					<div className={styles.seo}>
						<dt>Поиск</dt>
						<dd>{variant.seo}</dd>
					</div>
				</dl>
			</section>
		))}
	</div>
);

export default AboutVariantsPage;
