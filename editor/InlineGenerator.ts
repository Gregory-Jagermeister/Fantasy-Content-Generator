import { nameByRace } from "fantasy-name-generator";
import { generateCityName } from "generators/city";
import { generateDungeonName } from "generators/dungeon";
import { generateInn } from "generators/inn";
import { dwarfFamilyNames } from "lists/dwarvenFamilyNames";
import { elfFamilyNames } from "lists/elvenFamilyNames";
import { familyNameList } from "lists/humanFamilyNames";
import { titleLastNames } from "lists/titleLastNames";
import * as FCG from "fantasy-content-generator";
import FantasyPlugin from "main";
import { Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo } from "obsidian";
import { generatorAirships } from "generators/airship";
import { generatorDrinks } from "generators/drink";
import { generateMiscellaneousArtifacts } from "generators/artifact";
import { generateLoot } from "generators/loot";
import { generatorMetals } from "generators/metal";
import { generatorMagical_trees } from "generators/magicalTrees";
import { generateShipName } from "generators/ship";
import { generatorAnimal_groups } from "generators/animalGroups";
import { generatorGroups } from "generators/groups";
import { generatorReligions } from "generators/religions";
import { generatePathfinderName } from "generators/Pathfinder/pathfinderName";
import { generatePlotHook } from "generators/plothook";
import { generateTradingPost } from "generators/tradingPost";

type Generator = () => string | Error;

//An interface to be used with Getting the keys of the Generator object.
interface Generators {
    [key: string]: Generator;
}


export class InlineGeneratorSuggester extends EditorSuggest<string> {
    private getCompletions: () => string[]; // function to retrieve completions
    startChar: EditorPosition
    endChar: EditorPosition
    plugin: FantasyPlugin

