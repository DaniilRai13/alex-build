import { company } from '@/config/company';
import type { LegalSection } from '@/types/legal.interface';

export const privacySections: LegalSection[] = [
	{
		heading: 'Správce osobních údajů',
		paragraphs: [
			`Správcem vašich osobních údajů je ${company.name}, se sídlem ${company.address}, IČO ${company.id} (dále jen „správce“).`,
			`V případě jakýchkoli dotazů týkajících se zpracování osobních údajů nás můžete kontaktovat na e-mailu ${company.email}.`,
		],
	},
	{
		heading: 'Jaké údaje zpracováváme',
		paragraphs: [
			'Prostřednictvím kontaktního formuláře na tomto webu zpracováváme následující údaje, které nám dobrovolně poskytnete: jméno, e-mailovou adresu, telefonní číslo a text vaší zprávy.',
			'Neshromažďujeme žádné citlivé osobní údaje a nezpracováváme údaje o osobách mladších 16 let.',
		],
	},
	{
		heading: 'Účel a právní základ zpracování',
		paragraphs: [
			'Vaše údaje zpracováváme za účelem vyřízení vaší poptávky, zodpovězení dotazů a následné komunikace ohledně poptávané služby.',
			'Právním základem zpracování je provedení opatření před uzavřením smlouvy na vaši žádost a náš oprávněný zájem na vyřízení vašeho požadavku, případně váš souhlas udělený odesláním formuláře.',
		],
	},
	{
		heading: 'Doba uchování údajů',
		paragraphs: [
			'Osobní údaje uchováváme pouze po dobu nezbytně nutnou k vyřízení vaší poptávky a splnění souvisejících povinností, nejdéle však po dobu [DOPLŇTE, např. 12 měsíců], nevyžaduje-li zákon dobu delší.',
		],
	},
	{
		heading: 'Předání údajů třetím stranám',
		paragraphs: [
			'Pro odesílání zpráv z kontaktního formuláře využíváme službu třetí strany (EmailJS), která zpracovává údaje jako zpracovatel na základě našich pokynů.',
			'Vaše údaje nepředáváme dalším subjektům za marketingovými účely. K předání může dojít pouze tehdy, vyžaduje-li to platný právní předpis.',
		],
	},
	{
		heading: 'Cookies',
		paragraphs: [
			'Tento web [POUŽÍVÁ / NEPOUŽÍVÁ] soubory cookies. Pokud jsou používány pouze technicky nezbytné cookies, není k jejich uložení vyžadován souhlas. Případné analytické nebo marketingové cookies používáme pouze s vaším souhlasem.',
		],
	},
	{
		heading: 'Vaše práva',
		paragraphs: [
			'V souvislosti se zpracováním osobních údajů máte právo na přístup k údajům, jejich opravu nebo výmaz, omezení zpracování, právo vznést námitku a právo na přenositelnost údajů.',
			'Byl-li dán souhlas, máte právo jej kdykoli odvolat. Rovněž máte právo podat stížnost u dozorového úřadu (v ČR Úřad pro ochranu osobních údajů).',
		],
	},
	{
		heading: 'Kontakt',
		paragraphs: [
			`Pro uplatnění svých práv nebo v případě jakýchkoli dotazů nás kontaktujte na e-mailu ${company.email}.`,
		],
	},
];
