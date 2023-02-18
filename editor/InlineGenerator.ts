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
import { Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, MarkdownView } from "obsidian";
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
        'Gen-ElfMale': () => nameByRace("elf", { gender: "male" }),
        'Gen-ElfMaleLastname': () => nameByRace("elf", { gender: "male" }) + " " + elfFamilyNames[Math.floor(Math.random() * elfFamilyNames.length)],
        'Gen-ElfFemale': () => nameByRace("elf", { gender: "female" }),
        'Gen-ElfFemaleLastname': () => nameByRace("elf", { gender: "female" }) + " " + elfFamilyNames[Math.floor(Math.random() * elfFamilyNames.length)],
        'Gen-Orc': () => nameByRace("orc"),
        'Gen-OrcLastname': () => nameByRace("orc") + " " + titleLastNames[Math.floor(Math.random() * titleLastNames.length)],
        'Gen-DwarfMale': () => nameByRace("elf", { gender: "male" }),
        'Gen-DwarfMaleLastname': () => nameByRace("elf", { gender: "male" }) + " " + dwarfFamilyNames[Math.floor(Math.random() * dwarfFamilyNames.length)],
        'Gen-DwarfFemale': () => nameByRace("elf", { gender: "female" }),
        'Gen-DwarfFemaleLastname': () => nameByRace("elf", { gender: "female" }) + " " + dwarfFamilyNames[Math.floor(Math.random() * dwarfFamilyNames.length)],
        'Gen-HumanMale': () => nameByRace("elf", { gender: "male" }),
        'Gen-HumanFemale': () => nameByRace("elf", { gender: "female" }),
        'Gen-HumanMaleLastname': () => nameByRace("elf", { gender: "male" }) + " " + familyNameList[Math.floor(Math.random() * familyNameList.length)],
        'Gen-HumanFemaleLastname': () => nameByRace("elf", { gender: "female" }) + " " + familyNameList[Math.floor(Math.random() * familyNameList.length)],
        "Gen-DungeonsLabryinths": () => generateDungeonName(this.plugin.settings.dungeonSettings),
        "Gen-InnsTaverns": () => {
            const innInfo = generateInn(this.plugin.settings.innSettings);
            return innInfo.name + "\nDescription: " + innInfo.description + "\nRumors: " + innInfo.rumors;
        },
        "Gen-Settlement": () => {
            const CityInfo = FCG.Settlements.generate();
            const name = generateCityName(this.plugin.settings.citySettings);
            return "Name: " + name + "\nPopulation: " + CityInfo.population + "\nType: " + CityInfo.type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
        },
        "Gen-Airships": () => generatorAirships(),
        "Gen-Drinks": () => generatorDrinks(this.plugin.settings.drinkSettings),
        "Gen-Artifacts": () => generateMiscellaneousArtifacts(),
        "Gen-LootTreasure": () => generateLoot(this.plugin.settings.enableCurrency, this.plugin.settings.currencyFrequency, this.plugin.settings.currencyTypes, this.plugin.settings.lootSettings),
        "Gen-Metals": () => generatorMetals(),
        "Gen-MagicalTrees": () => generatorMagical_trees(),
        "Gen-Ship": () => generateShipName(),
        "Gen-AnimalGroups": () => generatorAnimal_groups(),
        "Gen-Groups": () => generatorGroups(this.plugin.settings.groupSettings),
        "Gen-Religion": () => generatorReligions(),
        "Gen-AasimarsLastname": () => generatePathfinderName("aasimars", "male", true),
        "Gen-CatfolkLastname": () => generatePathfinderName("catfolk", "male", true),
        "Gen-FetchlingsLastname": () => generatePathfinderName("fetchlings", "male", true),
        "Gen-HalfElfLastname": () => generatePathfinderName("halfelf", "male", true),
        "Gen-HalfOrcLastname": () => generatePathfinderName("halforc", "male", true),
        "Gen-HobgoblinLastname": () => generatePathfinderName("hobgoblin", "male", true),
        "Gen-IfritsLastname": () => generatePathfinderName("ifrits", "male", true),
        "Gen-KobaldsLastname": () => generatePathfinderName("kobalds", "male", true),
        "Gen-OreadsLastname": () => generatePathfinderName("oreads", "male", true),
        "Gen-RatfolkLastname": () => generatePathfinderName("ratfolk", "male", true),
        "Gen-SylphsLastname": () => generatePathfinderName("sylphs", "male", true),
        "Gen-TenguLastname": () => generatePathfinderName("tengu", "male", true),
        "Gen-TiansLastname": () => generatePathfinderName("tians", "male", true),
        "Gen-TieflingLastname": () => generatePathfinderName("tiefling", "male", true),
        "Gen-UndinesLastname": () => generatePathfinderName("undines", "male", true),
        "Gen-AngelMaleLastname": () => nameByRace("angel", { gender: "male" }) + " " + nameByRace("angel", { gender: "male" }),
        "Gen-AngelFemaleLastname": () => nameByRace("angel", { gender: "female" }) + " " + nameByRace("angel", { gender: "female" }),
        "Gen-CavePersonMaleLastname": () => nameByRace("cavePerson", { gender: "male" }) + " " + nameByRace("cavePerson", { gender: "male" }),
        "Gen-CavePersonFemaleLastname": () => nameByRace("cavePerson", { gender: "female" }) + " " + nameByRace("cavePerson", { gender: "female" }),
        "Gen-DarkElfMaleLastname": () => nameByRace("darkelf", { gender: "male" }) + " " + nameByRace("darkelf", { gender: "male" }),
        "Gen-DarkElfFemaleLastname": () => nameByRace("darkelf", { gender: "female" }) + " " + nameByRace("darkelf", { gender: "female" }),
        "Gen-DemonLastname": () => nameByRace("demon") + " " + nameByRace("demon"),
        "Gen-DragonMaleLastname": () => nameByRace("dragon", { gender: "male" }) + " " + nameByRace("dragon", { gender: "male" }),
        "Gen-DragonFemaleLastname": () => nameByRace("dragon", { gender: "female" }) + " " + nameByRace("dragon", { gender: "female" }),
        "Gen-DrowMaleLastname": () => nameByRace("drow", { gender: "male" }) + " " + nameByRace("drow", { gender: "male" }),
        "Gen-DrowFemaleLastname": () => nameByRace("drow", { gender: "female" }) + " " + nameByRace("drow", { gender: "female" }),
        "Gen-FairyMaleLastname": () => nameByRace("fairy", { gender: "male" }) + " " + nameByRace("fairy", { gender: "male" }),
        "Gen-FairyFemaleLastname": () => nameByRace("fairy", { gender: "female" }) + " " + nameByRace("fairy", { gender: "female" }),
        "Gen-GnomeMaleLastname": () => nameByRace("gnome", { gender: "male" }) + " " + nameByRace("gnome", { gender: "male" }),
        "Gen-GnomeFemaleLastname": () => nameByRace("gnome", { gender: "female" }) + " " + nameByRace("gnome", { gender: "female" }),
        "Gen-GoblinLastname": () => nameByRace("goblin") + " " + nameByRace("goblin"),
        "Gen-HalfDemonMaleLastname": () => nameByRace("halfdemon", { gender: "male" }) + " " + nameByRace("halfdemon", { gender: "male" }),
        "Gen-HalfDemonFemaleLastname": () => nameByRace("halfdemon", { gender: "female" }) + " " + nameByRace("halfdemon", { gender: "female" }),
        "Gen-HalflingMaleLastname": () => nameByRace("halfling", { gender: "male" }) + " " + nameByRace("halfling", { gender: "male" }),
        "Gen-HalflingFemaleLastname": () => nameByRace("halfling", { gender: "female" }) + " " + nameByRace("halfling", { gender: "female" }),
        "Gen-HighElfMaleLastname": () => nameByRace("highelf", { gender: "male" }) + " " + nameByRace("highelf", { gender: "male" }),
        "Gen-HighElfFemaleLastname": () => nameByRace("highelf", { gender: "female" }) + " " + nameByRace("highelf", { gender: "female" }),
        "Gen-HighFairyMaleLastname": () => nameByRace("highfairy", { gender: "male" }) + " " + nameByRace("highfairy", { gender: "male" }),
        "Gen-HighFairyFemaleLastname": () => nameByRace("highfairy", { gender: "female" }) + " " + nameByRace("angel", { gender: "female" }),
        "Gen-OgreLastname": () => nameByRace("ogre") + " " + nameByRace("ogre"),
        "Gen-Aasimars": () => generatePathfinderName("aasimars", "male", false),
        "Gen-Catfolk": () => generatePathfinderName("catfolk", "male", false),
        "Gen-Fetchlings": () => generatePathfinderName("fetchlings", "male", false),
        "Gen-HalfElf": () => generatePathfinderName("halfelf", "male", false),
        "Gen-HalfOrc": () => generatePathfinderName("halforc", "male", false),
        "Gen-Hobgoblin": () => generatePathfinderName("hobgoblin", "male", false),
        "Gen-Ifrits": () => generatePathfinderName("ifrits", "male", false),
        "Gen-Kobalds": () => generatePathfinderName("kobalds", "male", false),
        "Gen-Oreads": () => generatePathfinderName("oreads", "male", false),
        "Gen-Ratfolk": () => generatePathfinderName("ratfolk", "male", false),
        "Gen-Sylphs": () => generatePathfinderName("sylphs", "male", false),
        "Gen-Tengu": () => generatePathfinderName("tengu", "male", false),
        "Gen-Tians": () => generatePathfinderName("tians", "male", false),
        "Gen-Tiefling": () => generatePathfinderName("tiefling", "male", false),
        "Gen-Undines": () => generatePathfinderName("undines", "male", false),
        "Gen-AngelMale": () => nameByRace("angel", { gender: "male" }),
        "Gen-CavePersonMale": () => nameByRace("cavePerson", { gender: "male" }),
        "Gen-DarkElfMale": () => nameByRace("darkelf", { gender: "male" }),
        "Gen-DragonMale": () => nameByRace("dragon", { gender: "male" }),
        "Gen-DrowMale": () => nameByRace("drow", { gender: "male" }),
        "Gen-FairyMale": () => nameByRace("fairy", { gender: "male" }),
        "Gen-GnomeMale": () => nameByRace("Gnome", { gender: "male" }),
        "Gen-HalfDemonMale": () => nameByRace("halfdemon", { gender: "male" }),
        "Gen-HalflingMale": () => nameByRace("halfling", { gender: "male" }),
        "Gen-HighElfMale": () => nameByRace("highelf", { gender: "male" }),
        "Gen-HighFairyMale": () => nameByRace("highfairy", { gender: "male" }),
        "Gen-Ogre": () => nameByRace("ogre"),
        "Gen-AngelFemale": () => nameByRace("angel", { gender: "female" }),
        "Gen-CavePersonFemale": () => nameByRace("cavePerson", { gender: "female" }),
        "Gen-DarkElfFemale": () => nameByRace("darkelf", { gender: "female" }),
        "Gen-Demon": () => nameByRace("demon"),
        "Gen-DragonFemale": () => nameByRace("dragon", { gender: "female" }),
        "Gen-DrowFemale": () => nameByRace("drow", { gender: "female" }),
        "Gen-FairyFemale": () => nameByRace("fairy", { gender: "female" }),
        "Gen-GnomeFemale": () => nameByRace("gnome", { gender: "female" }),
        "Gen-Goblin": () => nameByRace("goblin"),
        "Gen-HalfDemonFemale": () => nameByRace("halfdemon", { gender: "female" }),
        "Gen-HalflingFemale": () => nameByRace("halfling", { gender: "female" }),
        "Gen-HighElfFemale": () => nameByRace("highelf", { gender: "female" }),
        "Gen-HighFairyFemale": () => nameByRace("highfairy", { gender: "female" }),
        "Gen-PlotStoryHooks": () => generatePlotHook(),
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

        // insert the result into the editor
        const activeView = app.workspace.getActiveViewOfType(MarkdownView);
        if (activeView) {
            activeView.editor.replaceRange(result.toString(), this.startChar, this.endChar);
        }
    }
}
