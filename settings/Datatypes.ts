/* Settings shapes. */

// currency Datatype for defining custom currency
export type currency = {
    name: string,
    rarity: string
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
    dungeonSettings: dungeonGenSettings;
    inlineCallout: string;
    /** Folder holding custom generator notes (subfolders included) */
    generatorFolder: string;
    /** Amount the generator panel starts with */
    defaultAmount: number;
    /** Settings section shown last */
    settingsSection: string;
    /** Built-in groups hidden from the generator panel and the inline list */
    hiddenGroups: string[];
    /** Generator keys pinned to the top of the generator panel, in the order pinned */
    pinnedGenerators: string[];
    /** Generator keys used recently in the panel, newest first */
    recentGenerators: string[];
    /** The one-time "now TTRPG Content Generator" notice (1.6.0) has been shown (or this is a fresh install) */
    renameNotice160: boolean;
}
