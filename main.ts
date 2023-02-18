import { GeneratorModal } from 'modal';
import { MarkdownView, Notice, Plugin } from 'obsidian';
import { InlineGeneratorSuggester } from "editor/AutoComplete";
import { MyPluginSettings, possibleOptions } from 'settings/Datatypes';
import { DEFAULT_SETTINGS } from 'settings/DefaultSetting';
import { SettingTab } from 'settings/SettingsTab';

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	//Function used to return the array of options for the suggester.
	getOptionsForSuggest(): string[] {
		return possibleOptions;
	}

	async onload() {  
		await this.loadSettings();
		app.workspace.onLayoutReady(() => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			// Make sure the user is editing a Markdown file.
			if (view) {
				//Register the InlineGeneratorSuggester to the Editor suggester.
				this.registerEditorSuggest(new InlineGeneratorSuggester(this.getOptionsForSuggest, this));
			}
		});

		// This creates an icon in the left ribbon to access the modal for the Fantasy Content Generator.
		const ribbonIconEl = this.addRibbonIcon('book', 'Fantasy Generators', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new GeneratorModal(this.app, (result) => {
				const copyContent = async () => {
					console.log();
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
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

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

