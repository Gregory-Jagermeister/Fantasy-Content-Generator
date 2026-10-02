import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SETTINGS } from "settings/DefaultSetting";
import { checkImport, clonePlain, mergeSettings, parseJsonText, parseListInput, parseWeightedInput } from "settings/settingsData";

test("merge: a new setting inside a group reaches existing users; saved values are kept", () => {
    const defaults = { a: 1, group: { old: ["x"], added: ["new"] } };
    const saved = { a: 5, group: { old: ["mine"] } };
    const merged = mergeSettings(defaults, saved);
    assert.deepEqual(merged, { a: 5, group: { old: ["mine"], added: ["new"] } });
    assert.deepEqual(defaults, { a: 1, group: { old: ["x"], added: ["new"] } }, "defaults untouched");
});

test("merge: nothing saved gives a copy of the defaults, not the defaults themselves", () => {
    const merged = mergeSettings(DEFAULT_SETTINGS, null);
    assert.deepEqual(merged, DEFAULT_SETTINGS);
    merged.innSettings.nouns.push("Changed");
    assert.ok(!DEFAULT_SETTINGS.innSettings.nouns.includes("Changed"));
});

test("reset: a fresh copy, so later edits never change the defaults", () => {
    const copy = clonePlain(DEFAULT_SETTINGS);
    copy.citySettings.prefixArray.length = 0;
    copy.inlineCallout = "!";
    assert.ok(DEFAULT_SETTINGS.citySettings.prefixArray.length > 0);
    assert.equal(DEFAULT_SETTINGS.inlineCallout, "@");
});

test("list input: lines or commas, blanks dropped", () => {
    assert.deepEqual(parseListInput("a, b ,, c"), ["a", "b", "c"]);
    assert.deepEqual(parseListInput("one, with comma\ntwo\n\n"), ["one, with comma", "two"]);
    assert.deepEqual(parseWeightedInput("Sword | 3\nShield\nBad | x"), [
        { item: "Sword", weight: 3 }, { item: "Shield", weight: 1 }, { item: "Bad", weight: 1 },
    ]);
});

test("import: bad JSON and wrong shapes give a message", () => {
    assert.throws(() => parseJsonText("{nope"), /isn't valid JSON/);
    assert.equal(checkImport(DEFAULT_SETTINGS.innSettings, clonePlain(DEFAULT_SETTINGS.innSettings)), null);
    assert.match(checkImport(DEFAULT_SETTINGS.innSettings, { prefixes: [] }) ?? "", /missing/);
    assert.match(checkImport(DEFAULT_SETTINGS.innSettings, [1]) ?? "", /object/);
    assert.equal(checkImport(DEFAULT_SETTINGS.currencyTypes, [{ name: "gp", rarity: "common" }]), null);
    assert.match(checkImport(DEFAULT_SETTINGS.currencyTypes, {}) ?? "", /list/);
});
