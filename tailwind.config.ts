/**
 * Tailwind CSS v4: most design tokens live in `src/routes/layout.css` via `@theme`.
 * This file exists for tooling/IDE hints and any plugins that still expect a config entry.
 */
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}']
} satisfies Config;
