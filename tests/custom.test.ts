import { test } from "node:test";
import assert from "node:assert/strict";
import { EXAMPLE_NOTE, keyFromName, parseEntry, parseGeneratorNote, parseLists, rankKeys, resolveCustom, runCustom, starterNote, stripFrontmatter } from "generators/custom";
import { pickWeighted } from "utils/random";

const NOTE = `---
fcg-generator: Ashborn names
pattern: "{First} {Family}"
---
Some text that is ignored.

## First
- Kael
- Irith | 3
* Sorv
- [ ] Task-style item

## Family
- Emberfall
- Cinderwake |
- Ash | Grey

# Notes
- not a list item for any list
`;
const FM = { "fcg-generator": "Ashborn names", pattern: "{First} {Family}" };

test("key from the name, or fcg-key", () => {
    assert.equal(keyFromName("Ashborn names"), "AshbornNames");
    assert.equal(keyFromName("half-elf (homebrew) v2"), "HalfElfHomebrewV2");
    assert.equal(keyFromName("Élan names"), "ÉlanNames");
    assert.equal(parseGeneratorNote("G/a.md", { ...FM, "fcg-key": "Ash" }, NOTE)?.key, "Ash");
    const spaced = parseGeneratorNote("G/a.md", { ...FM, "fcg-key": "Ash born" }, NOTE);
    assert.equal(spaced?.key, "Ashborn");
    assert.match(spaced?.problems.join() ?? "", /spaces/);
});

test("entries: weights, bars and blanks", () => {
    assert.deepEqual(parseEntry("Irith | 3"), { item: "Irith", weight: 3 });
    assert.deepEqual(parseEntry("Cinderwake |"), { item: "Cinderwake", weight: 1 });
    assert.deepEqual(parseEntry("Ash | Grey"), { item: "Ash | Grey", weight: 1 });
    assert.deepEqual(parseEntry("Bad | 0"), { item: "Bad | 0", weight: 1 });
    assert.equal(parseEntry("   "), null);
});

test("lists: ## headings and bullets; # headings end a list; code blocks ignored", () => {
    const { lists, names } = parseLists(stripFrontmatter(NOTE) + "\n## Code\n```\n- not this\n```\n- this\n");
    assert.deepEqual(lists.get("first")?.map((e) => e.item), ["Kael", "Irith", "Sorv", "Task-style item"]);
    assert.equal(lists.get("first")?.[1].weight, 3);
    assert.deepEqual(lists.get("family")?.map((e) => e.item), ["Emberfall", "Cinderwake", "Ash | Grey"]);
    assert.deepEqual(lists.get("code")?.map((e) => e.item), ["this"]);
    assert.equal(names.get("first"), "First");
});

test("not a generator without fcg-generator; name falls back to the note name", () => {
    assert.equal(parseGeneratorNote("G/a.md", {}, NOTE), null);
    assert.equal(parseGeneratorNote("G/a.md", undefined, NOTE), null);
    const g = parseGeneratorNote("G/Sky folk.md", { "fcg-generator": "" }, NOTE);
    assert.equal(g?.name, "Sky folk");
    assert.equal(g?.key, "SkyFolk");
});

test("patterns: one, several, none, either-list, plain text", () => {
    const one = parseGeneratorNote("G/a.md", FM, NOTE);
    assert.ok(one && !one.problems.length, one?.problems.join());
    for (let i = 0; i < 30; i++) assert.match(runCustom(one), /^.+ (Emberfall|Cinderwake|Ash \| Grey)$/);
    const none = parseGeneratorNote("G/a.md", { "fcg-generator": "X" }, NOTE);
    assert.deepEqual(none?.patterns, ["{First}"]);
    const either = parseGeneratorNote("G/a.md", { "fcg-generator": "X", pattern: "Captain {First|Family}!" }, NOTE);
    const seen = new Set<string>();
    for (let i = 0; i < 300; i++) seen.add(runCustom(either!).replace(/^Captain |!$/g, ""));
    assert.ok(seen.has("Kael") && seen.has("Emberfall"), [...seen].join());
    const several = parseGeneratorNote("G/a.md", { "fcg-generator": "X", patterns: ["{First}", "{Family}"] }, NOTE);
    const kinds = new Set<string>();
    for (let i = 0; i < 200; i++) kinds.add(["Emberfall", "Cinderwake", "Ash | Grey"].includes(runCustom(several!)) ? "family" : "first");
    assert.equal(kinds.size, 2);
});

