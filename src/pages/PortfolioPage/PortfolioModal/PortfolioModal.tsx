import { useEffect, useState } from 'react';

import { Icon } from '@/components/ui/LucidIcon/Icon';

import type { IPortfolioProject } from '@/types/portfolio.interface';

import styles from './PortfolioModal.module.scss';
import Heading from '@/components/ui/Heading/Heading';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import Image from '@/components/ui/Image/Image';

import Lightbox from 'yet-another-react-lightbox';

import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';

import 'yet-another-react-lightbox/styles.css';

interface Props {
	project: IPortfolioProject | null;
	onClose(): void;
}

const PortfolioModal = ({ project, onClose }: Props) => {
	const [currentImg, setCurrentImg] = useState<number>(0);
	const [lightboxOpen, setLightboxOpen] = useState(false);

	const prevImage = () => {
		if (!project) return;
		setCurrentImg(prev => (prev === 0 ? project.images.length - 1 : prev - 1));
	};
	const nextImage = () => {
		if (!project) return;
		setCurrentImg(prev => (prev === project.images.length - 1 ? 0 : prev + 1));
	};

	useEffect(() => {
		if (!project) return;

		document.body.style.overflow = 'hidden';

		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};

		window.addEventListener('keydown', handleEsc);

		return () => {
			document.body.style.overflow = '';

			window.removeEventListener('keydown', handleEsc);
		};
	}, [onClose, project]);

	if (!project) return null;

	return (
		<>
			<div
				className={styles.backdrop}
				onClick={() => {
					if (!lightboxOpen) {
						onClose();
					}
				}}
			>
				<div className={styles.modal} onClick={e => e.stopPropagation()}>
					<button className={styles.close} onClick={onClose}>
						<Icon icon='X' />
					</button>

					<div className={styles.image}>
						<Image
							src={project.images[currentImg]}
							alt={project.title}
							onClick={() => setLightboxOpen(true)}
							style={{ cursor: 'zoom-in' }}
							priority
						/>
						<button
							className={`${styles.nav} ${styles.prev}`}
							onClick={prevImage}
						>
							<Icon icon='ChevronLeft' />
						</button>

						<button
							className={`${styles.nav} ${styles.next}`}
							onClick={nextImage}
						>
							<Icon icon='ChevronRight' />
						</button>
					</div>

					<div className={styles.info}>
						<span className={styles.category}>{project.categoryLabel}</span>

						<Heading children={project.title} className={styles.title} />

						<Subtitle
							children={project.description}
							className={styles.description}
						/>

						<div className={styles.meta}>
							<div>
								<strong>Místo</strong>
								<span>{project.location}</span>
							</div>

							<div>
								<strong>Plocha</strong>
								<span>{project.area} m²</span>
							</div>

							<div>
								<strong>Rok</strong>
								<span>{project.year}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Lightbox
				open={lightboxOpen}
				close={() => setLightboxOpen(false)}
				index={currentImg}
				slides={project.images.map(image => ({
					src: image,
				}))}
				plugins={[Zoom, Fullscreen]}
			/>
		</>
	);
};

export default PortfolioModal;
