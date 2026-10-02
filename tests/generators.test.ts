import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SETTINGS } from "settings/DefaultSetting";
import { GENERATORS, RACES, inlineGenerators, raceName } from "generators/registry";
import { clonePlain } from "settings/settingsData";
import { dwarfFamilyNames } from "lists/dwarvenFamilyNames";
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

test("inline keys: every 1.2.4 key still works, plus the corrected spelling", () => {
    const gens = inlineGenerators();
    for (const k of keys124) assert.ok(k in gens, `missing ${k}`);
    assert.deepEqual(Object.keys(gens).filter((k) => !(keys124).includes(k)), ["DungeonsLabyrinths"]);
    for (const [k, fn] of Object.entries(gens)) assert.ok(!bad(fn(settings)), k);
});

test("dwarf and human names use their own lists (not the elf list)", () => {
    const gens = inlineGenerators();
    const dwarf = RACES.find((r) => r.key === "Dwarf");
    const human = RACES.find((r) => r.key === "Human");
    assert.equal(dwarf?.race, "dwarf");
    assert.equal(human?.race, "human");
    for (let i = 0; i < 20; i++) {
        const d = gens.DwarfMaleLastname(settings).split(" ");
        assert.ok(dwarfFamilyNames.includes(d.slice(1).join(" ")), d.join(" "));
        const h = gens.HumanFemaleLastname(settings).split(" ");
        assert.ok(familyNameList.includes(h.slice(1).join(" ")), h.join(" "));
    }
});

test("GnomeMale works (it returned an error in 1.2.4)", () => {
    assert.ok(!bad(inlineGenerators().GnomeMale(settings)));
});
