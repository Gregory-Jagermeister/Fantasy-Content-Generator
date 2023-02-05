import { GeneratorModal } from 'modal';
import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

type currency = {
	name: string,
	rarity: string
}

interface MyPluginSettings {
	enableCurrency: boolean;
	currencyTypes: currency[];
	currencyFrequency: number;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	enableCurrency: false,
	currencyTypes: [{
		"name": "GP",
		"rarity": "rare"
	},
	{
		"name": "CP",
		"rarity": "common"
	},
	{
		"name": "SP",
		"rarity": "common"
	},
	{
		"name": "PP",
		"rarity": "rarest"
	}],
	currencyFrequency: 50
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {  
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('book', 'Fantasy Generators', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			//this.activateView();
			new GeneratorModal(this.app, (result) => {
				const copyContent = async () => {
					try {
						await navigator.clipboard.writeText(result);
						new Notice(`${result} was copied to the clipboard.`);
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
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Fantasy Content Generator'});

		new Setting(containerEl)
			.setName('Enable Currency for Loot Generation.')
			.setDesc('If you have Currency in your World or game consider Activating this')
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.enableCurrency);
				toggle.onChange(async (value) => {
					this.plugin.settings.enableCurrency = value;
					this.display();
					await this.plugin.saveSettings();
				})
			})
		
		if (this.plugin.settings.enableCurrency) {

			new Setting(containerEl).setName("Occurance Rate:").setDesc("Set How Frequently Loot generates currency as a percentage of 100")
				.addText((text) => { 
					text.setValue(String(this.plugin.settings.currencyFrequency));
					text.onChange(async(value) => {
						if (!(isNaN(+value))) {
							this.plugin.settings.currencyFrequency = Number(value);
							await this.plugin.saveSettings();
						}
						
					})
				})

			const ctext = {
				name: '',
				rarity: 'common'
			}
			new Setting(containerEl)
			.setName("Currency Name:")
			.addText((text) => {
				text.onChange((value) => {
					ctext.name = value;
				})
			}).addDropdown((drop) => {
				drop.addOption("common", "Common");
				drop.addOption("uncommon", "Uncommon");
				drop.addOption("rare", "Rare");
				drop.addOption("rarest", "Rarest");
				drop.onChange((value) => {
					ctext.rarity = value;
				})
			})
			.addButton((btn) => {
				btn.setCta().setButtonText("Add")
					.onClick(async () => {
						this.plugin.settings.currencyTypes.push(ctext);
						this.display();
						await this.plugin.saveSettings();
					})
			})

			containerEl.createEl("h3", { text: "Added Currency" });
			containerEl.createEl("p", { text: "Click remove on a currency you would like to removed" });

			for (let index = 0; index < this.plugin.settings.currencyTypes.length; index++) {
				new Setting(containerEl)
					.setName(this.plugin.settings.currencyTypes[index].name)
					.addButton((btn) => btn
						.setCta()
						.setButtonText("Remove")
						.onClick(async() => {
							this.plugin.settings.currencyTypes.splice(index, 1);
							this.display();
							await this.plugin.saveSettings();
						})
				)
				
			}
				
		}
	}
}
