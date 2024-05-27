import { GeneratorModal } from 'editor/GeneratorModal';
import { MarkdownView, Notice, Plugin, Editor } from 'obsidian';
import { InlineGeneratorSuggester } from "editor/InlineGenerator";
import { FantasyPluginSettings, possibleOptions } from 'settings/Datatypes';
import { DEFAULT_SETTINGS } from 'settings/DefaultSetting';
import { SettingTab } from 'settings/SettingsTab';

export default class FantasyPlugin extends Plugin {
	settings: FantasyPluginSettings;
	currentEditor: Editor | null = null;

	//Function used to return the array of options for the suggester.
	getOptionsForSuggest(): string[] {
		return possibleOptions;
	}

	async onload() {  
		await this.loadSettings();

		this.app.workspace.on('active-leaf-change', (leaf) => {
			if (leaf) {
				const view = leaf.view;
				if (view instanceof MarkdownView) {
					this.currentEditor = view.editor;
				} else {
					this.currentEditor = null;
				}
			} else {
				this.currentEditor = null;
			}
		});

		//Command to open Modal dialog
		this.addCommand({
			id: 'open-fantasy-generator',
			name: 'Open Fantasy Generator',
			callback: () => {
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
			},
		});

		//Register the InlineGeneratorSuggester to the Editor suggester.
		this.registerEditorSuggest(new InlineGeneratorSuggester(this.getOptionsForSuggest, this));

		// This creates an icon in the left ribbon to access the modal for the Fantasy Content Generator.
		this.addRibbonIcon('book', 'Fantasy Generators', (evt: MouseEvent) => {
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

