import { WIKI_URL } from "generators/custom";
/* The village example (1.6.0, Step 5): three part generators, a how-to note, and the Templater script (for the wiki
   only, never written into the vault) that builds a linked village. Added on request ("Add the village example");
   never overwrites. Descriptive words are placeholders to replace
   (Decisions.md 2026-10-06). */

/** Starter sets the Owner part calls; the command adds them when missing. */
export const VILLAGE_STARTERS = ["Dwarvish", "Elvish", "HumanEnglish"];

/** Subfolder of the generator folder the example goes into. */
export const VILLAGE_FOLDER = "Village example";

const FENCE = "```";

const VILLAGE = `---
fcg-generator: Example village
fcg-key: ExampleVillage
---
Part of the village example. Type **@ExampleVillage** for a village on its own, or run the "Build a village" Templater script to make a village with its buildings and owners as linked notes. Words like "Wealth word high" are placeholders: replace them with your own.

${FENCE}pattern
{$wealth ?= 1d100}{$race ?= Race}{$name ?= {Name}}# {$name}
A {#if $wealth > 60: Wealth word high | {#if $wealth <= 20: Wealth word low | Wealth word middle}} village, mostly {$race} folk (wealth {$wealth}).
Known for: {Feature}
${FENCE}

## Race
- Dwarf
- Elf
- Human

## Name
- Village A
- Village B
- Village C
- Village D

## Feature
- Feature A
- Feature B
- Feature C
`;

const BUILDING = `---
fcg-generator: Example building
fcg-key: ExampleBuilding
---
Part of the village example. Takes $wealth and $race from the village (or rolls its own). The first line is the building's name; the Templater script uses it as the note's name. Inns use the built-in Inns and taverns and Drinks generators.

${FENCE}pattern
{$wealth ?= 1d100}{$race ?= Race}{$kind ?= Kind}{#if $kind = Inn}
{@InnsTaverns}
On tap: {#repeat 3: {@Drinks}}
{else}
{#if $kind = Shop: {Shop name} | {Temple name}}
Kind: {$kind}
{/if}
Condition: {#if $wealth > 60: Condition high | {#if $wealth <= 20: Condition low | Condition middle}}
${FENCE}

## Race
- Dwarf
- Elf
- Human

## Kind
- Inn
- Shop
- Temple

## Shop name
- Shop A
- Shop B
- Shop C

## Temple name
- Temple A
- Temple B
`;

const OWNER = `---
fcg-generator: Example owner
fcg-key: ExampleOwner
---
Part of the village example. Takes $race from the village and names the owner from the matching starter set: Dwarvish for Dwarf, Elvish for Elf, Human (English and British) for anyone else.

${FENCE}pattern
{$race ?= Race}{$name = {#if $race = Dwarf: {@Dwarvish} | {#if $race = Elf: {@Elvish} | {@HumanEnglish}}}}# {$name}
{A $race} who is {Trait}.
${FENCE}

## Race
- Dwarf
- Elf
- Human

## Trait
- Trait A
- Trait B
- Trait C
`;

/** The Templater script (published on the wiki, not added to the vault): a village, then 3 buildings with an owner each, as linked notes in Villages/<name>/. */
export const VILLAGE_SCRIPT = `<%*
const fcg = tp.app.plugins.plugins["fantasy-content-generator"]?.api;
if (!fcg) {
  new Notice("Turn on the TTRPG Content Generator plugin first.");
} else {
  const vault = tp.app.vault;
  const village = fcg.generateData("ExampleVillage");
  const { wealth, race, name } = village.values;
  const clean = (s) => String(s).replace(/^#+\\s*/, "").replace(/[\\\\/:*?"<>|#^[\\]]/g, "").trim() || "Untitled";
  const root = "Villages";
  if (!vault.getAbstractFileByPath(root)) await vault.createFolder(root);
  let folder = root + "/" + clean(name);
  for (let n = 2; vault.getAbstractFileByPath(folder); n++) folder = root + "/" + clean(name) + " " + n;
  await vault.createFolder(folder);
  const taken = new Set();
  const unique = (base) => {
    let f = clean(base);
    for (let n = 2; taken.has(f) || vault.getAbstractFileByPath(folder + "/" + f + ".md"); n++) f = clean(base) + " " + n;
    taken.add(f);
    return f;
  };
  const villageNote = unique(name);
  const links = [];
  for (let i = 0; i < 3; i++) {
    const b = fcg.generateData("ExampleBuilding", { wealth, race });
    const o = fcg.generateData("ExampleOwner", { race });
    const buildingNote = unique(b.text.split("\\n")[0]);
    const ownerNote = unique(o.values.name);
    await vault.create(folder + "/" + buildingNote + ".md", b.text + "\\n\\nOwner: [[" + ownerNote + "]]\\nVillage: [[" + villageNote + "]]\\n");
    await vault.create(folder + "/" + ownerNote + ".md", o.text + "\\n\\nWorks at: [[" + buildingNote + "]]\\n");
    links.push("- [[" + buildingNote + "]] (owner: [[" + ownerNote + "]])");
  }
  await vault.create(folder + "/" + villageNote + ".md", village.text + "\\n\\n## Buildings\\n" + links.join("\\n") + "\\n");
  tR += "[[" + villageNote + "]]";
}
%>`;

/**
 * The how-to note the command adds. It holds no Templater tags: Templater runs "<% %>" in any new note outside its
 * templates folder when "Trigger on new file creation" is on, so the script itself lives only on the wiki.
 */
const HOW_TO_NOTE = `# Build a village (how to)

The three "Example" generators in this folder are the parts of a village: a village, its buildings and their owners. Each one works on its own with @ (try **@ExampleVillage**). Change their words and the village changes too.

With the **Templater** plugin you can build a whole village as linked notes in one go: a village note, three buildings and an owner for each, in a new folder under "Villages". The village's wealth and main race are passed into every building and owner, so they match.

The Templater script is on the plugin's wiki, with step-by-step instructions: ${WIKI_URL}/Build-a-village

It asks the plugin for each part with \`generateData\`, which gives back the text and the values it picked (name, wealth, race).
`;

/** The notes the command writes: file name (in the example subfolder) and text. */
export const VILLAGE_NOTES: { file: string; text: string }[] = [
    { file: "Example village.md", text: VILLAGE },
    { file: "Example building.md", text: BUILDING },
    { file: "Example owner.md", text: OWNER },
    { file: "Build a village (how to).md", text: HOW_TO_NOTE },
];
