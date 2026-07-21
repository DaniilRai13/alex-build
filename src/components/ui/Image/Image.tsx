import cn from 'classnames';
import { type ComponentPropsWithoutRef, type FC } from 'react';
import styles from './Image.module.scss';

interface ImageProps extends Omit<ComponentPropsWithoutRef<'img'>, 'loading'> {
	src: string;
	alt: string;
	aspectRatio?: string | number;
	priority?: boolean;
}

const Image: FC<ImageProps> = ({
	src,
	alt,
	aspectRatio,
	priority = false,
	className,
	style,
	...rest
}) => {
	return (
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
};

export default Image;
