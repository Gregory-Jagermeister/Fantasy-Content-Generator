/* Settings shapes and small dice helpers. */

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

export function weightedRandomItem(table: { string: string, range: number[] }[], roll: number) {

    // Find the object in the table that corresponds to the roll
    const item = table.find(({ range }) => range[0] <= roll && roll <= range[1]);

    // Return the item
    return item?.string;
}



export function rollD20(modifier: number) {
    return clamp(Math.floor((Math.random() * 20) + 1) + modifier, 1, 20);
}

export function rollD100(modifier: number) {
    return clamp(Math.floor((Math.random() * 100) + 1) + modifier, 1, 100);
}

/** Keep a number inside [min, max]. */
function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
