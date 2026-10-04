/* The note engine (1.4.0): evaluates patterns in generator notes.
   Pure functions, no Obsidian imports, unit-tested.

   Inside {braces}:
     {List} {A|B}            pick from a list (ranged lists roll their die)
     {@Key}                  another generator (built-in or custom), through the host
     {2d6} {1d8+4} {1-4}     dice, ranges and sums; $names allowed: {1d20 + $x}
     {N x List}              N different results (N: number, range, dice, $name or a lookup)
     {List + $x} {List - 2}  ranged list rolled with a modifier, clamped to its first and last rows
     {List with d4}          ranged list rolled with another die (a modifier may follow)
     {List: key}             keyed lookup (key can be $name); on a ranged list a number picks its row
     {$x = ...} {$x += 2}    remember a number or a result (prints nothing)
     {$x}                    print a remembered value
     {again}                 inside a row: roll the same list again, that row excluded
     {List.meaning}          a meaning list's English side ("blood"), not recorded as a meaning
   "## Name (learn)" lists hold sample names; picking from one makes a new name in their style.
   "## Name (meanings)" lists hold "- word = meaning" rows; picking one prints the word and records
   the meaning, so a name can show what it means: Nöndtrind (stone-helmet).
   \{ and \} are literal braces. */
import { pickWeighted, randomInt } from "utils/random";

export interface WeightedEntry {
    item: string;
    weight: number;
}

/** One row of a list. `item` is what a random pick prints. */
export interface ListRow extends WeightedEntry {
    /** Ranged lists: the row covers lo..hi */
    lo?: number;
    hi?: number;
    /** Keyed rows ("Small: {1d8+4}"): the key and the text after the colon */
    key?: string;
    value?: string;
    /** Meaning lists: what the word means ("nönd = stone" -> "stone") */
    meaning?: string;
}

export interface ListInfo {
    kind: "plain" | "ranged" | "learn" | "meanings";
    /** Ranged lists: the die in the heading */
    die?: number;
    /** Learn lists: name length limits, if given */
    min?: number;
    max?: number;
}

/** What the engine needs from a generator note. */
export interface EngineSource {
    name: string;
    lists: Map<string, ListRow[]>;
    listNames: Map<string, string>;
    listInfo: Map<string, ListInfo>;
}

/** Lets the engine run other generators ({@Key}). `depth` is how deeply calls are nested. */
export interface EngineHost {
    call?: (key: string, depth: number) => string;
}

export const MAX_DEPTH = 10;
export const MAX_REPEAT = 100;
const MAX_STEPS = 20000;
const NAME = String.raw`[\p{L}\p{N}_]+`;
const VAR_RE = new RegExp(String.raw`^\$(${NAME})$`, "u");
const ASSIGN_RE = new RegExp(String.raw`^\$(${NAME})\s*(\+=|-=|=)\s*(.+)$`, "su");
const TERM_RE = new RegExp(String.raw`^(\d+d\d+|d\d+|\d+-\d+|\d+|\$${NAME})`, "u");

/* ---------------- headings and rows ---------------- */

/** "Size (d20)" -> {name: "Size", info: ranged d20}; "Elf (learn 4-9)" -> learn list; "Land (meanings)" -> meaning list; else plain. */
export function parseHeading(text: string): { name: string; info: ListInfo } {
    const meanings = /^(.*?)\s*\(\s*meanings\s*\)\s*$/i.exec(text);
    if (meanings && meanings[1].trim()) return { name: meanings[1].trim(), info: { kind: "meanings" } };
    const m = /^(.*?)\s*\(\s*(?:d(\d+)|learn(?:\s+(\d+)\s*-\s*(\d+))?)\s*\)\s*$/i.exec(text);
    if (!m || !m[1].trim()) return { name: text.trim(), info: { kind: "plain" } };
    if (m[2]) return { name: m[1].trim(), info: { kind: "ranged", die: Number(m[2]) } };
    const info: ListInfo = { kind: "learn" };
    if (m[3] && m[4]) { info.min = Math.min(Number(m[3]), Number(m[4])); info.max = Math.max(Number(m[3]), Number(m[4])); }
    return { name: m[1].trim(), info };
}

