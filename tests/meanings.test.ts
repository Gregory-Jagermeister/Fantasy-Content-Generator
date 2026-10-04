import { test } from "node:test";
import assert from "node:assert/strict";
import { parseGeneratorNote, runCustom, usesMeanings, CustomGenerator } from "generators/custom";
import { parseHeading, parseMeaningRow, translation } from "generators/engine";

/** A generator from a note body and properties; fails the test if the note has problems (unless allowed). */
function gen(body: string, fm: Record<string, unknown> = {}, allowProblems = false): CustomGenerator {
    const g = parseGeneratorNote("G/t.md", { "fcg-generator": "T", ...fm }, body);
    assert.ok(g, "not a generator");
    if (!allowProblems) assert.deepEqual(g.problems, []);
    return g;
}
const M = { meanings: true };

const KIT = `
## First
- Durak

## Land (meanings)
- nönd = stone

## War (meanings)
- trind = helmet
`;

test("meaning lists: heading and rows", () => {
    assert.deepEqual(parseHeading("Land (meanings)"), { name: "Land", info: { kind: "meanings" } });
    assert.deepEqual(parseHeading("Land ( Meanings )"), { name: "Land", info: { kind: "meanings" } });
    assert.deepEqual(parseMeaningRow("nönd = stone"), { word: "nönd", meaning: "stone" });
    assert.deepEqual(parseMeaningRow("nönd=stone, rock"), { word: "nönd", meaning: "stone, rock" });
    assert.equal(parseMeaningRow("nönd"), null);
    assert.equal(parseMeaningRow("= stone"), null);
    const g = gen("## Land (meanings)\n- nönd = stone | 3\n- skök = iron");
    const rows = g.lists.get("land") ?? [];
    assert.deepEqual(rows.map((r) => [r.item, r.meaning, r.weight]), [["nönd", "stone", 3], ["skök", "iron", 1]]);
    assert.ok(usesMeanings(g));
    assert.ok(!usesMeanings(gen("## A\n- a")));
});

test("meaning lists: a row without = is a problem", () => {
    const g = gen("## Land (meanings)\n- nönd\n- skök = iron", {}, true);
    assert.equal(g.problems.length, 1);
    assert.match(g.problems[0], /needs a word and its meaning/);
    assert.equal(g.lists.get("land")?.length, 1);
});

test("translation: words join with -, separate words with ', '", () => {
    assert.equal(translation(["stone", "helmet"]), "stone-helmet");
    assert.equal(translation([null, "iron", "wolf", null, "stone", "helmet"]), "iron-wolf, stone-helmet");
    assert.equal(translation([null, null]), "");
    assert.equal(translation([]), "");
});

test("names: the word prints; + meaning adds the translation", () => {
    const g = gen(KIT, { pattern: "{First} {Land}{War}", "fcg-capitalize": "words" });
    assert.equal(runCustom(g), "Durak Nöndtrind");
    assert.equal(runCustom(g, {}, 0, M), "Durak Nöndtrind (stone-helmet)");
    const two = gen(KIT, { pattern: "{War}{Land} {Land}{War}" });
    assert.equal(runCustom(two, {}, 0, M), "trindnönd nöndtrind (helmet-stone, stone-helmet)");
});

test("names: no meaning list used means no brackets", () => {
    const g = gen(KIT, { pattern: "{First}" });
    assert.equal(runCustom(g, {}, 0, M), "Durak");
});

test("{List.meaning}: English side, not recorded", () => {
    const g = gen(KIT, { pattern: "{First} {Land.meaning}{War.meaning}", "fcg-capitalize": "words" });
    assert.equal(runCustom(g, {}, 0, M), "Durak Stonehelmet");
    const plain = gen("## A\n- a", { pattern: "{A.meaning}" }, true);
    assert.match(plain.problems.join(" "), /isn't a meaning list/);
    assert.throws(() => runCustom(plain), /needs a meaning list/);
});

test("meaning lists mix with {A|B}, lookups and repeats", () => {
    const g = gen(KIT, { pattern: "{Land|War}" });
    for (let i = 0; i < 50; i++) assert.match(runCustom(g, {}, 0, M), /^(nönd \(stone\)|trind \(helmet\))$/);
    const look = gen(KIT, { pattern: "{Land: stone}" });
    assert.equal(runCustom(look, {}, 0, M), "nönd (stone)");
    const rep = gen("## Land (meanings)\n- nönd = stone\n- skök = iron", { pattern: "Two: {2 x Land}" });
    for (let i = 0; i < 30; i++) assert.match(runCustom(rep, {}, 0, M), /^Two: (nönd and skök \(stone, iron\)|skök and nönd \(iron, stone\))$/);
});

test("fcg-capitalize: words capitalises every word; true only the first", () => {
    const words = gen("## A\n- ab cd", { "fcg-capitalize": "words" });
    assert.equal(runCustom(words), "Ab Cd");
    const first = gen("## A\n- ab cd", { "fcg-capitalize": true });
    assert.equal(runCustom(first), "Ab cd");
    assert.equal(runCustom(gen(KIT, { pattern: "{Land}", "fcg-capitalize": "words" }), {}, 0, M), "Nönd (stone)");
});
