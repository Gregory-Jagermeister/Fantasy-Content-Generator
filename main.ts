import { GeneratorModal } from 'editor/GeneratorModal';
import { Notice, Plugin } from 'obsidian';
import { InlineGeneratorSuggester } from "editor/InlineGenerator";
import { FantasyPluginSettings, possibleOptions } from 'settings/Datatypes';
import { DEFAULT_SETTINGS } from 'settings/DefaultSetting';
import { SettingTab } from 'settings/SettingsTab';

export default class FantasyPlugin extends Plugin {
	settings: FantasyPluginSettings;

	//Function used to return the array of options for the suggester.
	getOptionsForSuggest(): string[] {
		return possibleOptions;
	}

	async onload() {  
		await this.loadSettings();
		app.workspace.onLayoutReady(() => {
			//Register the InlineGeneratorSuggester to the Editor suggester.
			this.registerEditorSuggest(new InlineGeneratorSuggester(this.getOptionsForSuggest, this));
		});

		// This creates an icon in the left ribbon to access the modal for the Fantasy Content Generator.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const ribbonIconEl = this.addRibbonIcon('book', 'Fantasy Generators', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new GeneratorModal(this.app, (result) => {
				const copyContent = async () => {
					//Try to see if any generators spit out an Error or if copying the string fails.
					try {
						if (result instanceof Error) {
							new Notice(`${result}`);
						} else {
							await navigator.clipboard.writeText(result);
							new Notice(`${result} was copied to the clipboard.`);
						}
					} catch (err) {
						console.error('Failed to copy: ', err);
						new Notice("Failed to copy, Check error in console.");
					}
				}
				
				copyContent();

			}, this).open();
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));

		console.log("loaded Fantasy Content Generator");
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

