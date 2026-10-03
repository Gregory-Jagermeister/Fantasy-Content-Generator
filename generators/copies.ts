/* "Copy to my folder" (D16): turn a list-based built-in generator into an editable generator note.
   Pure functions, no Obsidian imports. The copy uses the word lists from the user's settings. */
import { FantasyPluginSettings } from "settings/Datatypes";
import { METAL_SUFFIXES, METAL_SYLLABLES } from "generators/metal";
import { SHIP_ADJECTIVES, SHIP_NOUNS, SHIP_PREFIXES, SHIP_SYLLABLES, SHIP_VOWELS } from "generators/ship";

/** Built-in keys that can be copied, with the label used for the note name. */
export const COPYABLE: Readonly<Record<string, string>> = {
    Drinks: "Drinks",
    DungeonsLabryinths: "Dungeons and labyrinths",
    InnsTaverns: "Inns and taverns",
    Metals: "Metals",
    Ship: "Ship",
};

/** A list item as written in a note: braces escaped, and a trailing "| 3" kept as text (not a weight). */
export function noteItem(item: string): string {
    let text = item.replace(/[{}]/g, (b) => `\\${b}`).replace(/\r?\n/g, " ").trim();
    if (/\|\s*\d+(\.\d+)?\s*$/.test(text)) text += " | 1";
    return text;
}

function list(name: string, items: readonly string[]): string {
    return `## ${name}\n${items.map((i) => `- ${noteItem(i)}`).join("\n")}\n`;
}

const yamlString = (s: string) => JSON.stringify(s);

interface CopySpec {
    patterns?: string[];
    /** A multi-line pattern (written as `pattern: |`) */
    block?: string;
    capitalize?: boolean;
    lists: [string, readonly string[]][];
}

function spec(key: string, s: FantasyPluginSettings): CopySpec | null {
    switch (key) {
        case "Drinks":
            return {
                patterns: ["{Adjective} {Drink}", "{Adjective} {Adjective} {Drink}"],
                lists: [["Adjective", s.drinkSettings.adj], ["Drink", s.drinkSettings.nouns]],
            };
        case "DungeonsLabryinths":
            return {
                block: "{$type = Type}{$loc = Location}{Name}\nDescription: {Description}",
                lists: [
                    ["Name", ["{$type} of the {Adjective} {Noun}", "The {Adjective} {Noun}"]],
                    ["Description", [
                        "Located in {$loc}, this {$type} is known for {Descriptor}.",
                        "A {$type} that is known for {Descriptor}.",
                        "In the heart of {$loc} lies this {$type}, notorious for {Descriptor}.",
                        "Deep within {$loc}, the {$type} is feared for {Descriptor}.",
                        "This {$type} located in {$loc} is infamous for {Descriptor}.",
                        "The {$type} in {$loc} is a place to be reckoned with, famous for {Descriptor}.",
                    ]],
                    ["Type", s.dungeonSettings.dungeonTypes],
                    ["Adjective", s.dungeonSettings.adjectives],
                    ["Noun", s.dungeonSettings.nouns],
                    ["Location", s.dungeonSettings.locations],
                    ["Descriptor", s.dungeonSettings.randomDesc],
                ],
            };
        case "InnsTaverns":
            return {
                block: "{Prefix} {Noun} {Type}\nDescription: {Description}\nRumors: {3 x Rumor}",
                lists: [
                    ["Prefix", s.innSettings.prefixes], ["Noun", s.innSettings.nouns], ["Type", s.innSettings.innType],
                    ["Description", s.innSettings.desc], ["Rumor", s.innSettings.rumors],
                ],
            };
        case "Metals":
            return {
                patterns: ["{Syllable}{Suffix}", "{Syllable}{Syllable}{Suffix}"],
                capitalize: true,
                lists: [["Syllable", METAL_SYLLABLES], ["Suffix", METAL_SUFFIXES]],
            };
        case "Ship":
            return {
                patterns: ["{Adjective} {Noun} of {Name}", "{Prefix} {Adjective} {Name}"],
                lists: [
                    ["Name", ["{First syllable}{Vowel}{Syllable}", "{First syllable}{Vowel}{Syllable}{Vowel}{Syllable}"]],
                    ["Adjective", SHIP_ADJECTIVES], ["Noun", SHIP_NOUNS], ["Prefix", SHIP_PREFIXES],
                    ["First syllable", SHIP_SYLLABLES.map((x) => x.charAt(0).toUpperCase() + x.slice(1))],
                    ["Syllable", SHIP_SYLLABLES], ["Vowel", SHIP_VOWELS],
                ],
            };
        default:
            return null;
    }
}

/**
 * The note for a copy of a built-in generator, or null if it can't be copied.
 * The template rows for Name/Description are written as patterns, so they are not escaped.
 */
export function copyNote(key: string, settings: FantasyPluginSettings): { name: string; key: string; text: string } | null {
    const label = COPYABLE[key];
    const sp = spec(key, settings);
    if (!label || !sp) return null;
    const name = `${label} (my copy)`;
    const copyKey = `${key}Copy`;
    const fm = [`fcg-generator: ${yamlString(name)}`, `fcg-key: ${copyKey}`];
    if (sp.capitalize) fm.push("fcg-capitalize: true");
    if (sp.block) fm.push("pattern: |", ...sp.block.split("\n").map((l) => `  ${l}`));
    if (sp.patterns) fm.push("patterns:", ...sp.patterns.map((p) => `  - ${yamlString(p)}`));
    const templates = new Set(["Name", "Description"]);
    const lists = sp.lists.map(([n, items]) => {
        if (!(templates.has(n) && (key === "DungeonsLabryinths" || key === "Ship"))) return list(n, items);
        return `## ${n}\n${items.map((i) => `- ${i}`).join("\n")}\n`;
    });
    const text = `---\n${fm.join("\n")}\n---\nA copy of the built-in **${label}** generator, made from your current word lists. Type **@${copyKey}** to use it. Edit anything here; the built-in one is unchanged.\n\n${lists.join("\n")}`;
    return { name, key: copyKey, text };
}
