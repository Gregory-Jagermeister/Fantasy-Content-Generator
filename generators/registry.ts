/* Every generator in one place, used by the modal and the inline suggester.
   No Obsidian imports, so it runs in unit tests. Generators return plain text and throw on failure. */
import { nameByRace } from "fantasy-name-generator";
import { FantasyPluginSettings } from "settings/Datatypes";
import { generateCityName } from "generators/city";
import { generateSettlement } from "generators/settlement";
import { generateDungeonName } from "generators/dungeon";
import { generateInn } from "generators/inn";
import { generatorDrinks } from "generators/drink";
import { generateLoot } from "generators/loot";
import { generatorMetals } from "generators/metal";
import { generateShipName } from "generators/ship";
import { generatePlotHook } from "generators/plothook";
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
    /** Inline key stem, e.g. "Dwarf" -> @DwarfMale, @DwarfMaleLastname */
    key: string;
    /** Shown in the modal */
    label: string;
    /** Id passed to the name library */
    race: string;
    /** Inline keys come in Male / Female versions */
    gendered: boolean;
    family?: FamilySource;
    familyList?: string[];
}

const library = (key: string, label: string, race: string, gendered = true, familyList?: string[]): RaceDef =>
    ({ key, label, race, gendered, family: familyList ? "list" : "repeat", familyList });

export const RACES: RaceDef[] = [
    library("Angel", "Angel", "angel"),
    library("CavePerson", "Cave person", "cavePerson"),
    library("DarkElf", "Dark elf", "darkelf"),
    library("Demon", "Demon", "demon", false),
    library("Dragon", "Dragon", "dragon"),
    library("Drow", "Drow", "drow"),
    library("Dwarf", "Dwarf", "dwarf"),
    library("Elf", "Elf", "elf"),
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
            const info = generateSettlement();
            const name = generateCityName(s.citySettings);
            return { title: name, text: `Name: ${name}\nPopulation: ${info.population.toLocaleString()}\nType: ${info.type.label}` };
        },
    },
    { key: "Drinks", label: "Drinks", group: "Objects and vehicles", run: (s) => plain(generatorDrinks(s.drinkSettings)) },
    { key: "LootTreasure", label: "Loot and treasure", group: "Objects and vehicles", run: (s) => plain(generateLoot(s.enableCurrency, s.currencyFrequency, s.currencyTypes, s.lootSettings)) },
    { key: "Metals", label: "Metals", group: "Objects and vehicles", run: () => plain(generatorMetals()) },
    { key: "Ship", label: "Ship", group: "Objects and vehicles", run: () => plain(generateShipName()) },
    { key: "PlotStoryHooks", label: "Plot and story hooks", group: "Story tools", run: () => plain(generatePlotHook()) },
];

/**
 * Inline keys retired in 1.3.1 and 1.3.2 (key -> version), to be rewritten in a later update.
 * They still show in the inline list, marked retired; picking one explains why instead of inserting text.
 * A custom generator note may reuse any of these keys.
 */
const RETIRED_1_3_1: string[] = [
    ...["Aasimars", "Catfolk", "Fetchlings", "HalfElf", "HalfOrc", "Hobgoblin", "Ifrits", "Kobalds", "Oreads",
        "Ratfolk", "Sylphs", "Tengu", "Tians", "Tiefling", "Undines"].flatMap((k) => [k, `${k}Lastname`]),
    "Airships", "Artifacts", "AnimalGroups", "MagicalTrees", "TradingPost",
];
const RETIRED_1_3_2: string[] = ["Religion", "Groups"];
export const RETIRED: Readonly<Record<string, string>> = {
    ...Object.fromEntries(RETIRED_1_3_1.map((k): [string, string] => [k, "1.3.1"])),
    ...Object.fromEntries(RETIRED_1_3_2.map((k): [string, string] => [k, "1.3.2"])),
};
export const RETIRED_KEYS: readonly string[] = Object.keys(RETIRED);

/** What to tell someone who picks a retired key. */
export function retiredMessage(key: string, trigger = "@"): string {
    return `${trigger}${key} was removed in ${RETIRED[key] ?? "an earlier version"}. See the plugin's README.`;
}

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
