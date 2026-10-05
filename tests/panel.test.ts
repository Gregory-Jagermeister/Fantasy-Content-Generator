/* 1.6.0 step 3: the generator side panel's logic. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { ADD_STARTER_LABEL, buildEntries, insertionText, isMultiLine, joinResults, pushRecent, searchEntries, togglePin } from "editor/panelModel";

const sources = (customs: { key: string; name: string; twinKey?: string; withMeanings?: boolean }[]) => ({
    builtIns: [{ key: "InnsTaverns", label: "Inns and taverns", group: "Settlements and buildings" }, { key: "Drinks", label: "Drinks", group: "Objects and vehicles" }],
    customs,
    isStarter: (k: string) => ["Dwarvish", "DwarvishMeaning", "Kohrog", "KohrogMeaning", "HalfOrc"].includes(k),
    racesOf: (k: string) => ({ Dwarvish: "Dwarf", Kohrog: "Orc, Goblin, Hobgoblin", HalfOrc: "Half-orc" } as Record<string, string>)[k] ?? "",
});

test("entries: built-ins, then starter sets, then custom; twins folded into their set", () => {
    const e = buildEntries(sources([
        { key: "Dwarvish", name: "Dwarvish names", twinKey: "DwarvishMeaning" },
        { key: "DwarvishMeaning", name: "Dwarvish names + meaning", withMeanings: true },
        { key: "MyInns", name: "My inns" },
        { key: "Kohrog", name: "Kohrog names", twinKey: "KohrogMeaning" },
    ]));
    assert.deepEqual(e.map((x) => x.label), ["Inns and taverns", "Drinks", "Dwarvish names", "Kohrog names", "My inns"]);
    assert.equal(e.find((x) => x.key === "Dwarvish")?.meaningKey, "DwarvishMeaning");
    assert.deepEqual(e.map((x) => x.group), ["Settlements and buildings", "Objects and vehicles", "Starter set", "Starter set", "Custom"]);
});

test("entries: no starter sets gives a Names group with 'Add a starter set…'", () => {
    const e = buildEntries(sources([{ key: "MyInns", name: "My inns" }]));
    const add = e.find((x) => x.kind === "addStarter");
    assert.equal(add?.label, ADD_STARTER_LABEL);
    assert.equal(add?.group, "Names");
    assert.ok(!buildEntries(sources([{ key: "Dwarvish", name: "Dwarvish names" }])).some((x) => x.kind === "addStarter"));
});

test("search: label start, word start, contains, then races", () => {
    const e = buildEntries(sources([
        { key: "Dwarvish", name: "Dwarvish names" }, { key: "Kohrog", name: "Kohrog names" }, { key: "HalfOrc", name: "Half-Orc names" },
    ]));
    assert.deepEqual(searchEntries(e, "orc").map((x) => x.key), ["HalfOrc", "Kohrog"], "word start beats races");
    assert.deepEqual(searchEntries(e, "dw").map((x) => x.key), ["Dwarvish"]);
    assert.deepEqual(searchEntries(e, "names").map((x) => x.key), ["Dwarvish", "HalfOrc", "Kohrog"], "sorted by label");
    assert.deepEqual(searchEntries(e, "taver").map((x) => x.key), ["InnsTaverns"]);
    assert.equal(searchEntries(e, "").length, e.length);
});

test("insert and copy text: lines one per line, blocks set apart; cursor line respected", () => {
    assert.ok(isMultiLine("a\nb") && !isMultiLine("a\n"));
    assert.equal(joinResults(["Ada", "Bo"]), "Ada\nBo");
    assert.equal(joinResults(["Ada", "Inn\nDescription: x", "Bo"]), "Ada\n\nInn\nDescription: x\n\nBo");
    // Names go right at the cursor, inside the sentence (Daniel, 2026-10-06)
    assert.equal(insertionText("Ada", ""), "Ada");
    assert.equal(insertionText("Ada", "The dwarf by the name of "), "Ada");
    assert.equal(insertionText("Ada", "The dwarf by the name of"), " Ada");
    assert.equal(insertionText("Ada", "Name: \"", "", "\""), "Ada");
    assert.equal(insertionText("Ada", "Ask ", "", "about it"), "Ada ");
    assert.equal(insertionText("Ada", "Ask ", "", ", then"), "Ada");
    // Blocks and Insert all go on their own lines
    assert.equal(insertionText("Inn\nDesc", "text"), "\n\nInn\nDesc\n\n");
    assert.equal(insertionText("Inn\nDesc", ""), "Inn\nDesc\n\n");
    assert.equal(insertionText("Inn\nDesc", "", "Rard"), "\nInn\nDesc\n\n", "blank line after a line of text above");
    assert.equal(insertionText(joinResults(["Ada", "Bo"]), ""), "Ada\nBo\n\n", "Insert all of names: a list");
});

test("recent: newest first, no repeats, at most 4; pins toggle and keep order", () => {
    let r: string[] = [];
    for (const k of ["a", "b", "c", "a", "d", "e"]) r = pushRecent(r, k);
    assert.deepEqual(r, ["e", "d", "a", "c"]);
    assert.deepEqual(togglePin(["a"], "b"), ["a", "b"]);
    assert.deepEqual(togglePin(["a", "b"], "a"), ["b"]);
});
