import { App, Modal, Notice, PluginSettingTab, Setting, SettingDefinitionItem, SettingDefinitionList } from "obsidian";
import type FantasyPlugin from "main";
import { currency } from "./Datatypes";
import { DEFAULT_SETTINGS } from "./DefaultSetting";
import { builtInGroups } from "generators/registry";
import { checkImport, parseJsonText, WeightedItem } from "./settingsData";
import { GROUP_KEY, addWords, matchesFilter, wordLabel } from "./settingsModel";

type SectionKey = "citySettings" | "innSettings" | "drinkSettings" | "lootSettings" | "dungeonSettings";

interface ListDef {
    /** Field name inside the section */
    field: string;
    label: string;
    /** Loot items carry a weight ("Sword | 3") */
    weighted?: boolean;
}

interface SectionDef {
    key: SectionKey;
    label: string;
    file: string;
    lists: ListDef[];
    /** One line at the top of the tab showing how the lists make a result (1.6.0, M5) */
    example?: string;
}

const SECTIONS: SectionDef[] = [
    { key: "citySettings", label: "Settlements", file: "settlements", lists: [{ field: "prefixArray", label: "Prefixes" }, { field: "suffixArray", label: "Suffixes" }], example: "Town names mix three shapes: prefix + suffix (Red + ford = Redford), made-up sounds + suffix (Bakoford), or prefix + made-up (North Bako)." },
    {
        key: "innSettings", label: "Inns and taverns", file: "inns", lists: [
            { field: "prefixes", label: "Prefixes" }, { field: "innType", label: "Types" }, { field: "nouns", label: "Nouns" },
            { field: "desc", label: "Descriptions" }, { field: "rumors", label: "Rumors" },
        ],
        example: "Inn names are prefix + noun + type: Silver + Goblin + Tavern = Silver Goblin Tavern. Each inn also gets one description and three rumours.",
    },
    { key: "drinkSettings", label: "Drinks", file: "drinks", lists: [{ field: "adj", label: "Adjectives" }, { field: "nouns", label: "Nouns" }], example: "Drinks are one or two adjectives + a noun: Ancient + Ale = Ancient Ale." },
    { key: "lootSettings", label: "Loot", file: "loot", lists: [{ field: "adj", label: "Adjectives" }, { field: "items", label: "Items", weighted: true }], example: "Each roll gives 1 to 5 items, adjective + item: a rusty sword. Items with a higher weight come up more often." },
    {
        key: "dungeonSettings", label: "Dungeons", file: "dungeons", lists: [
            { field: "adjectives", label: "Adjectives" }, { field: "nouns", label: "Nouns" }, { field: "locations", label: "Locations" },
            { field: "dungeonTypes", label: "Types" }, { field: "randomDesc", label: "Descriptors" },
        ],
        example: "Names are \"Type of the Adjective Noun\" or \"The Adjective Noun\": Crypt of the Haunted Wraith. The description adds a location and a descriptor.",
    },
];

/** Read a file the user picked (works on desktop and phone). */
function readPickedFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
        reader.onerror = () => reject(new Error("The file couldn't be read."));
        reader.readAsText(file);
    });
}

/** Offer some data as a .json download. */
function downloadJson(data: unknown, name: string): void {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = createEl("a", { attr: { href: url, download: `ttrpg-content-generator-${name}.json` } });
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Pick a .json file and read it (works on desktop and phone). */
function pickJson(onText: (text: string) => void): void {
    const input = createEl("input", { attr: { type: "file", accept: ".json,application/json" } });
    input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file) return;
        readPickedFile(file).then(onText).catch((e) => new Notice(`Import failed. ${e instanceof Error ? e.message : String(e)}`));
    });
    input.click();
}

/** A small window to paste words into a list: one per line, or comma separated (loot: name | weight). */
class AddWordsModal extends Modal {
    constructor(app: App, private readonly title: string, private readonly weighted: boolean, private readonly onAdd: (text: string) => void) {
        super(app);
    }

