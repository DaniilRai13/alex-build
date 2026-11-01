import type { IResponsiveImage } from './image.interface';

export type PortfolioCategory = 'all' | 'interior' | 'renovation' | 'facade';

/** Mirrors portfolio_projects.building_type in the admin's database. */
export type BuildingType = 'panel' | 'brick' | 'house' | 'other';

/** Mirrors portfolio_images.phase: where in the job the photo was taken. */
export type PhotoPhase = 'before' | 'during' | 'after';

export interface IProjectPhoto extends IResponsiveImage {
	/** One sentence on what the photo shows — printed under it and used as alt. */
	caption?: string;
	phase?: PhotoPhase;
}

/**
 * The case study, in the order the page tells it. Every part is optional: a
 * section is rendered only when its text (or, for before / work / result, its
 * photos) exists.
 */
export interface IProjectStory {
	before?: string;
	brief?: string;
	work?: string;
	challenges?: string;
	materials?: string;
	result?: string;
}

export interface IPortfolioProject {
	/** UUID from the database. Used as a React key, never shown. */
	id: string;
	slug: string;

	title: string;
	description: string;

	/** The badge text comes from categoryLabel() in portfolioCategories.data.ts. */
	category: PortfolioCategory;

	location: string;
	/** Part of town, printed after the location: "Teplice – Trnovany". */
	district?: string;
	buildingType?: BuildingType;
	/** Free text: "2+1", "2+1 → 3+kk". */
	layout?: string;
	durationWeeks?: number;

	area: number;

	year: number;

	story: IProjectStory;
	testimonial?: { text: string; author?: string };

	/** Hand-written <title> / meta description; built from the facts when absent. */
	seoTitle?: string;
	seoDescription?: string;

	preview: IProjectPhoto;

	images: IProjectPhoto[];
}
