import type { IProcessStep } from '@/types/contactInfo.interface';

// Shown on /contacts and on the home page. Each step restates something the
// site already commits to elsewhere — the viewing before the price, the fixed
// price and the schedule, one contractor, the two-year warranty — so nothing
// here is a new promise. The steps used to be one vague line each ("Upřesníme
// úkoly, přání a rozpočet projektu."), which said how any company works.
export const workStepsData: IProcessStep[] = [
	{
		id: 1,
		title: 'Poptávka',
		description:
			'Zavoláte nám nebo pošlete poptávku přes formulář. Stačí pár vět o tom, co potřebujete.',
	},
	{
		id: 2,
		title: 'Prohlídka',
		description:
			'Na nezávazné prohlídce si upřesníme rozsah prací, vaše přání i rozpočet.',
	},
	{
		id: 3,
		title: 'Cenová nabídka',
		description:
			'Dostanete pevnou cenu bez skrytých poplatků a harmonogram, takže dopředu víte, co a kdy se bude dít.',
	},
	{
		id: 4,
		title: 'Realizace a předání',
		description:
			'Celou stavbu vede jeden dodavatel a profese na sebe navazují bez prostojů. Na veškeré práce dáváme záruku 2 roky.',
	},
];
