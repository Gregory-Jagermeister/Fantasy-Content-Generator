/* The generator side panel's logic (1.6.0): what the picker lists, how it searches, how results are
   joined for Insert and Copy, and the recent list. Pure functions, no Obsidian imports, unit-tested. */

export type EntryKind = "builtin" | "starter" | "custom" | "addStarter";

/** One choice in the panel's picker. */
export interface PanelEntry {
    /** Generator key ("" for "Add a starter set…") */
    key: string;
    /** What the picker shows */
    label: string;
    /** Shown beside the label: the built-in group, "Starter set" or "Custom" */
    group: string;
    /** Searched too, not shown as the label: races for starter sets, the key */
    hint: string;
    kind: EntryKind;
    /** The "+ meaning" twin's key, when the generator has meanings */
    meaningKey?: string;
}

export interface EntrySources {
    /** Built-in generators that aren't hidden in settings */
    builtIns: { key: string; label: string; group: string }[];
    /** Custom generators that are active, twins ("+ meaning") included */
    customs: { key: string; name: string; twinKey?: string; withMeanings?: boolean }[];
    /** Is this key a starter set's? */
    isStarter: (key: string) => boolean;
    /** Races for a starter set key, e.g. "Dwarf" */
    racesOf: (key: string) => string;
}

export const ADD_STARTER_LABEL = "Add a starter set…";

/**
 * Every choice for the picker: built-ins, then starter sets, then custom generators.
 * One entry per set: "+ meaning" twins are folded into their set (the Show meanings toggle uses them).
 * With no starter sets added, a "Names" group offers "Add a starter set…".
 */
export function buildEntries(src: EntrySources): PanelEntry[] {
    const out: PanelEntry[] = src.builtIns.map((b) => ({ key: b.key, label: b.label, group: b.group, hint: b.key, kind: "builtin" as const }));
    const starters: PanelEntry[] = [];
    const customs: PanelEntry[] = [];
    for (const c of src.customs) {
        if (c.withMeanings) continue;
        const starter = src.isStarter(c.key);
        const entry: PanelEntry = {
            key: c.key, label: c.name, group: starter ? "Starter set" : "Custom",
            hint: `${c.key} ${starter ? src.racesOf(c.key) : ""}`.trim(), kind: starter ? "starter" : "custom",
        };
        if (c.twinKey) entry.meaningKey = c.twinKey;
        (starter ? starters : customs).push(entry);
    }
    const byLabel = (a: PanelEntry, b: PanelEntry) => a.label.localeCompare(b.label);
    if (!starters.length) out.push({ key: "", label: ADD_STARTER_LABEL, group: "Names", hint: "names starter set", kind: "addStarter" });
    return [...out, ...starters.sort(byLabel), ...customs.sort(byLabel)];
}

/**
 * Entries matching what was typed: label starts with it, then a word in the label starts with it,
 * then the label or key contains it, then the hint (races) contains it. Empty query: everything, in order.
 */
export function searchEntries(entries: PanelEntry[], query: string): PanelEntry[] {
    const q = query.trim().toLowerCase();
    if (!q) return [...entries];
    const tiers: PanelEntry[][] = [[], [], [], []];
    for (const e of entries) {
        const label = e.label.toLowerCase();
        if (label.startsWith(q)) tiers[0].push(e);
        else if (label.split(/[^\p{L}\p{N}]+/u).some((w) => w.startsWith(q))) tiers[1].push(e);
        else if (label.includes(q) || e.key.toLowerCase().includes(q)) tiers[2].push(e);
        else if (e.hint.toLowerCase().includes(q)) tiers[3].push(e);
    }
    return tiers.flat();
}

/** A result with more than one line shows as a block. */
export function isMultiLine(text: string): boolean {
    return text.trim().includes("\n");
}

/** Results joined for Insert all / Copy all: one-line results one per line, blocks set apart by a blank line. */
export function joinResults(texts: string[]): string {
    let out = "";
    let prevBlock = false;
    texts.forEach((t, i) => {
        const text = t.trim();
        const block = isMultiLine(text);
        if (i) out += block || prevBlock ? "\n\n" : "\n";
        out += text;
        prevBlock = block;
    });
    return out;
}

/**
 * The text to put at the cursor.
 * - One-line results go right at the cursor, inside the sentence ("The dwarf by the name of |"): a space is added
 *   before when the text before doesn't end in one, and after when a word follows straight away.
 * - Blocks (and "Insert all", which is joined into lines) go on their own lines: a line break first when the
 *   cursor's line has text, a blank line before when the line above has text, and a blank line after.
 * @param lineBefore the cursor's line up to the cursor
 * @param lineAbove the line above the cursor's line ("" at the top of the note)
 * @param lineAfter the cursor's line after the cursor
 */
export function insertionText(text: string, lineBefore: string, lineAbove = "", lineAfter = ""): string {
    const body = text.trim();
    if (!isMultiLine(body)) {
        const before = lineBefore && !/[\s([{"'“‘]$/u.test(lineBefore) ? " " : "";
        const after = /^[\p{L}\p{N}]/u.test(lineAfter) ? " " : "";
        return `${before}${body}${after}`;
    }
    let lead = "";
    if (lineBefore.trim()) lead = "\n\n";
    else if (lineAbove.trim()) lead = "\n";
    return `${lead}${body}\n\n`;
}

/** The recent list after using `key`: newest first, no repeats, at most `max`. */
export function pushRecent(recent: readonly string[], key: string, max = 4): string[] {
    return [key, ...recent.filter((k) => k !== key)].slice(0, max);
}

/** Pin or unpin a key; pins keep the order they were added in. */
export function togglePin(pins: readonly string[], key: string): string[] {
    return pins.includes(key) ? pins.filter((k) => k !== key) : [...pins, key];
}