    //An object storing all the Generator functions used by the particular selection
    private generators: Generators = {
        'TradingPost': () => "Trading Post Name: " + generateCityName(this.plugin.settings.citySettings) + "\n" + generateTradingPost(),
        'ElfMale': () => nameByRace("elf", { gender: "male" }),
        'ElfMaleLastname': () => nameByRace("elf", { gender: "male" }) + " " + elfFamilyNames[Math.floor(Math.random() * elfFamilyNames.length)],
        'ElfFemale': () => nameByRace("elf", { gender: "female" }),
        'ElfFemaleLastname': () => nameByRace("elf", { gender: "female" }) + " " + elfFamilyNames[Math.floor(Math.random() * elfFamilyNames.length)],
        'Orc': () => nameByRace("orc"),
        'OrcLastname': () => nameByRace("orc") + " " + titleLastNames[Math.floor(Math.random() * titleLastNames.length)],
        'DwarfMale': () => nameByRace("elf", { gender: "male" }),
        'DwarfMaleLastname': () => nameByRace("elf", { gender: "male" }) + " " + dwarfFamilyNames[Math.floor(Math.random() * dwarfFamilyNames.length)],
        'DwarfFemale': () => nameByRace("elf", { gender: "female" }),
        'DwarfFemaleLastname': () => nameByRace("elf", { gender: "female" }) + " " + dwarfFamilyNames[Math.floor(Math.random() * dwarfFamilyNames.length)],
        'HumanMale': () => nameByRace("elf", { gender: "male" }),
        'HumanFemale': () => nameByRace("elf", { gender: "female" }),
        'HumanMaleLastname': () => nameByRace("elf", { gender: "male" }) + " " + familyNameList[Math.floor(Math.random() * familyNameList.length)],
        'HumanFemaleLastname': () => nameByRace("elf", { gender: "female" }) + " " + familyNameList[Math.floor(Math.random() * familyNameList.length)],
        "DungeonsLabryinths": () => generateDungeonName(this.plugin.settings.dungeonSettings),
        "InnsTaverns": () => {
            const innInfo = generateInn(this.plugin.settings.innSettings);
            return innInfo.name + "\nDescription: " + innInfo.description + "\nRumors: " + innInfo.rumors;
        },
        "Settlement": () => {
            const CityInfo = FCG.Settlements.generate();
            const name = generateCityName(this.plugin.settings.citySettings);
            return "Name: " + name + "\nPopulation: " + CityInfo.population + "\nType: " + CityInfo.type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
        },
        "Airships": () => generatorAirships(),
        "Drinks": () => generatorDrinks(this.plugin.settings.drinkSettings),
        "Artifacts": () => generateMiscellaneousArtifacts(),
        "LootTreasure": () => generateLoot(this.plugin.settings.enableCurrency, this.plugin.settings.currencyFrequency, this.plugin.settings.currencyTypes, this.plugin.settings.lootSettings),
        "Metals": () => generatorMetals(),
        "MagicalTrees": () => generatorMagical_trees(),
        "Ship": () => generateShipName(),
        "AnimalGroups": () => generatorAnimal_groups(),
        "Groups": () => generatorGroups(this.plugin.settings.groupSettings),
        "Religion": () => generatorReligions(),
        "AasimarsLastname": () => generatePathfinderName("aasimars", "male", true),
        "CatfolkLastname": () => generatePathfinderName("catfolk", "male", true),
        "FetchlingsLastname": () => generatePathfinderName("fetchlings", "male", true),
        "HalfElfLastname": () => generatePathfinderName("halfelf", "male", true),
        "HalfOrcLastname": () => generatePathfinderName("halforc", "male", true),
        "HobgoblinLastname": () => generatePathfinderName("hobgoblin", "male", true),
        "IfritsLastname": () => generatePathfinderName("ifrits", "male", true),
        "KobaldsLastname": () => generatePathfinderName("kobalds", "male", true),
        "OreadsLastname": () => generatePathfinderName("oreads", "male", true),
        "RatfolkLastname": () => generatePathfinderName("ratfolk", "male", true),
        "SylphsLastname": () => generatePathfinderName("sylphs", "male", true),
        "TenguLastname": () => generatePathfinderName("tengu", "male", true),
        "TiansLastname": () => generatePathfinderName("tians", "male", true),
        "TieflingLastname": () => generatePathfinderName("tiefling", "male", true),
        "UndinesLastname": () => generatePathfinderName("undines", "male", true),
        "AngelMaleLastname": () => nameByRace("angel", { gender: "male" }) + " " + nameByRace("angel", { gender: "male" }),
        "AngelFemaleLastname": () => nameByRace("angel", { gender: "female" }) + " " + nameByRace("angel", { gender: "female" }),
        "CavePersonMaleLastname": () => nameByRace("cavePerson", { gender: "male" }) + " " + nameByRace("cavePerson", { gender: "male" }),
        "CavePersonFemaleLastname": () => nameByRace("cavePerson", { gender: "female" }) + " " + nameByRace("cavePerson", { gender: "female" }),
        "DarkElfMaleLastname": () => nameByRace("darkelf", { gender: "male" }) + " " + nameByRace("darkelf", { gender: "male" }),
        "DarkElfFemaleLastname": () => nameByRace("darkelf", { gender: "female" }) + " " + nameByRace("darkelf", { gender: "female" }),
        "DemonLastname": () => nameByRace("demon") + " " + nameByRace("demon"),
        "DragonMaleLastname": () => nameByRace("dragon", { gender: "male" }) + " " + nameByRace("dragon", { gender: "male" }),
        "DragonFemaleLastname": () => nameByRace("dragon", { gender: "female" }) + " " + nameByRace("dragon", { gender: "female" }),
        "DrowMaleLastname": () => nameByRace("drow", { gender: "male" }) + " " + nameByRace("drow", { gender: "male" }),
        "DrowFemaleLastname": () => nameByRace("drow", { gender: "female" }) + " " + nameByRace("drow", { gender: "female" }),
        "FairyMaleLastname": () => nameByRace("fairy", { gender: "male" }) + " " + nameByRace("fairy", { gender: "male" }),
        "FairyFemaleLastname": () => nameByRace("fairy", { gender: "female" }) + " " + nameByRace("fairy", { gender: "female" }),
        "GnomeMaleLastname": () => nameByRace("gnome", { gender: "male" }) + " " + nameByRace("gnome", { gender: "male" }),
        "GnomeFemaleLastname": () => nameByRace("gnome", { gender: "female" }) + " " + nameByRace("gnome", { gender: "female" }),
        "GoblinLastname": () => nameByRace("goblin") + " " + nameByRace("goblin"),
        "HalfDemonMaleLastname": () => nameByRace("halfdemon", { gender: "male" }) + " " + nameByRace("halfdemon", { gender: "male" }),
        "HalfDemonFemaleLastname": () => nameByRace("halfdemon", { gender: "female" }) + " " + nameByRace("halfdemon", { gender: "female" }),
        "HalflingMaleLastname": () => nameByRace("halfling", { gender: "male" }) + " " + nameByRace("halfling", { gender: "male" }),
        "HalflingFemaleLastname": () => nameByRace("halfling", { gender: "female" }) + " " + nameByRace("halfling", { gender: "female" }),
        "HighElfMaleLastname": () => nameByRace("highelf", { gender: "male" }) + " " + nameByRace("highelf", { gender: "male" }),
        "HighElfFemaleLastname": () => nameByRace("highelf", { gender: "female" }) + " " + nameByRace("highelf", { gender: "female" }),
        "HighFairyMaleLastname": () => nameByRace("highfairy", { gender: "male" }) + " " + nameByRace("highfairy", { gender: "male" }),
        "HighFairyFemaleLastname": () => nameByRace("highfairy", { gender: "female" }) + " " + nameByRace("angel", { gender: "female" }),
        "OgreLastname": () => nameByRace("ogre") + " " + nameByRace("ogre"),
        "Aasimars": () => generatePathfinderName("aasimars", "male", false),
        "Catfolk": () => generatePathfinderName("catfolk", "male", false),
        "Fetchlings": () => generatePathfinderName("fetchlings", "male", false),
        "HalfElf": () => generatePathfinderName("halfelf", "male", false),
        "HalfOrc": () => generatePathfinderName("halforc", "male", false),
        "Hobgoblin": () => generatePathfinderName("hobgoblin", "male", false),
        "Ifrits": () => generatePathfinderName("ifrits", "male", false),
        "Kobalds": () => generatePathfinderName("kobalds", "male", false),
        "Oreads": () => generatePathfinderName("oreads", "male", false),
        "Ratfolk": () => generatePathfinderName("ratfolk", "male", false),
        "Sylphs": () => generatePathfinderName("sylphs", "male", false),
        "Tengu": () => generatePathfinderName("tengu", "male", false),
        "Tians": () => generatePathfinderName("tians", "male", false),
        "Tiefling": () => generatePathfinderName("tiefling", "male", false),
        "Undines": () => generatePathfinderName("undines", "male", false),
        "AngelMale": () => nameByRace("angel", { gender: "male" }),
        "CavePersonMale": () => nameByRace("cavePerson", { gender: "male" }),
        "DarkElfMale": () => nameByRace("darkelf", { gender: "male" }),
        "DragonMale": () => nameByRace("dragon", { gender: "male" }),
        "DrowMale": () => nameByRace("drow", { gender: "male" }),
        "FairyMale": () => nameByRace("fairy", { gender: "male" }),
        "GnomeMale": () => nameByRace("Gnome", { gender: "male" }),
        "HalfDemonMale": () => nameByRace("halfdemon", { gender: "male" }),
        "HalflingMale": () => nameByRace("halfling", { gender: "male" }),
        "HighElfMale": () => nameByRace("highelf", { gender: "male" }),
        "HighFairyMale": () => nameByRace("highfairy", { gender: "male" }),
        "Ogre": () => nameByRace("ogre"),
        "AngelFemale": () => nameByRace("angel", { gender: "female" }),
        "CavePersonFemale": () => nameByRace("cavePerson", { gender: "female" }),
        "DarkElfFemale": () => nameByRace("darkelf", { gender: "female" }),
        "Demon": () => nameByRace("demon"),
        "DragonFemale": () => nameByRace("dragon", { gender: "female" }),
        "DrowFemale": () => nameByRace("drow", { gender: "female" }),
        "FairyFemale": () => nameByRace("fairy", { gender: "female" }),
        "GnomeFemale": () => nameByRace("gnome", { gender: "female" }),
        "Goblin": () => nameByRace("goblin"),
        "HalfDemonFemale": () => nameByRace("halfdemon", { gender: "female" }),
        "HalflingFemale": () => nameByRace("halfling", { gender: "female" }),
        "HighElfFemale": () => nameByRace("highelf", { gender: "female" }),
        "HighFairyFemale": () => nameByRace("highfairy", { gender: "female" }),
        "PlotStoryHooks": () => generatePlotHook(),
    }

