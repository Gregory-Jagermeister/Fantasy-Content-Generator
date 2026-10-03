# Fantasy Content Generator

This is a plugin for Obsidian (<https://obsidian.md>) for the generation of fantasy content like inn, settlements and names for characters based on races.

## Credits and Resources

The names for Angel, Cave person, Dark elf, Demon, Dragon, Drow, Dwarf, Elf, Fairy, Gnome, Goblin, Half demon, Halfling, High elf, High fairy, Human, Ogre and Orc come from the Fantasy Name Generator package (<https://www.npmjs.com/package/fantasy-name-generator>, ISC licence).

## How to Use

1. Select the Book icon in the ribbon
2. Select the Generator you would like to use
3. Edit the Settings to your hearts content
4. Click generate and copy your generation to your Clipboard.

### Example

![Example](Obsidian-Fantasy-Content-Generator-Compressed.gif)

## Changelog

### 1.4.0
- **Note engine** for custom generators: dice and ranges, calls to other generators (`{@Key}`), repeats (`{3 x Drinks}`), tables rolled with a die (`## Size (d20)`), modifiers, lookups, remembered values and `{again}`. Notes from 1.3 work as before. See **Note engine**.
- **Naming kits**: lists ending in `(learn)` make new names in the style of your samples. See **Naming kits**.
- **Copy to my folder** for Drinks, Dungeons and labyrinths, Inns and taverns, Metals and Ship.
- **Show groups** in General settings to hide groups you don't use.
- Fixed: inn rumours could show "undefined" or freeze with fewer than three rumours; double spaces in drink and dungeon names; "famous for its …" in dungeon descriptions; plot hooks ("rulers's", a trailing comma, missing "the", capitalised places mid-sentence).

### 1.3.3
- Dwarf and Elf family names now come from the same name library as the other races.
- Small fixes to the Orc family names.

### 1.3.2
- **Religion** and **Groups** have been retired so they can be rewritten from scratch in a later update (see **TO-DO**). `@Religion` and `@Groups` show **Retired in 1.3.2** in the list.
- The **Groups** settings section has gone. If you edited its lists, your words are still in the plugin's data file; you can turn them into a custom generator note (see **Custom generators** below).

### 1.3.1
- **Some generators have been retired** so they can be rewritten from scratch in a later update (see **TO-DO**):
  - Names: Aasimar, Catfolk, Fetchling, Half-elf, Half-orc, Hobgoblin, Ifrit, Kobold, Oread, Ratfolk, Sylph, Tengu, Tian, Tiefling, Undine
  - Airships, Artifacts, Animal groups, Magical trees, Trading post
- Their inline keys (for example `@Catfolk`, `@CatfolkLastname`, `@TradingPost`) still show in the list, marked **Retired in 1.3.1**. Picking one shows a short message and inserts nothing. Templater calls to them show the same message.
- You can make your own replacement with a custom generator note: set `fcg-key` to the old key (for example `fcg-key: Catfolk`) and it works again. See **Custom generators** below.
- Settlements now use the plugin's own code. The population always fits the settlement type (a metropolis could show a wrong or negative number before). The plugin is about 40% smaller.

### 1.3.0
- **Custom generators from notes** (#11): put notes with `fcg-generator` in their properties in the `Generators` folder (set in settings) and they appear in the `@` suggestions and the generator window. See **Custom generators** below.
- New command **New custom generator** creates the folder (with an example the first time) and a starter note
- Inline suggestions also match anywhere in a name (`@lastname`), with names that start with what you typed listed first
- **Default amount** setting for the generator window, which remembers your last amount until Obsidian restarts (#7)
- Settings are split into sections: tabs on desktop, a dropdown on phones and tablets
- Other plugins (for example Templater) can call `api.generate("Key")`; see **Templater**
- Code tidy-up: shared random helpers; an empty word list now shows a message instead of producing "undefined"

### 1.2.5
- Inline generation now works in note cards on a canvas (#10)
- Fixed: dwarf and human inline names used the elf name list; `@GnomeMale` gave an error; the dungeon "Nouns" setting edited the group list; reset to defaults could change the defaults until a restart
- New settings added in updates now reach everyone, without losing your own lists
- Import works on phones; a broken file shows a message instead of failing silently
- Loot items are added as `name | weight`, one per line (other lists: one per line, or comma separated)
- The generator window lists generators in groups; results are shorter in the "copied" notice
- `@DungeonsLabyrinths` works as well as the old `@DungeonsLabryinths`
- Orc family names in the generator window now use the same title list as inline orc names
- Requires Obsidian 1.1.0 or newer. Licence is now MIT

## Custom generators

A custom generator is a note in your generator folder (default `Generators`, subfolders included). Run **New custom generator** from the command palette to start one.

```markdown
---
fcg-generator: Ashborn names
pattern: "{First} {Family}"
---
## First
- Kael
- Irith | 3

## Family
- Emberfall
- Cinderwake
```

Type `@AshbornNames` in any note to insert a result, or pick it under **Custom** in the generator window.

| In the note | What it does |
|---|---|
| `fcg-generator: <name>` | Makes the note a generator |
| `fcg-key: <Key>` | Optional inline key. Without it the key is the name with each word capitalised and no spaces |
| `pattern: "..."` | Always used |
| `patterns:` (a list) | One is picked at random each time; list one twice to make it twice as likely |
| `fcg-capitalize: true` | Capitalise the first letter of each result |
| `pattern: \|` | A pattern over several lines (Markdown kept) |
| `- item \| 3` | That item is three times as likely |

Everything else in the note is ignored. Problems (a missing list, a table with gaps, a key already in use) are listed in **Settings › Custom generators**.

### Note engine

Patterns (in the properties and inside list items) can use:

| Write | Does | Example |
|---|---|---|
| `{List}` / `{A\|B}` | one item from the list (or either list) | `{First} {Family}` |
| `{@Key}` | another generator's result, built-in or custom | `{@InnsTaverns}` |
| `{2d6}` `{1d8+4}` `{1-4}` | dice, sums and ranges | `{2d6} shops` |
| `{N x List}` | N different items: a bullet list when alone on its line, "a, b and c" in a sentence | `{2-4 x Drinks}` |
| `## Size (d20)` then `- 1-2: Tiny` | a table rolled with its die | `{Size}` |
| `{Table + $x}` `{Table - 2}` | roll a table with a modifier, kept inside its first and last rows | `{Wealth + $wealth}` |
| `{Table with d4}` | roll a table with another die | `{Specialty with d4}` |
| `- Small: {1d8+4}` and `{List: key}` | look up a row by its key (`$x` works as the key) | `{Shop count: $size}` |
| `{$x = …}` `{$x += 2}` `{$x -= 2}` | remember a number or a result (prints nothing) | `{$size = Size}` |
| `{$x}` | print what was remembered | `Size: {$size}` |
| `{again}` | in a table row: roll the same table again | `- 20: {again} and {again}` |
| `\{` `\}` | a literal brace | |

Values from `$` belong to one result; `{@Key}` runs the other generator with its own values. Calls nest at most 10 deep and a repeat makes at most 100 items, so a mistake shows a message instead of freezing.

### Naming kits

Two ways to make names that sound like one people:

- **Sound templates**: lists of sounds joined by a pattern, such as `{C}{V}{C}{V}` with `fcg-capitalize: true`.
- **Learn from samples**: a list whose heading ends in `(learn)` holds at least 10 names you like. Picking from it makes a **new** name in the same style, never a copy of a sample. `(learn 4-9)` limits the length (default: your shortest to longest sample). Several names at once try to start with different letters.

The **Example naming kit** note (made with the generator folder) shows both. A language tool such as Vulgarlang can make word lists to take samples from.

### Copy to my folder

In the generator window, Drinks, Dungeons and labyrinths, Inns and taverns, Metals and Ship have **Copy to my folder**: it writes the generator as a note (using your current word lists) that you can edit, as `@DrinksCopy` and so on. The built-in one is unchanged.

### Show groups

**Settings › General › Show groups** hides groups you never use from the generator window and the `@` list. Their generators still work when a note or template calls them.

## Templater

Any plugin that runs JavaScript can use the generators. In a Templater template:

```
<%* tR += app.plugins.plugins["fantasy-content-generator"].api.generate("AshbornNames") %>
```

`api.generate(key)` takes any key that works inline (built-in or custom); `api.keys()` lists them.

## Custom Sources

In the settings of the plugin you will Find settings and options to add your own words and phrases to the generators, not all are added as of yet and there is no current plans to add more unless I get overwhelming requests for a particular one. The current Generators that can be customised are:

- loot generator
- Inn and Tavern generator
- Settlement Generator
- Drink Generator
- Currency.
- Dungeon Generator.

## Inline Generator

Names starting with what you type are listed first, followed by names that contain it anywhere (so `@lastname` works too). If the suggestions close or never appear, another plugin may also use `@` (for example Natural Language Dates); change the trigger in settings.

If you found yourself needing a quick name for an Elf or really wanting a quick dungeon description then look no further then the Inline generator. You can activate this by using the Callout token (Default is set to '@', can be changed in settings) and scrolling through the list of generators possible.

### Inline Example

![Example](Obsidian_mrGSNRjLpe.gif)

## Configuration

Below is a table for all the settings in this plugin
| Setting | Options |
| ------- | ------- |
| Reset | Click the Reset button to return to defaults |
| Import or export | Each section can be saved to a .json file and loaded in another vault |
| Call Out | Modify the call out used when using the inline Generator|
| Currency | Enable Currency use in generation, How often it occurs and add type of currency with rarity. |
| Settlements | Modify an Array of both Prefixed and Suffixes that can be used to generate settlements.|
| Inn & Taverns | Modify Arrays of Prefixes, Types, Nouns, Descriptions and Rumors that will generate for Inns and Taverns.|
| Drinks | Modify an array of both adjectives and nouns that will be used for the drinks generator |
| Loot | Modify an array of both adjectives and nouns that will be used for the loot generator |
| Dungeon | adjust the Adjectives, Nouns, Locations, Dungeon types and Random Descriptions used by the Dungeon Generator.|

## TO-DO

- ~~Add more settings to help build custom generation settings for vaults for certain generators; Generators included in this are the~~
  - ~~loot generator~~
  - ~~Inn and Tavern generator~~
  - ~~Settlement Generator~~
  - ~~Drink Generator~~
  - ~~Group Generator.~~
- ~~Randomization within a note.~~
- Rewrite the generators retired in 1.3.1 and 1.3.2:
  - Names: Aasimar, Catfolk, Fetchling, Half-elf, Half-orc, Hobgoblin, Ifrit, Kobold, Oread, Ratfolk, Sylph, Tengu, Tian, Tiefling, Undine
  - Airships, Artifacts, Animal groups, Magical trees, Trading post
  - Religion, Groups
- Possibly more Generation type.
- Better UI
- ~~JSON Import And Export~~

## Development

```bash
npm install
npm run dev     # rebuilds main.js on every change (put the repo in a vault's .obsidian/plugins folder)
npm run build   # type check and production build of main.js
npm run lint    # Obsidian's own lint rules (eslint-plugin-obsidianmd)
npm test        # unit tests
```