import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './App';

// Inter, self-hosted. The stylesheet has named it since the first commit but
// nothing ever loaded it, so every visitor got their own system fallback —
// Segoe UI on Windows, San Francisco on macOS, Roboto on Android.
//
// Self-hosted rather than the Google Fonts CDN on purpose: this site sends no
// request to a third party anywhere else, which is why the visit counter is a
// PHP file of our own and why the site needs no consent banner. Fetching a
// stylesheet from Google would hand every visitor's IP to Google and undo
// that for the sake of one font.
//
// wght.css, not index.css: only the weight axis, and one file per subset with
// a unicode-range, so a Czech page fetches latin and latin-ext and nothing else.
import '@fontsource-variable/inter/wght.css';

import './styles/main.scss';

export const createRoot = ViteReactSSG({ routes });
