import FantasyPlugin from "main";
import { PluginSettingTab, App, Setting, Platform } from "obsidian";
import { cityGeneratorSetting, currency, drinkGeneratorSettings, dungeonGenSettings, exportJSON, FileWithPath, groupGenSettings, importJSON, innGeneratorSettings, lootTables } from "./Datatypes";
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
        new Setting(containerEl).setName(type + " being used").setDesc("Click 'remove' for any item you want removed from the Array");
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
        const generalSettings = containerEl.createDiv("general")
        new Setting(generalSettings)
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

        new Setting(generalSettings).setName("Inline Generator Callout").setDesc("Set callout character to activate the inline Generator.")
            .addText((text) => {
                text.setValue(String(this.plugin.settings.inlineCallout));
                text.onChange(async (value) => {
                    this.plugin.settings.inlineCallout = value;
                    await this.plugin.saveSettings();
                })
            })

        // CURRENCEY SETTINGS //

        const currencyEl = containerEl.createDiv("currencyDiv");

        new Setting(currencyEl).setHeading().setName("Currency Settings");

        new Setting(currencyEl)
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

            new Setting(currencyEl).setName("Occurance Rate:").setDesc("Set How Frequently Loot generates currency as a percentage of 100")
                .addText((text) => {
                    text.setValue(String(this.plugin.settings.currencyFrequency));
                    text.onChange(async (value) => {
                        if (!(isNaN(+value))) {
                            this.plugin.settings.currencyFrequency = Number(value);
                            await this.plugin.saveSettings();
                        }

                    })
                })

            if (Platform.isDesktopApp) {
                const importExportFile = new Setting(currencyEl)
                    .setName("Import | Export")
                    .setDesc("Import A Json File With Supported information");

                const inputAppfile = createEl("input", {
                    attr: {
                        type: "file",
                        name: "currency",
                        accept: ".json",
                        multiple: false
                    }
                });

                inputAppfile.onchange = async () => {
                    const { files } = inputAppfile;
                    if (files === null || !files.length) return;
                    try {
                        const file = files[0] as FileWithPath;
                        importJSON(file.path, async (data) => {
                            this.plugin.settings.currencyTypes = data as currency[];
                            this.display();
                            await this.plugin.saveSettings();
                        });

                    } catch (e) { /* empty */ }
                }

                importExportFile.addButton((b) => {
                    b.setButtonText("Choose Import File").setTooltip(
                        "Import Json File for the Generator"
                    ).buttonEl.appendChild(inputAppfile)
                    b.buttonEl.addClass("FCGInput");
                    b.onClick(() => inputAppfile.click());
                }).addButton((b) => {
                    b.setButtonText("Export Section To File").setCta()
                        .onClick(() => {
                            exportJSON(this.plugin.settings.currencyTypes);
                        })
                });
            }

            const ctext = {
                name: '',
                rarity: 'common'
            }
            new Setting(currencyEl)
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

            new Setting(currencyEl).setName("Added currency").setDesc("Click Remove on a Currency you would like to Remove");

            const foldDiv = currencyEl.createEl('details', { cls: "OFCGDetails" });
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
        currencyEl.createEl('hr');
        //SETTLEMENT SETTINGS//

        const settlementDiv = containerEl.createDiv("settlementDiv");
        new Setting(settlementDiv).setHeading().setName("Settlement Settings");
        settlementDiv.createEl('br');

        if (Platform.isDesktopApp) {
            const importExportFile = new Setting(settlementDiv)
                .setName("Import | Export")
                .setDesc("Import A Json File With Supported information");

            const inputAppfile = createEl("input", {
                attr: {
                    type: "file",
                    name: "settlement",
                    accept: ".json",
                    multiple: false
                }
            });

            inputAppfile.onchange = async () => {
                const { files } = inputAppfile;
                if (files === null || !files.length) return;
                try {
                    const file = files[0] as FileWithPath;
                    importJSON(file.path, async (data) => {
                        this.plugin.settings.citySettings = data as cityGeneratorSetting;
                        this.display();
                        await this.plugin.saveSettings();
                    });

                } catch (e) { /* empty */ }
            }

            importExportFile.addButton((b) => {
                b.setButtonText("Choose Import File").setTooltip(
                    "Import Json File for the Generator"
                ).buttonEl.appendChild(inputAppfile)
                b.buttonEl.addClass("FCGInput");
                b.onClick(() => inputAppfile.click());
            }).addButton((b) => {
                b.setButtonText("Export Section To File").setCta()
                    .onClick(() => {
                        exportJSON(this.plugin.settings.citySettings);
                    })
            });
        }

        const preText = "";
        const sufText = "";
        this.createSettingsBlock(settlementDiv, preText, this.plugin.settings.citySettings.prefixArray, "Prefixes");
        this.createSettingsBlock(settlementDiv, sufText, this.plugin.settings.citySettings.suffixArray, "Suffixes");

        // END SETTLEMENT SETTINGS //

        // INN'S / TAVERN SETTINGS //
        const innDiv = containerEl.createDiv("innDiv");
        new Setting(innDiv).setHeading().setName("Inn Settings");
        innDiv.createEl('br');

        if (Platform.isDesktopApp) {
            const importExportFile = new Setting(innDiv)
                .setName("Import | Export")
                .setDesc("Import A Json File With Supported information");

            const inputAppfile = createEl("input", {
                attr: {
                    type: "file",
                    name: "inn",
                    accept: ".json",
                    multiple: false
                }
            });

            inputAppfile.onchange = async () => {
                const { files } = inputAppfile;
                if (files === null || !files.length) return;
                try {
                    const file = files[0] as FileWithPath;
                    importJSON(file.path, async (data) => {
                        this.plugin.settings.innSettings = data as innGeneratorSettings;
                        this.display();
                        await this.plugin.saveSettings();
                    });

                } catch (e) { /* empty */ }
            }

            importExportFile.addButton((b) => {
                b.setButtonText("Choose Import File").setTooltip(
                    "Import Json File for the Generator"
                ).buttonEl.appendChild(inputAppfile)
                b.buttonEl.addClass("FCGInput");
                b.onClick(() => inputAppfile.click());
            }).addButton((b) => {
                b.setButtonText("Export Section To File").setCta()
                    .onClick(() => {
                        exportJSON(this.plugin.settings.innSettings);
                    })
            });
        }

        const innPreText = "";
        const innTypeText = "";
        const innNounText = "";
        const innDescText = "";
        const innRumorText = "";

        this.createSettingsBlock(innDiv, innPreText, this.plugin.settings.innSettings.prefixes, "Prefixes");
        this.createSettingsBlock(innDiv, innTypeText, this.plugin.settings.innSettings.innType, "Type's");
        this.createSettingsBlock(innDiv, innNounText, this.plugin.settings.innSettings.nouns, "Nouns");
        this.createSettingsBlock(innDiv, innDescText, this.plugin.settings.innSettings.desc, "Description's");
        this.createSettingsBlock(innDiv, innRumorText, this.plugin.settings.innSettings.rumors, "Rumors");

        // END INN'S / TAVERN SETTINGS //

        // DRINK SETTINGS //

        const drinkDiv = containerEl.createDiv("drinkDiv");
        new Setting(drinkDiv).setHeading().setName("Drink Settings");
        drinkDiv.createEl('br');

        if (Platform.isDesktopApp) {
            const importExportFile = new Setting(drinkDiv)
                .setName("Import | Export")
                .setDesc("Import A Json File With Supported information");

            const inputAppfile = createEl("input", {
                attr: {
                    type: "file",
                    name: "drink",
                    accept: ".json",
                    multiple: false
                }
            });

            inputAppfile.onchange = async () => {
                const { files } = inputAppfile;
                if (files === null || !files.length) return;
                try {
                    const file = files[0] as FileWithPath;
                    importJSON(file.path, async (data) => {
                        this.plugin.settings.drinkSettings = data as drinkGeneratorSettings;
                        this.display();
                        await this.plugin.saveSettings();
                    });

                } catch (e) { /* empty */ }
            }

            importExportFile.addButton((b) => {
                b.setButtonText("Choose Import File").setTooltip(
                    "Import Json File for the Generator"
                ).buttonEl.appendChild(inputAppfile)
                b.buttonEl.addClass("FCGInput");
                b.onClick(() => inputAppfile.click());
            }).addButton((b) => {
                b.setButtonText("Export Section To File").setCta()
                    .onClick(() => {
                        exportJSON(this.plugin.settings.drinkSettings);
                    })
            });
        }

        const drinkNounText = "";
        const drinkAdjText = "";

        this.createSettingsBlock(drinkDiv, drinkAdjText, this.plugin.settings.drinkSettings.adj, "Adjectives");
        this.createSettingsBlock(drinkDiv, drinkNounText, this.plugin.settings.drinkSettings.nouns, "Nouns");

        // LOOT SETTINGS //

        const lootDiv = containerEl.createDiv("lootDiv");
        new Setting(lootDiv).setHeading().setName("Loot Settings");
        lootDiv.createEl('br');

        if (Platform.isDesktopApp) {
            const importExportFile = new Setting(lootDiv)
                .setName("Import | Export")
                .setDesc("Import A Json File With Supported information");

            const inputAppfile = createEl("input", {
                attr: {
                    type: "file",
                    name: "loot",
                    accept: ".json",
                    multiple: false
                }
            });

            inputAppfile.onchange = async () => {
                const { files } = inputAppfile;
                if (files === null || !files.length) return;
                try {
                    const file = files[0] as FileWithPath;
                    importJSON(file.path, async (data) => {
                        this.plugin.settings.lootSettings = data as lootTables;
                        this.display();
                        await this.plugin.saveSettings();
                    });

                } catch (e) { /* empty */ }
            }

            importExportFile.addButton((b) => {
                b.setButtonText("Choose Import File").setTooltip(
                    "Import Json File for the Generator"
                ).buttonEl.appendChild(inputAppfile)
                b.buttonEl.addClass("FCGInput");
                b.onClick(() => inputAppfile.click());
            }).addButton((b) => {
                b.setButtonText("Export Section To File").setCta()
                    .onClick(() => {
                        exportJSON(this.plugin.settings.lootSettings);
                    })
            });
        }

        const lootNounText = "";
        const lootAdjText = "";

        this.createSettingsBlock(lootDiv, lootAdjText, this.plugin.settings.drinkSettings.adj, "Adjectives");
        this.createSettingsBlock(lootDiv, lootNounText, this.plugin.settings.drinkSettings.nouns, "Nouns");

        // GROUP SETTINGS //

        const groupDiv = containerEl.createDiv("groupDiv");
        new Setting(groupDiv).setHeading().setName("Group Settings");
        groupDiv.createEl('br');

        if (Platform.isDesktopApp) {
            const importExportFile = new Setting(groupDiv)
                .setName("Import | Export")
                .setDesc("Import A Json File With Supported information");

            const inputAppfile = createEl("input", {
                attr: {
                    type: "file",
                    name: "group",
                    accept: ".json",
                    multiple: false
                }
            });

            inputAppfile.onchange = async () => {
                const { files } = inputAppfile;
                if (files === null || !files.length) return;
                try {
                    const file = files[0] as FileWithPath;
                    importJSON(file.path, async (data) => {
                        this.plugin.settings.groupSettings = data as groupGenSettings;
                        this.display();
                        await this.plugin.saveSettings();
                    });

                } catch (e) { /* empty */ }
            }

            importExportFile.addButton((b) => {
                b.setButtonText("Choose Import File").setTooltip(
                    "Import Json File for the Generator"
                ).buttonEl.appendChild(inputAppfile)
                b.buttonEl.addClass("FCGInput");
                b.onClick(() => inputAppfile.click());
            }).addButton((b) => {
                b.setButtonText("Export Section To File").setCta()
                    .onClick(() => {
                        exportJSON(this.plugin.settings.groupSettings);
                    })
            });
        }

        const groupAdjectives = ''
        const groupNouns = ''
        const groupNounsPlural = ''
        const groupTypes = ''
        const groupSingleDescriptors = ''

        this.createSettingsBlock(groupDiv, groupAdjectives, this.plugin.settings.groupSettings.adj, "Adjectives");
        this.createSettingsBlock(groupDiv, groupNouns, this.plugin.settings.groupSettings.nouns, "Nouns");
        this.createSettingsBlock(groupDiv, groupNounsPlural, this.plugin.settings.groupSettings.nounsP, "Plural Nouns");
        this.createSettingsBlock(groupDiv, groupTypes, this.plugin.settings.groupSettings.groupTypes, "Types");
        this.createSettingsBlock(groupDiv, groupSingleDescriptors, this.plugin.settings.groupSettings.singleDescriptors, "Descriptors");

        // END GROUP SETTINGS //

        const dungDiv = containerEl.createDiv("dungDiv");
        new Setting(dungDiv).setHeading().setName("Dungeon Settings");
        dungDiv.createEl('br');

        if (Platform.isDesktopApp) {
            const importExportFile = new Setting(dungDiv)
                .setName("Import | Export")
                .setDesc("Import A Json File With Supported information");

            const inputAppfile = createEl("input", {
                attr: {
                    type: "file",
                    name: "dungeon",
                    accept: ".json",
                    multiple: false
                }
            });

            inputAppfile.onchange = async () => {
                const { files } = inputAppfile;
                if (files === null || !files.length) return;
                try {
                    const file = files[0] as FileWithPath;
                    importJSON(file.path, async (data) => {
                        this.plugin.settings.dungeonSettings = data as dungeonGenSettings;
                        this.display();
                        await this.plugin.saveSettings();
                    });

                } catch (e) { /* empty */ }
            }

            importExportFile.addButton((b) => {
                b.setButtonText("Choose Import File").setTooltip(
                    "Import Json File for the Generator"
                ).buttonEl.appendChild(inputAppfile)
                b.buttonEl.addClass("FCGInput");
                b.onClick(() => inputAppfile.click());
            }).addButton((b) => {
                b.setButtonText("Export Section To File").setCta()
                    .onClick(() => {
                        exportJSON(this.plugin.settings.dungeonSettings);
                    })
            });
        }

        const dungAdjectives = ''
        const dungNouns = ''
        const dungTypes = ''
        const dungLocations = ''
        const dungRandomDesc = ''

        this.createSettingsBlock(dungDiv, dungAdjectives, this.plugin.settings.dungeonSettings.adjectives, "Adjectives");
        this.createSettingsBlock(dungDiv, dungNouns, this.plugin.settings.groupSettings.nouns, "Nouns");
        this.createSettingsBlock(dungDiv, dungLocations, this.plugin.settings.dungeonSettings.locations, "Locations");
        this.createSettingsBlock(dungDiv, dungTypes, this.plugin.settings.dungeonSettings.dungeonTypes, "Types");
        this.createSettingsBlock(dungDiv, dungRandomDesc, this.plugin.settings.dungeonSettings.randomDesc, "Descriptors");
    }

}
