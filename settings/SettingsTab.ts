import { App, Notice, Platform, PluginSettingTab, Setting } from "obsidian";
import type FantasyPlugin from "main";
import { currency } from "./Datatypes";
import { DEFAULT_SETTINGS } from "./DefaultSetting";
import { builtInGroups } from "generators/registry";
import { checkImport, parseJsonText, parseListInput, parseWeightedInput, WeightedItem } from "./settingsData";

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
}

const SECTIONS: SectionDef[] = [
    { key: "citySettings", label: "Settlements", file: "settlements", lists: [{ field: "prefixArray", label: "Prefixes" }, { field: "suffixArray", label: "Suffixes" }] },
    {
        key: "innSettings", label: "Inns and taverns", file: "inns", lists: [
            { field: "prefixes", label: "Prefixes" }, { field: "innType", label: "Types" }, { field: "nouns", label: "Nouns" },
            { field: "desc", label: "Descriptions" }, { field: "rumors", label: "Rumors" },
        ],
    },
    { key: "drinkSettings", label: "Drinks", file: "drinks", lists: [{ field: "adj", label: "Adjectives" }, { field: "nouns", label: "Nouns" }] },
    { key: "lootSettings", label: "Loot", file: "loot", lists: [{ field: "adj", label: "Adjectives" }, { field: "items", label: "Items", weighted: true }] },
    {
        key: "dungeonSettings", label: "Dungeons", file: "dungeons", lists: [
            { field: "adjectives", label: "Adjectives" }, { field: "nouns", label: "Nouns" }, { field: "locations", label: "Locations" },
            { field: "dungeonTypes", label: "Types" }, { field: "randomDesc", label: "Descriptors" },
        ],
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
    const a = createEl("a", { attr: { href: url, download: `fantasy-content-generator-${name}.json` } });
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export class SettingTab extends PluginSettingTab {
    plugin: FantasyPlugin;

    constructor(app: App, plugin: FantasyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    private save(): void {
        this.plugin.saveSettings().catch((e) => {
            console.error("Fantasy Content Generator: saving settings failed", e);
            new Notice("Couldn't save the settings.");
        });
    }

    /** Sections of the settings page, in order. */
    private sections(): { id: string; label: string; render: (el: HTMLElement) => void }[] {
        return [
            { id: "general", label: "General", render: (el) => this.generalSection(el) },
            { id: "custom", label: "Custom generators", render: (el) => this.customSection(el) },
            { id: "currency", label: "Currency", render: (el) => this.currencySection(el) },
            ...SECTIONS.map((def) => ({ id: def.key, label: def.label, render: (el: HTMLElement) => this.listSection(el, def) })),
        ];
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        const sections = this.sections();
        const current = sections.find((x) => x.id === this.plugin.settings.settingsSection) ?? sections[0];
        const choose = (id: string) => {
            this.plugin.settings.settingsSection = id;
            this.save();
            this.display();
        };

        // Tabs on desktop; a dropdown on phones and tablets.
        if (Platform.isMobile) {
            new Setting(containerEl).setName("Section").addDropdown((d) => {
                for (const x of sections) d.addOption(x.id, x.label);
                d.setValue(current.id).onChange(choose);
            });
        } else {
            const tabs = containerEl.createDiv({ cls: "fcg-tabs" });
            for (const x of sections) {
                const tab = tabs.createEl("button", { text: x.label, cls: "fcg-tab" });
                if (x.id === current.id) tab.addClass("is-active");
                tab.addEventListener("click", () => choose(x.id));
            }
        }
        current.render(containerEl.createDiv({ cls: "fcg-section" }));
    }

    private generalSection(el: HTMLElement): void {
        const s = this.plugin.settings;
        new Setting(el)
            .setName("Inline trigger")
            .setDesc("Type this, then a generator name, to insert a result while writing. Other plugins can use @ too; if suggestions close or never show, pick a different trigger such as ;;.")
            .addText((t) => t.setValue(s.inlineCallout).onChange((v) => {
                s.inlineCallout = v;
                this.save();
            }));
        new Setting(el)
            .setName("Default amount")
            .setDesc("How many results the generator window makes at first. It then remembers the last amount you used until Obsidian restarts.")
            .addText((t) => {
                t.inputEl.type = "number";
                t.setValue(String(s.defaultAmount)).onChange((v) => {
                    const n = Math.floor(Number(v));
                    if (Number.isFinite(n) && n >= 1 && n <= 50) {
                        s.defaultAmount = n;
                        this.plugin.lastAmount = null;
                        this.save();
                    }
                });
            });
        new Setting(el).setName("Show groups").setDesc("Hidden groups leave the generator window and the inline list. Their generators still work when a note or template calls them.").setHeading();
        for (const group of builtInGroups()) {
            new Setting(el).setName(group).addToggle((t) => t.setValue(!s.hiddenGroups.includes(group)).onChange((show) => {
                s.hiddenGroups = show ? s.hiddenGroups.filter((g) => g !== group) : [...s.hiddenGroups, group];
                this.save();
            }));
        }
        new Setting(el)
            .setName("Reset to defaults")
            .setDesc("Put every word list and option back to how the plugin ships. Your custom generator notes are not touched.")
            .addButton((b) => b.setButtonText("Reset").setWarning().onClick(() => {
                this.plugin.resetSettings().then(() => this.display()).catch((e) => console.error(e));
            }));
    }

    private customSection(el: HTMLElement): void {
        const s = this.plugin.settings;
        const store = this.plugin.customs;
        new Setting(el)
            .setName("Generator folder")
            .setDesc("Notes in this folder (and its subfolders) with fcg-generator in their properties become generators.")
            .addText((t) => t.setPlaceholder("Generators").setValue(s.generatorFolder).onChange((v) => {
                s.generatorFolder = v.trim();
                this.save();
                store.scheduleReload();
            }));
        new Setting(el)
            .setName("New generator")
            .setDesc("Creates the folder (with an example) the first time, then a starter note to fill in.")
            .addButton((b) => b.setButtonText("New generator").setCta().onClick(() => {
                void this.plugin.newGenerator();
            }));
        new Setting(el)
            .setName("Refresh")
            .setDesc("Generators update by themselves when their notes change. Use this if something looks out of date.")
            .addButton((b) => b.setButtonText("Refresh").onClick(() => {
                store.reload().then(() => this.display()).catch((e) => console.error(e));
            }));

        new Setting(el).setName(`Found (${store.all.length})`).setHeading();
        if (!store.all.length) {
            el.createEl("p", { text: "No generator notes yet.", cls: "setting-item-description" });
            return;
        }
        for (const g of store.all) {
            const active = store.active.get(g.key) === g;
            const item = new Setting(el)
                .setName(active ? `@${g.key}` : `@${g.key} (not in use)`)
                .setDesc(`${g.name} · ${g.path}`);
            if (g.problems.length) {
                const list = item.descEl.createEl("ul", { cls: "fcg-problems" });
                for (const p of g.problems) list.createEl("li", { text: p });
            }
        }
    }

    /** Import and export buttons for one part of the settings. */
    private importExport(el: HTMLElement, name: string, get: () => unknown, defaults: unknown, apply: (data: unknown) => void): void {
        const input = el.createEl("input", { cls: "fcg-hidden-input", attr: { type: "file", accept: ".json,application/json" } });
        input.addEventListener("change", () => {
            const file = input.files?.[0];
            input.value = "";
            if (!file) return;
            readPickedFile(file)
                .then((text) => {
                    const data = parseJsonText(text);
                    const problem = checkImport(defaults, data);
                    if (problem) throw new Error(`This file doesn't fit: ${problem}.`);
                    apply(data);
                    this.save();
                    this.display();
                    new Notice("Imported.");
                })
                .catch((e) => new Notice(`Import failed. ${e instanceof Error ? e.message : String(e)}`));
        });
        new Setting(el)
            .setName("Import or export")
            .setDesc("Share these lists between vaults as a .json file.")
            .addButton((b) => b.setButtonText("Import").onClick(() => input.click()))
            .addButton((b) => b.setButtonText("Export").onClick(() => downloadJson(get(), name)));
    }

    private currencySection(containerEl: HTMLElement): void {
        const s = this.plugin.settings;
        new Setting(containerEl)
            .setName("Add currency to loot")
            .setDesc("Loot sometimes includes coins from the list below.")
            .addToggle((t) => t.setValue(s.enableCurrency).onChange((v) => {
                s.enableCurrency = v;
                this.save();
                this.display();
            }));
        if (!s.enableCurrency) return;

        new Setting(containerEl)
            .setName("How often")
            .setDesc("Chance (0 to 100) that a loot roll includes currency.")
            .addText((t) => t.setValue(String(s.currencyFrequency)).onChange((v) => {
                const n = Number(v);
                if (Number.isFinite(n) && n >= 0 && n <= 100) {
                    s.currencyFrequency = n;
                    this.save();
                }
            }));

        this.importExport(containerEl, "currency", () => s.currencyTypes, DEFAULT_SETTINGS.currencyTypes, (data) => {
            s.currencyTypes = (data as currency[]).filter((c) => typeof c?.name === "string");
        });

        const draft: currency = { name: "", rarity: "common" };
        new Setting(containerEl)
            .setName("New currency")
            .addText((t) => t.setPlaceholder("Gold pieces").onChange((v) => { draft.name = v.trim(); }))
            .addDropdown((d) => d
                .addOption("common", "Common").addOption("uncommon", "Uncommon").addOption("rare", "Rare").addOption("rarest", "Rarest")
                .onChange((v) => { draft.rarity = v; }))
            .addButton((b) => b.setButtonText("Add").setCta().onClick(() => {
                if (!draft.name) return;
                s.currencyTypes.push({ ...draft });
                this.save();
                this.display();
            }));

        const details = containerEl.createEl("details", { cls: "fcg-details" });
        details.createEl("summary", { text: `Currencies (${s.currencyTypes.length})`, cls: "fcg-summary" });
        s.currencyTypes.forEach((c, i) => {
            new Setting(details).setName(c.name).setDesc(c.rarity).addButton((b) => b.setButtonText("Remove").onClick(() => {
                s.currencyTypes.splice(i, 1);
                this.save();
                this.display();
            }));
        });
    }

    private listSection(containerEl: HTMLElement, def: SectionDef): void {
        const settings = this.plugin.settings as unknown as Record<SectionKey, Record<string, unknown[]>>;
        const defaults = DEFAULT_SETTINGS as unknown as Record<SectionKey, Record<string, unknown[]>>;
        this.importExport(containerEl, def.file, () => settings[def.key], defaults[def.key], (data) => {
            settings[def.key] = data as Record<string, unknown[]>;
        });
        for (const list of def.lists) this.listBlock(containerEl, settings[def.key], list);
    }

    private listBlock(containerEl: HTMLElement, section: Record<string, unknown[]>, list: ListDef): void {
        const items = section[list.field] ?? (section[list.field] = []);
        let draft = "";
        new Setting(containerEl)
            .setName(`Add ${list.label.toLowerCase()}`)
            .setDesc(list.weighted
                ? "One per line as name | weight (higher weight = more common), for example: Sword | 3."
                : "One per line, or several on one line separated by commas.")
            .addTextArea((t) => t.onChange((v) => { draft = v; }))
            .addButton((b) => b.setButtonText("Add").setCta().onClick(() => {
                const added: unknown[] = list.weighted ? parseWeightedInput(draft) : parseListInput(draft);
                if (!added.length) return;
                items.push(...added);
                this.save();
                this.display();
            }));

        const details = containerEl.createEl("details", { cls: "fcg-details" });
        details.createEl("summary", { text: `${list.label} (${items.length})`, cls: "fcg-summary" });
        items.forEach((item, i) => {
            const label = list.weighted ? `${(item as WeightedItem).item} (weight ${(item as WeightedItem).weight})` : String(item);
            new Setting(details).setName(label).addButton((b) => b.setButtonText("Remove").onClick(() => {
                items.splice(i, 1);
                this.save();
                this.display();
            }));
        });
    }
}

