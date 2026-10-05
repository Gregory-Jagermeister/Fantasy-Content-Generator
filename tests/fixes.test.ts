import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SETTINGS } from "settings/DefaultSetting";
import { clonePlain, mergeSettings } from "settings/settingsData";
import { generateInn, pickDistinct } from "generators/inn";
import { generatorDrinks } from "generators/drink";
import { generateDungeonName } from "generators/dungeon";
import { generatePlotHook, possessive, tidyHook } from "generators/plothook";
import { builtInGroups, groupOfKey, inlineGenerators } from "generators/registry";
import { buildModel, graphemes, learnName } from "generators/engine";

const settings = clonePlain(DEFAULT_SETTINGS);

test("inns: three different rumours, never undefined; fewer rumours don't freeze", () => {
    for (let i = 0; i < 300; i++) {
        const inn = generateInn(settings.innSettings);
        assert.equal(inn.rumors.length, 3);
        assert.equal(new Set(inn.rumors).size, 3);
        assert.ok(inn.rumors.every((r) => typeof r === "string"));
    }
    const short = { ...settings.innSettings, rumors: ["only one"] };
    assert.deepEqual(generateInn(short).rumors, ["only one"]);
    assert.deepEqual(pickDistinct([], 3), []);
    assert.ok(!/undefined/.test(inlineGenerators().InnsTaverns(settings)));
});

test("drinks: single spaces, no repeated adjective", () => {
    for (let i = 0; i < 300; i++) {
        const d = generatorDrinks(settings.drinkSettings);
        assert.doesNotMatch(d, / {2}|^ | $/, d);
        assert.doesNotMatch(d, /\b(\w+) \1\b/, d);
    }
});

test("dungeons: single spaces and no 'for its' before a descriptor", () => {
    for (let i = 0; i < 300; i++) {
        const d = generateDungeonName(settings.dungeonSettings);
        assert.doesNotMatch(d, / {2}/, d);
        assert.doesNotMatch(d, /for its /, d);
    }
});

test("plot hooks: title on its own line, no trailing comma, possessives, no double spaces", () => {
    assert.equal(possessive("efreeti rulers"), "efreeti rulers'");
    assert.equal(possessive("orcish horde"), "orcish horde's");
    assert.equal(tidyHook("The efreeti rulers's Lair", "Stop the efreeti rulers's plans in the Forest.", "efreeti rulers", "forest"),
        "The Efreeti Rulers' Lair\nStop the efreeti rulers' plans in the forest.");
    assert.equal(tidyHook("The Forest Race", "You were challenged by orcish horde in the  Forest.", "orcish horde", "forest"),
        "The Forest Race\nYou were challenged by the orcish horde in the forest.");
    for (let i = 0; i < 500; i++) {
        const h = generatePlotHook();
        const [title, desc] = h.split("\n");
        assert.ok(title && desc, h);
        assert.doesNotMatch(title, /,$/, h);
        assert.doesNotMatch(h, /s's\b| {2}/, h);
    }
});

test("groups: every built-in key has a group; three groups (Names went in 1.5.0)", () => {
    assert.deepEqual(builtInGroups(), ["Settlements and buildings", "Objects and vehicles", "Story tools"]);
    const groups = groupOfKey();
    for (const k of Object.keys(inlineGenerators())) assert.ok(groups.has(k), k);
    assert.equal(groups.get("ElfMale"), undefined);
    assert.equal(groups.get("Drinks"), "Objects and vehicles");
});

test("settings: hiddenGroups defaults to none and reaches old saved data", () => {
    assert.deepEqual(DEFAULT_SETTINGS.hiddenGroups, []);
    const merged = mergeSettings(DEFAULT_SETTINGS, { inlineCallout: "@" });
    assert.deepEqual(merged.hiddenGroups, []);
});

test("naming kit: accents and modifier letters stay on their letter", () => {
    assert.deepEqual(graphemes("kïhïp"), ["k", "ï", "h", "ï", "p"]);
    assert.deepEqual(graphemes("l̥ukʷ"), ["l̥", "u", "kʷ"]);
    const samples = ["Khïhïp", "Yuïch", "L̥uïch", "Bowh", "Maü", "Saün", "Ëdlüwad", "Vagfaat", "Rekʷa", "Pïval̥", "Hïl̥", "Sëʍo"];
    const model = buildModel(samples);
    for (let i = 0; i < 300; i++) {
        const n = learnName(model);
        assert.ok(n, "no name");
        assert.doesNotMatch(n.normalize("NFD"), /^[̀-ͯ]|[^\p{L}][̀-ͯ]/u, `a mark without a letter: ${n}`);
        assert.doesNotMatch(n, /^ʷ|[aeiouäëïöü]ʷ/u, `ʷ in the wrong place: ${n}`);
    }
});
