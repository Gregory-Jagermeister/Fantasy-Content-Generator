import { MarkdownView, Notice, Plugin, WorkspaceLeaf } from "obsidian";
import { GeneratorView, PanelState, VIEW_TYPE_GENERATOR, noNoteNotice } from "editor/GeneratorView";
import { PanelEntry, buildEntries, insertionText } from "editor/panelModel";
import { starterChoices } from "generators/starterChoices";
import { InlineGeneratorSuggester } from "editor/InlineGenerator";
import { FantasyPluginSettings } from "settings/Datatypes";
import { DEFAULT_SETTINGS } from "settings/DefaultSetting";
import { SettingTab } from "settings/SettingsTab";
import { clonePlain, mergeSettings } from "settings/settingsData";
import { describeBuiltIn, GENERATORS, groupOfKey, inlineGenerators, isAlias, replacementFor, RETIRED, RETIRED_KEYS, retiredMessage } from "generators/registry";
import { runCustomData } from "generators/custom";
import { toValues, Value } from "generators/engine";
import { CustomGeneratorStore } from "custom/store";
import { StarterModal } from "editor/StarterModal";
import { STARTERS, StarterKit } from "generators/starters";

/** What other plugins (for example Templater) can call: app.plugins.plugins["fantasy-content-generator"].api */
export interface FantasyGeneratorApi {
	/**
	 * One result from any generator key that works inline (built-in or custom). Throws on an unknown key.
	 * @param values passed in, like {@Key $wealth=70}: `{ wealth: 70, race: "Dwarf" }` (custom generators use them)
	 */
	generate(key: string, values?: Record<string, string | number>): string;
	/**
	 * The result and everything the generator remembered ($names, including the values passed in),
	 * e.g. `{ text: "…", values: { wealth: 70, owner: "…" } }`, so a script can name and link notes.
	 */
	generateData(key: string, values?: Record<string, string | number>): { text: string; values: Record<string, string | number> };
	/** Every key, built-in first, then custom. */
	keys(): string[];
}

export default class FantasyPlugin extends Plugin {
	settings: FantasyPluginSettings;
	customs: CustomGeneratorStore;
	api: FantasyGeneratorApi;
	/** The generator panel remembers the last amount used this session (starts at the Default amount setting). */
	lastAmount: number | null = null;
	/** What the generator panel shows; kept here so results survive closing and reopening the panel. */
	panelState: PanelState = { key: "", results: [], meanings: false, keep: false };
	/** The last note being edited, where the panel's Insert goes (a Markdown leaf, not one of this plugin's views). */
	private lastEditorLeaf: WorkspaceLeaf | null = null;
	private builtIns = inlineGenerators();
	private groups = groupOfKey();

	async onload() {
		await this.loadSettings();
		this.customs = new CustomGeneratorStore(this);
		this.customs.watch();
		this.api = {
			generate: (key: string, values?: Record<string, string | number>) => this.generateData(key, 0, toValues(values)).text,
			generateData: (key: string, values?: Record<string, string | number>) => {
				const r = this.generateData(key, 0, toValues(values));
				return { text: r.text, values: Object.fromEntries(r.values) };
			},
			keys: () => this.inlineKeys(),
		};

		this.addCommand({
			id: "open-fantasy-generator",
			name: "Open generator",
			callback: () => { void this.openGenerator(); },
		});
		this.addCommand({
			id: "new-generator",
			name: "New custom generator",
			callback: () => { void this.newGenerator(); },
		});
		this.addCommand({
			id: "add-starter-set",
			name: "Add a starter set",
			callback: () => this.openStarters(),
		});
		this.registerView(VIEW_TYPE_GENERATOR, (leaf) => new GeneratorView(leaf, this));
		this.registerEvent(this.app.workspace.on("active-leaf-change", (leaf) => {
			if (leaf?.view instanceof MarkdownView) this.lastEditorLeaf = leaf;
		}));
		this.addRibbonIcon("scroll-text", "Open generator", () => { void this.openGenerator(); });
		this.registerEditorSuggest(new InlineGeneratorSuggester(this.app, this));
		this.addSettingTab(new SettingTab(this.app, this));
	}

	/** Keys of the generators that ship with the plugin. */
	builtInKeys(): string[] {
		return Object.keys(this.builtIns);
	}

	/** Every inline key: built-in, then custom. */
	inlineKeys(): string[] {
		return [...this.builtInKeys(), ...this.customs.active.keys()];
	}

	/** Is this built-in group hidden in settings? */
	isGroupHidden(group: string): boolean {
		return this.settings.hiddenGroups.includes(group);
	}

