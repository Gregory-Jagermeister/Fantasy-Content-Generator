/* Every generator in one place, used by the modal and the inline suggester.
   No Obsidian imports, so it runs in unit tests. Generators return plain text and throw on failure. */
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

/** One generated result: `title` is shown in the list, `text` is what gets copied or inserted. */
export interface Generated {
    title: string;
    text: string;
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
 * Inline keys retired in 1.3.1, 1.3.2 and 1.5.0 (key -> version). They are not in the inline list;
 * typing one in full shows a message (naming the starter set that replaces it, if any) instead of text.
 * A custom generator note may reuse any of these keys.
 */
const RETIRED_1_3_1_NAMES: Record<string, string> = {
    Aasimars: "Planar: Light", Catfolk: "Catfolk names", Fetchlings: "Shadow names", HalfElf: "Half-Elvish names",
    HalfOrc: "Half-Orc names", Hobgoblin: "Kohrog names", Ifrits: "Elemental Fire names", Kobalds: "Draconic names",
    Oreads: "Elemental Earth names", Ratfolk: "Ratfolk names", Sylphs: "Elemental Air names", Tengu: "Tengu names",
    Tians: "Human", Tiefling: "Planar: Dark", Undines: "Elemental Water names",
};
const RETIRED_1_3_1: string[] = [
    ...Object.keys(RETIRED_1_3_1_NAMES).flatMap((k) => [k, `${k}Lastname`]),
    "Airships", "Artifacts", "AnimalGroups", "MagicalTrees", "TradingPost",
];
const RETIRED_1_3_2: string[] = ["Religion", "Groups"];

/** The built-in race names removed in 1.5.0 (the name library), by key stem, with the starter set that replaces them. */
const RETIRED_1_5_0_NAMES: Record<string, string> = {
    Angel: "Planar: Light", CavePerson: "Cave person names", DarkElf: "Elvish names", Demon: "Planar: Dark",
    Dragon: "Draconic names", Drow: "Elvish names", Dwarf: "Dwarvish names", Elf: "Elvish names", Fairy: "Fey names",
    Gnome: "Small folk names", Goblin: "Kohrog names", HalfDemon: "Planar: Dark", Halfling: "Small folk names",
    HighElf: "Elvish names", HighFairy: "Fey names", Human: "Human", Ogre: "Kohrog names", Orc: "Kohrog names",
};
/** Demon, Goblin, Ogre and Orc had no Male/Female keys. */
const UNGENDERED = ["Demon", "Goblin", "Ogre", "Orc"];
const RETIRED_1_5_0: string[] = Object.keys(RETIRED_1_5_0_NAMES).flatMap((k) =>
    UNGENDERED.includes(k) ? [k, `${k}Lastname`] : [`${k}Male`, `${k}MaleLastname`, `${k}Female`, `${k}FemaleLastname`]);

export const RETIRED: Readonly<Record<string, string>> = {
    ...Object.fromEntries(RETIRED_1_3_1.map((k): [string, string] => [k, "1.3.1"])),
    ...Object.fromEntries(RETIRED_1_3_2.map((k): [string, string] => [k, "1.3.2"])),
    ...Object.fromEntries(RETIRED_1_5_0.map((k): [string, string] => [k, "1.5.0"])),
};
export const RETIRED_KEYS: readonly string[] = Object.keys(RETIRED);

/** The starter set that replaces a retired name key ("Elvish names"; "Human" = the Human sets), if any. */
export function replacementFor(key: string): string | undefined {
    const stem = key.replace(/(Male|Female)?(Lastname)?$/, "");
    return RETIRED_1_5_0_NAMES[stem] ?? RETIRED_1_3_1_NAMES[stem];
}

/** What to tell someone who picks a retired key. */
export function retiredMessage(key: string, trigger = "@"): string {
    const removed = `${trigger}${key} was removed in ${RETIRED[key] ?? "an earlier version"}.`;
    const set = replacementFor(key);
    if (!set) return `${removed} See the plugin's README.`;
    const which = set === "Human" ? "one of the Human starter sets" : `the "${set}" starter set`;
    return `${removed} Use ${which} instead: run "Add a starter set".`;
}

/** Inline keys kept from older versions that now point at a renamed key. */
const ALIASES: Record<string, string> = { DungeonsLabyrinths: "DungeonsLabryinths" };

/** Is this an old spelling kept so older notes still work? (Left out of the inline list.) */
export function isAlias(key: string): boolean {
    return key in ALIASES;
}

/** Every inline generator by key (the names users type after the trigger, e.g. @InnsTaverns). */
export function inlineGenerators(): Record<string, (settings: FantasyPluginSettings) => string> {
    const out: Record<string, (settings: FantasyPluginSettings) => string> = {};
    for (const g of GENERATORS) out[g.key] = (s) => g.run(s).text;
    for (const [alias, target] of Object.entries(ALIASES)) out[alias] = out[target];
    return out;
}

/** The groups built-in generators belong to, in the order the generator window shows them. */
export function builtInGroups(): string[] {
    return [...new Set(GENERATORS.map((g) => g.group))];
}

/** The group of every built-in inline key (aliases included). */
export function groupOfKey(): Map<string, string> {
    const map = new Map<string, string>();
    for (const g of GENERATORS) map.set(g.key, g.group);
    for (const [alias, target] of Object.entries(ALIASES)) { const g = map.get(target); if (g) map.set(alias, g); }
    return map;
}

/** Second line for a built-in key in the inline list: "Settlements and buildings · Inns and taverns". */
export function describeBuiltIn(key: string): string | undefined {
    const g = GENERATORS.find((x) => x.key === key);
    return g ? `${g.group} · ${g.label}` : undefined;
}
