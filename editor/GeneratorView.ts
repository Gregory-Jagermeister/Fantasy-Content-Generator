/* The generator side panel (1.6.0, replaces the generator window).
   Layout (Decisions.md 2026-10-06): pinned and recent generators, a search picker, amount + Generate,
   toggles that apply, results (lines for one-line results, blocks for longer ones) with Insert and Copy
   on each, then "Make it your own" and "Add a starter set…". */
import { AbstractInputSuggest, App, ItemView, MarkdownRenderer, Notice, WorkspaceLeaf, setIcon } from "obsidian";
import type FantasyPlugin from "main";
import { GENERATORS, Generated } from "generators/registry";
import { COPYABLE } from "generators/copies";
import { PanelEntry, isMultiLine, joinResults, pushRecent, searchEntries, togglePin } from "editor/panelModel";

export const VIEW_TYPE_GENERATOR = "fcg-generator-panel";

/** Most results generated in one go. */
const MAX_AMOUNT = 50;
/** Blocks longer than this (lines, or characters for long wrapped lines) fold behind "Show more". */
const FOLD_LINES = 4;
const FOLD_CHARS = 280;

/** One result in the panel; `error` instead of text when the generator failed. */
export interface PanelResult {
    title: string;
    text: string;
    error?: boolean;
}

/** What the panel shows; kept on the plugin so it survives the panel being closed and reopened. */
export interface PanelState {
    key: string;
    results: PanelResult[];
    meanings: boolean;
    keep: boolean;
}

export class GeneratorView extends ItemView {
    private readonly plugin: FantasyPlugin;
    private quickEl!: HTMLElement;
    private bodyEl!: HTMLElement;
    private search!: HTMLInputElement;

    constructor(leaf: WorkspaceLeaf, plugin: FantasyPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_GENERATOR;
    }

    getDisplayText(): string {
        return "Generator";
    }

    getIcon(): string {
        return "dices";
    }

    async onOpen(): Promise<void> {
        const root = this.contentEl;
        root.empty();
        root.addClass("fcg-panel");
        this.quickEl = root.createDiv({ cls: "fcg-panel-quick" });
        const pick = root.createDiv({ cls: "fcg-panel-pick" });
        this.search = pick.createEl("input", { type: "search", cls: "fcg-panel-search", attr: { placeholder: "Find a generator…", "aria-label": "Find a generator" } });
        new EntrySuggest(this.app, this.search, this.plugin, (entry) => this.choose(entry));
        this.bodyEl = root.createDiv({ cls: "fcg-panel-body" });
        this.render();
    }

    async onClose(): Promise<void> {
        this.contentEl.empty();
    }

    /** Redraw everything from the plugin's panel state (call after the generator list changes). */
    render(): void {
        if (!this.bodyEl) return;
        this.renderQuick();
        const entry = this.currentEntry();
        this.search.value = entry?.label ?? "";
        this.renderBody(entry);
    }

    private get state(): PanelState {
        return this.plugin.panelState;
    }

    private currentEntry(): PanelEntry | undefined {
        return this.state.key ? this.plugin.panelEntries().find((e) => e.key === this.state.key) : undefined;
    }

    private choose(entry: PanelEntry): void {
        if (entry.kind === "addStarter") {
            this.search.value = "";
            this.plugin.openStarters();
            return;
        }
        if (entry.key !== this.state.key) {
            this.state.key = entry.key;
            if (!this.state.keep) this.state.results = [];
        }
        this.render();
    }

    /* ---------- quick row: pinned, then recent ---------- */

    private renderQuick(): void {
        const el = this.quickEl;
        el.empty();
        const entries = new Map(this.plugin.panelEntries().map((e) => [e.key, e]));
        const pins = this.plugin.settings.pinnedGenerators.filter((k) => entries.has(k));
        const recent = this.plugin.settings.recentGenerators.filter((k) => entries.has(k) && !pins.includes(k));
        el.toggleClass("fcg-hidden", !pins.length && !recent.length);
        const chip = (key: string, icon: string, what: string) => {
            const e = entries.get(key);
            if (!e) return;
            const b = el.createEl("button", { cls: "fcg-chip", attr: { "aria-label": `${what}: ${e.label}` } });
            if (key === this.state.key) b.addClass("is-active");
            setIcon(b.createSpan({ cls: "fcg-chip-icon" }), icon);
            b.createSpan({ text: e.label });
            b.addEventListener("click", () => this.choose(e));
        };
        for (const k of pins) chip(k, "star", "Pinned");
        for (const k of recent) chip(k, "history", "Recent");
    }

    /* ---------- controls, results, footer ---------- */

