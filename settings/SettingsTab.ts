import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import type FantasyPlugin from "main";
import { currency } from "./Datatypes";
import { DEFAULT_SETTINGS } from "./DefaultSetting";
import { checkImport, parseJsonText, parseListInput, parseWeightedInput, WeightedItem } from "./settingsData";

type SectionKey = "citySettings" | "innSettings" | "drinkSettings" | "lootSettings" | "groupSettings" | "dungeonSettings";

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
        key: "groupSettings", label: "Groups", file: "groups", lists: [
            { field: "adj", label: "Adjectives" }, { field: "nouns", label: "Nouns" }, { field: "nounsP", label: "Plural nouns" },
            { field: "groupTypes", label: "Types" }, { field: "singleDescriptors", label: "Descriptors" },
        ],
    },
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

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName("Reset to defaults")
            .setDesc("Put every word list and option back to how the plugin ships.")
            .addButton((b) => b.setButtonText("Reset").setWarning().onClick(() => {
                this.plugin.resetSettings().then(() => this.display()).catch((e) => console.error(e));
            }));

        new Setting(containerEl)
            .setName("Inline trigger")
            .setDesc("Type this, then a generator name, to insert a result while writing.")
            .addText((t) => t.setValue(this.plugin.settings.inlineCallout).onChange((v) => {
                this.plugin.settings.inlineCallout = v;
                this.save();
            }));

        this.currencySection(containerEl);
        for (const section of SECTIONS) this.listSection(containerEl, section);
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
        new Setting(containerEl).setName("Currency").setHeading();
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
        new Setting(containerEl).setName(def.label).setHeading();
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

