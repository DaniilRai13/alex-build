import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { ROUTES } from '@/config/routes';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.scss';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, info);
	}

	handleReset = () => {
		this.setState({ hasError: false });
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className={styles.fallback} role='alert'>
					<Heading className={styles.title}>Něco se pokazilo</Heading>

					<Subtitle className={styles.text}>
						Omlouváme se, došlo k neočekávané chybě. Zkuste to prosím znovu.
					</Subtitle>

					<div className={styles.actions}>
						<Button
							title='Zkusit znovu'
							icon='RotateCcw'
							onClick={this.handleReset}
							className={styles.retry}
						/>
						<Button
							title='Zpět na domovskou stránku'
							icon='House'
							to={ROUTES.HOME}
							className={styles.homeButton}
						/>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
