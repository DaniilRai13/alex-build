/** An image plus its WebP alternatives, ready for <picture>. */
export interface IResponsiveImage {
	/** Original JPEG/PNG — the <img> fallback (and the lightbox source). */
	src: string;
	/**
	 * Value for <source srcSet>. Portfolio photos carry width descriptors
	 * ("…-480.webp 480w, …"); service illustrations are a single file with no
	 * descriptor, because there the only gain is the format, not the size.
	 */
	srcSet?: string;
}
