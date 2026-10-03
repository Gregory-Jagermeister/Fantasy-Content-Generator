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
| `{List}` | One item from the list under `## List` |
| `{A\|B}` | One item from either list |
| `- item \| 3` | That item is three times as likely |

Everything else in the note is ignored. Problems (a missing list, a key already in use) are listed in **Settings › Custom generators**.

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