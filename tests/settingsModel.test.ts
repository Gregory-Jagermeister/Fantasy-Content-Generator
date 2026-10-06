/* 1.6.1: helpers behind the settings screen. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { GROUP_KEY, addWords, matchesFilter, wordLabel } from "settings/settingsModel";

test("settings helpers: labels, adding words, filter", () => {
    assert.equal(GROUP_KEY + "Story tools", "group:Story tools");
    assert.equal(wordLabel("Goblin"), "Goblin");
    assert.equal(wordLabel({ item: "Sword", weight: 3 }), "Sword (weight 3)");
    const list: unknown[] = ["A"];
    assert.equal(addWords(list, "B, C", false), 2);
    assert.deepEqual(list, ["A", "B", "C"]);
    assert.equal(addWords(list, "  ", false), 0);
    const loot: unknown[] = [];
    assert.equal(addWords(loot, "Sword | 3\nBow", true), 2);
    assert.equal((loot[0] as { weight: number }).weight, 3);
    assert.ok(matchesFilter("A rusty old Goblin", "goblin rusty"));
    assert.ok(!matchesFilter("Goblin", "orc"));
    assert.ok(matchesFilter("anything", ""));
});
