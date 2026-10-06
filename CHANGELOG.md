# Changelog

## 1.6.0

**Renamed:** Fantasy Content Generator is now **TTRPG Content Generator**, for any genre. The plugin id is unchanged, so settings, hotkeys and Templater scripts keep working. The GitHub repository is now `Gregory-Jagermeister/TTRPG-Content-Generator` (the old address redirects).

**Generator panel**
- The generator window is now a **side panel** that stays open while you write (ribbon icon or **Open generator**).
- Pinned (★) and recent generators at the top; a search box that finds generators by name, group or race.
- Results show in full: names as a list, longer results (inns, settlements) as blocks that fold with **Show more**.
- **Insert** and **Copy** on every result, plus **Insert all** and **Copy all**. Names go right at the cursor, inside your sentence; blocks go on their own lines.
- One entry per starter set, with a **Show meanings** tick; **Keep previous** to let results pile up.

**Writing generators**
- Patterns can be written in the note as a ` ```pattern ` block (several blocks: one is picked at random). The `pattern` property still works.
- **If / else**: `{#if $wealth > 60: rich | poor}` and `{#if …}` … `{else if …}` … `{else}` … `{/if}` blocks, with `and`, `or`, `not`.
- **Loops**: `{#repeat 1d4: …}`, `{#each List: …}` and their blocks, with `$i`, `$item`, `$first`, `$last`.
- **Maths** with `*`, `/` and brackets (rounded down); `{a Race}` / `{A Race}` for "a" or "an".
- Braces can nest: `{#if $x: {Drinks} | {Food}}`.
- `{$race = "Dwarf"}` saves exact words.
- **Passing values**: `{@Tavern $wealth=$wealth $race=Dwarf}`, and `{$wealth ?= 1d100}` for a fallback when nothing is passed.
- While writing a pattern, the `@` list writes the key: after `{` you get `{@Dwarvish`, inside a pattern block `{@Dwarvish}`.

**Build your own world**
- `api.generate(key, values)` and the new `api.generateData(key, values)`, which also returns the values a generator picked, for Templater and other scripts.
- **Add the village example**: three part generators (village, building, owner) and a how-to note; the wiki has a Templater script that builds a whole village as linked notes.

**Smaller changes**
- All starter sets use pattern blocks; the human sets build names from a "Name" list, with the same results as before.
- The `@` list offers **Add a starter set** when you have no name generators yet.
- Each word-list tab in settings starts with an example of what its lists make.
- The **New generator** note points to the example note and the wiki.
- New ribbon icon (a scroll).
- Fixed: settlement names never used the Prefixes list (now Redford, Bakoford or North Bako).
- Fixed: the Korean, Chinese and Vietnamese set could now and then fail with "couldn't make a new name".
- Requires Obsidian 1.4.10 or newer.

## 1.5.0
- **Starter sets**: 30 ready-made naming kits, one for each language (Dwarvish, Elvish, Kohrog for orcs and goblinoids, Draconic, Fey, Small folk for halflings and gnomes, Catfolk, Ratfolk, Tengu, Shadow for fetchlings, Cave person, Planar for angels, demons and kin, the four Elemental tongues and the half-races) and ten human cultures. Add one, or all of them at once, with the **Add a starter set** command or the button in **Settings › Custom generators**. See the wiki's Starter sets page.
- **Meanings**: lists ending in `(meanings)` hold `word = meaning` rows. A generator that uses one also gets a **+ meaning** pick whose names say what they mean: *Nukho Nöndtrind (stone-helmet)*.
- `{List.meaning}` gives the meaning side of a row; `fcg-capitalize: words` capitalises every word.
- **The built-in race names are replaced by starter sets.** The 18 built-in name generators (Angel, Cave person, Dark elf, Demon, Dragon, Drow, Dwarf, Elf, Fairy, Gnome, Goblin, Half demon, Halfling, High elf, High fairy, Human, Ogre and Orc) and the name library they used have been removed. Their inline keys (`@ElfFemale`, `@DwarfMaleLastname` and the rest) are retired: typing one in full tells you which starter set to add instead. Notes you already generated are not affected.
- **A tidier `@` list**: retired keys are no longer listed, every entry has a second line saying what it is (*Starter set · Elvish names*, *Settlements and buildings · Inns and taverns*), and the search reads that line too, so `@tavern` finds `@InnsTaverns`.
- The generator window lists starter sets in their own group; the Names section (race, gender and family name) is gone.
- The names retired in 1.3.1 are back as starter sets (Half-orc, Half-elf, Catfolk, Ratfolk, Tengu, Tiefling, Aasimar, Fetchling, Hobgoblin, Kobold, Ifrit, Oread, Sylph, Undine; for Tian, see the human sets). `@Catfolk`, `@HalfOrc`, `@Ratfolk` and `@Tengu` work again once their set is added.

## 1.4.0
- **Note engine** for custom generators: dice and ranges, calls to other generators (`{@Key}`), repeats (`{3 x Drinks}`), tables rolled with a die (`## Size (d20)`), modifiers, lookups, remembered values and `{again}`. Notes from 1.3 work as before.
- **Naming kits**: lists ending in `(learn)` make new names in the style of your samples.
- **Copy to my folder** for Drinks, Dungeons and labyrinths, Inns and taverns, Metals and Ship.
- **Show groups** in General settings to hide groups you don't use.
- Fixed: inn rumours could show "undefined" or freeze with fewer than three rumours; double spaces in drink and dungeon names; "famous for its …" in dungeon descriptions; plot hooks ("rulers's", a trailing comma, missing "the", capitalised places mid-sentence).
- Fixed: pressing Enter straight after picking an inline suggestion could do nothing (the pick ran a second time against old text).

## 1.3.3
- Dwarf and Elf family names now come from the same name library as the other races.
- Small fixes to the Orc family names.

## 1.3.2
- **Religion** and **Groups** have been retired so they can be rewritten from scratch in a later update. `@Religion` and `@Groups` show **Retired in 1.3.2** in the list.
- The **Groups** settings section has gone. If you edited its lists, your words are still in the plugin's data file; you can turn them into a custom generator note (see the wiki).

## 1.3.1
- **Some generators have been retired** so they can be rewritten from scratch in a later update:
  - Names: Aasimar, Catfolk, Fetchling, Half-elf, Half-orc, Hobgoblin, Ifrit, Kobold, Oread, Ratfolk, Sylph, Tengu, Tian, Tiefling, Undine
  - Airships, Artifacts, Animal groups, Magical trees, Trading post
- Their inline keys (for example `@Catfolk`, `@CatfolkLastname`, `@TradingPost`) still show in the list, marked **Retired in 1.3.1**. Picking one shows a short message and inserts nothing. Templater calls to them show the same message.
- You can make your own replacement with a custom generator note: set `fcg-key` to the old key (for example `fcg-key: Catfolk`) and it works again. See the wiki.
- Settlements now use the plugin's own code. The population always fits the settlement type (a metropolis could show a wrong or negative number before). The plugin is about 40% smaller.

## 1.3.0
- **Custom generators from notes** (#11): put notes with `fcg-generator` in their properties in the `Generators` folder (set in settings) and they appear in the `@` suggestions and the generator window. See the wiki.
- New command **New custom generator** creates the folder (with an example the first time) and a starter note
- Inline suggestions also match anywhere in a name (`@lastname`), with names that start with what you typed listed first
- **Default amount** setting for the generator window, which remembers your last amount until Obsidian restarts (#7)
- Settings are split into sections: tabs on desktop, a dropdown on phones and tablets
- Other plugins (for example Templater) can call `api.generate("Key")`
- Code tidy-up: shared random helpers; an empty word list now shows a message instead of producing "undefined"

## 1.2.5
- Inline generation now works in note cards on a canvas (#10)
- Fixed: dwarf and human inline names used the elf name list; `@GnomeMale` gave an error; the dungeon "Nouns" setting edited the group list; reset to defaults could change the defaults until a restart
- New settings added in updates now reach everyone, without losing your own lists
- Import works on phones; a broken file shows a message instead of failing silently
- Loot items are added as `name | weight`, one per line (other lists: one per line, or comma separated)
- The generator window lists generators in groups; results are shorter in the "copied" notice
- `@DungeonsLabyrinths` works as well as the old `@DungeonsLabryinths`
- Orc family names in the generator window now use the same title list as inline orc names
- Requires Obsidian 1.1.0 or newer. Licence is now MIT
