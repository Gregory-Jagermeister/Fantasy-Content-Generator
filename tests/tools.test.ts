/* 1.6.0 step 1: if/else, loops, maths, a/an, nested braces. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseGeneratorNote, patternBlocks, runCustom, CustomGenerator } from "generators/custom";
import { article, isNumeric } from "generators/engine";

function gen(body: string, fm: Record<string, unknown> = {}, allowProblems = false): CustomGenerator {
    const g = parseGeneratorNote("G/t.md", { "fcg-generator": "T", ...fm }, body);
    assert.ok(g, "not a generator");
    if (!allowProblems) assert.deepEqual(g.problems, []);
    return g;
}
const run = (pattern: string, body = "## A\n- a") => runCustom(gen(body, { pattern }));
const many = (g: CustomGenerator, n = 100) => Array.from({ length: n }, () => runCustom(g));

test("Daniel's inn sign: nested if with else", () => {
    const sign = (w: number) => run(`{$wealth = ${w}}The sign is {if $wealth > 60: Freshly painted | {if $wealth <= 20: entirely missing | peeling}}.`);
    assert.equal(sign(80), "The sign is Freshly painted.");
    assert.equal(sign(61), "The sign is Freshly painted.");
    assert.equal(sign(60), "The sign is peeling.");
    assert.equal(sign(21), "The sign is peeling.");
    assert.equal(sign(20), "The sign is entirely missing.");
    assert.equal(sign(0), "The sign is entirely missing.");
});

test("if: else optional, comparisons, text ignoring case, and/or/not, unset values", () => {
    assert.equal(run("{$x = 3}[{if $x > 5: big}]"), "[]");
    assert.equal(run("{$x = 3}{if $x >= 3: a | b}{if $x <= 2: a | b}{if $x != 3: a | b}{if $x = 3: a | b}{if $x == 3: a | b}{if $x < 4: a | b}"), "abbaaa");
    assert.equal(run(`{$race = "Dwarf"}{if $race = dwarf: yes | no}{if $race != Elf: yes | no}`), "yesyes");
    assert.equal(run('{$n = "Old Bell"}{if $n = "old bell": yes | no}'), "yes");
    assert.equal(run("{$a = 1}{$b = 0}{if $a and $b: x | y}{if $a or $b: x | y}{if not $b: x | y}{if $a and not $b: x | y}"), "yxxx");
    assert.equal(run("{if $a = 1 or $b = 2 and $c = 3: x | y}"), "y");
    assert.equal(run("{$b = 2}{$c = 3}{if $a = 1 or $b = 2 and $c = 3: x | y}"), "x");
    assert.equal(run("{if $unset = 0: zero | not}{if $unset = \"\": empty | not}{if $unset: set | unset}"), "zeroemptyunset");
    assert.equal(run("{$x = 10}{if $x * 2 > 15: x | y}"), "x");
});

test("if: branches are trimmed and can hold patterns; only the branch that runs is evaluated", () => {
    assert.equal(run("{$x = 1}<{if $x:   {A} and {A}   |  b  }>"), "<a and a>");
    let called = 0;
    const g = gen("## A\n- a", { pattern: "{if 1 = 2: {@Never} | ok}" });
    assert.equal(runCustom(g, { call: () => { called++; return "x"; } }), "ok");
    assert.equal(called, 0);
    assert.equal(run("{if 1 = 1: a \\| b | c}"), "a | b");
    assert.equal(run("{if 1 = 1: {A|A} | c}", "## A\n- a"), "a");
});

test("if: a row with an if keeps its weight", () => {
    const g = gen("## R\n- {if $x > 1: big | small} | 3\n- other", { pattern: "{R}" });
    assert.equal(g.lists.get("r")?.[0].weight, 3);
    assert.equal(g.lists.get("r")?.[0].item, "{if $x > 1: big | small}");
});

test("blocks: #if / else if / else, whole lines removed", () => {
    const pattern = "Start\n{#if $w > 60}\nRich\n{else if $w > 20}\nMiddling\n  {else}\nPoor\n{/if}\nEnd";
    assert.equal(run(`{$w = 90}${pattern}`), "Start\nRich\nEnd");
    assert.equal(run(`{$w = 30}${pattern}`), "Start\nMiddling\nEnd");
    assert.equal(run(`{$w = 1}${pattern}`), "Start\nPoor\nEnd");
    assert.equal(run("{$w = 1}A{#if $w} yes{/if}B"), "A yesB");
    assert.equal(run("{#if 1 = 1}\n{#if 2 = 3}\nno\n{else}\nnested\n{/if}\n{/if}"), "nested");
});

test("blocks: #each with $item, $i, $first, $last and else for an empty list", () => {
    const body = "## Drinks\n- Ale\n- Mead\n- Wine\n## Empty\n";
    const g = gen(body, { pattern: "{#each Drinks}\n{$i}. {$item}{if $first: (first)}{if $last: (last)}\n{/each}" }, true);
    assert.equal(runCustom(g), "1. Ale(first)\n2. Mead\n3. Wine(last)");
    const e = gen(body, { pattern: "{#each Empty}\nx\n{else}\nNothing on tap\n{/each}" }, true);
    assert.equal(runCustom(e), "Nothing on tap");
});

test("blocks: #repeat with $i; loop values belong to their loop; nesting", () => {
    assert.equal(run("{#repeat 3}{$i}{/repeat}"), "123");
    assert.equal(run("{$i = 9}{#repeat 2}{#repeat 2}{$i}{/repeat}|{/repeat}{$i}"), "12|12|9");
    assert.equal(run("{$total = 0}{#repeat 4}{$total += $i}{/repeat}{$total}"), "10");
});

test("short loops: a sentence gets 'a, b and c', alone on a line gets one line per round", () => {
    const body = "## Drinks\n- Ale\n- Mead\n- Wine";
    assert.equal(runCustom(gen(body, { pattern: "On tap: {each Drinks: {$item}}." })), "On tap: Ale, Mead and Wine.");
    assert.equal(runCustom(gen(body, { pattern: "On tap: {each Drinks}." })), "On tap: Ale, Mead and Wine.");
    assert.equal(runCustom(gen(body, { pattern: "Menu:\n  {each Drinks: - {$item} ({$i})}" })), "Menu:\n  - Ale (1)\n  - Mead (2)\n  - Wine (3)");
    assert.equal(run("Got {repeat 3: x{$i}}."), "Got x1, x2 and x3.");
    assert.equal(run("Got:\n{repeat 3: x{$i}}"), "Got:\nx1\nx2\nx3");
    assert.equal(run("{repeat 0: x}|"), "|");
    assert.equal(runCustom(gen(body, { pattern: "Not Mead: {each Drinks: {if $item != Mead: {$item}}}" })), "Not Mead: Ale and Wine");
    for (const r of many(gen(body, { pattern: "Got {repeat 1d4: {Drinks}}" }), 50)) assert.match(r, /^Got (\w+)((, \w+)* and \w+)?$/, r);
});

test("loops: at most 100 rounds; runaway nesting is stopped", () => {
    assert.throws(() => run("{repeat 101: x}"), /at most 100 rounds/);
    assert.throws(() => run("{#repeat 100}{#repeat 100}{#repeat 100}x{/repeat}{/repeat}{/repeat}"), /too much text/);
});

test("maths: * / and brackets, rounding down, divide by 0", () => {
    assert.equal(run("{$w = 7}{$w * 3 / 2}|{(1 + 2) * 3}|{1 + 2 * 3}|{7 / 2}|{-7 / 2}|{10 - 4}"), "10|9|7|3|-4|6");
    assert.equal(run("{$income = $w * 3 / 2}{$w = 4}{$income}"), "0");
    assert.throws(() => run("{5 / 0}"), /divides by 0/);
    assert.throws(() => run("{$z = 0}{5 / $z}"), /divides by 0/);
    for (const r of many(gen("## A\n- a", { pattern: "{(1d6 + 1) * 2}" }), 50)) assert.ok(Number(r) % 2 === 0 && Number(r) >= 4 && Number(r) <= 14, r);
    assert.ok(isNumeric("($x + 1) * 2d6 / 3") && !isNumeric("(1 + 2") && !isNumeric("2 x Item"));
});

test("a / an: by first letter, exceptions, capital A, list names win", () => {
    assert.equal(article("elf"), "an");
    assert.equal(article("dwarf"), "a");
    assert.equal(article("hour"), "an");
    assert.equal(article("honest man"), "an");
    assert.equal(article("unicorn"), "a");
    assert.equal(article("one-eyed giant"), "a");
    assert.equal(article("umbrella"), "an");
    assert.equal(article("8"), "an");
    assert.equal(article("18"), "an");
    assert.equal(article("11000"), "an");
    assert.equal(article("110"), "a");
    assert.equal(article("**orc**"), "an");
    const body = "## Race\n- elf\n## Monster\n- unicorn\n## A Thing\n- whole list";
    assert.equal(runCustom(gen(body, { pattern: "{a Race}|{A Race}|{an Monster}|{A Thing}" })), "an elf|An elf|a unicorn|whole list");
    assert.equal(runCustom(gen(body, { pattern: "{$r = Race}{a $r}|{A {Race}}" })), "an elf|An elf");
    const plusA = gen("## A (d4)\n- 1-2: low\n- 3-4: high", { pattern: "{A + 2}" });
    for (const r of many(plusA, 20)) assert.equal(r, "high");
});

test("nested braces: lookups, assignments and counts can hold patterns", () => {
    const body = "## Size\n- Small: S\n- Big: B\n## Pick\n- Big";
    assert.equal(runCustom(gen(body, { pattern: "{Size: {Pick}}" })), "B");
    assert.equal(run("{$x = {if 1 = 1: yes | no}}{$x}"), "yes");
    assert.equal(run("{$x = 2}<{repeat {$x}: y}>"), "<y and y>");
    assert.equal(run("{$s = a {A}}{$s}"), "an a");
});

test("checks: new forms are checked; unmatched tags and missing colons are problems", () => {
    const body = "## A\n- a";
    const p = (pattern: string) => gen(body, { pattern }, true).problems.join("\n");
    assert.equal(p("{if $x > 1: {A} | {A}}{repeat 2: {A}}{each A: {$item}}{#each A}{$item}{/each}{a A}"), "");
    assert.match(p("{if $x > 1: {Nope} | b}"), /no list "## Nope"/);
    assert.match(p("{if $x > 1 yes}"), /needs a ":"/);
    assert.match(p("{each Nope: x}"), /no list "## Nope"/);
    assert.match(p("{#each Nope}x{/each}"), /no list "## Nope"/);
    assert.match(p("{repeat lots: x}"), /isn't a count/);
    assert.match(p("{#if $x}x"), /\{#if\} has no \{\/if\}/);
    assert.match(p("x{/each}"), /no \{#each\} before it/);
    assert.match(p("{#if $x}x{/each}"), /closes a \{#if\}/);
    assert.match(p("{#repeat 2}x{else}y{/repeat}"), /only goes inside/);
    assert.match(p("{if $x > : a}"), /missing a side/);
    assert.match(p("{a Nope}"), /no list "## Nope"/);
    const named = gen("## If Wet\n- a\n## A\n- a", { pattern: "{A}" }, true);
    assert.match(named.problems.join(), /"## If Wet" starts with "If"/);
});

test("old notes: plain patterns, unions, repeats and escapes behave as before", () => {
    const body = "## First\n- Kael\n- Irith | 3\n## Family\n- Ash | Grey\n## Drinks\n- Ale\n- Mead";
    for (const r of many(gen(body, { pattern: "{First} {Family}" }), 30)) assert.match(r, /^(Kael|Irith) Ash \| Grey$/);
    for (const r of many(gen(body, { pattern: "{First|Drinks}" }), 30)) assert.match(r, /^(Kael|Irith|Ale|Mead)$/);
    assert.equal(runCustom(gen(body, { pattern: "\\{x\\} {2 x Drinks}" })).replace("Mead and Ale", "Ale and Mead"), "{x} Ale and Mead");
});

test("pattern blocks: written in the note, several pick at random, other code blocks skipped, property ignored", () => {
    const body = "Intro text\n\n```pattern\n{$w = 70}\nSign: {if $w > 60: rich | poor}\n- {A}\n```\n\n## A\n- a";
    const g = gen(body);
    assert.equal(runCustom(g), "Sign: rich\n- a");
    assert.equal(g.lists.get("a")?.length, 1, "the - line in the pattern isn't a list row");
    const two = gen("```pattern\none\n```\n~~~ pattern\ntwo\n~~~\n## A\n- a");
    assert.deepEqual(two.patterns, ["one", "two"]);
    assert.ok(new Set(many(two, 60)).size === 2);
    assert.deepEqual(patternBlocks("````\n```pattern\nshown only\n```\n````\n```js\nx\n```"), []);
    const both = gen("```pattern\n{A}\n```\n## A\n- a", { pattern: "old" }, true);
    assert.deepEqual(both.patterns, ["{A}"]);
    assert.match(both.problems.join(), /pattern in its properties is ignored/);
    const bad = gen("```pattern\n{Nope}\n```\n## A\n- a", {}, true);
    assert.match(bad.problems.join(), /no list "## Nope"/);
});