test("problems: missing list, empty list, no lists", () => {
    const missing = parseGeneratorNote("G/a.md", { "fcg-generator": "X", pattern: "{First} {Title}" }, NOTE);
    assert.match(missing?.problems.join() ?? "", /\{Title\}, but there is no list "## Title"/);
    assert.throws(() => runCustom(missing!), /nothing to pick/);
    const empty = parseGeneratorNote("G/a.md", { "fcg-generator": "X" }, "## First\n## Second\n- a");
    assert.match(empty?.problems.join() ?? "", /"First" is empty/);
    const nothing = parseGeneratorNote("G/a.md", { "fcg-generator": "X" }, "just text");
    assert.match(nothing?.problems.join() ?? "", /no lists/);
    assert.throws(() => runCustom(nothing!), /no lists/);
});

test("weights: an item with weight 3 comes up about three times as often", () => {
    const counts = { a: 0, b: 0 };
    for (let i = 0; i < 4000; i++) counts[pickWeighted([{ item: "a" as const, weight: 3 }, { item: "b" as const, weight: 1 }])]++;
    const share = counts.a / 4000;
    assert.ok(share > 0.7 && share < 0.8, String(share));
});

test("clashes: built-in keys and earlier notes win; case is ignored", () => {
    const a = parseGeneratorNote("G/a.md", { "fcg-generator": "Orc" }, NOTE)!;
    const b = parseGeneratorNote("G/b.md", { "fcg-generator": "Ashborn" }, NOTE)!;
    const c = parseGeneratorNote("G/c.md", { "fcg-generator": "x", "fcg-key": "ASHBORN" }, NOTE)!;
    const active = resolveCustom([c, b, a], ["Orc", "ElfMale"]);
    assert.deepEqual([...active.keys()], ["Ashborn"]);
    assert.match(a.problems.join(), /built-in/);
    assert.match(c.problems.join(), /G\/b\.md/);
});

test("inline ranking: starts-with first, then anywhere", () => {
    const keys = ["Orc", "OrcLastname", "ElfMaleLastname", "HumanFemaleLastname", "Ogre"];
    assert.deepEqual(rankKeys(keys, "or"), ["Orc", "OrcLastname"]);
    assert.deepEqual(rankKeys(keys, "lastname"), ["OrcLastname", "ElfMaleLastname", "HumanFemaleLastname"]);
    assert.deepEqual(rankKeys(keys, "o"), ["Orc", "OrcLastname", "Ogre"]);
    assert.deepEqual(rankKeys(keys, "male"), ["ElfMaleLastname", "HumanFemaleLastname"]);
    assert.deepEqual(rankKeys(keys, ""), keys);
});

test("starter and example notes are valid generators", () => {
    const starter = parseGeneratorNote("G/New generator.md", { "fcg-generator": "New generator" }, starterNote("New generator"));
    assert.ok(starter && !starter.problems.length, starter?.problems.join());
    assert.match(starterNote("New generator"), /Example generator" note in this folder.*wiki/s, "M6: points to the example note and the wiki");
    const ex = parseGeneratorNote("G/Example generator.md", { "fcg-generator": "Example generator", "fcg-key": "Example" }, EXAMPLE_NOTE);
    assert.ok(ex && !ex.problems.length, ex?.problems.join());
    assert.equal(ex.lists.size, 5, "the explanation bullets under # are not a list");
    for (let i = 0; i < 50; i++) assert.match(runCustom(ex), /^First [ABC] Family [AB], Role [AB]\nCarries [1-6] coins and Item [ABC] and Item [ABC]\.\nMood: Mood [ABC]$/);
    assert.equal(ex.key, "Example");
});
