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
					<h2 className={styles.title}>Něco se pokazilo</h2>
					<p className={styles.text}>
						Omlouváme se, došlo k neočekávané chybě. Zkuste to prosím znovu.
					</p>
					<div className={styles.actions}>
						<button
							type='button'
							className={styles.button}
							onClick={this.handleReset}
						>
							Zkusit znovu
						</button>
						<a className={styles.link} href='/'>
							Zpět na domovskou stránku
						</a>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
