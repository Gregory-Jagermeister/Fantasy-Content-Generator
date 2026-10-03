import { test } from "node:test";
import assert from "node:assert/strict";
import { parseGeneratorNote, runCustom, CustomGenerator } from "generators/custom";
import { isNumeric, joinNatural, parseHeading, scanPattern, tidy } from "generators/engine";

/** A generator from a note body and properties; fails the test if the note has problems (unless allowed). */
function gen(body: string, fm: Record<string, unknown> = {}, allowProblems = false): CustomGenerator {
    const g = parseGeneratorNote("G/t.md", { "fcg-generator": "T", ...fm }, body);
    assert.ok(g, "not a generator");
    if (!allowProblems) assert.deepEqual(g.problems, []);
    return g;
}
const many = (g: CustomGenerator, n = 200, host = {}) => Array.from({ length: n }, () => runCustom(g, host));

test("headings: plain, ranged and learn", () => {
    assert.deepEqual(parseHeading("Drinks"), { name: "Drinks", info: { kind: "plain" } });
    assert.deepEqual(parseHeading("Size (d20)"), { name: "Size", info: { kind: "ranged", die: 20 } });
    assert.deepEqual(parseHeading("Elf names (learn 9-4)"), { name: "Elf names", info: { kind: "learn", min: 4, max: 9 } });
    assert.deepEqual(parseHeading("Notes (old)"), { name: "Notes (old)", info: { kind: "plain" } });
});

test("numbers: dice, ranges, sums and $names", () => {
    assert.ok(isNumeric("2d6") && isNumeric("1d8+4") && isNumeric("1-4") && isNumeric("1d20 + $x - 2") && isNumeric("d6"));
    assert.ok(!isNumeric("Drinks") && !isNumeric("2 x Drinks") && !isNumeric(""));
    const g = gen("## A\n- a", { pattern: "{2d6}|{1d8+4}|{1-4}|{d4}|{10}" });
    for (const r of many(g)) {
        const [a, b, c, d, e] = r.split("|").map(Number);
        assert.ok(a >= 2 && a <= 12 && b >= 5 && b <= 12 && c >= 1 && c <= 4 && d >= 1 && d <= 4 && e === 10, r);
    }
});

