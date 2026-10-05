import { test } from "node:test";
import assert from "node:assert/strict";
import { parseGeneratorNote, resolveCustom, runCustom } from "generators/custom";
import { STARTERS } from "generators/starters";

test("starter kits: 19 language kits and 10 human kits, unique keys, each credits its source", () => {
    assert.equal(STARTERS.length, 29);
    assert.equal(STARTERS.filter((k) => k.races.includes("Human")).length, 10);
    assert.equal(new Set(STARTERS.map((k) => k.key.toLowerCase())).size, 29);
    for (const k of STARTERS) {
        const human = k.races.includes("Human");
        assert.match(k.note, human ? /US Social Security Administration baby-name data \(public domain\)/ : /generated with Vulgarlang \(vulgarlang\.com\)/, k.language);
    }
});

test("starter kits: every note reads with no problems and gets its '+ meaning' twin", () => {
    const gens = STARTERS.map((k) => parseGeneratorNote(`Generators/${k.language} names.md`, undefined, k.note));
    // parseGeneratorNote needs the properties Obsidian would parse; read them from the note itself.
    assert.ok(gens.every((g) => g === null));
    for (const k of STARTERS) {
        const g = parseGeneratorNote(`Generators/${k.language} names.md`, frontmatter(k.note), k.note);
        assert.ok(g, k.language);
        assert.deepEqual(g.problems, [], k.language);
        assert.equal(g.key, k.key);
        const active = resolveCustom([g], []);
        assert.equal(active.has(`${k.key}Meaning`), /\(meanings\)/.test(k.note), k.language);
    }
});

test("starter kits: 300 names each, with and without meanings", () => {
    for (const k of STARTERS) {
        const g = parseGeneratorNote(`Generators/${k.language} names.md`, frontmatter(k.note), k.note);
        assert.ok(g);
        const twin = resolveCustom([g], []).get(`${k.key}Meaning`);
        for (let i = 0; i < 300; i++) {
            const plain = runCustom(g);
            // a first name, then a family name (which may start with a lower-case particle: von, de, bin, bint)
            assert.match(plain, /^\p{Lu}\S* (?:(?:von|de|bin|bint) )?\p{Lu}\S*$/u, `${k.language}: ${plain}`);
            if (!twin) continue;
            const meant = runCustom(twin);
            assert.match(meant, /^\p{Lu}\S* (?:(?:von|de|bin|bint) )?\p{Lu}\S*( \([a-z]+(?: [a-z]+)*-[a-z]+(?: [a-z]+)*\))?$/u, `${k.language}: ${meant}`);
        }
    }
});

/** The few properties a kit note uses, read the way Obsidian would. */
function frontmatter(note: string): Record<string, unknown> {
    const fm: Record<string, unknown> = {};
    const block = /^---\n([\s\S]*?)\n---/.exec(note)?.[1] ?? "";
    const patterns: string[] = [];
    for (const line of block.split("\n")) {
        const item = /^ {2}- "(.*)"$/.exec(line);
        if (item) { patterns.push(item[1]); continue; }
        const kv = /^([\w-]+):\s*(.*)$/.exec(line);
        if (kv && kv[2]) fm[kv[1]] = kv[2];
    }
    fm.patterns = patterns;
    return fm;
}
