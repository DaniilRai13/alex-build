export interface IProcessStep {
	id: number;
	title: string;
	description: string;
}

export type FormValues = {
	name: string;
	email: string;
	phone: string;
	message: string;
};
