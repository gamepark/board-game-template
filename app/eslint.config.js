import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [js.configs.recommended, tseslint.configs.recommended, reactRefresh.configs.vite],
        plugins: {
            'react-hooks': reactHooks
        },
        rules: {
            ...reactHooks.configs['recommended-latest'].rules,
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser
        }
    }
])