    onOpen(): void {
        this.setTitle(this.title);
        let text = "";
        new Setting(this.contentEl)
            .setDesc(this.weighted ? "One per line as name | weight (higher weight = more common), for example: Sword | 3." : "One per line, or several on one line separated by commas.")
            .addTextArea((t) => {
                t.inputEl.rows = 6;
                t.inputEl.addClass("fcg-add-words");
                t.onChange((v) => { text = v; });
                window.setTimeout(() => t.inputEl.focus(), 0);
            });
        new Setting(this.contentEl).addButton((b) => b.setButtonText("Add").setCta().onClick(() => {
            this.onAdd(text);
            this.close();
        }));
    }

    onClose(): void {
        this.contentEl.empty();
    }
}

/** A small window to add a currency: its name and how rare it is. */
class AddCurrencyModal extends Modal {
    constructor(app: App, private readonly onAdd: (c: currency) => void) {
        super(app);
    }

    onOpen(): void {
        this.setTitle("Add a currency");
        const draft: currency = { name: "", rarity: "common" };
        new Setting(this.contentEl).setName("Name").addText((t) => t.setPlaceholder("Gold pieces").onChange((v) => { draft.name = v.trim(); }));
        new Setting(this.contentEl).setName("Rarity").addDropdown((d) => d
            .addOption("common", "Common").addOption("uncommon", "Uncommon").addOption("rare", "Rare").addOption("rarest", "Rarest")
            .setValue("common").onChange((v) => { draft.rarity = v; }));
        new Setting(this.contentEl).addButton((b) => b.setButtonText("Add").setCta().onClick(() => {
            if (!draft.name) { new Notice("Give the currency a name."); return; }
            this.onAdd({ ...draft });
            this.close();
        }));
    }

    onClose(): void {
        this.contentEl.empty();
    }
}

/**
 * Settings (1.6.1): described with Obsidian's settings definitions, so every setting shows up in Obsidian's
 * settings search. Word lists are pages with a filter box; their words stay out of the search (Decisions.md 2026-10-06).
 */
export class SettingTab extends PluginSettingTab {
    plugin: FantasyPlugin;