	/** Keys for the inline list: hidden groups and old spellings left out (they still work when called). */
	suggestKeys(): string[] {
		return this.inlineKeys().filter((k) => {
			if (isAlias(k) && !this.customs.active.has(k)) return false;
			const group = this.groups.get(k);
			return !group || this.customs.active.has(k) || !this.isGroupHidden(group);
		});
	}

	/** Has the user added any starter set (name generators)? */
	hasStarterSets(): boolean {
		for (const k of this.customs.active.keys()) if (this.isStarterKey(k)) return true;
		return false;
	}

	/** Is this a starter set's key (or its "+ meaning" twin)? */
	isStarterKey(key: string): boolean {
		return STARTERS.some((k) => key === k.key || key === `${k.key}Meaning`);
	}

	/** Second line in the inline list: "Starter set · Elvish names", "Story tools · Plot and story hooks". */
	describeKey(key: string): string {
		const custom = this.customs.active.get(key);
		if (custom) return `${this.isStarterKey(key) ? "Starter set" : "Custom"} · ${custom.name}`;
		if (this.isRetired(key)) {
			const set = replacementFor(key);
			return `Retired in ${RETIRED[key]}${set ? ` · now ${set === "Human" ? "the Human starter sets" : `the ${set} starter set`}` : ""}`;
		}
		return describeBuiltIn(key) ?? "";
	}

	/** The key as written in a note ({@drinks}), matched to a real key ignoring case. */
	matchKey(key: string): string {
		if (this.builtIns[key] || this.customs.active.has(key)) return key;
		const lower = key.toLowerCase();
		return this.inlineKeys().find((k) => k.toLowerCase() === lower) ?? key;
	}

	/** A retired key typed in full (any case) that no custom generator has taken over, so picking it can explain. */
	retiredMatch(typed: string): string | undefined {
		const lower = typed.toLowerCase();
		return RETIRED_KEYS.find((k) => k.toLowerCase() === lower && !this.customs.active.has(k));
	}

	/** Is this a retired key that no custom generator has taken over? */
	isRetired(key: string): boolean {
		return RETIRED_KEYS.includes(key) && !this.customs.active.has(key);
	}

	/**
	 * One result for an inline key. Throws with a readable message.
	 * @param depth how deeply generators are calling each other ({@Key} in a note); 0 from outside
	 */
	generate(key: string, depth = 0, values?: Map<string, Value>): string {
		return this.generateData(key, depth, values).text;
	}

	/** A result and the values it remembered. Built-in generators ignore values passed in (and give them back). */
	generateData(key: string, depth = 0, values: Map<string, Value> = new Map()): { text: string; values: Map<string, Value> } {
		const builtIn = this.builtIns[key];
		if (builtIn) return { text: builtIn(this.settings), values: new Map(values) };
		const custom = this.customs.active.get(key);
		if (custom) return runCustomData(custom, { call: (k, d, v) => this.generate(this.matchKey(k), d, v) }, depth, { values });
		if (RETIRED_KEYS.includes(key)) throw new Error(retiredMessage(key, this.settings.inlineCallout || "@"));
		throw new Error(`There is no generator called "${key}".`);
	}

	/** Write an editable copy of a built-in generator into the generator folder and open it. */
	async copyBuiltIn(key: string): Promise<void> {
		try {
			const file = await this.customs.copyBuiltIn(key);
			if (!file) { new Notice("That generator can't be copied."); return; }
			await this.app.workspace.getLeaf(false).openFile(file);
			new Notice(`Copied to ${file.path}.`);
		} catch (e) {
			console.error("Fantasy Content Generator: couldn't copy the generator", e);
			new Notice(`Couldn't copy the generator: ${e instanceof Error ? e.message : String(e)}`);
		}
	}

	/** Open the generator panel in the right sidebar, or show it if it's open already. */
	async openGenerator(): Promise<void> {
		const { workspace } = this.app;
		let leaf: WorkspaceLeaf | null = workspace.getLeavesOfType(VIEW_TYPE_GENERATOR)[0] ?? null;
		if (!leaf) {
			leaf = workspace.getRightLeaf(false);
			if (!leaf) return;
			await leaf.setViewState({ type: VIEW_TYPE_GENERATOR, active: true });
		}
		await workspace.revealLeaf(leaf);
	}

