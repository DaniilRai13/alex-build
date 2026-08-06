import Heading from '@/components/ui/Heading/Heading';
import { workStepsData } from '@/data/workSteps.data';
import styles from './WorkProcess.module.scss';

const ContactInfo = () => {
	return (
		<div className={styles.process}>
			<Heading className={styles.title}>Jak pracujeme</Heading>

			<div className={styles.timeline}>
				{workStepsData.map((step, index) => (
					<div className={styles.step} key={step.id}>
						<div className={styles.marker}>
							<span>{step.id}</span>

							{index !== workStepsData.length - 1 && (
								<div className={styles.line} />
							)}
						</div>

						<div className={styles.content}>
							<Heading as='h3' className={styles.contentTitle}>
								{step.title}
							</Heading>
							<p>{step.description}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ContactInfo;
