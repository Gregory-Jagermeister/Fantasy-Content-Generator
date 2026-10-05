import { test } from "node:test";
import assert from "node:assert/strict";
import { starterChoices, starterTitle } from "generators/starterChoices";
import { STARTERS } from "generators/starters";

test("starter titles: unique and safe as note names on every system", () => {
    const titles = STARTERS.map(starterTitle);
    assert.equal(new Set(titles).size, STARTERS.length);
    for (const t of titles) assert.doesNotMatch(t, /[\\/:*?"<>|#^[\]]/, t);
    assert.equal(starterTitle(STARTERS.find((k) => k.key === "Elvish")!), "Elvish names");
    assert.equal(starterTitle(STARTERS.find((k) => k.key === "HumanSlavic")!), "Human (Slavic) names");
});

test("starter choices: one per starter set, races on the second line, sorted", () => {
    const choices = starterChoices();
    assert.equal(choices.length, STARTERS.length);
    assert.equal(new Set(choices.map((c) => c.kit)).size, STARTERS.length);
    const elvish = choices.find((c) => c.kit.key === "Elvish");
    assert.deepEqual([elvish?.label, elvish?.detail], ["Elvish names", "Elf, High elf, Dark elf, Drow"]);
    const planar = choices.filter((c) => c.kit.key.startsWith("Planar"));
    assert.deepEqual(planar.map((c) => [c.label, c.detail]), [
        ["Planar", "Light and Dark together"],
        ["Planar: Dark", "Demon, Half demon, Tiefling"],
        ["Planar: Light", "Angel, Aasimar"],
    ]);
    for (const c of choices) assert.ok(!c.kit.races.includes(c.label), `race as a title: ${c.label}`);
    const labels = choices.map((c) => c.label);
    assert.deepEqual(labels, [...labels].sort((a, b) => a.localeCompare(b)));
});