test("calls: {@Key} goes through the host, with depth; no host gives a message", () => {
    const g = gen("## A\n- a", { pattern: "Tavern: {@InnsTaverns}" });
    let depthSeen = -1;
    assert.equal(runCustom(g, { call: (k, d) => { depthSeen = d; return `<${k}>`; } }), "Tavern: <InnsTaverns>");
    assert.equal(depthSeen, 1);
    assert.throws(() => runCustom(g), /can't run here/);
    assert.throws(() => runCustom(g, { call: () => "x" }, 10), /more than 10 deep/);
});

test("repeat: bullet list when alone on a line, 'a, b and c' in a sentence, no duplicates while possible", () => {
    const body = "## Drinks\n- Ale\n- Mead\n- Wine\n- Cider";
    const alone = gen(body, { pattern: "Menu:\n{3 x Drinks}" });
    for (const r of many(alone, 50)) {
        const lines = r.split("\n");
        assert.equal(lines[0], "Menu:");
        assert.equal(lines.length, 4, r);
        assert.ok(lines.slice(1).every((l) => /^- (Ale|Mead|Wine|Cider)$/.test(l)), r);
        assert.equal(new Set(lines).size, 4, `duplicate in ${r}`);
    }
    const inline = gen(body, { pattern: "They serve {2-3 x Drinks}." });
    for (const r of many(inline, 50)) assert.match(r, /^They serve (\w+ and \w+|\w+, \w+ and \w+)\.$/, r);
    assert.equal(joinNatural(["a"]), "a");
    assert.equal(joinNatural(["a", "b", "c"]), "a, b and c");
});

test("repeat: limit and counts from $names and lookups", () => {
    const g = gen("## Size\n- Small: 2\n## Item\n- x\n- y\n- z", { pattern: "{$n = 3}{$n x Item}|{Size: Small x Item}" });
    for (const r of many(g, 30)) {
        const [a, b] = r.split("|");
        assert.equal(a.split(/, | and /).length, 3, a);
        assert.equal(b.split(/, | and /).length, 2, b);
    }
    assert.throws(() => runCustom(gen("## A\n- a", { pattern: "{101 x A}" })), /at most 100/);
});

test("patterns inside rows; multi-line patterns keep Markdown", () => {
    const g = gen("## Drinks\n- Ale ({1d4} cp)", { pattern: "## Menu\n- {Drinks}\n- **Total**: {2d6} gp" });
    for (const r of many(g, 30)) assert.match(r, /^## Menu\n- Ale \([1-4] cp\)\n- \*\*Total\*\*: \d+ gp$/);
});

test("ranged lists: roll the die, modifiers clamp to the first and last rows, other dice", () => {
    const body = "## Size (d20)\n- 1-2: Tiny\n- 3-18: Mid\n- 19-20: Huge";
    const plus = gen(body, { pattern: "{Size + 30}" });
    assert.ok(many(plus, 50).every((r) => r === "Huge"));
    const minus = gen(body, { pattern: "{$m -= 40}{Size + $m}" });
    assert.ok(many(minus, 50).every((r) => r === "Tiny"));
    const small = gen(body, { pattern: "{Size with d2}" });
    assert.ok(many(small, 50).every((r) => r === "Tiny"));
    const all = new Set(many(gen(body, { pattern: "{Size}" }), 400));
    assert.deepEqual([...all].sort(), ["Huge", "Mid", "Tiny"]);
});

test("ranged lists: gaps, overlaps and rows without numbers are reported", () => {
    const g = gen("## Size (d10)\n- 1-3: a\n- 3-5: b\n- 8-12: c\n- nothing here", {}, true);
    const p = g.problems.join("\n");
    assert.match(p, /outside 1-10/);
    assert.match(p, /no row for 6-7/);
    assert.match(p, /more than one row for 3/);
    assert.match(p, /needs a number or range first/);
});

test("modifiers only on ranged lists", () => {
    const g = gen("## A\n- a", { pattern: "{A + 2}" });
    assert.throws(() => runCustom(g), /isn't a ranged list/);
});

test("numbers in rows change later rolls ($ += / -=), and remembered results print", () => {
    const body = "## Wealth (d6)\n- 1-6: Poor {$q -= 1}\n## Quality (d6)\n- 1-3: Bad\n- 4-6: Good";
    const g = gen(body, { pattern: "{Wealth}/{$q}/{Quality + 10}" });
    for (const r of many(g, 30)) assert.equal(r, "Poor/-1/Good");
    const t = gen("## Size (d4)\n- 1-4: Small", { pattern: "{$size = Size}Size is {$size}; unset {$none}" });
    assert.equal(runCustom(t), "Size is Small; unset 0");
});

test("keyed lookups: by text, by $name, longest key wins, prefix before punctuation", () => {
    const body = "## Size (d4)\n- 1-2: Very Small. Up to 20.\n- 3-4: Small. Up to 40.\n## Shops\n- Small: S\n- Very Small: VS";
    const g = gen(body, { pattern: "{$s = Size}{Shops: $s}|{Shops: small}" });
    for (const r of many(g, 60)) assert.ok(["VS|S", "S|S"].includes(r), r);
    assert.throws(() => runCustom(gen(body, { pattern: "{Shops: Huge}" })), /no row for "Huge"/);
    const byNumber = gen(body, { pattern: "{Size: 3}" });
    assert.equal(runCustom(byNumber), "Small. Up to 40.");
    const plain = gen(body, { pattern: "{Shops}" });
    assert.ok(many(plain, 50).every((r) => r === "Small: S" || r === "Very Small: VS"));
});

test("again: rolls the same list without that row; limited", () => {
    const g = gen("## Loot (d4)\n- 1-3: gold\n- 4: {again} and {again}", { pattern: "{Loot}" });
    for (const r of many(g, 100)) assert.match(r, /^gold( and gold)?$/, r);
    const loop = gen("## L\n- {again}", { pattern: "{L}" });
    assert.throws(() => runCustom(loop), /no other row/);
    const outside = gen("## L\n- a", { pattern: "{again}" });
    assert.throws(() => runCustom(outside), /only works inside a list row/);
});

test("escapes, unbalanced braces and empty expressions", () => {
    assert.equal(runCustom(gen("## A\n- a", { pattern: "\\{not this\\} {A}" })), "{not this} a");
    const bad = gen("## A\n- a", { pattern: "{A" }, true);
    assert.match(bad.problems.join(), /without a matching/);
    assert.throws(() => scanPattern("a}"), /without a "{"/);
    const empty = gen("## A\n- a", { pattern: "{} {A}" }, true);
    assert.match(empty.problems.join(), /empty \{\}/);
});

test("checks: unknown lists in patterns and rows; union parts", () => {
    const g = gen("## A\n- {B} and {Nope}\n## B\n- b", { pattern: "{A|C} {D + 2} {3 x E}" }, true);
    const p = g.problems.join("\n");
    assert.match(p, /\{C\}, but there is no list "## C"/);
    assert.match(p, /\{D \+ 2\}/);
    assert.match(p, /\{E\}/);
    assert.match(p, /a row in "## A" uses \{Nope\}/);
    assert.doesNotMatch(p, /\{B\}/);
});

test("capitalise and tidy spaces", () => {
    const g = gen("## C\n- k\n## V\n- a", { pattern: "{C}{V}{C}", "fcg-capitalize": true });
    assert.equal(runCustom(g), "Kak");
    assert.equal(tidy("a  b {x}   \n  c"), "a b {x}\n  c");
    const t = gen("## A\n- a", { pattern: "x {$n = 1} y" });
    assert.equal(runCustom(t), "x y");
});

test("1.3 notes behave as before", () => {
    const g = gen("## First\n- Kael\n- Irith | 3\n## Family\n- Ash | Grey", { pattern: "{First} {Family}" });
    for (const r of many(g, 30)) assert.match(r, /^(Kael|Irith) Ash \| Grey$/);
});

test("runaway text is stopped", () => {
    const g = gen("## A\n- {100 x B}\n## B\n- {100 x C}\n## C\n- c", { pattern: "{100 x A}" });
    assert.throws(() => runCustom(g), /too much text/);
});
