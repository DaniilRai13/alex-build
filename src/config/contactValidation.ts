export const contactValidation = {
	name: {
		required: 'Zadejte své jméno',
	},

	email: {
		required: 'Zadejte e-mail',
		pattern: {
			value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			message: 'Neplatný e-mail',
		},
	},

	phone: {
		required: 'Zadejte telefon',
		pattern: {
			value: /^[+\d\s()-]+$/,
			message: 'Telefon může obsahovat pouze čísla',
		},
	},
};