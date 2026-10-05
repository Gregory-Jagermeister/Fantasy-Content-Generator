import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SETTINGS } from "settings/DefaultSetting";
import { GENERATORS, RETIRED, RETIRED_KEYS, describeBuiltIn, inlineGenerators, replacementFor, retiredMessage } from "generators/registry";
import { STARTERS } from "generators/starters";
import { starterTitle } from "generators/starterChoices";
import { SETTLEMENT_TYPES, generateSettlement } from "generators/settlement";
import { clonePlain } from "settings/settingsData";
import { generateCityName } from "generators/city";
import keys124 from "./keys-1.2.4.json";

const settings = clonePlain(DEFAULT_SETTINGS);
const bad = (t: string) => !t || /undefined|\[object|^Error/.test(t);

test("every generator gives text 50 times", () => {
    for (const g of GENERATORS) {
        for (let i = 0; i < 50; i++) {
            const r = g.run(settings);
            assert.ok(!bad(r.text) && !bad(r.title), `${g.key}: ${r.text}`);
        }
    }
});

test("inline keys: every 1.2.4 key still works or is retired, plus the corrected spelling", () => {
    const gens = inlineGenerators();
    for (const k of keys124) assert.ok(k in gens || RETIRED_KEYS.includes(k), `missing ${k}`);
    for (const k of RETIRED_KEYS) assert.ok(!(k in gens), `retired key still built in: ${k}`);
    assert.equal(RETIRED_KEYS.length, 37 + 64);
    assert.equal(Object.keys(gens).length, 8 + 1);
    assert.deepEqual(Object.keys(gens).filter((k) => !(keys124).includes(k)), ["DungeonsLabyrinths"]);
    for (const [k, fn] of Object.entries(gens)) assert.ok(!bad(fn(settings)), k);
});

test("retired keys are 1.2.4 keys and explain themselves", () => {
    for (const k of RETIRED_KEYS) assert.ok(keys124.includes(k), k);
    assert.equal(retiredMessage("Catfolk"), '@Catfolk was removed in 1.3.1. Use the "Catfolk names" starter set instead: run "Add a starter set".');
    assert.equal(retiredMessage("ElfFemaleLastname", "!"), '!ElfFemaleLastname was removed in 1.5.0. Use the "Elvish names" starter set instead: run "Add a starter set".');
    assert.equal(retiredMessage("HumanMale"), '@HumanMale was removed in 1.5.0. Use one of the Human starter sets instead: run "Add a starter set".');
    assert.equal(retiredMessage("TradingPost"), "@TradingPost was removed in 1.3.1. See the plugin's README.");
    assert.equal(retiredMessage("Religion"), "@Religion was removed in 1.3.2. See the plugin's README.");
    assert.equal(RETIRED.Groups, "1.3.2");
    assert.equal(RETIRED.TradingPost, "1.3.1");
    assert.equal(RETIRED.OrcLastname, "1.5.0");
    assert.equal(RETIRED.CavePersonFemale, "1.5.0");
    assert.ok(!GENERATORS.some((g) => g.group === "Groups and religions"));
});

test("settlement: type on the ladder, population inside its range", () => {
    assert.equal(SETTLEMENT_TYPES.length, 11);
    for (const t of SETTLEMENT_TYPES) assert.ok(t.minPop < t.maxPop, t.label);
    const metro = SETTLEMENT_TYPES.find((t) => t.label === "Metropolis");
    assert.deepEqual([metro?.minPop, metro?.maxPop], [100000, 5000000]);
    for (let i = 0; i < 1000; i++) {
        const s = generateSettlement();
        assert.ok(Number.isInteger(s.population) && s.population >= s.type.minPop && s.population <= s.type.maxPop, `${s.type.label} ${s.population}`);
    }
    const text = inlineGenerators().Settlement(settings);
    assert.match(text, /^Name: .+\nPopulation: [\d,.\s]+\nType: (Thorp|Hamlet|Village|Small Town|Medium Town|Large Town|Small City|Medium City|Large City|Great City|Metropolis)$/);
});

test("1.5.0: every retired name key points at a starter set that exists", () => {
    const names = new Set(STARTERS.map(starterTitle));
    const labels = new Set(["Planar: Light", "Planar: Dark"]);
    for (const k of RETIRED_KEYS) {
        const set = replacementFor(k);
        if (RETIRED[k] === "1.5.0") assert.ok(set, k);
        if (!set || set === "Human") continue;
        assert.ok(names.has(set) || labels.has(set), `${k} -> ${set}`);
    }
    assert.equal(describeBuiltIn("InnsTaverns"), "Settlements and buildings · Inns and taverns");
    assert.equal(describeBuiltIn("ElfMale"), undefined);
});


test("settlement names: three shapes, prefixes used (1.6.0 fix)", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 300; i++) {
        const n = generateCityName({ prefixArray: ["red"], suffixArray: ["ford"] });
        if (n === "Redford") seen.add("prefix+suffix");
        else if (/^Red [A-Z][a-z]+$/.test(n)) seen.add("prefix+made-up");
        else if (/^[A-Z][a-z]+ford$/.test(n)) seen.add("made-up+suffix");
        else assert.fail(`unexpected shape: ${n}`);
    }
    assert.equal(seen.size, 3, [...seen].join());
});
