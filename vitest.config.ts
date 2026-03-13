import path from 'node:path';
import { defineConfig } from 'vitest/config';

const rootDir = path.resolve(__dirname);

export default defineConfig({
    resolve: {
        alias: {
            '~': path.resolve(rootDir, 'src'),
            'astrowind:config': path.resolve(rootDir, 'tests/unit/mocks/astrowind-config.ts'),
            'astro:content': path.resolve(rootDir, 'tests/unit/mocks/astro-content.ts'),
        },
    },
    test: {
        environment: 'happy-dom',
        setupFiles: ['./tests/unit/setup.ts'],
        include: ['tests/unit/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: [
                'src/utils/permalinks.ts',
                'src/utils/utils.ts',
                'src/utils/language.ts',
                'src/utils/content.ts',
                'src/utils/crypto.ts',
                'src/utils/metadata-extractor.ts',
                'src/lib/subscription/constants.ts',
                'src/lib/subscription/access.ts',
                'src/lib/subscription/display.ts',
                'src/lib/loading.ts',
                'src/i18n/index.ts',
            ],
            thresholds: {
                lines: 90,
                functions: 90,
                branches: 90,
                statements: 90,
            },
        },
    },
});
