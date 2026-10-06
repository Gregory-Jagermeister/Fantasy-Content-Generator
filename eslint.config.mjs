import { defineConfig, globalIgnores } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";

export default defineConfig([
	globalIgnores(["node_modules/", "main.js", "tests/build/", "fantasy-content-generator/", "builds/"]),
	...obsidianmd.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ["eslint.config.mjs", "esbuild.config.mjs", "version-bump.mjs", "tests/*.mjs"],
				},
			},
		},
		rules: {
			// The plugin's names (new and old) keep their capitals.
			"obsidianmd/ui/sentence-case": ["warn", { brands: ["TTRPG Content Generator", "Fantasy Content Generator", "Obsidian", "Templater"] }],
		},
	},
	{
		// Build and test scripts run in Node, never inside Obsidian.
		files: ["*.mjs", "tests/**/*.mjs", "tests/**/*.ts"],
		languageOptions: { globals: globals.node },
		rules: {
			"obsidianmd/no-nodejs-modules": "off",
			// node:test's test() returns a promise the runner tracks itself.
			"@typescript-eslint/no-floating-promises": "off",
		},
	},
]);