    constructor(getCompletions: () => string[], plugin: FantasyPlugin) {
        super(app);
        this.getCompletions = getCompletions;
        this.plugin = plugin;
    }

    onTrigger(
        cursor: EditorPosition,
        editor: Editor
    ): EditorSuggestTriggerInfo | null {
        // check if the cursor is immediately following the Callout defined in settings
        const callOut = this.plugin.settings.inlineCallout;
        const escapedCallOut = callOut.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regEx = new RegExp(`${escapedCallOut}(\\S*)`);
        const line = editor.getLine(cursor.line);
        const match = line.slice(0, cursor.ch).match(regEx);

        if (!match) {
            return null;
        }

        const start = { line: cursor.line, ch: cursor.ch - match[1].length - callOut.length };
        const end = { line: cursor.line, ch: cursor.ch };

        this.startChar = start;
        this.endChar = end;

        return { start, end, query: match[1] };
    }

    getSuggestions(context: EditorSuggestContext): string[] {
        return this.getCompletions().filter((s) => s.toLowerCase().startsWith(context.query.toLowerCase()));
    }

    renderSuggestion(value: string, el: HTMLElement): void {
        el.createEl("div", { text: value });
    }

    selectSuggestion(value: string, _evt: MouseEvent | KeyboardEvent): void {
        // execute the selected function if the function does not exist then return "not implemented"
        let result: string | Error = "Not Implemented";
        if (value in this.generators) {
            result = this.generators[value]();
        }

        if (this.plugin.currentEditor) {
            this.plugin.currentEditor.replaceRange(result.toString(), this.startChar, this.endChar);
        }
    }
}
