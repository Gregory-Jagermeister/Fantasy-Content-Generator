import FantasyPlugin from "main";
import { PluginSettingTab, App, Setting } from "obsidian";
import { DEFAULT_SETTINGS } from "./DefaultSetting";

export class SettingTab extends PluginSettingTab {
    plugin: FantasyPlugin;

    constructor(app: App, plugin: FantasyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    convertStringToArray(string: string, arr: string[]): void {
        //const newString = string.replace(/\s/g, '');
        const array = string.split(',');
        array.forEach((el) => {
            arr.push(el);
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createSettingsBlock(containerEl: HTMLElement, textA: string, arr: any[], type: string): void {
        new Setting(containerEl)
            .setName("New Addition:")
            .addTextArea((text) => {
                text.onChange((value) => {
                    textA = value;
                })
            })
            .addButton((btn) => {
                btn.setCta().setButtonText("Add")
                    .onClick(async () => {
                        this.convertStringToArray(textA, arr);
                        this.display();
                        await this.plugin.saveSettings();
                    })
            })


        containerEl.createEl("p", { text: "Click 'remove' on a prefix you would like to removed" });

        const foldDiv = containerEl.createEl('details', { cls: "OFCGDetails" });
        foldDiv.createEl("summary", { text: type, cls: "OFCGSummary" });

        for (let index = 0; index < arr.length; index++) {
            new Setting(foldDiv)
                .setName(arr[index])
                .addButton((btn) => btn
                    .setCta()
                    .setButtonText("Remove")
                    .onClick(async () => {
                        arr.splice(index, 1);
                        this.display();
                        await this.plugin.saveSettings();
                    })
                )

        }

        containerEl.createEl('hr');
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h1', { text: 'Fantasy Content Generator' });

        new Setting(containerEl)
            .setName('Reset To Defaults')
            .setDesc('Click if you would like to use the default settings again')
            .addButton((btn) => {
                btn.setCta()
                    .setButtonText("Reset")
                    .onClick(async () => {
                        this.plugin.settings = DEFAULT_SETTINGS;
                        this.display();
                        await this.plugin.saveSettings();
                    })
            })

        new Setting(containerEl).setName("Inline Generator Callout").setDesc("Set callout character to activate the inline Generator.")
            .addText((text) => {
                text.setValue(String(this.plugin.settings.inlineCallout));
                text.onChange(async (value) => {
                    this.plugin.settings.inlineCallout = value;
                    await this.plugin.saveSettings();
                })
            })

        // CURRENCEY SETTINGS //

        containerEl.createEl("h2", { text: "Currency Settings" });

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
                    text.onChange(async (value) => {
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

            const foldDiv = containerEl.createEl('details', { cls: "OFCGDetails" });
            foldDiv.createEl("summary", { text: "Currency", cls: "OFCGSummary" });

            for (let index = 0; index < this.plugin.settings.currencyTypes.length; index++) {
                new Setting(foldDiv)
                    .setName(this.plugin.settings.currencyTypes[index].name)
                    .addButton((btn) => btn
                        .setCta()
                        .setButtonText("Remove")
                        .onClick(async () => {
                            this.plugin.settings.currencyTypes.splice(index, 1);
                            this.display();
                            await this.plugin.saveSettings();
                        })
                    )

            }

        }

        // END CURRENCY SETTINGS //

        containerEl.createEl('hr');

        //SETTLEMENT SETTINGS//

        containerEl.createEl("h2", { text: "Settlement Settings" });

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

        const foldDiv = containerEl.createEl('details', { cls: "OFCGDetails" });
        foldDiv.createEl("summary", { text: "Prefixes", cls: "OFCGSummary" });

        for (let index = 0; index < this.plugin.settings.citySettings.prefixArray.length; index++) {
            new Setting(foldDiv)
                .setName(this.plugin.settings.citySettings.prefixArray[index])
                .addButton((btn) => btn
                    .setCta()
                    .setButtonText("Remove")
                    .onClick(async () => {
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

        const foldDiv2 = containerEl.createEl('details', { cls: "OFCGDetails" });
        foldDiv2.createEl("summary", { text: "Suffixes", cls: "OFCGSummary" });

        for (let index = 0; index < this.plugin.settings.citySettings.suffixArray.length; index++) {
            new Setting(foldDiv2)
                .setName(this.plugin.settings.citySettings.suffixArray[index])
                .addButton((btn) => btn
                    .setCta()
                    .setButtonText("Remove")
                    .onClick(async () => {
                        this.plugin.settings.citySettings.suffixArray.splice(index, 1);
                        this.display();
                        await this.plugin.saveSettings();
                    })
                )

        }

        // END SETTLEMENT SETTINGS //

        containerEl.createEl('hr');

        // INN'S / TAVERN SETTINGS //
        containerEl.createEl("h2", { text: "Inn & Tavern Settings" });

        const innPreText = "";
        const innTypeText = "";
        const innNounText = "";
        const innDescText = "";
        const innRumorText = "";

        containerEl.createEl("h4", { text: "Prefixes being used" });
        this.createSettingsBlock(containerEl, innPreText, this.plugin.settings.innSettings.prefixes, "Prefixes");

        containerEl.createEl("h4", { text: "Type's being used" });
        this.createSettingsBlock(containerEl, innTypeText, this.plugin.settings.innSettings.innType, "Type's");

        containerEl.createEl("h4", { text: "Nouns being used" });
        this.createSettingsBlock(containerEl, innNounText, this.plugin.settings.innSettings.nouns, "Nouns");

        containerEl.createEl("h4", { text: "Description's being used" });
        this.createSettingsBlock(containerEl, innDescText, this.plugin.settings.innSettings.desc, "Description's");

        containerEl.createEl("h4", { text: "Rumors being used" });
        this.createSettingsBlock(containerEl, innRumorText, this.plugin.settings.innSettings.rumors, "Rumors");

        // END INN'S / TAVERN SETTINGS //

        // DRINK SETTINGS //

        containerEl.createEl("h2", { text: "Drink Generator Settings" });

        const drinkNounText = "";
        const drinkAdjText = "";

        containerEl.createEl("h4", { text: "Adjectives being used" });
        this.createSettingsBlock(containerEl, drinkAdjText, this.plugin.settings.drinkSettings.adj, "Adjectives");

        containerEl.createEl("h4", { text: "Nouns being used" });
        this.createSettingsBlock(containerEl, drinkNounText, this.plugin.settings.drinkSettings.nouns, "Nouns");

        // LOOT SETTINGS //

        containerEl.createEl("h2", { text: "Loot Generator Settings" });

        const lootNounText = "";
        const lootAdjText = "";

        containerEl.createEl("h4", { text: "Adjectives being used" });
        this.createSettingsBlock(containerEl, lootAdjText, this.plugin.settings.drinkSettings.adj, "Adjectives");

        containerEl.createEl("h4", { text: "Nouns being used" });
        this.createSettingsBlock(containerEl, lootNounText, this.plugin.settings.drinkSettings.nouns, "Nouns");

        // GROUP SETTINGS //

        containerEl.createEl("h2", { text: "Group Generator Settings" });

        const groupAdjectives = ''
        const groupNouns = ''
        const groupNounsPlural = ''
        const groupTypes = ''
        const groupSingleDescriptors = ''

        containerEl.createEl("h4", { text: "Adjectives being used" });
        this.createSettingsBlock(containerEl, groupAdjectives, this.plugin.settings.groupSettings.adj, "Adjectives");

        containerEl.createEl("h4", { text: "Nouns being used" });
        this.createSettingsBlock(containerEl, groupNouns, this.plugin.settings.groupSettings.nouns, "Nouns");

        containerEl.createEl("h4", { text: "Plural Nouns being used" });
        this.createSettingsBlock(containerEl, groupNounsPlural, this.plugin.settings.groupSettings.nounsP, "Plural Nouns");

        containerEl.createEl("h4", { text: "Group Types being used" });
        this.createSettingsBlock(containerEl, groupTypes, this.plugin.settings.groupSettings.groupTypes, "Types");

        containerEl.createEl("h4", { text: "Single Descriptors being used" });
        this.createSettingsBlock(containerEl, groupSingleDescriptors, this.plugin.settings.groupSettings.singleDescriptors, "Descriptors");

        // END GROUP SETTINGS //

        containerEl.createEl("h2", { text: "Dungeon Generator Settings" });

        const dungAdjectives = ''
        const dungNouns = ''
        const dungTypes = ''
        const dungLocations = ''
        const dungRandomDesc = ''

        containerEl.createEl("h4", { text: "Adjectives being used" });
        this.createSettingsBlock(containerEl, dungAdjectives, this.plugin.settings.dungeonSettings.adjectives, "Adjectives");

        containerEl.createEl("h4", { text: "Nouns being used" });
        this.createSettingsBlock(containerEl, dungNouns, this.plugin.settings.groupSettings.nouns, "Nouns");

        containerEl.createEl("h4", { text: "Locations being used" });
        this.createSettingsBlock(containerEl, dungLocations, this.plugin.settings.dungeonSettings.locations, "Locations");

        containerEl.createEl("h4", { text: "Dungeon Types being used" });
        this.createSettingsBlock(containerEl, dungTypes, this.plugin.settings.dungeonSettings.dungeonTypes, "Types");

        containerEl.createEl("h4", { text: "Random Descriptions being used" });
        this.createSettingsBlock(containerEl, dungRandomDesc, this.plugin.settings.dungeonSettings.randomDesc, "Descriptors");
    }

}
