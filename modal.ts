import { App, DropdownComponent, Modal, Setting } from "obsidian";
import { nameByRace } from "fantasy-name-generator";
import { familyNameList } from "lists/humanFamilyNames";
import { generateShipName } from "generators/ship";
import { generatorReligions } from "generators/religions";
import { generatorAirships } from "generators/airship";
import { generatorDrinks } from "generators/drink";
import { generatorGroups } from "generators/groups";
import { generatorAnimal_groups } from "generators/animalGroups";
import { generatorMetals } from "generators/metal";
import { generatorMagical_trees } from "generators/magicalTrees";
import { elfFamilyNames } from "lists/elvenFamilyNames";
import { dwarfFamilyNames } from "lists/dwarvenFamilyNames";
import * as FCG from "fantasy-content-generator";
import { generateCityName } from "generators/city";
import { generateLoot } from "generators/loot";
import MyPlugin, { innGeneratorSettings, lootTables } from "main";
import { generateInn } from "generators/inn";
import { generatePathfinderName } from "generators/Pathfinder/pathfinderName";
import { ISettlementDomainObject } from "fantasy-content-generator/dist/interfaces";
import { generateMiscellaneousArtifacts } from "generators/artifact";

const races: string[] = ["none","none", "inn", "settlement", "none", "airships", "drinks","artifacts", "loot", "metals", "magicaltrees", "ship", "none", "animalgroups", "groups", "religion", "none", "aasimars", "catfolk", "fetchlings","halfelf","halforc","hobgoblin","ifrits","kobalds","oreads","ratfolk","sylphs","tengu","tians","tiefling","undines","angel", "cavePerson", "darkelf", "demon", "dragon", "drow", "dwarf", "elf", "fairy", "gnome", "goblin", "halfdemon", "halfling", "highelf", "highfairy", "human", "ogre", "orc"];
const racesDisplayName: string[] = ["Select a Generator to Start","--[Settlements and Buildings]--", "Inn's & Taverns", "Settlement", "--[Objects and Vehicles]--", "Airships", "Drinks","Artifacts", "Loot And Treasure", "Metals", "Magical Trees", "Ship", "--[Groups and Religions]--", "Animal Groups", "Groups", "Religion", "--[Races]--", "Aasimars", "Catfolk", "Fetchlings","Half-Elf","Half-Orc","Hobgoblin","Ifrits","Kobalds","Oreads","Ratfolk","Sylphs","Tengu","Tians","Tiefling","Undines","Angel", "Cave Person", "Dark Elf", "Demon", "Dragon", "Drow", "Dwarf", "Elf", "Fairy", "Gnome", "Goblin", "Half Demon", "Halfling", "High Elf", "High Fairy", "Human", "Ogre", "Orc"];
const pathfinderFilter = ["aasimars", "catfolk", "fetchlings","halfelf","halforc","hobgoblin","ifrits","kobalds","oreads","ratfolk","sylphs","tengu","tians","tiefling","undines"];

let genSettings = {
    race: "angel",
    gender: "male",
    multiNames: false
}

export class GeneratorModal extends Modal {
    result: string;
    onSubmit: (result: string) => void;
    plugin: MyPlugin;
    constructor(app: App, onSubmit: (result: string) => void, plugin: MyPlugin) {
        super(app);
        this.onSubmit = onSubmit;
        this.plugin = plugin;

  }

