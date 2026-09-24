import cn from 'classnames';
import type { FC } from 'react';
import styles from './TextVariants.module.scss';

export type TextStyle =
	| 'now'
	| 'fixed'
	| 'inter'
	| 'plex'
	| 'source'
	| 'manrope'
	| 'bigger';

/** The two paragraphs as they actually appear on the home page, side by side. */
const TextVariant: FC<{ variant: TextStyle }> = ({ variant }) => (
	<div className={cn(styles.demo, styles[variant])}>
		<div className={styles.col}>
			<span className={styles.eyebrow}>O společnosti</span>
			<p className={styles.heading}>Kdo jsme a co děláme</p>
			<p className={styles.lead}>
				Specializujeme se na kompletní rekonstrukce bytů a domů. Spojujeme
				kvalitní řemeslné zpracování, moderní design a individuální přístup,
				abychom vytvořili interiéry, které budou sloužit mnoho let.
			</p>
		</div>

		<div className={styles.col}>
			<span className={styles.eyebrow}>Co nabízíme</span>
			<p className={styles.heading}>Naše služby</p>
			<p className={styles.lead}>
				Vybíráme řešení pro úkoly jakékoli složitosti – od konceptu až po
				realizaci.
			</p>
			<p className={styles.lead}>
				Rekonstrukci bytu i domu zvládneme celou pod jednou střechou – od
				demolice a nových rozvodů přes podlahy a dveře až po finální povrchy.
			</p>
		</div>
	</div>
);

export default TextVariant;
