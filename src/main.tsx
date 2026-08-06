import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './App';
import './styles/main.scss';

export const createRoot = ViteReactSSG({ routes });