  onOpen() {
      const { contentEl } = this;
      const amountToGen = 1;
      contentEl.createEl("h1", { text: "Lets Generate!" });
      contentEl.createEl("p", { text: "Welcome to the Fantasy Content Generator! Select the Generator for the name you would like to generate below and then fill out the form." });
      contentEl.createEl("h2", { text: "Select the Generator." });
      const select = new DropdownComponent(contentEl);
      races.forEach((race,index) => {
          select.addOption(race, racesDisplayName[index]);
      })

      const optionsDiv = contentEl.createDiv();

      select.onChange((raceSelected) => {
         switch (raceSelected) {
             default:
                 this.generatorRaceSettings(optionsDiv, amountToGen, raceSelected);
                 break;
            case "ship":
                this.generatorCustomSettings(optionsDiv, amountToGen, generateShipName);
                break;
            case "religion":
                this.generatorCustomSettings(optionsDiv, amountToGen, generatorReligions);
                break;
             case "inn":
                 this.generatorInnSettings(optionsDiv, amountToGen, generateInn);
                 break;             
            case "airships":
                this.generatorCustomSettings(optionsDiv, amountToGen, generatorAirships);
                break;
            case "drinks":
                this.generatorCustomSettings(optionsDiv, amountToGen, generatorDrinks, this.plugin.settings.drinkSettings);
                break;
            case "groups":
                this.generatorCustomSettings(optionsDiv, amountToGen, generatorGroups, this.plugin.settings.groupSettings);      
                break;
            case "animalgroups":
                this.generatorCustomSettings(optionsDiv, amountToGen, generatorAnimal_groups);
                break;
             case "metals":
                this.generatorCustomSettings(optionsDiv, amountToGen, generatorMetals);
                 break;
             case "magicaltrees":
                this.generatorCustomSettings(optionsDiv, amountToGen, generatorMagical_trees);
                 break;
             case "settlement":
                 this.generatorFCGSettlementSettings(optionsDiv, amountToGen, FCG.Settlements.generate);
                 break;
             case "loot":
                this.generatorLootSettings(optionsDiv, amountToGen, generateLoot, this.plugin.settings.enableCurrency, this.plugin.settings.currencyFrequency, this.plugin.settings.currencyTypes);
                 break;
             case "artifacts":
                 this.generatorCustomSettings(optionsDiv, amountToGen, generateMiscellaneousArtifacts);
                 break;
             case "none":
                optionsDiv.innerHTML = "";
                break;
         } 
      });

    }

    generatorRaceSettings(settingsdiv: HTMLElement, genAmount: number, raceSelected: string) {
        genSettings = {
            race: "angel",
            gender: "male",
            multiNames: false
        }
        genSettings.race = raceSelected;
        settingsdiv.innerHTML = "";
        settingsdiv.createEl("h3", { text: "Customise The Generation" });
        new Setting(settingsdiv)
            .setName("Male or Female?")
            .addDropdown((drop) => {
                drop.addOption("male", "Male");
                drop.addOption("female", "Female");
                drop.onChange((value) => {
                    genSettings.gender = value;
                })
            });
        new Setting(settingsdiv)
            .setName("Family Name?")
            .addToggle((toggle) => {
                toggle.onChange((value) => {
                    genSettings.multiNames = value;
                })
            })
        new Setting(settingsdiv)
            .setName("Amount")
            .setDesc("How Many Records to Generate")
            .addText((text) => {
                text.onChange((value) => genAmount = Number(value));
                })
                    .addButton((btn) =>
                        btn.setButtonText("Generate")
                            .setCta()
                        .onClick(()=>{
                            for (let index = 0; index < genAmount; index++) {
                                let firstName;
                                let familyName = '';
                                let fullName = '';
                                if (pathfinderFilter.includes(genSettings.race)) {
                                    fullName = generatePathfinderName(genSettings.race, genSettings.gender, genSettings.multiNames);
                                    
                                } else {
                                    type gender = 'male' | 'female' | undefined;
                                    firstName = nameByRace(genSettings.race, { gender: genSettings.gender as gender});
                                    if (genSettings.multiNames === true) {
                                        familyName = genSettings.race.includes("human") || genSettings.race.includes("dwarf") || genSettings.race.includes("elf") ? " " + this.determineLastname(genSettings.race) : " " + nameByRace(genSettings.race, { gender: genSettings.gender as gender});
                                    }
                                    fullName = firstName + familyName;
                                }

                                new Setting(settingsdiv)
                                .addButton((btn) =>
                                    btn
                                        .setButtonText("Copy")
                                        .setCta()
                                        .onClick(() => {
                                            this.result = fullName;
                                            this.close();
                                            this.onSubmit(this.result);
                                        })).setName(fullName);
                            }
                        }))
        
}

    generatorInnSettings(settingsdiv: HTMLElement, genAmount: number, generatorFunction: (settings: innGeneratorSettings) => {name:string,description:string,rumors:string[]}) {
        settingsdiv.innerHTML = "";
        settingsdiv.createEl("h3", { text: "Customise The Generation" });
        genAmount = 1;
        new Setting(settingsdiv)
        .setName("Amount to Generate")
        .addText((text) => {
        text.onChange((value) => genAmount = Number(value));
        })
            .addButton((btn) =>
                btn
                    .setButtonText("Generate Names")
                    .setCta()
                    .onClick(() => {
                    for (let index = 0; index < genAmount; index++) {
                    
                        const innName = generatorFunction(this.plugin.settings.innSettings);
                        console.log(innName);
                        
                        new Setting(settingsdiv)
                            .addButton((btn) => {
                                btn.setButtonText("Copy to Clipboard")
                                    .setCta()
                                    .onClick(() => {
                                        this.result = `Name: ${innName.name}\nDescription: ${innName.description}\nRumors: ${innName.rumors.toString()}`;
                                        this.close()
                                        this.onSubmit(this.result);
                                    })
                            }).setName(innName.name);
                    
                    }
                    }));
    }
    
