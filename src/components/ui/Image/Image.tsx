import cn from 'classnames';
import { type ComponentPropsWithoutRef, type FC } from 'react';
import styles from './Image.module.scss';

interface ImageProps extends Omit<ComponentPropsWithoutRef<'img'>, 'loading'> {
	src: string;
	alt: string;
	aspectRatio?: string | number;
	priority?: boolean;
	/** WebP candidates; when present the image is wrapped in a <picture>. */
	srcSet?: string;
	/** Layout width hint for picking a candidate, e.g. "(max-width: 768px) 100vw, 33vw". */
	sizes?: string;
}

const Image: FC<ImageProps> = ({
	src,
	alt,
	aspectRatio,
	priority = false,
	srcSet,
	sizes,
	className,
	style,
	...rest
}) => {
	const image = (
		<img
			{...rest}
			src={src}
			alt={alt}
			loading={priority ? 'eager' : 'lazy'}
			decoding='async'
			fetchPriority={priority ? 'high' : 'auto'}
			className={cn(styles.image, className)}
			style={
				aspectRatio ? { aspectRatio: String(aspectRatio), ...style } : style
			}
		/>
	);

	if (!srcSet) return image;

	// <picture> rather than a bare srcset: srcset picks a size, not a format, so
	// a browser without WebP support would still choose a .webp it cannot decode.
	// The wrapper uses display: contents, so surrounding CSS keeps targeting the
	// <img> exactly as before.
	return (
		<picture className={styles.picture}>
			<source type='image/webp' srcSet={srcSet} sizes={sizes} />
			{image}
		</picture>
	);
};

export default Image;
