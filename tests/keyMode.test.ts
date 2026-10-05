/* 1.6.0: the @ list writes keys while a pattern is being written. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { inPatternBlock, keyMode, keyText } from "editor/keyMode";

test("key mode: after '{' anywhere; inside a pattern block; else a result", () => {
    assert.equal(keyMode("Owner: {", []), "brace");
    assert.equal(keyMode("- {", ["## Drinks"]), "brace", "list rows");
    assert.equal(keyMode("{#if $x: {", []), "brace");
    assert.equal(keyMode("The dwarf ", []), null, "normal writing inserts a result");
    assert.equal(keyMode("Village: ", ["```pattern", "{$wealth ?= 1d100}"]), "block");
    assert.equal(keyMode("x ", ["```pattern", "a", "```"]), null, "after the block closed");
    assert.equal(keyMode("x ", ["```js", "a"]), null, "other code blocks don't count");
    assert.equal(keyMode("x ", ["````", "```pattern", "shown", "```"]), null, "an example inside a ```` block");
    assert.ok(inPatternBlock(["~~~ pattern"]));
    assert.equal(keyText("Dwarvish", "brace"), "@Dwarvish");
    assert.equal(keyText("Dwarvish", "block"), "{@Dwarvish}");
    // A custom inline trigger (";;") still writes "@": that's what patterns use.
});
