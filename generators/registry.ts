/* Every generator in one place, used by the modal and the inline suggester.
   No Obsidian imports, so it runs in unit tests. Generators return plain text and throw on failure. */
import { nameByRace } from "fantasy-name-generator";
import * as FCG from "fantasy-content-generator";
import { FantasyPluginSettings } from "settings/Datatypes";
import { generateCityName } from "generators/city";
import { generateDungeonName } from "generators/dungeon";
import { generateInn } from "generators/inn";
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
import { dwarfFamilyNames } from "lists/dwarvenFamilyNames";
import { elfFamilyNames } from "lists/elvenFamilyNames";
import { familyNameList } from "lists/humanFamilyNames";
import { titleLastNames } from "lists/titleLastNames";
import { pick } from "utils/random";

export type Gender = "male" | "female";

/** One generated result: `title` is shown in the list, `text` is what gets copied or inserted. */
export interface Generated {
    title: string;
    text: string;
}

/* ---------------- names ---------------- */

/** How a race's family name is made. */
type FamilySource = "repeat" | "list";

export interface RaceDef {
    /** Inline key stem, e.g. "HalfElf" -> @HalfElf, @HalfElfLastname */
    key: string;
    /** Shown in the modal */
    label: string;
    /** Id passed to the name library */
    race: string;
    /** "pathfinder" uses this plugin's Pathfinder lists; "library" uses fantasy-name-generator */
    source: "pathfinder" | "library";
    /** Inline keys come in Male / Female versions */
    gendered: boolean;
    family?: FamilySource;
    familyList?: string[];
}

const pathfinder = (key: string, label: string, race: string): RaceDef => ({ key, label, race, source: "pathfinder", gendered: false });
const library = (key: string, label: string, race: string, gendered = true, familyList?: string[]): RaceDef =>
    ({ key, label, race, source: "library", gendered, family: familyList ? "list" : "repeat", familyList });

export const RACES: RaceDef[] = [
    pathfinder("Aasimars", "Aasimar", "aasimars"),
    pathfinder("Catfolk", "Catfolk", "catfolk"),
    pathfinder("Fetchlings", "Fetchling", "fetchlings"),
    pathfinder("HalfElf", "Half-elf", "halfelf"),
    pathfinder("HalfOrc", "Half-orc", "halforc"),
    pathfinder("Hobgoblin", "Hobgoblin", "hobgoblin"),
    pathfinder("Ifrits", "Ifrit", "ifrits"),
    pathfinder("Kobalds", "Kobold", "kobalds"),
    pathfinder("Oreads", "Oread", "oreads"),
    pathfinder("Ratfolk", "Ratfolk", "ratfolk"),
    pathfinder("Sylphs", "Sylph", "sylphs"),
    pathfinder("Tengu", "Tengu", "tengu"),
    pathfinder("Tians", "Tian", "tians"),
    pathfinder("Tiefling", "Tiefling", "tiefling"),
    pathfinder("Undines", "Undine", "undines"),
    library("Angel", "Angel", "angel"),
    library("CavePerson", "Cave person", "cavePerson"),
    library("DarkElf", "Dark elf", "darkelf"),
    library("Demon", "Demon", "demon", false),
    library("Dragon", "Dragon", "dragon"),
    library("Drow", "Drow", "drow"),
    library("Dwarf", "Dwarf", "dwarf", true, dwarfFamilyNames),
    library("Elf", "Elf", "elf", true, elfFamilyNames),
    library("Fairy", "Fairy", "fairy"),
    library("Gnome", "Gnome", "gnome"),
    library("Goblin", "Goblin", "goblin", false),
    library("HalfDemon", "Half demon", "halfdemon"),
    library("Halfling", "Halfling", "halfling"),
    library("HighElf", "High elf", "highelf"),
    library("HighFairy", "High fairy", "highfairy"),
    library("Human", "Human", "human", true, familyNameList),
    library("Ogre", "Ogre", "ogre", false),
    library("Orc", "Orc", "orc", false, titleLastNames),
];


/** fantasy-name-generator returns an Error instead of throwing; turn that into a throw. */
function libraryName(race: string, gender: Gender): string {
    const result: string | Error = nameByRace(race, { gender });
    if (result instanceof Error) throw result;
    return result;
}

