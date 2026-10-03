/* Custom generators written as notes (issue #11). Pure functions: no Obsidian imports, unit-tested.

   A note is a generator when its properties have `fcg-generator: <name>`.
     fcg-key:   optional inline key (default: the name, each word capitalised, no spaces)
     pattern:   one pattern, always used
     patterns:  several patterns, one picked at random each time
   Lists are `## Heading` followed by `- item` lines; `- item | 3` gives a weight of 3.
   In a pattern, {List} picks from that list, {A|B} from either list, other text stays as written. */
import { pickWeighted } from "utils/random";

export interface WeightedEntry {
    item: string;
    weight: number;
}

export interface CustomGenerator {
    /** Name from `fcg-generator` */
    name: string;
    /** Inline key (`@Key`) */
    key: string;
    /** Path of the note it came from */
    path: string;
    /** Lists by lower-case heading */
    lists: Map<string, WeightedEntry[]>;
    /** Heading as written, by lower-case heading (for messages) */
    listNames: Map<string, string>;
    patterns: string[];
    /** Problems found while reading; the generator may still work */
    problems: string[];
}

/** "Ashborn names" -> "AshbornNames"; "half-elf (homebrew)" -> "HalfElfHomebrew". */
export function keyFromName(name: string): string {
    return name
        .split(/[^\p{L}\p{N}]+/u)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
}

/** The note text without its properties block. */
export function stripFrontmatter(text: string): string {
    const m = /^---\r?\n[\s\S]*?\r?\n---[ \t]*(\r?\n|$)/.exec(text);
    return m ? text.slice(m[0].length) : text;
}

/** "Irith | 3" -> {item: "Irith", weight: 3}; weight defaults to 1. */
export function parseEntry(raw: string): WeightedEntry | null {
    const bar = raw.lastIndexOf("|");
    let item = raw;
    let weight = 1;
    if (bar >= 0) {
        const after = raw.slice(bar + 1).trim();
        const w = Number(after);
        if (after === "") item = raw.slice(0, bar);
        else if (Number.isFinite(w) && w > 0) {
            item = raw.slice(0, bar);
            weight = w;
        }
    }
    item = item.trim();
    return item ? { item, weight } : null;
}

/** Lists from the note body: `## Heading` then `- item` / `* item` / `+ item` lines. Other lines are ignored. */
export function parseLists(body: string): { lists: Map<string, WeightedEntry[]>; names: Map<string, string> } {
    const lists = new Map<string, WeightedEntry[]>();
    const names = new Map<string, string>();
    let current: WeightedEntry[] | null = null;
    let inFence = false;
    for (const line of body.split(/\r?\n/)) {
        if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; continue; }
        if (inFence) continue;
        const heading = /^##\s+(.+?)\s*#*\s*$/.exec(line);
        if (heading) {
            const name = heading[1].trim();
            const id = name.toLowerCase();
            if (!lists.has(id)) { lists.set(id, []); names.set(id, name); }
            current = lists.get(id) ?? null;
            continue;
        }
        if (/^#\s/.test(line)) { current = null; continue; }
        const bullet = /^\s*[-*+]\s+(?:\[[ xX]\]\s+)?(.*)$/.exec(line);
        if (bullet && current) {
            const entry = parseEntry(bullet[1]);
            if (entry) current.push(entry);
        }
    }
    return { lists, names };
}

function asStringList(value: unknown): string[] {
    if (typeof value === "string") return [value];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
    return [];
}

/**
 * Read one generator note.
 * @param fm   the note's properties (frontmatter), as Obsidian parsed them
 * @param body the note text (with or without its properties block)
 * @returns null when the note isn't a generator (no `fcg-generator`)
 */