    constructor(app: App, plugin: FantasyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    private save(): void {
        this.plugin.saveSettings().catch((e) => {
            console.error("TTRPG Content Generator: saving settings failed", e);
            new Notice("Couldn't save the settings.");
        });
    }

    /** Save, then rebuild the settings (lists grew or shrank). */
    private changed(): void {
        this.save();
        this.update();
    }

    getControlValue(key: string): unknown {
        const s = this.plugin.settings;
        if (key.startsWith(GROUP_KEY)) return !s.hiddenGroups.includes(key.slice(GROUP_KEY.length));
        return (s as unknown as Record<string, unknown>)[key];
    }

    async setControlValue(key: string, value: unknown): Promise<void> {
        const s = this.plugin.settings;
        if (key.startsWith(GROUP_KEY)) {
            const group = key.slice(GROUP_KEY.length);
            s.hiddenGroups = value ? s.hiddenGroups.filter((g) => g !== group) : [...s.hiddenGroups.filter((g) => g !== group), group];
        } else {
            (s as unknown as Record<string, unknown>)[key] = typeof value === "string" ? value.trim() : value;
        }
        if (key === "defaultAmount") this.plugin.lastAmount = null;
        await this.plugin.saveSettings();
        if (key === "generatorFolder") this.plugin.customs.scheduleReload();
        if (key === "enableCurrency") this.refreshDomState();
        if (key.startsWith(GROUP_KEY)) this.plugin.refreshPanels();
    }

    getSettingDefinitions(): SettingDefinitionItem[] {
        return [
            {
                name: "Inline trigger",
                desc: "Type this, then a generator name, to insert a result while writing. Other plugins can use @ too; if suggestions close or never show, pick a different trigger such as ;;.",
                aliases: ["callout", "@"],
                control: { type: "text", key: "inlineCallout", placeholder: "@", validate: (v) => (v.trim() ? undefined : "The trigger can't be empty.") },
            },
            {
                name: "Default amount",
                desc: "How many results the generator panel makes at first (1 to 50). It then remembers the last amount you used until Obsidian restarts.",
                control: { type: "number", key: "defaultAmount", min: 1, max: 50, step: 1, validate: (v) => (Number.isInteger(v) && v >= 1 && v <= 50 ? undefined : "Use a whole number from 1 to 50.") },
            },
            {
                type: "group",
                heading: "Show groups",
                items: [
                    { name: "Turn a group off to hide it", desc: "Hidden groups leave the generator panel and the @ list. Their generators still work when a note or template calls them." },
                    ...builtInGroups().map((group) => ({ name: group, control: { type: "toggle" as const, key: `${GROUP_KEY}${group}` } })),
                ],
            },
            this.customPage(),
            this.currencyPage(),
            ...SECTIONS.map((def) => this.wordsPage(def)),
            {
                name: "Reset to defaults",
                desc: "Put every word list and option back to how the plugin ships. Your generator notes are not touched.",
                render: (setting) => {
                    setting.addButton((b) => b.setButtonText("Reset").setDestructive().onClick(() => {
                        this.plugin.resetSettings().then(() => this.update()).catch((e) => console.error(e));
                    }));
                },
            },
        ];
    }

    /* ---------- Custom generators ---------- */

    private customPage(): SettingDefinitionItem {
        const store = this.plugin.customs;
        return {
            type: "page",
            name: "Custom generators",
            desc: "Your generator notes, starter sets and the village example.",
            displayValue: () => `${store.all.length} found`,
            status: () => (store.all.some((g) => g.problems.length) ? "warning" : null),
            items: [
                {
                    name: "Generator folder",
                    desc: "Notes in this folder (and its subfolders) with fcg-generator in their properties become generators.",
                    control: { type: "folder", key: "generatorFolder", placeholder: "Generators" },
                },
                { name: "New generator", desc: "Creates the folder (with an example) the first time, then a starter note to fill in.", action: () => { void this.plugin.newGenerator(); } },
                { name: "Add a starter set", desc: "A ready-made name set for a race or human culture. Your own notes are never overwritten.", aliases: ["names"], action: () => this.plugin.openStarters() },
                { name: "Add the village example", desc: "Village, building and owner generators that pass values to each other (see the wiki's Build a village page).", action: () => { void this.plugin.addVillageExample(); } },
                {
                    name: "Refresh",
                    desc: "Generators update by themselves when their notes change. Use this if something looks out of date.",
                    action: () => { store.reload().then(() => this.update()).catch((e) => console.error(e)); },
                },
                {
                    type: "list",
                    heading: `Found (${store.all.length})`,
                    emptyState: "No generator notes yet.",
                    items: store.all.map((g) => {
                        const active = store.active.get(g.key) === g;
                        const desc = createFragment((f) => {
                            f.appendText(`${g.name} · ${g.path}${active && g.twinKey ? ` · with meanings: @${g.twinKey}` : ""}`);
                            if (g.problems.length) {
                                const ul = f.createEl("ul", { cls: "fcg-problems" });
                                for (const p of g.problems) ul.createEl("li", { text: p });
                            }
                        });
                        return { name: active ? `@${g.key}` : `@${g.key} (not in use)`, desc, searchable: false };
                    }),
                },
            ],
        };
    }

    /* ---------- Currency ---------- */

    private currencyPage(): SettingDefinitionItem {
        const s = this.plugin.settings;
        const on = () => s.enableCurrency;
        const list: SettingDefinitionList = {
            type: "list",
            heading: `Currencies (${s.currencyTypes.length})`,
            visible: on,
            emptyState: "No currencies yet.",
            onDelete: (i) => { s.currencyTypes.splice(i, 1); this.changed(); },
            onReorder: (from, to) => { const [c] = s.currencyTypes.splice(from, 1); s.currencyTypes.splice(to, 0, c); this.changed(); },
            addItem: { name: "Add a currency", action: () => new AddCurrencyModal(this.app, (c) => { s.currencyTypes.push(c); this.changed(); }).open() },
            items: s.currencyTypes.map((c) => ({ name: c.name, desc: c.rarity, searchable: false })),
        };
        return {
            type: "page",
            name: "Currency",
            desc: "Coins that loot can include.",
            displayValue: () => (s.enableCurrency ? "On" : "Off"),
            items: [
                { name: "Add currency to loot", desc: "Loot sometimes includes coins from the list below.", control: { type: "toggle", key: "enableCurrency" } },
                {
                    name: "How often",
                    desc: "Chance (0 to 100) that a loot roll includes currency.",
                    visible: on,
                    control: { type: "number", key: "currencyFrequency", min: 0, max: 100, step: 1, validate: (v) => (v >= 0 && v <= 100 ? undefined : "Use a number from 0 to 100.") },
                },
                ...this.importExport("currency", () => s.currencyTypes, DEFAULT_SETTINGS.currencyTypes, (data) => {
                    s.currencyTypes = (data as currency[]).filter((c) => typeof c?.name === "string");
                }, on),
                list,
            ],
        };
    }

    /* ---------- Word lists ---------- */

    private wordsPage(def: SectionDef): SettingDefinitionItem {
        const settings = this.plugin.settings as unknown as Record<SectionKey, Record<string, unknown[]>>;
        const defaults = DEFAULT_SETTINGS as unknown as Record<SectionKey, Record<string, unknown[]>>;
        const section = settings[def.key];
        return {
            type: "page",
            name: def.label,
            desc: def.example ?? `The word lists the ${def.label.toLowerCase()} generator uses.`,
            items: [
                ...this.importExport(def.file, () => settings[def.key], defaults[def.key], (data) => {
                    settings[def.key] = data as Record<string, unknown[]>;
                }),
                ...def.lists.flatMap((list) => [this.filterRow(`${def.key}.${list.field}`, list.label), this.wordList(section, list, `${def.key}.${list.field}`)]),
            ],
        };
    }

    /** What each word list is filtered by (kept while the settings are open). */
    private readonly filters = new Map<string, string>();

    /**
     * A filter box above a word list. Obsidian's own list filter skips rows kept out of settings search, so the
     * rows are shown or hidden here instead (Decisions.md 2026-10-06: words stay out of search).
     */
    private filterRow(id: string, label: string): SettingDefinitionItem {
        return {
            name: `Filter ${label.toLowerCase()}`,
            searchable: false,
            render: (setting) => {
                setting.addSearch((c) => c.setPlaceholder("Type to filter").setValue(this.filters.get(id) ?? "").onChange((v) => {
                    this.filters.set(id, v);
                    this.refreshDomState();
                }));
            },
        };
    }

    private wordList(section: Record<string, unknown[]>, list: ListDef, id: string): SettingDefinitionList {
        const items = section[list.field] ?? (section[list.field] = []);
        const shown = (name: string) => () => matchesFilter(name, this.filters.get(id) ?? "");
        return {
            type: "list",
            heading: `${list.label} (${items.length})`,
            emptyState: "This list is empty, so its generator will show a message instead of a result.",
            onDelete: (i) => { items.splice(i, 1); this.changed(); },
            addItem: {
                name: `Add ${list.label.toLowerCase()}`,
                action: () => new AddWordsModal(this.app, `Add ${list.label.toLowerCase()}`, !!list.weighted, (text) => {
                    if (addWords(items, text, !!list.weighted)) this.changed();
                }).open(),
            },
            items: items.map((item) => {
                const name = wordLabel(item as string | WeightedItem);
                return { name, searchable: false, visible: shown(name) };
            }),
        };
    }

    /* ---------- Import and export ---------- */

    private importExport(name: string, get: () => unknown, defaults: unknown, apply: (data: unknown) => void, visible?: () => boolean): SettingDefinitionItem[] {
        return [
            {
                name: "Import from a file",
                desc: "Load these lists from a .json file exported from another vault.",
                visible,
                action: () => pickJson((text) => {
                    try {
                        const data = parseJsonText(text);
                        const problem = checkImport(defaults, data);
                        if (problem) throw new Error(`This file doesn't fit: ${problem}.`);
                        apply(data);
                        this.changed();
                        new Notice("Imported.");
                    } catch (e) {
                        new Notice(`Import failed. ${e instanceof Error ? e.message : String(e)}`);
                    }
                }),
            },
            { name: "Export to a file", desc: "Save these lists as a .json file to use in another vault.", visible, action: () => downloadJson(get(), name) },
        ];
    }
}
