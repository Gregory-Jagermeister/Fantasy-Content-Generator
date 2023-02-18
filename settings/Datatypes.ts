// The possible Options that could be selected durring inline generation
export const possibleOptions = [
    'Gen-ElfMale',
    'Gen-ElfMaleLastname',
    'Gen-ElfFemale',
    'Gen-ElfFemaleLastname',
    'Gen-Orc',
    'Gen-OrcLastname',
    'Gen-DwarfMale',
    'Gen-DwarfMaleLastname',
    'Gen-DwarfFemale',
    'Gen-DwarfFemaleLastname',
    'Gen-HumanMale',
    'Gen-HumanFemale',
    'Gen-HumanMaleLastname',
    'Gen-HumanFemaleLastname',
    "Gen-DungeonsLabryinths",
    "Gen-InnsTaverns",
    "Gen-Settlement",
    "Gen-Airships",
    "Gen-Drinks",
    "Gen-Artifacts",
    "Gen-LootTreasure",
    "Gen-Metals",
    "Gen-MagicalTrees",
    "Gen-Ship",
    "Gen-AnimalGroups",
    "Gen-Groups",
    "Gen-Religion",
    "Gen-AasimarsLastname",
    "Gen-CatfolkLastname",
    "Gen-FetchlingsLastname",
    "Gen-HalfElfLastname",
    "Gen-HalfOrcLastname",
    "Gen-HobgoblinLastname",
    "Gen-IfritsLastname",
    "Gen-KobaldsLastname",
    "Gen-OreadsLastname",
    "Gen-RatfolkLastname",
    "Gen-SylphsLastname",
    "Gen-TenguLastname",
    "Gen-TiansLastname",
    "Gen-TieflingLastname",
    "Gen-UndinesLastname",
    "Gen-AngelMaleLastname",
    "Gen-AngelFemaleLastname",
    "Gen-CavePersonMaleLastname",
    "Gen-CavePersonFemaleLastname",
    "Gen-DarkElfMaleLastname",
    "Gen-DarkElfFemaleLastname",
    "Gen-DemonLastname",
    "Gen-DragonMaleLastname",
    "Gen-DragonFemaleLastname",
    "Gen-DrowMaleLastname",
    "Gen-DrowFemaleLastname",
    "Gen-FairyMaleLastname",
    "Gen-FairyFemaleLastname",
    "Gen-GnomeMaleLastname",
    "Gen-GnomeFemaleLastname",
    "Gen-GoblinLastname",
    "Gen-HalfDemonMaleLastname",
    "Gen-HalfDemonFemaleLastname",
    "Gen-HalflingMaleLastname",
    "Gen-HalflingFemaleLastname",
    "Gen-HighElfMaleLastname",
    "Gen-HighElfFemaleLastname",
    "Gen-HighFairyMaleLastname",
    "Gen-HighFairyFemaleLastname",
    "Gen-OgreLastname",
    "Gen-Aasimars",
    "Gen-Catfolk",
    "Gen-Fetchlings",
    "Gen-HalfElf",
    "Gen-HalfOrc",
    "Gen-Hobgoblin",
    "Gen-Ifrits",
    "Gen-Kobalds",
    "Gen-Oreads",
    "Gen-Ratfolk",
    "Gen-Sylphs",
    "Gen-Tengu",
    "Gen-Tians",
    "Gen-Tiefling",
    "Gen-Undines",
    "Gen-AngelMale",
    "Gen-CavePersonMale",
    "Gen-DarkElfMale",
    "Gen-DragonMale",
    "Gen-DrowMale",
    "Gen-FairyMale",
    "Gen-GnomeMale",
    "Gen-HalfDemonMale",
    "Gen-HalflingMale",
    "Gen-HighElfMale",
    "Gen-HighFairyMale",
    "Gen-Ogre",
    "Gen-AngelFemale",
    "Gen-CavePersonFemale",
    "Gen-DarkElfFemale",
    "Gen-Demon",
    "Gen-DragonFemale",
    "Gen-DrowFemale",
    "Gen-FairyFemale",
    "Gen-GnomeFemale",
    "Gen-Goblin",
    "Gen-HalfDemonFemale",
    "Gen-HalflingFemale",
    "Gen-HighElfFemale",
    "Gen-HighFairyFemale",
    "Gen-PlotStoryHooks"
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
    nouns: string[];
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