export function parseGeneratorNote(path: string, fm: Record<string, unknown> | undefined, body: string): CustomGenerator | null {
    const rawName: unknown = fm?.["fcg-generator"];
    if (rawName === undefined || rawName === null) return null;
    const problems: string[] = [];
    const fallbackName = path.replace(/^.*\//, "").replace(/\.md$/i, "");
    const name = typeof rawName === "string" && rawName.trim() ? rawName.trim() : fallbackName;
    if (typeof rawName !== "string" || !rawName.trim()) problems.push(`"fcg-generator" has no name, so the note name "${fallbackName}" is used`);

    const rawKey: unknown = fm?.["fcg-key"];
    let key = keyFromName(name);
    if (typeof rawKey === "string" && rawKey.trim()) {
        const cleaned = rawKey.trim().replace(/\s+/g, "");
        if (cleaned !== rawKey.trim()) problems.push(`"fcg-key" can't contain spaces, so "${cleaned}" is used`);
        key = cleaned;
    }
    if (!key) problems.push("this generator has no usable key (add fcg-key)");

    const { lists, names } = parseLists(stripFrontmatter(body));
    let patterns = [...asStringList(fm?.patterns), ...asStringList(fm?.pattern)].map((p) => p.trim()).filter(Boolean);
    if (!lists.size) problems.push("no lists found (a list is a ## heading followed by - items)");
    for (const [id, entries] of lists) if (!entries.length) problems.push(`the list "${names.get(id)}" is empty`);
    if (!patterns.length && lists.size) patterns = [`{${[...names.values()][0]}}`];
    for (const p of patterns) {
        for (const m of p.matchAll(/\{([^{}]+)\}/g)) {
            for (const part of m[1].split("|").map((x) => x.trim()).filter(Boolean)) {
                if (!lists.has(part.toLowerCase())) problems.push(`the pattern "${p}" uses {${part}}, but there is no list "## ${part}"`);
            }
        }
    }
    return { name, key, path, lists, listNames: names, patterns, problems };
}

/** One result from a custom generator. Throws with a readable message if it can't. */
export function runCustom(gen: CustomGenerator): string {
    if (!gen.patterns.length) throw new Error(`${gen.name} has no lists to pick from.`);
    const pattern = gen.patterns[Math.floor(Math.random() * gen.patterns.length)];
    return pattern.replace(/\{([^{}]+)\}/g, (_whole, inner: string) => {
        const pool: WeightedEntry[] = [];
        for (const part of inner.split("|")) pool.push(...(gen.lists.get(part.trim().toLowerCase()) ?? []));
        if (!pool.length) throw new Error(`${gen.name}: nothing to pick for {${inner}}. Check that the list exists and has items.`);
        return pickWeighted(pool);
    }).trim();
}

/** Starter note for the New generator command (structure only; the words are placeholders). */
export function starterNote(name: string): string {
    return `---
fcg-generator: ${name}
pattern: "{First} {Family}"
---
Type @${keyFromName(name)} in any note to use this generator.

## First
- First A
- First B
- First C

## Family
- Family A
- Family B
`;
}

/** Example note added the first time the generator folder is created: shows every rule. */
export const EXAMPLE_NOTE = `---
fcg-generator: Example generator
fcg-key: Example
patterns:
  - "{First} {Family}"
  - "{First} {Family}"
  - "Captain {Family}"
---
# How this generator works

Type **@Example** in any note (or pick it in the generator window under Custom).

- \`fcg-generator\` names the generator. \`fcg-key\` sets the inline key; without it the key is the name without spaces (here it would be @ExampleGenerator).
- \`pattern\` (one) or \`patterns\` (several, one picked at random each time). Listing a pattern twice makes it twice as likely.
- \`{List}\` picks from the list under \`## List\`. \`{A|B}\` picks from either list.
- \`- item | 3\` makes an item three times as likely.
- Everything else in the note (like this text) is ignored.

## First
- First A
- First B | 3
- First C

## Family
- Family A
- Family B
`;

/**
 * Decide which custom generators are active. A key already used by a built-in generator or an
 * earlier note (sorted by path) is skipped and the clash added to that note's problems.
 * Keys are compared ignoring case, because inline matching ignores case.
 */
export function resolveCustom(gens: CustomGenerator[], builtInKeys: Iterable<string>): Map<string, CustomGenerator> {
    const taken = new Map<string, string>();
    for (const k of builtInKeys) taken.set(k.toLowerCase(), "a built-in generator");
    const active = new Map<string, CustomGenerator>();
    for (const g of [...gens].sort((a, b) => a.path.localeCompare(b.path))) {
        if (!g.key) continue;
        const owner = taken.get(g.key.toLowerCase());
        if (owner) {
            g.problems.push(`the key @${g.key} is already used by ${owner}; set a different fcg-key`);
            continue;
        }
        taken.set(g.key.toLowerCase(), `"${g.path}"`);
        active.set(g.key, g);
    }
    return active;
}

/**
 * Inline suggestions for what was typed after the trigger: names that start with it first,
 * then names that contain it anywhere. Case is ignored; order within each group is kept.
 */
export function rankKeys(keys: readonly string[], query: string): string[] {
    const q = query.toLowerCase();
    if (!q) return [...keys];
    const starts: string[] = [];
    const contains: string[] = [];
    for (const k of keys) {
        const l = k.toLowerCase();
        if (l.startsWith(q)) starts.push(k);
        else if (l.includes(q)) contains.push(k);
    }
    return [...starts, ...contains];
}
