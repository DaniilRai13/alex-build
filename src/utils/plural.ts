/**
 * The Czech noun form after a number: 1 byt, 2–4 byty, 0 and 5+ bytů.
 *
 * Numbers on the site are counted from the data, so the noun next to them has
 * to follow — "9 realizace" reads as a typo to every Czech visitor.
 */
export const plural = (count: number, one: string, few: string, many: string) => {
	if (count === 1) return one;
	if (count >= 2 && count <= 4) return few;

	return many;
};
