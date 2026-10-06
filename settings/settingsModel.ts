/* Pure helpers for the settings screen (1.6.1). No Obsidian imports, unit-tested. */
import { parseListInput, parseWeightedInput, WeightedItem } from "./settingsData";

/** Control key prefix for the "Show groups" toggles: "group:Story tools" ↔ hiddenGroups. */
export const GROUP_KEY = "group:";

/** How a word-list row shows: the word, or "Sword (weight 3)" for loot. */
export function wordLabel(item: string | WeightedItem): string {
    return typeof item === "string" ? item : `${item.item} (weight ${item.weight})`;
}

/** Add pasted words to a list. Returns how many were added. */
export function addWords(list: unknown[], text: string, weighted: boolean): number {
    const added: unknown[] = weighted ? parseWeightedInput(text) : parseListInput(text);
    list.push(...added);
    return added.length;
}

/** The filter box on a word list: every word typed must appear, ignoring case. */
export function matchesFilter(name: string, query: string): boolean {
    const n = name.toLowerCase();
    return query.toLowerCase().split(/\s+/).filter(Boolean).every((w) => n.includes(w));
}
