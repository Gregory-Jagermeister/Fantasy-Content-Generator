/* 1.6.0 step 2: passing values into calls, ?= fallbacks, results with values. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseGeneratorNote, runCustom, runCustomData, CustomGenerator } from "generators/custom";
import { EngineHost, parseCall, toValues, Value } from "generators/engine";

function gen(body: string, fm: Record<string, unknown> = {}, allowProblems = false): CustomGenerator {
    const g = parseGeneratorNote("G/t.md", { "fcg-generator": "T", ...fm }, body);
    assert.ok(g, "not a generator");
    if (!allowProblems) assert.deepEqual(g.problems, []);
    return g;
}

/** A tiny host with named generators that can call each other, like main.ts does. */
function hostFor(gens: Record<string, CustomGenerator>): EngineHost {
    const host: EngineHost = {
        call: (key: string, depth: number, values?: Map<string, Value>) => runCustom(gens[key], host, depth, { values }),
    };
    return host;
}

const TAVERN = "```pattern\n{$wealth ?= 1d100}Tavern ({$wealth}): {#if $wealth > 60: rich | {#if $wealth <= 20: poor | middling}}{#if $race: , run by {a $race}}\n```\n## A\n- a";

test("passing values: the called generator starts with them; dice roll once in the caller", () => {
    const tavern = gen(TAVERN);
    const village = gen("```pattern\n{$wealth = 2d6 + 70}Village ({$wealth}). {@Tavern $wealth=$wealth $race=Dwarf}\n```\n## A\n- a");
    const host = hostFor({ Tavern: tavern });
    for (let i = 0; i < 50; i++) {
        const r = runCustom(village, host);
        const m = /^Village \((\d+)\)\. Tavern \((\d+)\): rich, run by a Dwarf$/.exec(r);
        assert.ok(m, r);
        assert.equal(m[1], m[2], "parent and child agree");
    }
    const dice = gen("```pattern\n{@Tavern $wealth=2d6}\n```\n## A\n- a");
    for (let i = 0; i < 30; i++) assert.match(runCustom(dice, host), /^Tavern \((\d|1[0-2])\): poor$/);
});

test("?= : a fallback only when nothing was passed; an unset $name isn't passed", () => {
    const tavern = gen(TAVERN);
    const host = hostFor({ Tavern: tavern });
    const alone = gen("```pattern\n{@Tavern}\n```\n## A\n- a");
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) seen.add(/rich|poor|middling/.exec(runCustom(alone, host))?.[0] ?? "?");
    assert.deepEqual([...seen].sort(), ["middling", "poor", "rich"], "rolled its own wealth");
    const unset = gen("```pattern\n{@Tavern $wealth=$nothing}\n```\n## A\n- a");
    assert.ok(/Tavern \(\d+\)/.test(runCustom(unset, host)));
    assert.equal(runCustom(gen("```pattern\n{$x = 5}{$x ?= 99}{$x}|{$y ?= 7}{$y}\n```\n## A\n- a")), "5|7");
});

test("values passed: quoted text, words, patterns, numbers; values stay inside the call", () => {
    const show = gen("```pattern\n[{$name}|{$n}|{$pick}|{$word}]{$secret = 1}\n```\n## A\n- a");
    const host = hostFor({ Show: show });
    const caller = gen('```pattern\n{$secret = 0}{@Show $name="Old Bell Inn" $n=3 * 4 $pick={A} $word=Dwarf}\n```\n## A\n- a', {}, true);
    assert.match(caller.problems.join(), /"\*" isn't a value to pass/);
    const ok = gen('```pattern\n{$secret = 0}{@Show $name="Old Bell Inn" $n=12 $pick={A} $word=Dwarf} secret {$secret}\n```\n## A\n- a');
    assert.equal(runCustom(ok, host), "[Old Bell Inn|12|a|Dwarf] secret 0", "the call's $secret doesn't leak back");
});

test("results with values (for Templater): passed values and everything remembered", () => {
    const g = gen("```pattern\n{$wealth ?= 1d100}{$tier = {#if $wealth > 60: high | low}}{$tier}\n```\n## A\n- a");
    const r = runCustomData(g, {}, 0, { values: toValues({ wealth: 80, race: "Elf" }) });
    assert.equal(r.text, "high");
    assert.deepEqual(Object.fromEntries(r.values), { wealth: 80, race: "Elf", tier: "high" });
    assert.deepEqual(Object.fromEntries(toValues({ $a: 1, b: "x", c: true, d: false })), { a: 1, b: "x", c: 1, d: 0 });
    assert.throws(() => toValues({ "bad name": 1 }), /can't be a value name/);
});

test("call checks: spaces around =, stray words, unclosed quotes; nested patterns checked", () => {
    assert.deepEqual(parseCall("Tavern"), { key: "Tavern", args: [] });
    assert.deepEqual(parseCall('Tavern $a=1 $b="x y" $c={A: b c}'), { key: "Tavern", args: [{ name: "a", raw: "1" }, { name: "b", raw: '"x y"' }, { name: "c", raw: "{A: b c}" }] });
    const p = (pattern: string) => gen("```pattern\n" + pattern + "\n```\n## A\n- a", {}, true).problems.join("\n");
    assert.match(p("{@Tavern $wealth = 80}"), /no spaces around "="/);
    assert.match(p("{@Tavern wealth=80}"), /"wealth=80" isn't a value to pass/);
    assert.match(p('{@Tavern $name="Old Bell}'), /isn't closed/);
    assert.match(p("{@Tavern $x={Nope}}"), /no list "## Nope"/);
    assert.equal(p("{@Tavern $x={A} $y=$z}"), "");
});
