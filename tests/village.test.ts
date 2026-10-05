/* 1.6.0 step 5: the village example's part generators work alone and together. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseGeneratorNote, resolveCustom, runCustomData, CustomGenerator } from "generators/custom";
import { EngineHost, Value } from "generators/engine";
import { STARTERS } from "generators/starters";
import { inlineGenerators } from "generators/registry";
import { DEFAULT_SETTINGS } from "settings/DefaultSetting";
import { VILLAGE_NOTES, VILLAGE_SCRIPT, VILLAGE_STARTERS } from "generators/villageExample";

/** Parse a note the way the store does: properties from its frontmatter, the body as written. */
function parse(path: string, text: string): CustomGenerator {
    const fm: Record<string, unknown> = {};
    const m = /^---\n([\s\S]*?)\n---/.exec(text);
    for (const line of (m?.[1] ?? "").split("\n")) {
        const kv = /^([\w-]+):\s*(.*)$/.exec(line);
        if (kv) fm[kv[1]] = kv[2];
    }
    const g = parseGeneratorNote(path, fm, text);
    assert.ok(g, path);
    return g;
}

const parts = VILLAGE_NOTES.filter((n) => n.file !== "Build a village (how to).md").map((n) => parse(n.file, n.text));
const starters = STARTERS.filter((k) => VILLAGE_STARTERS.includes(k.key)).map((k) => parse(`${k.key}.md`, k.note));
const gens = resolveCustom([...parts, ...starters], Object.keys(inlineGenerators()));
const builtIns = inlineGenerators();
const host: EngineHost = {
    call: (key: string, depth: number, values?: Map<string, Value>) => {
        const b = builtIns[key];
        if (b) return b(DEFAULT_SETTINGS);
        const g = gens.get(key);
        assert.ok(g, `no generator ${key}`);
        return runCustomData(g, host, depth, { values }).text;
    },
};
const run = (key: string, values: Record<string, Value> = {}) => runCustomData(gens.get(key) as CustomGenerator, host, 0, { values: new Map(Object.entries(values)) });

test("village example: notes have no problems; the starter sets it needs exist", () => {
    for (const g of parts) assert.deepEqual(g.problems, [], g.name);
    assert.equal(starters.length, 3);
    assert.match(VILLAGE_SCRIPT, /generateData\("ExampleVillage"\)/);
    // Templater runs "<% %>" in new notes outside its templates folder: nothing the command writes may hold one.
    for (const n of VILLAGE_NOTES) assert.ok(!n.text.includes("<%") && !n.text.includes("%>"), n.file);
});

test("village example: parts follow the values passed in, like the Templater script does", () => {
    for (let i = 0; i < 40; i++) {
        const v = run("ExampleVillage");
        const { wealth, race, name } = Object.fromEntries(v.values);
        assert.ok(typeof wealth === "number" && ["Dwarf", "Elf", "Human"].includes(String(race)) && String(name).startsWith("Village "), JSON.stringify([...v.values]));
        assert.match(v.text, new RegExp(`^# ${String(name)}\\n`));
        const b = run("ExampleBuilding", { wealth, race });
        const first = b.text.split("\n")[0];
        assert.ok(first.trim().length > 0, b.text);
        assert.match(b.text, new RegExp(`Condition: Condition ${wealth > 60 ? "high" : wealth <= 20 ? "low" : "middle"}$`));
        const o = run("ExampleOwner", { race });
        assert.match(o.text, new RegExp(`^# ${String(o.values.get("name")).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\n(A|An) ${String(race)} who is Trait [ABC]\\.$`));
    }
    const inn = run("ExampleBuilding", { wealth: 80, race: "Elf", kind: "Inn" });
    assert.match(inn.text, /\nOn tap: .+\nCondition: Condition high$/);
});
