import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as ProduckEslint from '@produck/eslint-rules';


/** @type {import('eslint').Linter.Config[]} */
export default [
	{files: ['**/*.{js,mjs,cjs,ts}']},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	ProduckEslint.config,
];