/** A name for a race, with or without a family name. */
export function raceName(def: RaceDef, gender: Gender, withFamily: boolean): string {
    if (def.source === "pathfinder") return generatePathfinderName(def.race, gender, withFamily);
    const first = libraryName(def.race, gender);
    if (!withFamily) return first;
    const family = def.familyList ? pick(def.familyList) : libraryName(def.race, gender);
    return `${first} ${family}`;
}

/* ---------------- everything else ---------------- */

export interface GeneratorDef {
    /** Inline key, e.g. "InnsTaverns" */
    key: string;
    label: string;
    group: string;
    run: (settings: FantasyPluginSettings) => Generated;
}

const firstLine = (text: string): string => text.split("\n")[0];
const plain = (text: string): Generated => ({ title: firstLine(text), text });
const titleCase = (str: string): string =>
    str.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");

export const GENERATORS: GeneratorDef[] = [
    { key: "DungeonsLabryinths", label: "Dungeons and labyrinths", group: "Settlements and buildings", run: (s) => plain(generateDungeonName(s.dungeonSettings)) },
    {
        key: "InnsTaverns", label: "Inns and taverns", group: "Settlements and buildings", run: (s) => {
            const inn = generateInn(s.innSettings);
            return { title: inn.name, text: `${inn.name}\nDescription: ${inn.description}\nRumors: ${inn.rumors.join(", ")}` };
        },
    },
    {
        key: "Settlement", label: "Settlement", group: "Settlements and buildings", run: (s) => {
            const info = FCG.Settlements.generate();
            const name = generateCityName(s.citySettings);
            return { title: name, text: `Name: ${name}\nPopulation: ${info.population}\nType: ${titleCase(info.type)}` };
        },
    },
    {
        key: "TradingPost", label: "Trading post", group: "Settlements and buildings", run: (s) => {
            const name = generateCityName(s.citySettings);
            return { title: name, text: `Trading Post Name: ${name}\n${generateTradingPost()}` };
        },
    },
    { key: "Airships", label: "Airships", group: "Objects and vehicles", run: () => plain(generatorAirships()) },
    { key: "Drinks", label: "Drinks", group: "Objects and vehicles", run: (s) => plain(generatorDrinks(s.drinkSettings)) },
    { key: "Artifacts", label: "Artifacts", group: "Objects and vehicles", run: () => plain(generateMiscellaneousArtifacts()) },
    { key: "LootTreasure", label: "Loot and treasure", group: "Objects and vehicles", run: (s) => plain(generateLoot(s.enableCurrency, s.currencyFrequency, s.currencyTypes, s.lootSettings)) },
    { key: "Metals", label: "Metals", group: "Objects and vehicles", run: () => plain(generatorMetals()) },
    { key: "MagicalTrees", label: "Magical trees", group: "Objects and vehicles", run: () => plain(generatorMagical_trees()) },
    { key: "Ship", label: "Ship", group: "Objects and vehicles", run: () => plain(generateShipName()) },
    { key: "AnimalGroups", label: "Animal groups", group: "Groups and religions", run: () => plain(generatorAnimal_groups()) },
    { key: "Groups", label: "Groups", group: "Groups and religions", run: (s) => plain(generatorGroups(s.groupSettings)) },
    { key: "Religion", label: "Religion", group: "Groups and religions", run: () => plain(generatorReligions()) },
    { key: "PlotStoryHooks", label: "Plot and story hooks", group: "Story tools", run: () => plain(generatePlotHook()) },
];

/** Inline keys kept from older versions that now point at a renamed key. */
const ALIASES: Record<string, string> = { DungeonsLabyrinths: "DungeonsLabryinths" };

/**
 * Every inline generator by key (the names users type after the trigger, e.g. @ElfFemaleLastname).
 * Keys match version 1.2.4 so nobody's habits break.
 */
export function inlineGenerators(): Record<string, (settings: FantasyPluginSettings) => string> {
    const out: Record<string, (settings: FantasyPluginSettings) => string> = {};
    for (const g of GENERATORS) out[g.key] = (s) => g.run(s).text;
    for (const r of RACES) {
        if (r.gendered) {
            for (const gender of ["male", "female"] as Gender[]) {
                const g = gender === "male" ? "Male" : "Female";
                out[`${r.key}${g}`] = () => raceName(r, gender, false);
                out[`${r.key}${g}Lastname`] = () => raceName(r, gender, true);
            }
        } else {
            out[r.key] = () => raceName(r, "male", false);
            out[`${r.key}Lastname`] = () => raceName(r, "male", true);
        }
    }
    for (const [alias, target] of Object.entries(ALIASES)) out[alias] = out[target];
    return out;
}
