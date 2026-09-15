// Copy the variants share. Kept out of the component file so fast refresh
// keeps working — and so the page can count its words without importing JSX.

/** The paragraph the block carries today. */
export const P1 =
	'Specializujeme se na kompletní rekonstrukce bytů a domů. Spojujeme kvalitní řemeslné zpracování, moderní design a individuální přístup, abychom vytvořili interiéry, které budou sloužit mnoho let.';

/** Paraphrases the copy already on /services/kompletni-rekonstrukce. */
export const P2 =
	'Celou stavbu vede jeden dodavatel – od demolice a nových rozvodů přes podlahy a dveře až po finální povrchy. Jednotlivé profese na sebe navazují bez prostojů a vy nedomlouváte deset řemeslníků zvlášť.';

/** The geography, plus the promise the service pages already make. */
export const P3 =
	'Pracujeme v Teplicích, Ústí nad Labem, Mostě, Děčíně a dalších městech Ústeckého kraje. Před zahájením prací připravíme harmonogram a rozpočet, abyste dopředu věděli, co a kdy se bude dít.';

/** Variant 07. New promises — Alex has to confirm them before this ships. */
export const FAQ = [
	{
		q: 'Jak dlouho trvá rekonstrukce bytu?',
		a: 'U bytu 3+1 obvykle 6 až 8 týdnů podle rozsahu.',
	},
	{
		q: 'Můžu v bytě během prací bydlet?',
		a: 'U kosmetických úprav ano, práce naplánujeme po etapách.',
	},
	{
		q: 'Kdo práce přebírá?',
		a: 'Vy, spolu s námi – a na provedené práce dostanete dvouletou záruku.',
	},
];

/** Variant 06. Also new claims, also pending confirmation. */
export const CARD_NOTES: Record<string, string> = {
	'40+': 'převážně panelové byty a fasády v Ústeckém kraji',
	'Pevná cena': 'stanovíme ji po prohlídce a držíme ji',
	'24/7': 'na zprávy odpovídáme zpravidla týž den',
	'2+': 'na provedené práce i použitý materiál',
};
