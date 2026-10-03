import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SETTINGS } from "settings/DefaultSetting";
import { GENERATORS, RACES, RETIRED, RETIRED_KEYS, inlineGenerators, raceName, retiredMessage } from "generators/registry";
import { SETTLEMENT_TYPES, generateSettlement } from "generators/settlement";
import { clonePlain } from "settings/settingsData";
import { titleLastNames } from "lists/titleLastNames";
import { familyNameList } from "lists/humanFamilyNames";
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

test("every race gives a name for both genders, with and without a family name", () => {
    for (const r of RACES) for (const gender of ["male", "female"] as const) for (const fam of [false, true]) {
        for (let i = 0; i < 10; i++) {
            const name = raceName(r, gender, fam);
            assert.ok(!bad(name), `${r.key} ${gender} ${fam}: ${name}`);
        }
    }
});

test("inline keys: every 1.2.4 key still works or is retired, plus the corrected spelling", () => {
    const gens = inlineGenerators();
    for (const k of keys124) assert.ok(k in gens || RETIRED_KEYS.includes(k), `missing ${k}`);
    for (const k of RETIRED_KEYS) assert.ok(!(k in gens), `retired key still built in: ${k}`);
    assert.equal(RETIRED_KEYS.length, 37);
    assert.equal(Object.keys(gens).length, 72 + 1);
    assert.deepEqual(Object.keys(gens).filter((k) => !(keys124).includes(k)), ["DungeonsLabyrinths"]);
    for (const [k, fn] of Object.entries(gens)) assert.ok(!bad(fn(settings)), k);
});

test("human names use their own family list; dwarf and elf family names come from the name library", () => {
    const gens = inlineGenerators();
    const human = RACES.find((r) => r.key === "Human");
    assert.equal(human?.race, "human");
    for (const r of ["Dwarf", "Elf"]) assert.equal(RACES.find((x) => x.key === r)?.familyList, undefined, r);
    for (let i = 0; i < 20; i++) {
        for (const k of ["DwarfMaleLastname", "DwarfFemaleLastname", "ElfMaleLastname", "ElfFemaleLastname"]) {
            const n = gens[k](settings);
            assert.ok(!bad(n) && n.trim().split(/\s+/).length >= 2, `${k}: ${n}`);
        }
        const h = gens.HumanFemaleLastname(settings).split(" ");
        assert.ok(familyNameList.includes(h.slice(1).join(" ")), h.join(" "));
    }
});

test("GnomeMale works (it returned an error in 1.2.4)", () => {
    assert.ok(!bad(inlineGenerators().GnomeMale(settings)));
});

test("retired keys are 1.2.4 keys and explain themselves", () => {
    for (const k of RETIRED_KEYS) assert.ok(keys124.includes(k), k);
    assert.equal(retiredMessage("Catfolk"), "@Catfolk was removed in 1.3.1. See the plugin's README.");
    assert.equal(retiredMessage("Catfolk", "!"), "!Catfolk was removed in 1.3.1. See the plugin's README.");
    assert.equal(retiredMessage("Religion"), "@Religion was removed in 1.3.2. See the plugin's README.");
    assert.equal(RETIRED.Groups, "1.3.2");
    assert.equal(RETIRED.TradingPost, "1.3.1");
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

test("orc family names: no borrowed names, no stray full stops", () => {
    assert.ok(!titleLastNames.includes("Ravenclaw"));
    assert.ok(titleLastNames.every((n) => !n.endsWith(".")));
});