/** "1-2: Very Small" or "20: Huge" -> {lo, hi, text}; null when the row has no number. */
export function parseRangedRow(raw: string): { lo: number; hi: number; text: string } | null {
    const m = /^(\d+)\s*(?:-\s*(\d+))?\s*:\s*(.*)$/s.exec(raw.trim());
    if (!m) return null;
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    return { lo: Math.min(a, b), hi: Math.max(a, b), text: m[3].trim() };
}

/** "Small: {1d8+4}" -> {key: "Small", value: "{1d8+4}"}; null when there's no "key: " at the start. */
export function parseKeyedRow(raw: string): { key: string; value: string } | null {
    const m = /^([^{}:|]+?)\s*:\s+(.+)$/s.exec(raw.trim());
    return m ? { key: m[1].trim(), value: m[2].trim() } : null;
}

/** "nönd = stone" -> {word: "nönd", meaning: "stone"}; null when there's no "=" with text on both sides. */
export function parseMeaningRow(raw: string): { word: string; meaning: string } | null {
    const i = raw.indexOf("=");
    if (i < 0) return null;
    const word = raw.slice(0, i).trim();
    const meaning = raw.slice(i + 1).trim();
    return word && meaning ? { word, meaning } : null;
}

/**
 * The translation shown after a name: meanings in one word join with "-", words with ", ".
 * `log` holds meanings and null for each break between words.
 */
export function translation(log: (string | null)[]): string {
    const words: string[][] = [[]];
    for (const m of log) {
        if (m === null) { if (words[words.length - 1].length) words.push([]); }
        else words[words.length - 1].push(m);
    }
    return words.filter((w) => w.length).map((w) => w.join("-")).join(", ");
}

/** Problems with a ranged list's rows: gaps, overlaps, rows outside the die. */
export function rangedProblems(name: string, die: number, rows: ListRow[]): string[] {
    const problems: string[] = [];
    const seen = new Array<number>(die + 1).fill(0);
    for (const r of rows) {
        if (r.lo === undefined || r.hi === undefined) continue;
        if (r.lo < 1 || r.hi > die) problems.push(`"## ${name}" has a row ${r.lo}-${r.hi} outside 1-${die}`);
        for (let n = Math.max(1, r.lo); n <= Math.min(die, r.hi); n++) seen[n]++;
    }
    const gaps: number[] = [];
    const overlaps: number[] = [];
    for (let n = 1; n <= die; n++) {
        if (seen[n] === 0) gaps.push(n);
        else if (seen[n] > 1) overlaps.push(n);
    }
    if (gaps.length) problems.push(`"## ${name}" (d${die}) has no row for ${spans(gaps)}`);
    if (overlaps.length) problems.push(`"## ${name}" (d${die}) has more than one row for ${spans(overlaps)}`);
    return problems;
}

function spans(ns: number[]): string {
    const out: string[] = [];
    let start = ns[0];
    let prev = ns[0];
    for (const n of [...ns.slice(1), Infinity]) {
        if (n === prev + 1) { prev = n; continue; }
        out.push(start === prev ? String(start) : `${start}-${prev}`);
        start = prev = n;
    }
    return out.join(", ");
}

/* ---------------- pattern scanning ---------------- */

interface Piece {
    /** Literal text, or the inside of a {brace} */
    text: string;
    isExpr: boolean;
    /** Brace pieces: alone on their line (only whitespace around them) */
    alone?: boolean;
    /** Brace pieces: the whitespace before them on their line */
    indent?: string;
}