    generatorLootSettings(settingsdiv: HTMLElement, genAmount: number, generatorFunction: (enableCurrency:boolean, currencyFrequency: number, currencyTypes: object[], lootTable: lootTables) => string, enableCurrency:boolean, currencyFrequency: number, currencyTypes: object[]) {
        settingsdiv.innerHTML = "";
        settingsdiv.createEl("h3", { text: "Customise The Generation" });
        genAmount = 1;
        new Setting(settingsdiv)
        .setName("Amount to Generate")
        .addText((text) => {
        text.onChange((value) => genAmount = Number(value));
        })
            .addButton((btn) =>
                btn
                    .setButtonText("Generate Names")
                    .setCta()
                    .onClick(() => {
                    for (let index = 0; index < genAmount; index++) {
                    
                    const shipName = generatorFunction(enableCurrency, currencyFrequency, currencyTypes, this.plugin.settings.lootSettings);
                    
                        new Setting(settingsdiv)
                            .addButton((btn) => {
                                btn.setButtonText("Copy to Clipboard")
                                    .setCta()
                                    .onClick(() => {
                                        this.result = shipName;
                                        this.close()
                                        this.onSubmit(this.result);
                                    })
                            }).setName(shipName);
                    
                    }
                    }));
    }

    generatorFCGSettlementSettings(settingsdiv: HTMLElement, genAmount: number, generatorFunction: () => ISettlementDomainObject) {
        settingsdiv.innerHTML = "";
        settingsdiv.createEl("h3", { text: "Customise The Generation" });
        genAmount = 1;
        new Setting(settingsdiv)
            .setName("Amount to Generate")
        .addText((text) => {
        text.onChange((value) => genAmount = Number(value));
        })
            .addButton((btn) =>
                btn
                    .setButtonText("Generate Names")
                    .setCta()
                    .onClick(() => {
                    for (let index = 0; index < genAmount; index++) {
                    
                        const shipName = generatorFunction();
                        console.log(shipName);
                        
                        const name = generateCityName(this.plugin.settings.citySettings);
                        
                        new Setting(settingsdiv)
                            .addButton((btn) => {
                                btn.setButtonText("Copy to Clipboard")
                                    .setCta()
                                    .onClick(() => {
                                        
                                        this.result = "Name: " + name + "\nPopulation: " + shipName.population +"\nType: "+ shipName.type;
                                        this.close()
                                        this.onSubmit(this.result);
                                    })
                            }).setName(name + ", Population: " + shipName.population);
                    
                    }
                    }));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generatorCustomSettings(settingsdiv: HTMLElement, genAmount: number, generatorFunction: (settings ?: any) => string, settings ?: any) {
        settingsdiv.innerHTML = "";
        settingsdiv.createEl("h3", { text: "Customise The Generation" });
        genAmount = 1;
        new Setting(settingsdiv)
        .setName("Amount to Generate")
        .addText((text) => {
        text.onChange((value) => genAmount = Number(value));
        })
            .addButton((btn) =>
                btn
                    .setButtonText("Generate Names")
                    .setCta()
                    .onClick(() => {
                    for (let index = 0; index < genAmount; index++) {
                        let shipName = '';
                    if (settings !== undefined) {
                        shipName = generatorFunction(settings);
                    } else {
                        shipName = generatorFunction();
                    }

                   
                    
                        new Setting(settingsdiv)
                            .addButton((btn) => {
                                btn.setButtonText("Copy to Clipboard")
                                    .setCta()
                                    .onClick(() => {
                                        this.result = shipName;
                                        this.close()
                                        this.onSubmit(this.result);
                                    })
                            }).setName(shipName);
                    
                    }
                    }));
  }
    
    determineLastname(race: string) {

        if (race.includes("human")) {
            return this.randomItemFromArray(familyNameList);
        }
        
        if (race.includes("elf")) {
            return this.randomItemFromArray(elfFamilyNames);
        }

        if (race.includes("dwarf")) {
            return this.randomItemFromArray(dwarfFamilyNames);
        }

        return "The Unknown"
      
  }
    
  randomItemFromArray(array:string[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
    
  onClose() {
      const { contentEl } = this;
      genSettings = {
        race: "angel",
        gender: "male",
        multiNames: false
    }
    contentEl.empty();
  }
}