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
			// getSettingDefinitions() needs Obsidian 1.13; this plugin supports 1.1.0 and up (minAppVersion).
			"obsidianmd/settings-tab/prefer-setting-definitions": "off",
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
