
import * as fs from 'fs';
import { Notice } from 'obsidian';

// The possible Options that could be selected durring inline generation
export const possibleOptions = [
    'TradingPost',
    'ElfMale',
    'ElfMaleLastname',
    'ElfFemale',
    'ElfFemaleLastname',
    'Orc',
    'OrcLastname',
    'DwarfMale',
    'DwarfMaleLastname',
    'DwarfFemale',
    'DwarfFemaleLastname',
    'HumanMale',
    'HumanFemale',
    'HumanMaleLastname',
    'HumanFemaleLastname',
    "DungeonsLabryinths",
    "InnsTaverns",
    "Settlement",
    "Airships",
    "Drinks",
    "Artifacts",
    "LootTreasure",
    "Metals",
    "MagicalTrees",
    "Ship",
    "AnimalGroups",
    "Groups",
    "Religion",
    "AasimarsLastname",
    "CatfolkLastname",
    "FetchlingsLastname",
    "HalfElfLastname",
    "HalfOrcLastname",
    "HobgoblinLastname",
    "IfritsLastname",
    "KobaldsLastname",
    "OreadsLastname",
    "RatfolkLastname",
    "SylphsLastname",
    "TenguLastname",
    "TiansLastname",
    "TieflingLastname",
    "UndinesLastname",
    "AngelMaleLastname",
    "AngelFemaleLastname",
    "CavePersonMaleLastname",
    "CavePersonFemaleLastname",
    "DarkElfMaleLastname",
    "DarkElfFemaleLastname",
    "DemonLastname",
    "DragonMaleLastname",
    "DragonFemaleLastname",
    "DrowMaleLastname",
    "DrowFemaleLastname",
    "FairyMaleLastname",
    "FairyFemaleLastname",
    "GnomeMaleLastname",
    "GnomeFemaleLastname",
    "GoblinLastname",
    "HalfDemonMaleLastname",
    "HalfDemonFemaleLastname",
    "HalflingMaleLastname",
    "HalflingFemaleLastname",
    "HighElfMaleLastname",
    "HighElfFemaleLastname",
    "HighFairyMaleLastname",
    "HighFairyFemaleLastname",
    "OgreLastname",
    "Aasimars",
    "Catfolk",
    "Fetchlings",
    "HalfElf",
    "HalfOrc",
    "Hobgoblin",
    "Ifrits",
    "Kobalds",
    "Oreads",
    "Ratfolk",
    "Sylphs",
    "Tengu",
    "Tians",
    "Tiefling",
    "Undines",
    "AngelMale",
    "CavePersonMale",
    "DarkElfMale",
    "DragonMale",
    "DrowMale",
    "FairyMale",
    "GnomeMale",
    "HalfDemonMale",
    "HalflingMale",
    "HighElfMale",
    "HighFairyMale",
    "Ogre",
    "AngelFemale",
    "CavePersonFemale",
    "DarkElfFemale",
    "Demon",
    "DragonFemale",
    "DrowFemale",
    "FairyFemale",
    "GnomeFemale",
    "Goblin",
    "HalfDemonFemale",
    "HalflingFemale",
    "HighElfFemale",
    "HighFairyFemale",
    "PlotStoryHooks"
];

// currency Datatype for defining custom currency
export type currency = {
    name: string,
    rarity: string
}

// Datatype for collecting group settings
export type groupGenSettings = {
    adj: string[],
    nouns: string[],
    nounsP: string[],
    groupTypes: string[],
    singleDescriptors: string[]
}

// Datatype for collecting dungeon settings
export type dungeonGenSettings = {
    dungeonTypes: string[],
    adjectives: string[],
    nouns: string[],
    locations: string[],
    randomDesc: string[]
}

// Datatype for collecting loot settings
export type lootTables = {
    adj: string[]
    items: { item: string, weight: number }[];
}

// Datatype for collecting Drink settings
export type drinkGeneratorSettings = {
    adj: string[],
    nouns: string[],
}

// Datatype for collecting city settings
export type cityGeneratorSetting = {
    prefixArray: string[],
    suffixArray: string[]
}

// Datatype for collecting inn and tavern settings
export type innGeneratorSettings = {
    prefixes: string[],
    innType: string[],
    nouns: string[],
    desc: string[],
    rumors: string[]
}

export interface FileWithPath extends File {
    path: string
}

// the interface that uses all 
export interface FantasyPluginSettings {
    enableCurrency: boolean;
    citySettings: cityGeneratorSetting;
    currencyTypes: currency[];
    currencyFrequency: number;
    innSettings: innGeneratorSettings;
    drinkSettings: drinkGeneratorSettings;
    lootSettings: lootTables;
    groupSettings: groupGenSettings;
    dungeonSettings: dungeonGenSettings;
    inlineCallout: string;
}

export function importJSON(path: string, callback: (data: object) => void): void {
    fs.readFile(path, 'utf8', (error, data) => {
        if (error) {
            new Notice("Error Importing: " + error);
            return;
        }
        const jsonData = JSON.parse(data);
        new Notice("Data Successfully Imported!");
        callback(jsonData);
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportJSON(data: any) {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.download = 'data.json';
    a.href = url;
    a.click();

    new Notice("Data Exporting!");
}

export function weightedRandomItem(table: { string: string, range: number[] }[], roll: number) {

    // Find the object in the table that corresponds to the roll
    const item = table.find(({ range }) => range[0] <= roll && roll <= range[1]);

    // Return the item
    return item?.string;
}



export function rollD20(modifier: number) {
    return Math.clamp(Math.floor((Math.random() * 20) + 1) + modifier, 1, 20);
}

export function rollD100(modifier: number) {
    return Math.clamp(Math.floor((Math.random() * 100) + 1) + modifier, 1, 100);
}