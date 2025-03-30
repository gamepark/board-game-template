import globals from 'globals'
import pluginJs from '@eslint/js'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import { globalIgnores } from 'eslint/config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config([
    globalIgnores(['build/**/*.js', 'config-overrides.js', 'eslint.config.mjs']),
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        files: ['src/**/*.{js,mjs,ts,jsx,tsx}'],
        ...pluginJs.configs.recommended,
        settings: {
            react: {
                version: '17.0'
            }
        },
        ...pluginReact.configs.flat.recommended,
        ...pluginReact.configs.flat['jsx-runtime'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: globals.browser
        },
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