/** Split a pattern into literal text and {expressions}. Throws on unbalanced braces. */
export function scanPattern(pattern: string): Piece[] {
    const pieces: Piece[] = [];
    let lit = "";
    let i = 0;
    while (i < pattern.length) {
        const c = pattern[i];
        if (c === "\\" && (pattern[i + 1] === "{" || pattern[i + 1] === "}")) { lit += pattern[i + 1]; i += 2; continue; }
        if (c === "}") throw new Error(`a "}" without a "{" in: ${pattern}`);
        if (c !== "{") { lit += c; i++; continue; }
        const end = pattern.indexOf("}", i + 1);
        const nested = pattern.indexOf("{", i + 1);
        if (end < 0 || (nested >= 0 && nested < end)) throw new Error(`a "{" without a matching "}" in: ${pattern}`);
        const lineStart = pattern.lastIndexOf("\n", i - 1) + 1;
        const nextNl = pattern.indexOf("\n", end);
        const lineEnd = nextNl < 0 ? pattern.length : nextNl;
        const before = pattern.slice(lineStart, i);
        const after = pattern.slice(end + 1, lineEnd);
        if (lit) pieces.push({ text: lit, isExpr: false });
        lit = "";
        pieces.push({ text: pattern.slice(i + 1, end), isExpr: true, alone: !before.trim() && !after.trim(), indent: before });
        i = end + 1;
    }
    if (lit) pieces.push({ text: lit, isExpr: false });
    return pieces;
}