    private renderBody(entry: PanelEntry | undefined): void {
        const el = this.bodyEl;
        el.empty();
        if (!entry) {
            el.createDiv({ cls: "fcg-panel-hint", text: "Pick a generator above, or type to find one." });
            this.renderFooter(el, undefined);
            return;
        }

        const head = el.createDiv({ cls: "fcg-panel-chosen" });
        head.createSpan({ cls: "fcg-panel-chosen-name", text: entry.label });
        head.createSpan({ cls: "fcg-panel-chosen-group", text: entry.group });
        const pinned = this.plugin.settings.pinnedGenerators.includes(entry.key);
        const pin = head.createEl("button", { cls: "clickable-icon fcg-pin", attr: { "aria-label": pinned ? "Unpin" : "Pin to the top" } });
        setIcon(pin, pinned ? "star-off" : "star");
        pin.addEventListener("click", () => {
            this.plugin.settings.pinnedGenerators = togglePin(this.plugin.settings.pinnedGenerators, entry.key);
            void this.plugin.saveSettings();
            this.render();
        });

        const controls = el.createDiv({ cls: "fcg-panel-controls" });
        const amountLabel = controls.createEl("label", { cls: "fcg-panel-amount" });
        amountLabel.createSpan({ text: "Amount" });
        const amount = amountLabel.createEl("input", { type: "number", attr: { min: "1", max: String(MAX_AMOUNT), "aria-label": "Amount" } });
        amount.value = String(this.startAmount());
        amount.addEventListener("change", () => {
            const n = Math.floor(Number(amount.value));
            this.plugin.lastAmount = Number.isFinite(n) ? Math.min(Math.max(n, 1), MAX_AMOUNT) : 1;
            amount.value = String(this.plugin.lastAmount);
        });
        const go = controls.createEl("button", { cls: "mod-cta", text: "Generate" });
        go.addEventListener("click", () => this.generate(entry));

        const toggles = el.createDiv({ cls: "fcg-panel-toggles" });
        if (entry.meaningKey) this.checkbox(toggles, "Show meanings", this.state.meanings, (v) => { this.state.meanings = v; });
        this.checkbox(toggles, "Keep previous", this.state.keep, (v) => { this.state.keep = v; });

        this.renderResults(el);
        this.renderFooter(el, entry);
    }

    private checkbox(parent: HTMLElement, text: string, value: boolean, onChange: (v: boolean) => void): void {
        const label = parent.createEl("label", { cls: "fcg-panel-toggle" });
        const box = label.createEl("input", { type: "checkbox" });
        box.checked = value;
        label.createSpan({ text });
        box.addEventListener("change", () => onChange(box.checked));
    }

    private startAmount(): number {
        const n = this.plugin.lastAmount ?? this.plugin.settings.defaultAmount;
        return Number.isFinite(n) ? Math.min(Math.max(Math.floor(n), 1), MAX_AMOUNT) : 1;
    }

    private generate(entry: PanelEntry): void {
        const amount = this.startAmount();
        const key = this.state.meanings && entry.meaningKey ? entry.meaningKey : entry.key;
        const builtIn = entry.kind === "builtin" ? GENERATORS.find((g) => g.key === entry.key) : undefined;
        const one = (): Generated => {
            if (builtIn) return builtIn.run(this.plugin.settings);
            const text = this.plugin.generate(key);
            return { title: text.split("\n")[0], text };
        };
        const fresh: PanelResult[] = [];
        try {
            const firsts = new Set<string>();
            for (let i = 0; i < amount; i++) {
                // Variety: try a few times for a result that starts with a letter not used yet in this batch.
                let r = one();
                for (let tries = 0; tries < 5 && firsts.has(r.title.charAt(0).toLowerCase()); tries++) r = one();
                firsts.add(r.title.charAt(0).toLowerCase());
                fresh.push({ title: r.title, text: r.text });
            }
        } catch (e) {
            fresh.push({ title: "Couldn't generate", text: e instanceof Error ? e.message : String(e), error: true });
        }
        this.state.results = this.state.keep ? [...fresh, ...this.state.results] : fresh;
        this.plugin.settings.recentGenerators = pushRecent(this.plugin.settings.recentGenerators, entry.key);
        void this.plugin.saveSettings();
        this.render();
    }

