import { GeneratorModal } from 'modal';
import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

export type currency = {
	name: string,
	rarity: string
}

export type cityGeneratorSetting = {
	prefixArray: string[],
	suffixArray: string[]
}

interface MyPluginSettings {
	enableCurrency: boolean;
	enableSettlementSettings: boolean;
	citySettings: cityGeneratorSetting;
	currencyTypes: currency[];
	currencyFrequency: number;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	enableCurrency: false,
	enableSettlementSettings:false,
	citySettings: {
		prefixArray: ["camp", "castle", "east", "edge", "ever", "great", "mount", "new", "north", "red", "rose", "south", "west"],
		suffixArray: ["wood","avon","bank", "bark", "barrow", "bay", "beach", "bell", "borough","berg", "bourne", "broad", "bridge", "brook", "brough", "burgh", "burn", "bury", "by", "canyon", "caster", "chester", "cliffe", "combe", "cot", "cott", "cote", "cove", "creek", "croft", "crook", "dale", "den", "din", "dine", "don", "downs", "falls", "field", "fin", "flats", "ford", "fork", "gate", "grove", "gum", "ham", "harbour", "heights", "hill", "holm", "hurst", "ing", "kirk", "land", "lake", "latch", "lea", "leigh", "ley", "marsh", "mere", "minster", "mond", "mont", "more", "ness", "park", "pilly", "pine", "point", "pond", "ridge", "river", "rock", "sett", "side", "son", "stead", "stoke", "stone", "stow", "terrace", "thorpe", "ton", "tor", "town", "vale", "valley", "view", "village", "ville", "water", "well", "wharf", "wick", "wood", "worth"],
	},
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

	convertStringToArray(string:string, arr:string[]): void {
		const newString = string.replace(/\s/g, '');
		const array = newString.split(',');
		array.forEach((el) => {
			arr.push(el);
		})
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Fantasy Content Generator' });
		containerEl.createEl("h3", { text: "Currency Settings" });

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

			containerEl.createEl("h4", { text: "Added Currency" });
			containerEl.createEl("p", { text: "Click remove on a currency you would like to removed" });

			const foldDiv = containerEl.createEl('details',{cls: "OFCGDetails"});
			foldDiv.createEl("summary", { text: "Currency", cls: "OFCGSummary" });

			for (let index = 0; index < this.plugin.settings.currencyTypes.length; index++) {
				new Setting(foldDiv)
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

		containerEl.createEl("h3", { text: "Settlement Settings" });

		new Setting(containerEl)
		.setName('Enable Custom Data for Settlement Generation.')
		.setDesc('Want to give your own Custom settlement prefixes or suffixes this is the option for you')
		.addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.enableSettlementSettings);
			toggle.onChange(async (value) => {
				this.plugin.settings.enableSettlementSettings = value;
				this.display();
				await this.plugin.saveSettings();
			})
		})

		if (this.plugin.settings.enableSettlementSettings) {
			let preText = "";
			let sufText = "";
			containerEl.createEl("h4", { text: "Prefixes being used" });
			new Setting(containerEl)
			.setName("New Prefix:")
			.addTextArea((text) => {
				text.onChange((value) => {
					preText = value;
				})
			})
			.addButton((btn) => {
				btn.setCta().setButtonText("Add")
					.onClick(async () => {
						this.convertStringToArray(preText, this.plugin.settings.citySettings.prefixArray);
						this.display();
						await this.plugin.saveSettings();
					})
			})

			
			containerEl.createEl("p", { text: "Click 'remove' on a prefix you would like to removed" });

			const foldDiv = containerEl.createEl('details',{cls: "OFCGDetails"});
			foldDiv.createEl("summary", { text: "Prefixes", cls: "OFCGSummary" });

			for (let index = 0; index < this.plugin.settings.citySettings.prefixArray.length; index++) {
				new Setting(foldDiv)
					.setName(this.plugin.settings.citySettings.prefixArray[index])
					.addButton((btn) => btn
						.setCta()
						.setButtonText("Remove")
						.onClick(async() => {
							this.plugin.settings.citySettings.prefixArray.splice(index, 1);
							this.display();
							await this.plugin.saveSettings();
						})
				)
				
			}

			containerEl.createEl('hr');

			containerEl.createEl("h4", { text: "Suffixes being used" });
			new Setting(containerEl)
			.setName("New Suffix:")
			.addTextArea((text) => {
				text.onChange((value) => {
					sufText = value;
				})
			})
			.addButton((btn) => {
				btn.setCta().setButtonText("Add")
					.onClick(async () => {
						this.convertStringToArray(sufText, this.plugin.settings.citySettings.suffixArray);
						this.display();
						await this.plugin.saveSettings();
					})
			})

			
			containerEl.createEl("p", { text: "Click 'remove' on a suffix you would like to removed" });

			const foldDiv2 = containerEl.createEl('details',{cls: "OFCGDetails"});
			foldDiv2.createEl("summary", { text: "Suffixes", cls: "OFCGSummary" });

			for (let index = 0; index < this.plugin.settings.citySettings.suffixArray.length; index++) {
				new Setting(foldDiv2)
					.setName(this.plugin.settings.citySettings.suffixArray[index])
					.addButton((btn) => btn
						.setCta()
						.setButtonText("Remove")
						.onClick(async() => {
							this.plugin.settings.citySettings.suffixArray.splice(index, 1);
							this.display();
							await this.plugin.saveSettings();
						})
				)
				
			}
		}
	}
}
