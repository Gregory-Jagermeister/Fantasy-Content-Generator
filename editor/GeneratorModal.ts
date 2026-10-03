import { App, Modal, Notice, Setting } from "obsidian";
import type FantasyPlugin from "main";
import { GENERATORS, Gender, Generated, RACES, raceName } from "generators/registry";
import { COPYABLE } from "generators/copies";

/** Most results generated in one go. */
const MAX_AMOUNT = 50;

interface Row {
    result: Generated;
    selected: boolean;
}

/** Pick a generator, generate one or more results, tick the ones you want and copy them. */
export class GeneratorModal extends Modal {
    private readonly plugin: FantasyPlugin;
    private readonly onCopy: (text: string) => void;
    private rows: Row[] = [];
    private amount = 1;
    private gender: Gender = "male";
    private withFamily = false;

    constructor(app: App, plugin: FantasyPlugin, onCopy: (text: string) => void) {
        super(app);
        this.plugin = plugin;
        this.onCopy = onCopy;
    }

    onOpen(): void {
        const { contentEl } = this;
        this.titleEl.setText("Let's generate!");
        contentEl.createEl("p", { text: "Pick a generator, choose how many, then tick the results you want to copy." });

        const select = contentEl.createEl("select", { cls: "dropdown fcg-generator-select" });
        select.createEl("option", { text: "Select a generator to start", value: "" });
        const groups = new Map<string, HTMLOptGroupElement>();
        const group = (label: string) => {
            let g = groups.get(label);
            if (!g) { g = select.createEl("optgroup", { attr: { label } }); groups.set(label, g); }
            return g;
        };
        for (const g of GENERATORS) if (!this.plugin.isGroupHidden(g.group)) group(g.group).createEl("option", { text: g.label, value: `gen:${g.key}` });
        if (!this.plugin.isGroupHidden("Names")) for (const r of RACES) group("Names").createEl("option", { text: r.label, value: `race:${r.key}` });
        for (const c of this.plugin.customs.active.values()) group("Custom").createEl("option", { text: c.name, value: `custom:${c.key}` });

        const optionsEl = contentEl.createDiv();
        select.addEventListener("change", () => this.showOptions(optionsEl, select.value));
    }

    private showOptions(el: HTMLElement, choice: string): void {
        el.empty();
        this.rows = [];
        this.amount = this.startAmount();
        if (!choice) return;

        const kind = choice.slice(0, choice.indexOf(":"));
        const key = choice.slice(choice.indexOf(":") + 1);
        const race = kind === "race" ? RACES.find((r) => r.key === key) : undefined;
        const gen = kind === "gen" ? GENERATORS.find((g) => g.key === key) : undefined;
        const custom = kind === "custom" ? this.plugin.customs.active.get(key) : undefined;
        const settings = this.plugin.settings;
        const plain = (text: string): Generated => ({ title: text.split("\n")[0], text });
        const one: (() => Generated) | undefined = race
            ? () => plain(raceName(race, this.gender, this.withFamily))
            : gen ? () => gen.run(settings)
            : custom ? () => plain(this.plugin.generate(custom.key)) : undefined;
        if (!one) return;

        if (race) {
            new Setting(el).setName("Options").setHeading();
            this.gender = "male";
            this.withFamily = false;
            new Setting(el).setName("Gender").addDropdown((d) => d
                .addOption("male", "Male").addOption("female", "Female")
                .setValue(this.gender)
                .onChange((v) => { this.gender = v === "female" ? "female" : "male"; }));
            new Setting(el).setName("Family name").addToggle((t) => t.setValue(false).onChange((v) => { this.withFamily = v; }));
        }

        const listEl = createDiv();
        new Setting(el)
            .setName("Amount")
            .setDesc(`How many to generate (1 to ${MAX_AMOUNT}).`)
            .addText((t) => {
                t.inputEl.type = "number";
                t.setValue(String(this.amount)).onChange((v) => {
                    const n = Math.floor(Number(v));
                    this.amount = Number.isFinite(n) ? Math.min(Math.max(n, 1), MAX_AMOUNT) : 1;
                    this.plugin.lastAmount = this.amount;
                });
            })
            .addButton((b) => b.setButtonText("Generate").setCta().onClick(() => {
                try {
                    const firsts = new Set<string>();
                    for (let i = 0; i < this.amount; i++) {
                        // Variety: try a few times for a result that starts with a letter not used yet in this batch.
                        let result = one();
                        for (let tries = 0; tries < 5 && firsts.has(result.title.charAt(0).toLowerCase()); tries++) result = one();
                        firsts.add(result.title.charAt(0).toLowerCase());
                        this.rows.push({ result, selected: true });
                    }
                } catch (e) {
                    new Notice(`Couldn't generate: ${e instanceof Error ? e.message : String(e)}`);
                }
                this.renderRows(listEl);
            }))
            .addButton((b) => b.setButtonText("Copy").onClick(() => this.copySelected()));
        if (gen && COPYABLE[gen.key]) {
            new Setting(el)
                .setName("Make it your own")
                .setDesc("Copy this generator into your generator folder as a note you can edit. The built-in one stays as it is.")
                .addButton((b) => b.setButtonText("Copy to my folder").onClick(() => {
                    this.close();
                    void this.plugin.copyBuiltIn(gen.key);
                }));
        }
        el.appendChild(listEl);
    }

    /** Last amount used this session, else the Default amount setting. */
    private startAmount(): number {
        const n = this.plugin.lastAmount ?? this.plugin.settings.defaultAmount;
        return Number.isFinite(n) ? Math.min(Math.max(Math.floor(n), 1), MAX_AMOUNT) : 1;
    }

    private renderRows(listEl: HTMLElement): void {
        listEl.empty();
        for (const row of this.rows) {
            new Setting(listEl).setName(row.result.title).addToggle((t) => t.setValue(row.selected).onChange((v) => { row.selected = v; }));
        }
    }

    private copySelected(): void {
        const chosen = this.rows.filter((r) => r.selected).map((r) => r.result.text);
        if (!chosen.length) {
            new Notice("Nothing is selected to copy.");
            return;
        }
        this.close();
        this.onCopy(chosen.join("\n\n"));
    }

    onClose(): void {
        this.contentEl.empty();
    }
}