/** "a", "a and b", "a, b and c". */
export function joinNatural(items: string[]): string {
    if (items.length <= 1) return items.join("");
    return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/* ---------------- learning from samples ---------------- */

const START = "\u0002";
const END = "\u0003";
const ORDER = 3;
const LEARN_TRIES = 200;

/** Which letter follows each run of up to 3 letters in the samples, and how often. */
export interface NameModel {
    /** For each order 1..3: context -> next letter -> count */
    orders: Map<string, Map<string, number>>[];
    samples: Set<string>;
    minLen: number;
    maxLen: number;
    /** Most samples start with a capital letter */
    capital: boolean;
}

/**
 * Split text into the characters a reader sees: "ï" written as i + ¨ stays one character, and so do
 * "l̥" and "kʷ" (a mark or small modifier letter joins the letter before it). Text is normalised first.
 */
export function graphemes(text: string): string[] {
    const out: string[] = [];
    for (const ch of Array.from(text.normalize("NFC"))) {
        if (out.length && /[\p{M}\p{Lm}]/u.test(ch)) out[out.length - 1] += ch;
        else out.push(ch);
    }
    return out;
}

export function buildModel(samples: string[]): NameModel {
    const clean = samples.map((s) => s.trim().normalize("NFC")).filter(Boolean);
    const orders: Map<string, Map<string, number>>[] = [];
    for (let k = 0; k <= ORDER; k++) orders.push(new Map());
    for (const sample of clean) {
        const letters = [...START.repeat(ORDER), ...graphemes(sample.toLowerCase()), END];
        for (let i = ORDER; i < letters.length; i++) {
            for (let k = 1; k <= ORDER; k++) {
                const ctx = letters.slice(i - k, i).join("\u0001");
                const table = orders[k].get(ctx) ?? new Map<string, number>();
                table.set(letters[i], (table.get(letters[i]) ?? 0) + 1);
                orders[k].set(ctx, table);
            }
        }
    }
    const lengths = clean.map((s) => graphemes(s).length);
    const capitals = clean.filter((s) => s.charAt(0) !== s.charAt(0).toLowerCase()).length;
    return {
        orders,
        samples: new Set(clean.map((s) => s.toLowerCase())),
        minLen: lengths.length ? Math.min(...lengths) : 1,
        maxLen: lengths.length ? Math.max(...lengths) : 1,
        capital: capitals * 2 >= clean.length,
    };
}

/**
 * One letter after `history`, using the longest context the samples have seen, falling back to shorter ones.
 * Few samples use 2 letters of context (3 would mostly copy them); 50 or more use 3.
 */
function nextLetter(model: NameModel, history: string[]): string | undefined {
    const top = model.samples.size >= 50 ? ORDER : 2;
    for (let k = top; k >= 1; k--) {
        const table = model.orders[k].get(history.slice(-k).join("\u0001"));
        if (table?.size) return pickWeighted([...table].map(([item, weight]) => ({ item, weight })));
    }
    return undefined;
}

/**
 * A new name in the style of the samples: never one of the samples, length inside the limits
 * (default: shortest to longest sample). `accept` can reject a name (used for first-letter variety).
 * Returns undefined after 200 tries.
 */
export function learnName(model: NameModel, limits: { min?: number; max?: number } = {}, accept?: (name: string) => boolean): string | undefined {
    const min = limits.min ?? model.minLen;
    const max = limits.max ?? model.maxLen;
    for (let tries = 0; tries < LEARN_TRIES; tries++) {
        const history = START.repeat(ORDER).split("");
        const out: string[] = [];
        while (out.length <= max) {
            const c = nextLetter(model, history);
            if (c === undefined || c === END) break;
            out.push(c);
            history.push(c);
        }
        const word = out.join("");
        const len = out.length;
        if (len < min || len > max || model.samples.has(word)) continue;
        const name = model.capital ? word.charAt(0).toUpperCase() + word.slice(1) : word;
        if (accept && !accept(name) && tries < LEARN_TRIES / 2) continue;
        return name;
    }
    return undefined;
}

/* ---------------- evaluation ---------------- */

interface Ctx {
    /** The list whose row is being evaluated (for {again}) */
    list?: string;
    row?: ListRow;
    /** How many {again} rolls in a row */
    again: number;
}

type Value = number | string;

const MODELS = new WeakMap<ListRow[], NameModel>();

function modelFor(rows: ListRow[]): NameModel {
    let model = MODELS.get(rows);
    if (!model) { model = buildModel(rows.map((r) => r.item)); MODELS.set(rows, model); }
    return model;
}

export class Evaluator {
    private readonly vars = new Map<string, Value>();
    private steps = 0;
    /** First letters already used by the repeat in progress (for variety) */
    private firstLetters: Set<string> | null = null;
    /** Meanings picked so far, with null for each break between words */
    private readonly meaningLog: (string | null)[] = [];

    constructor(private readonly src: EngineSource, private readonly host: EngineHost = {}, private readonly depth = 0) {}

    /** Evaluate a whole pattern. */
    run(pattern: string): string {
        return tidy(this.pattern(pattern, { again: 0 }));
    }

    /** What the last run's name means ("stone-helmet"), or "" when it used no meaning list. */
    translation(): string {
        return translation(this.meaningLog);
    }

    /** Text with a space or line break in it ends the word being built. */
    private noteBreak(text: string): void {
        if (/\s/.test(text)) this.meaningLog.push(null);
    }

    private fail(message: string): never {
        throw new Error(`${this.src.name}: ${message}`);
    }

    private pattern(text: string, ctx: Ctx): string {
        let out = "";
        for (const p of scanPattern(text)) {
            if (!p.isExpr) { this.noteBreak(p.text); out += p.text; continue; }
            if (++this.steps > MAX_STEPS) this.fail("this makes too much text at once (a list may be calling itself through {again} or repeats)");
            const before = this.meaningLog.length;
            const text = this.expr(p.text.trim(), ctx, p);
            // Text that recorded no meaning (a first name, a call, a number) still splits words if it has a space.
            if (this.meaningLog.length === before) this.noteBreak(text);
            out += text;
        }
        return out;
    }

    private expr(e: string, ctx: Ctx, piece: Piece): string {
        if (!e) this.fail("an empty {} in a pattern");
        if (e.toLowerCase() === "again") return this.again(ctx);

        const assign = ASSIGN_RE.exec(e);
        if (assign) {
            const [, name, op, rhs] = assign;
            if (op === "=") {
                this.vars.set(name, isNumeric(rhs) ? this.number(rhs) : this.value(rhs.trim(), ctx));
            } else {
                const cur = this.vars.get(name) ?? 0;
                if (typeof cur !== "number") this.fail(`$${name} holds text ("${cur}"), so it can't be added to`);
                const n = this.number(rhs);
                this.vars.set(name, op === "+=" ? cur + n : cur - n);
            }
            return "";
        }

        const v = VAR_RE.exec(e);
        if (v) return String(this.vars.get(v[1]) ?? 0);

        const rep = /^(.+?)\s+x\s+(.+)$/is.exec(e);
        if (rep && this.isCount(rep[1].trim())) return this.repeat(rep[1].trim(), rep[2].trim(), ctx, piece);

        if (isNumeric(e)) return String(this.number(e));
        return this.value(e, ctx);
    }

    /** Can this be the N in {N x List}? */
    private isCount(s: string): boolean {
        if (isNumeric(s)) return true;
        const look = /^(.+?)\s*:\s*(.+)$/s.exec(s);
        return !!look && this.findList(look[1]) !== undefined;
    }

    /** A number from dice, ranges, whole numbers and $names joined by + and -. */
    private number(expr: string): number {
        let s = expr.trim();
        let total = 0;
        let sign = 1;
        let first = true;
        while (s.length) {
            if (!first) {
                const op = /^([+-])\s*/.exec(s);
                if (!op) this.fail(`"${expr}" isn't a number, dice or range`);
                sign = op[1] === "-" ? -1 : 1;
                s = s.slice(op[0].length);
            } else if (s.startsWith("-")) {
                sign = -1;
                s = s.slice(1).trimStart();
            }
            const t = TERM_RE.exec(s);
            if (!t) this.fail(`"${expr}" isn't a number, dice or range`);
            total += sign * this.term(t[1]);
            s = s.slice(t[0].length).trimStart();
            first = false;
        }
        return total;
    }

    private term(t: string): number {
        if (t.startsWith("$")) {
            const v = this.vars.get(t.slice(1)) ?? 0;
            if (typeof v === "number") return v;
            const n = Number(v);
            if (Number.isFinite(n)) return n;
            this.fail(`${t} holds text ("${v}"), not a number`);
        }
        const dice = /^(\d*)d(\d+)$/.exec(t);
        if (dice) {
            const count = dice[1] ? Number(dice[1]) : 1;
            const sides = Number(dice[2]);
            if (count > MAX_REPEAT || sides < 1) this.fail(`can't roll ${t}`);
            let sum = 0;
            for (let i = 0; i < count; i++) sum += randomInt(1, sides);
            return sum;
        }
        const range = /^(\d+)-(\d+)$/.exec(t);
        if (range) {
            const lo = Number(range[1]);
            const hi = Number(range[2]);
            if (lo > hi) this.fail(`the range ${t} runs backwards`);
            return randomInt(lo, hi);
        }
        return Number(t);
    }

    /** A count for a repeat: a number expression, or a lookup whose result is a number. */
    private count(expr: string, ctx: Ctx): number {
        const n = isNumeric(expr) ? this.number(expr) : Number(this.value(expr, ctx).trim());
        if (!Number.isFinite(n)) this.fail(`"${expr}" didn't give a number to repeat by`);
        return Math.max(0, Math.floor(n));
    }

    private repeat(countExpr: string, itemExpr: string, ctx: Ctx, piece: Piece): string {
        const n = this.count(countExpr, ctx);
        if (n > MAX_REPEAT) this.fail(`a repeat can make at most ${MAX_REPEAT} items (asked for ${n})`);
        const items: string[] = [];
        const seen = new Set<string>();
        const outer = this.firstLetters;
        this.firstLetters = new Set();
        try {
            for (let i = 0; i < n; i++) {
                if (i) this.meaningLog.push(null);
                const mark = this.meaningLog.length;
                let text = "";
                for (let tries = 0; tries < 20; tries++) {
                    this.meaningLog.length = mark; // a re-roll replaces the meanings of the one it discards
                    text = this.expr(itemExpr, ctx, { text: itemExpr, isExpr: true });
                    if (!seen.has(text)) break;
                }
                seen.add(text);
                items.push(text);
                this.firstLetters.add(text.charAt(0).toLowerCase());
            }
        } finally {
            this.firstLetters = outer;
        }
        if (piece.alone) return items.map((t) => `- ${t}`).join(`\n${piece.indent ?? ""}`);
        return joinNatural(items);
    }

    /** Lists, lookups, modified rolls and calls: anything that gives text. */
    private value(e: string, ctx: Ctx): string {
        if (e.startsWith("@")) return this.call(e.slice(1).trim());

        const whole = this.findList(e);
        if (whole !== undefined) return this.pick(whole, ctx, {});

        const side = /^(.+?)\.meaning$/i.exec(e);
        if (side) {
            const id = this.findList(side[1]);
            if (id !== undefined) return this.meaningOf(id);
        }

        const look = /^(.+?)\s*:\s*(.+)$/s.exec(e);
        if (look) {
            const id = this.findList(look[1]);
            if (id !== undefined) return this.lookup(id, look[2].trim(), ctx);
        }

        const withDie = /^(.+?)\s+with\s+d(\d+)\s*(?:([+-])\s*(.+))?$/is.exec(e);
        if (withDie) {
            const id = this.findList(withDie[1]);
            if (id !== undefined) {
                const mod = withDie[3] ? (withDie[3] === "-" ? -1 : 1) * this.number(withDie[4]) : 0;
                return this.pick(id, ctx, { die: Number(withDie[2]), mod });
            }
        }

        for (let i = e.length - 1; i > 0; i--) {
            if (e[i] !== "+" && e[i] !== "-") continue;
            const id = this.findList(e.slice(0, i));
            const rest = e.slice(i + 1);
            if (id !== undefined && isNumeric(rest)) return this.pick(id, ctx, { mod: (e[i] === "-" ? -1 : 1) * this.number(rest) });
        }

        if (e.includes("|")) {
            const ids = e.split("|").map((p) => p.trim()).filter(Boolean).map((p) => this.findList(p));
            if (ids.every((id): id is string => id !== undefined)) return this.pickUnion(ids, ctx);
        }

        this.fail(`nothing to pick for {${e}}. Check that the list exists and has items.`);
    }

    private findList(name: string): string | undefined {
        const id = name.trim().toLowerCase();
        return this.src.lists.has(id) ? id : undefined;
    }

    private listName(id: string): string {
        return this.src.listNames.get(id) ?? id;
    }

    private call(key: string): string {
        if (!key) this.fail("{@} needs a generator name, like {@Drinks}");
        if (!this.host.call) this.fail(`{@${key}} can't run here`);
        if (this.depth + 1 > MAX_DEPTH) this.fail(`generators call each other more than ${MAX_DEPTH} deep (one may be calling itself)`);
        return this.host.call(key, this.depth + 1);
    }

    /** Pick one row from a list and evaluate it. */
    private pick(id: string, ctx: Ctx, opt: { die?: number; mod?: number; exclude?: ListRow }): string {
        const rows = this.src.lists.get(id) ?? [];
        const info = this.src.listInfo.get(id) ?? { kind: "plain" };
        if (!rows.length) this.fail(`nothing to pick for {${this.listName(id)}}. Check that the list exists and has items.`);
        let row: ListRow | undefined;
        if (info.kind === "ranged") {
            row = this.roll(id, rows, info, opt);
        } else {
            if (opt.die !== undefined || opt.mod) this.fail(`"## ${this.listName(id)}" isn't a ranged list, so it can't be rolled with a modifier or another die. Add a die to its heading, like "## ${this.listName(id)} (d20)"`);
            if (info.kind === "learn") return this.learn(id, rows, info);
            const pool = rows.filter((r) => r !== opt.exclude);
            if (!pool.length) this.fail(`{again} in "## ${this.listName(id)}" has no other row to roll`);
            row = pickWeighted(pool.map((r) => ({ item: r, weight: r.weight })));
        }
        return this.evalRow(id, row, ctx.list === id ? ctx.again : 0);
    }

    /** Evaluate a picked row; a meaning list's row records its meaning first. */
    private evalRow(id: string, row: ListRow, again: number): string {
        if (row.meaning !== undefined) this.meaningLog.push(row.meaning);
        return this.pattern(row.item, { list: id, row, again }).trim();
    }

    /** {List.meaning}: the English side of a random row of a meaning list. */
    private meaningOf(id: string): string {
        if (this.src.listInfo.get(id)?.kind !== "meanings") this.fail(`{${this.listName(id)}.meaning} needs a meaning list, like "## ${this.listName(id)} (meanings)"`);
        const rows = this.src.lists.get(id) ?? [];
        if (!rows.length) this.fail(`nothing to pick for {${this.listName(id)}.meaning}. Check that the list has items.`);
        return pickWeighted(rows.map((r) => ({ item: r, weight: r.weight }))).meaning ?? "";
    }

    /** A new name from a "(learn)" list. */
    private learn(id: string, rows: ListRow[], info: ListInfo): string {
        const used = this.firstLetters;
        const name = learnName(modelFor(rows), { min: info.min, max: info.max }, used ? (n) => !used.has(n.charAt(0).toLowerCase()) : undefined);
        if (name === undefined) this.fail(`couldn't make a new name from "## ${this.listName(id)}"; add more samples or widen its length limits`);
        return name;
    }

    private pickUnion(ids: string[], ctx: Ctx): string {
        const pool: { item: [string, ListRow]; weight: number }[] = [];
        for (const id of ids) {
            const kind = this.src.listInfo.get(id)?.kind ?? "plain";
            if (kind !== "plain" && kind !== "meanings") this.fail(`{A|B} only mixes plain and meaning lists ("## ${this.listName(id)}" isn't one)`);
            for (const r of this.src.lists.get(id) ?? []) pool.push({ item: [id, r], weight: r.weight });
        }
        if (!pool.length) this.fail(`nothing to pick for {${ids.map((i) => this.listName(i)).join("|")}}. Check that the list exists and has items.`);
        const [id, row] = pickWeighted(pool);
        return this.evalRow(id, row, 0);
    }

    /** Roll a ranged list: its die (or another), plus a modifier, kept inside its first and last rows. */
    private roll(id: string, rows: ListRow[], info: ListInfo, opt: { die?: number; mod?: number; exclude?: ListRow }): ListRow {
        const die = opt.die ?? info.die ?? 20;
        const lows = rows.map((r) => r.lo ?? 1);
        const highs = rows.map((r) => r.hi ?? die);
        const min = Math.min(...lows);
        const max = Math.max(...highs);
        for (let tries = 0; tries < 50; tries++) {
            const n = Math.min(max, Math.max(min, randomInt(1, die) + (opt.mod ?? 0)));
            const row = rows.find((r) => (r.lo ?? 0) <= n && n <= (r.hi ?? -1));
            if (!row) this.fail(`"## ${this.listName(id)}" has no row for ${n}`);
            if (row !== opt.exclude) return row;
        }
        this.fail(`{again} in "## ${this.listName(id)}" couldn't roll a different row`);
    }

    private again(ctx: Ctx): string {
        if (!ctx.list) this.fail("{again} only works inside a list row");
        if (ctx.again + 1 > MAX_DEPTH) this.fail(`{again} rolled more than ${MAX_DEPTH} times in a row`);
        const id = ctx.list;
        return this.pick(id, { list: id, row: ctx.row, again: ctx.again + 1 }, { exclude: ctx.row });
    }

    /** {List: key}: the row for a key (or, on a ranged list, for a number). */
    private lookup(id: string, keyExpr: string, ctx: Ctx): string {
        const rows = this.src.lists.get(id) ?? [];
        let key: Value;
        const v = VAR_RE.exec(keyExpr);
        if (v) key = this.vars.get(v[1]) ?? 0;
        else if (isNumeric(keyExpr) && /\d/.test(keyExpr)) key = this.number(keyExpr);
        else key = keyExpr;

        const info = this.src.listInfo.get(id) ?? { kind: "plain" };
        const asNumber = typeof key === "number" ? key : Number(key);
        if (info.kind === "ranged" && Number.isFinite(asNumber) && String(key).trim() !== "") {
            const row = rows.find((r) => (r.lo ?? 0) <= asNumber && asNumber <= (r.hi ?? -1));
            if (!row) this.fail(`"## ${this.listName(id)}" has no row for ${asNumber}`);
            return this.pattern(row.item, { list: id, row, again: 0 }).trim();
        }

        const wanted = String(key).trim().toLowerCase();
        let best: ListRow | undefined;
        let bestLen = -1;
        for (const r of rows) {
            const k = (r.key ?? r.meaning ?? (info.kind === "ranged" ? r.item : "")).trim().toLowerCase();
            if (!k) continue;
            const hit = wanted === k || (wanted.startsWith(k) && !/[\p{L}\p{N}]/u.test(wanted.charAt(k.length)));
            if (hit && k.length > bestLen) { best = r; bestLen = k.length; }
        }
        if (!best) this.fail(`"## ${this.listName(id)}" has no row for "${String(key)}"`);
        if (best.meaning !== undefined) return this.evalRow(id, best, 0);
        const text = best.key !== undefined ? best.value ?? "" : best.item;
        return this.pattern(text, { list: id, row: best, again: 0 }).trim();
    }
}

/** Is this a sum of numbers, dice, ranges and $names? */
export function isNumeric(expr: string): boolean {
    let s = expr.trim();
    if (!s) return false;
    let first = true;
    while (s.length) {
        if (!first) {
            const op = /^[+-]\s*/.exec(s);
            if (!op) return false;
            s = s.slice(op[0].length);
        } else if (s.startsWith("-")) {
            s = s.slice(1).trimStart();
        }
        const t = TERM_RE.exec(s);
        if (!t) return false;
        s = s.slice(t[0].length).trimStart();
        first = false;
    }
    return true;
}

/** Collapse runs of spaces left inside a line by expressions that printed nothing; trim the ends. */
export function tidy(text: string): string {
    return text.replace(/(\S)[ \t]{2,}(?=\S)/g, "$1 ").replace(/[ \t]+$/gm, "").trim();
}

/* ---------------- static checks ---------------- */

/** Every {expression} in a pattern or row, for checking. Unbalanced braces are reported. */
export function checkText(text: string, where: string, src: EngineSource): string[] {
    let pieces: Piece[];
    try {
        pieces = scanPattern(text);
    } catch (e) {
        return [`${where}: ${e instanceof Error ? e.message : String(e)}`];
    }
    const problems: string[] = [];
    for (const p of pieces) if (p.isExpr) problems.push(...checkExpr(p.text.trim(), where, src));
    return problems;
}

function hasList(src: EngineSource, name: string): boolean {
    return src.lists.has(name.trim().toLowerCase());
}

function checkExpr(e: string, where: string, src: EngineSource): string[] {
    if (!e) return [`${where} has an empty {}`];
    if (e.toLowerCase() === "again" || VAR_RE.test(e) || isNumeric(e) || e.startsWith("@")) return [];
    const assign = ASSIGN_RE.exec(e);
    if (assign) return assign[2] === "=" && !isNumeric(assign[3]) ? checkExpr(assign[3].trim(), where, src) : [];
    const rep = /^(.+?)\s+x\s+(.+)$/is.exec(e);
    if (rep) {
        const left = rep[1].trim();
        const look = /^(.+?)\s*:\s*(.+)$/s.exec(left);
        if (isNumeric(left) || (look && hasList(src, look[1]))) return checkExpr(rep[2].trim(), where, src);
    }
    if (hasList(src, e)) return [];
    const side = /^(.+?)\.meaning$/i.exec(e);
    if (side && hasList(src, side[1])) {
        return src.listInfo.get(side[1].trim().toLowerCase())?.kind === "meanings" ? [] : [`${where} uses {${e}}, but "## ${side[1].trim()}" isn't a meaning list (add "(meanings)" to its heading)`];
    }
    const look = /^(.+?)\s*:\s*(.+)$/s.exec(e);
    if (look && hasList(src, look[1])) return [];
    const withDie = /^(.+?)\s+with\s+d\d+/is.exec(e);
    if (withDie && hasList(src, withDie[1])) return [];
    for (let i = e.length - 1; i > 0; i--) {
        if ((e[i] === "+" || e[i] === "-") && hasList(src, e.slice(0, i)) && isNumeric(e.slice(i + 1))) return [];
    }
    const parts = e.split("|").map((x) => x.trim()).filter(Boolean);
    return parts.filter((part) => !hasList(src, part)).map((part) => `${where} uses {${part}}, but there is no list "## ${part}"`);
}