    private renderResults(parent: HTMLElement): void {
        const results = this.state.results;
        if (!results.length) return;
        const good = results.filter((r) => !r.error).map((r) => r.text);
        const bar = parent.createDiv({ cls: "fcg-panel-results-bar" });
        bar.createSpan({ cls: "fcg-panel-count", text: `${good.length} result${good.length === 1 ? "" : "s"}` });
        if (good.length) {
            const insertAll = bar.createEl("button", { text: "Insert all" });
            insertAll.addEventListener("click", () => this.plugin.insertIntoNote(joinResults(good)));
            const copyAll = bar.createEl("button", { text: "Copy all" });
            copyAll.addEventListener("click", () => { void this.plugin.copyToClipboard(joinResults(good)); });
        }
        const list = parent.createDiv({ cls: "fcg-panel-results" });
        for (const r of results) {
            if (r.error) {
                const err = list.createDiv({ cls: "fcg-result fcg-result-error" });
                err.createDiv({ cls: "fcg-result-title", text: r.title });
                err.createDiv({ text: r.text });
                continue;
            }
            if (isMultiLine(r.text)) this.renderBlock(list, r);
            else this.renderLine(list, r);
        }
    }

    private actions(parent: HTMLElement, text: string): void {
        const box = parent.createDiv({ cls: "fcg-result-actions" });
        const ins = box.createEl("button", { cls: "clickable-icon", attr: { "aria-label": "Insert into the note" } });
        setIcon(ins, "corner-down-left");
        ins.addEventListener("click", () => this.plugin.insertIntoNote(text));
        const copy = box.createEl("button", { cls: "clickable-icon", attr: { "aria-label": "Copy" } });
        setIcon(copy, "copy");
        copy.addEventListener("click", () => { void this.plugin.copyToClipboard(text); });
    }

    private renderLine(list: HTMLElement, r: PanelResult): void {
        const row = list.createDiv({ cls: "fcg-result fcg-result-line" });
        row.createSpan({ cls: "fcg-result-text", text: r.text.trim() });
        this.actions(row, r.text);
    }

    private renderBlock(list: HTMLElement, r: PanelResult): void {
        const block = list.createDiv({ cls: "fcg-result fcg-result-block" });
        const lines = r.text.trim().split("\n");
        const top = block.createDiv({ cls: "fcg-result-head" });
        top.createDiv({ cls: "fcg-result-title", text: r.title });
        this.actions(top, r.text);
        const rest = lines[0].trim() === r.title.trim() ? lines.slice(1) : lines;
        const body = block.createDiv({ cls: "fcg-result-body markdown-rendered" });
        void MarkdownRenderer.render(this.app, rest.join("\n"), body, "", this);
        if (rest.length > FOLD_LINES || rest.join("\n").length > FOLD_CHARS) {
            block.addClass("is-folded");
            const more = block.createEl("button", { cls: "fcg-result-more", text: "Show more" });
            more.addEventListener("click", () => {
                const folded = block.hasClass("is-folded");
                block.toggleClass("is-folded", !folded);
                more.setText(folded ? "Show less" : "Show more");
            });
        }
    }

    private renderFooter(parent: HTMLElement, entry: PanelEntry | undefined): void {
        const foot = parent.createDiv({ cls: "fcg-panel-footer" });
        if (entry?.kind === "builtin" && COPYABLE[entry.key]) {
            const own = foot.createEl("button", { text: "Make it your own", attr: { "aria-label": "Copy this generator into your generator folder as a note you can edit" } });
            own.addEventListener("click", () => { void this.plugin.copyBuiltIn(entry.key); });
        }
        const add = foot.createEl("button", { text: "Add a starter set…" });
        add.addEventListener("click", () => this.plugin.openStarters());
    }
}

/** The picker's suggestions: matches with their group beside them; an empty box lists everything. */
class EntrySuggest extends AbstractInputSuggest<PanelEntry> {
    constructor(app: App, private readonly input: HTMLInputElement, private readonly plugin: FantasyPlugin, private readonly onPick: (e: PanelEntry) => void) {
        super(app, input);
    }

    protected getSuggestions(query: string): PanelEntry[] {
        const current = this.plugin.panelEntries().find((e) => e.key === this.plugin.panelState.key);
        // The box shows the chosen generator's name; clicking it again should list everything, not just that one.
        return searchEntries(this.plugin.panelEntries(), current && query === current.label ? "" : query);
    }

    renderSuggestion(entry: PanelEntry, el: HTMLElement): void {
        el.addClass("fcg-suggest");
        el.createSpan({ cls: "fcg-suggest-label", text: entry.label });
        el.createSpan({ cls: "fcg-suggest-group", text: entry.group });
    }

    selectSuggestion(entry: PanelEntry): void {
        this.input.value = entry.kind === "addStarter" ? "" : entry.label;
        this.close();
        this.onPick(entry);
    }
}

/** Show a notice when Insert has nowhere to go. */
export function noNoteNotice(): void {
    new Notice("Open a note to insert into.");
}