	/** Redraw open generator panels (after generator notes change). */
	refreshPanels(): void {
		for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_GENERATOR)) {
			if (leaf.view instanceof GeneratorView) leaf.view.render();
		}
	}

	/** What the panel's picker offers: built-ins (not hidden), starter sets, custom generators. */
	panelEntries(): PanelEntry[] {
		const races = new Map(starterChoices().filter((c) => c.kit).map((c) => [c.kit?.key ?? "", c.detail]));
		return buildEntries({
			builtIns: GENERATORS.filter((g) => !this.isGroupHidden(g.group)).map((g) => ({ key: g.key, label: g.label, group: g.group })),
			customs: [...this.customs.active.values()],
			isStarter: (k) => this.isStarterKey(k),
			racesOf: (k) => races.get(k) ?? "",
		});
	}

	/** Put text at the cursor of the last note being edited: names inside the sentence, blocks on their own lines. */
	insertIntoNote(text: string): void {
		const recent = this.app.workspace.getMostRecentLeaf();
		const leaf = this.lastEditorLeaf ?? (recent?.view instanceof MarkdownView ? recent : null);
		const view = leaf && this.app.workspace.getLeavesOfType("markdown").includes(leaf) && leaf.view instanceof MarkdownView ? leaf.view : null;
		if (!view) { noNoteNotice(); return; }
		const editor = view.editor;
		const cursor = editor.getCursor();
		const line = editor.getLine(cursor.line);
		const above = cursor.line > 0 ? editor.getLine(cursor.line - 1) : "";
		const insert = insertionText(text, line.slice(0, cursor.ch), above, line.slice(cursor.ch));
		editor.replaceRange(insert, cursor);
		editor.setCursor(editor.offsetToPos(editor.posToOffset(cursor) + insert.length));
	}

	/** Pick a starter set (a naming kit for a race or language) to add to the generator folder. */
	openStarters(): void {
		new StarterModal(this.app, this).open();
	}

	/** Write a starter kit into the generator folder (never overwriting) and open it. */
	async addStarter(kit: StarterKit): Promise<void> {
		try {
			const { file, existed } = await this.customs.addStarter(kit);
			await this.app.workspace.getLeaf(false).openFile(file);
			const trigger = this.settings.inlineCallout || "@";
			new Notice(existed
				? `${file.path} is already in your generator folder, so it was left as it is.`
				: `Added ${file.path}. Type ${trigger}${kit.key}, or ${trigger}${kit.key}Meaning where it has meanings.`);
		} catch (e) {
			console.error("Fantasy Content Generator: couldn't add the starter set", e);
			new Notice(`Couldn't add the starter set: ${e instanceof Error ? e.message : String(e)}`);
		}
	}

	/** Write every starter kit into the generator folder (never overwriting). Opens nothing. */
	async addAllStarters(): Promise<void> {
		let added = 0;
		let kept = 0;
		try {
			for (const kit of STARTERS) {
				const { existed } = await this.customs.addStarter(kit);
				if (existed) kept++; else added++;
			}
			const trigger = this.settings.inlineCallout || "@";
			new Notice(`Added ${added} starter set${added === 1 ? "" : "s"} to ${this.customs.folder() || "your generator folder"}${kept ? ` (${kept} already there, kept as they were)` : ""}. Type ${trigger} and a name, such as ${trigger}Dwarvish.`);
		} catch (e) {
			console.error("Fantasy Content Generator: couldn't add the starter sets", e);
			new Notice(`Added ${added}, then couldn't add the rest: ${e instanceof Error ? e.message : String(e)}`);
		}
	}

	/** Make a starter generator note (and the folder the first time) and open it. */
	async newGenerator(): Promise<void> {
		try {
			const file = await this.customs.newGenerator();
			await this.app.workspace.getLeaf(false).openFile(file);
			new Notice(`Created ${file.path}. Edit the lists, then type @ and its name.`);
		} catch (e) {
			console.error("Fantasy Content Generator: couldn't create a generator", e);
			new Notice(`Couldn't create the generator: ${e instanceof Error ? e.message : String(e)}`);
		}
	}

	async copyToClipboard(text: string): Promise<void> {
		try {
			await navigator.clipboard.writeText(text);
			const first = text.split("\n")[0];
			new Notice(`Copied: ${first.length > 60 ? first.slice(0, 57) + "..." : first}`);
		} catch (e) {
			console.error("Fantasy Content Generator: copy failed", e);
			new Notice("Couldn't copy to the clipboard.");
		}
	}

	async loadSettings(): Promise<void> {
		this.settings = mergeSettings(DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	/** Put every setting back to its default (a fresh copy, so the defaults never change). */
	async resetSettings(): Promise<void> {
		this.settings = clonePlain(DEFAULT_SETTINGS);
		await this.saveSettings();
		this.customs.scheduleReload();
	}
}
