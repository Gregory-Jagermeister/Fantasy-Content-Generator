/* Pure helpers for settings: copying defaults, merging saved data, and checking imported files.
   No Obsidian imports, so they run in unit tests. */

type Plain = Record<string, unknown>;

function isPlainObject(value: unknown): value is Plain {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** A deep copy of plain data (objects, arrays, strings, numbers, booleans). */
export function clonePlain<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Saved settings over the defaults, group by group.
 * A setting added inside a group in a newer version reaches existing users,
 * and every value the user saved is kept. Arrays (word lists) are taken as saved.
 * Never changes `defaults`.
 */
export function mergeSettings<T>(defaults: T, saved: unknown): T {
    const result = clonePlain(defaults) as unknown;
    if (!isPlainObject(saved) || !isPlainObject(result)) return result as T;
    for (const [key, value] of Object.entries(saved)) {
        const base = result[key];
        if (isPlainObject(base) && isPlainObject(value)) result[key] = mergeSettings(base, value);
        else if (value !== undefined) result[key] = clonePlain(value);
    }
    return result as T;
}

/** A weighted loot item. */
export interface WeightedItem { item: string; weight: number }

/**
 * Turn what the user typed into list entries: one per line, or comma separated when it's a single line.
 * Blank entries are dropped.
 */
export function parseListInput(text: string): string[] {
    const parts = text.includes("\n") ? text.split("\n") : text.split(",");
    return parts.map((p) => p.trim()).filter((p) => p.length > 0);
}

/** "Sword | 3" -> {item: "Sword", weight: 3}. Weight defaults to 1. */
export function parseWeightedInput(text: string): WeightedItem[] {
    return parseListInput(text).map((entry) => {
        const [name, weight] = entry.split("|").map((p) => p.trim());
        const n = Number(weight);
        return { item: name, weight: weight !== undefined && Number.isFinite(n) && n > 0 ? n : 1 };
    }).filter((w) => w.item.length > 0);
}

/**
 * Check an imported section against the shape of its defaults.
 * Returns an error message, or null when it fits.
 */
export function checkImport(defaults: unknown, data: unknown): string | null {
    if (Array.isArray(defaults)) {
        if (!Array.isArray(data)) return "expected a list";
        return null;
    }
    if (!isPlainObject(defaults)) return null;
    if (!isPlainObject(data)) return "expected an object with lists";
    for (const [key, value] of Object.entries(defaults)) {
        if (!(key in data)) return `missing "${key}"`;
        if (Array.isArray(value) && !Array.isArray(data[key])) return `"${key}" should be a list`;
    }
    return null;
}

/** Parse JSON text, with a readable error. */
export function parseJsonText(text: string): unknown {
    try {
        return JSON.parse(text) as unknown;
    } catch {
        throw new Error("The file isn't valid JSON.");
    }
}
