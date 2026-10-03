/* Custom generators written as notes (issue #11). Pure functions: no Obsidian imports, unit-tested.

   A note is a generator when its properties have `fcg-generator: <name>`.
     fcg-key:   optional inline key (default: the name, each word capitalised, no spaces)
     pattern:   one pattern, always used
     patterns:  several patterns, one picked at random each time
     fcg-capitalize: true capitalises the first letter of each result
   Lists are `## Heading` followed by `- item` lines; `- item | 3` gives a weight of 3.
   `## Size (d20)` makes a ranged list (`- 1-2: text`); `## Elf (learn)` a sample list.
   Patterns (in the properties and inside rows) are evaluated by the note engine (generators/engine.ts). */
import { Evaluator, EngineHost, ListInfo, ListRow, WeightedEntry, checkText, parseHeading, parseKeyedRow, parseRangedRow, rangedProblems } from "generators/engine";

export type { WeightedEntry, ListRow, ListInfo } from "generators/engine";

export interface CustomGenerator {
    /** Name from `fcg-generator` */
    name: string;
    /** Inline key (`@Key`) */
    key: string;
    /** Path of the note it came from */
    path: string;
    /** Lists by lower-case heading */
    lists: Map<string, ListRow[]>;
    /** Heading as written (without its "(d20)" or "(learn)"), by lower-case heading */
    listNames: Map<string, string>;
    /** Kind of each list: plain, ranged or learn */
    listInfo: Map<string, ListInfo>;
    patterns: string[];
    /** Capitalise the first letter of each result (`fcg-capitalize: true`) */
    capitalize: boolean;
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

/**
 * Lists from the note body: `## Heading` then `- item` / `* item` / `+ item` lines. Other lines are ignored.
 * A heading ending in "(d20)" makes a ranged list; "(learn)" or "(learn 4-9)" a sample list.
 */
export function parseLists(body: string): { lists: Map<string, ListRow[]>; names: Map<string, string>; info: Map<string, ListInfo>; problems: string[] } {
    const lists = new Map<string, ListRow[]>();
    const names = new Map<string, string>();
    const info = new Map<string, ListInfo>();
    const problems: string[] = [];
    let current: ListRow[] | null = null;
    let currentInfo: ListInfo = { kind: "plain" };
    let currentName = "";
    let inFence = false;
    for (const line of body.split(/\r?\n/)) {
        if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; continue; }
        if (inFence) continue;
        const heading = /^##\s+(.+?)\s*#*\s*$/.exec(line);
        if (heading) {
            const { name, info: listInfo } = parseHeading(heading[1].trim());
            const id = name.toLowerCase();
            if (!lists.has(id)) { lists.set(id, []); names.set(id, name); info.set(id, listInfo); }
            current = lists.get(id) ?? null;
            currentInfo = info.get(id) ?? { kind: "plain" };
            currentName = names.get(id) ?? name;
            continue;
        }
        if (/^#\s/.test(line)) { current = null; continue; }
        const bullet = /^\s*[-*+]\s+(?:\[[ xX]\]\s+)?(.*)$/.exec(line);
        if (!bullet || !current) continue;
        const entry = parseEntry(bullet[1]);
        if (!entry) continue;
        if (currentInfo.kind === "ranged") {
            const r = parseRangedRow(entry.item);
            if (!r) { problems.push(`the row "${entry.item}" in "## ${currentName}" needs a number or range first, like "- 1-2: text"`); continue; }
            current.push({ item: r.text, weight: 1, lo: r.lo, hi: r.hi });
        } else {
            const keyed = currentInfo.kind === "plain" ? parseKeyedRow(entry.item) : null;
            current.push(keyed ? { ...entry, key: keyed.key, value: keyed.value } : entry);
        }
    }
    return { lists, names, info, problems };
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

    const parsed = parseLists(stripFrontmatter(body));
    const { lists, names, info } = parsed;
    problems.push(...parsed.problems);
    let patterns = [...asStringList(fm?.patterns), ...asStringList(fm?.pattern)].map((p) => p.trim()).filter(Boolean);
    if (!lists.size) problems.push("no lists found (a list is a ## heading followed by - items)");
    for (const [id, entries] of lists) if (!entries.length) problems.push(`the list "${names.get(id)}" is empty`);
    if (!patterns.length && lists.size) patterns = [`{${[...names.values()][0]}}`];
    const src = { name, lists, listNames: names, listInfo: info };
    for (const p of patterns) problems.push(...checkText(p, `the pattern "${p}"`, src));
    for (const [id, rows] of lists) {
        const listName = names.get(id) ?? id;
        const kind = info.get(id);
        if (kind?.kind === "ranged" && kind.die) problems.push(...rangedProblems(listName, kind.die, rows));
        if (kind?.kind === "learn") {
            if (rows.length < 10) problems.push(`"## ${listName}" learns from samples and needs at least 10 (it has ${rows.length})`);
            continue;
        }
        for (const r of rows) problems.push(...checkText(r.key !== undefined ? r.value ?? "" : r.item, `a row in "## ${listName}"`, src));
    }
    const capitalize = fm?.["fcg-capitalize"] === true || fm?.["fcg-capitalize"] === "true";
    return { name, key, path, lists, listNames: names, listInfo: info, patterns, capitalize, problems: [...new Set(problems)] };
}

/**
 * One result from a custom generator. Throws with a readable message if it can't.
 * @param host  lets {@Key} run other generators
 * @param depth how deeply generator calls are nested already
 */
export function runCustom(gen: CustomGenerator, host: EngineHost = {}, depth = 0): string {
    if (!gen.patterns.length) throw new Error(`${gen.name} has no lists to pick from.`);
    const pattern = gen.patterns[Math.floor(Math.random() * gen.patterns.length)];
    const text = new Evaluator({ name: gen.name, lists: gen.lists, listNames: gen.listNames, listInfo: gen.listInfo }, host, depth).run(pattern);
    return gen.capitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text;
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
pattern: |
  {First} {Family}, {Role}
  Carries {1d6} coins and {2 x Item}.
  Mood: {Mood}
---
# How this generator works

Type **@Example** in any note (or pick it in the generator window under Custom). Replace the placeholder words with your own.

- \`fcg-generator\` names the generator. \`fcg-key\` sets the inline key; without it the key is the name without spaces (here it would be @ExampleGenerator).
- \`pattern\` is used every time; \`pattern: |\` lets it run over several lines. \`patterns\` (a list) picks one at random each time.
- \`{List}\` picks from the list under \`## List\`. \`{A|B}\` picks from either list. \`- item | 3\` makes an item three times as likely.
- \`{1d6}\`, \`{2d6+1}\`, \`{1-4}\` roll dice or a range. \`{2 x Item}\` gives two different items.
- A heading like \`## Mood (d6)\` makes a table: each row starts with the numbers it covers.
- \`{@Key}\` puts another generator's result here, built-in or yours (for example \`{@Drinks}\`).
- \`{$gold = 2d6}\` remembers a number or result; \`{$gold}\` prints it; \`{$gold += 1}\` changes it; \`{Mood + $gold}\` rolls a table with a modifier.
- Everything else in the note (like this text) is ignored. See the plugin's README for the full list.

## First
- First A
- First B | 3
- First C

## Family
- Family A
- Family B

## Role
- Role A
- Role B

## Item
- Item A
- Item B
- Item C

## Mood (d6)
- 1-2: Mood A
- 3-5: Mood B
- 6: Mood C
`;

/** Example naming kit added the first time the generator folder is created (letters only; your samples go in the code block's place). */
export const EXAMPLE_NAMING_KIT = `---
fcg-generator: Example naming kit
fcg-key: ExampleNames
fcg-capitalize: true
patterns:
  - "{C}{V}{C}"
  - "{C}{V}{C}{V}"
  - "{V}{C}{V}{C}"
---
# Two ways to make names

**1. Sound templates** (this note): lists of sounds and patterns that join them. \`fcg-capitalize: true\` gives the result a capital letter. Change the letters to change the feel: hard sounds (k, t, g) feel rough, soft ones (l, m, w) feel gentle.

**2. Learn from samples**: a list whose heading ends in \`(learn)\` holds at least 10 names you like. Picking from it makes a **new** name in the same style, never a copy of a sample. \`(learn 4-9)\` limits the length; without it, names are as long as your shortest to longest sample. To try it, copy this into a new note, swap in your own names, and remove the code fence:

\`\`\`
---
fcg-generator: My names
pattern: "{Names}"
---
## Names (learn)
- (your first sample name)
- (and at least nine more)
\`\`\`

Tip: a language tool such as Vulgarlang can make a word list to pick samples from.

## C
- k
- t
- r
- l
- m
- n
- s

## V
- a
- e
- i
- o
- u
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
