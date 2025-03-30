import globals from 'globals'
import pluginJs from '@eslint/js'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config([
    globalIgnores(['dist/**/*.{js,ts}', 'tests/**/*.{js,ts}', '*.config.{ts,mjs}']),
    { files: ['src/**/*.{js,mjs,cjs,ts}'] },
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            },
            globals: globals.browser
        },
        ...pluginJs.configs.recommended,
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
            '@typescript-eslint/restrict-template-expressions': ['error', { 'allowNullish': true, 'allowNumber': true }],
            '@typescript-eslint/no-confusing-void-expression': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-unsafe-enum-comparison': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off'
        }
    },
    eslintPluginPrettierRecommended
])