import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SETTINGS } from "settings/DefaultSetting";
import { clonePlain } from "settings/settingsData";
import { COPYABLE, copyNote, noteItem } from "generators/copies";
import { parseGeneratorNote, runCustom } from "generators/custom";

/** Just enough YAML for the copies' properties: key: value, "quoted", `pattern: |` blocks and `- item` lists. */
function frontmatter(text: string): Record<string, unknown> {
    const m = /^---\n([\s\S]*?)\n---/.exec(text);
    assert.ok(m, "no properties");
    const out: Record<string, unknown> = {};
    let key = "";
    let mode: "block" | "list" | "" = "";
    for (const line of m[1].split("\n")) {
        const kv = /^([\w-]+):\s*(.*)$/.exec(line);
        if (kv) {
            key = kv[1];
            if (kv[2] === "|") { out[key] = ""; mode = "block"; }
            else if (kv[2] === "") { out[key] = []; mode = "list"; }
            else { out[key] = kv[2] === "true" ? true : kv[2].startsWith('"') ? JSON.parse(kv[2]) as string : kv[2]; mode = ""; }
        } else if (mode === "block") {
            out[key] = `${out[key] as string}${(out[key] as string) ? "\n" : ""}${line.replace(/^ {2}/, "")}`;
        } else if (mode === "list") {
            (out[key] as unknown[]).push(JSON.parse(line.replace(/^ {2}- /, "")) as string);
        }
    }
    return out;
}

const settings = clonePlain(DEFAULT_SETTINGS);

function copied(key: string) {
    const note = copyNote(key, settings);
    assert.ok(note, key);
    const g = parseGeneratorNote(`G/${note.name}.md`, frontmatter(note.text), note.text);
    assert.ok(g, key);
    assert.deepEqual(g.problems, [], `${key}: ${g.problems.join("; ")}`);
    assert.equal(g.key, `${key}Copy`);
    return Array.from({ length: 200 }, () => runCustom(g));
}

test("every copyable generator makes a valid note that runs", () => {
    assert.deepEqual(Object.keys(COPYABLE), ["Drinks", "DungeonsLabryinths", "InnsTaverns", "Metals", "Ship"]);
    for (const key of Object.keys(COPYABLE)) for (const r of copied(key)) assert.ok(r && !/undefined|\{|\}/.test(r), `${key}: ${r}`);
    assert.equal(copyNote("Settlement", settings), null);
});

test("copies have the same shape as the built-ins", () => {
    for (const r of copied("Drinks")) assert.ok(settings.drinkSettings.nouns.some((n) => r.endsWith(n)), r);
    for (const r of copied("DungeonsLabryinths")) {
        const [name, desc] = r.split("\n");
        assert.match(desc, /^Description: /, r);
        const type = settings.dungeonSettings.dungeonTypes.find((t) => name.startsWith(`${t} of the `));
        if (type) assert.ok(desc.includes(type), `type differs between name and description: ${r}`);
    }
    for (const r of copied("InnsTaverns")) {
        const lines = r.split("\n");
        assert.equal(lines.length, 3, r);
        assert.match(lines[1], /^Description: /);
        assert.match(lines[2], /^Rumors: .+ and .+/);
    }
    for (const r of copied("Metals")) assert.match(r, /^[A-Z][a-z]+$/, r);
    for (const r of copied("Ship")) assert.match(r, /( of [A-Z][a-z]+$)|( [A-Z][a-z]+$)/, r);
});

test("the copy uses the user's own lists", () => {
    const mine = clonePlain(DEFAULT_SETTINGS);
    mine.drinkSettings.adj = ["Smoky"];
    mine.drinkSettings.nouns = ["Ale {old}"];
    const note = copyNote("Drinks", mine)!;
    const g = parseGeneratorNote("G/x.md", frontmatter(note.text), note.text)!;
    assert.deepEqual(g.problems, []);
    for (let i = 0; i < 20; i++) assert.match(runCustom(g), /^Smoky (Smoky )?Ale \{old\}$/);
});

test("list items: braces escaped, a trailing number after | kept as text", () => {
    assert.equal(noteItem("a {b}"), "a \\{b\\}");
    assert.equal(noteItem("Ash | 3"), "Ash | 3 | 1");
    assert.equal(noteItem("plain"), "plain");
});
