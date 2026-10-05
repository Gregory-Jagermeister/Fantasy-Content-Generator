import { Notice, Plugin } from "obsidian";
import { GeneratorModal } from "editor/GeneratorModal";
import { InlineGeneratorSuggester } from "editor/InlineGenerator";
import { FantasyPluginSettings } from "settings/Datatypes";
import { DEFAULT_SETTINGS } from "settings/DefaultSetting";
import { SettingTab } from "settings/SettingsTab";
import { clonePlain, mergeSettings } from "settings/settingsData";
import { describeBuiltIn, groupOfKey, inlineGenerators, isAlias, replacementFor, RETIRED, RETIRED_KEYS, retiredMessage } from "generators/registry";
import { runCustom } from "generators/custom";
import { CustomGeneratorStore } from "custom/store";
import { StarterModal } from "editor/StarterModal";
import { STARTERS, StarterKit } from "generators/starters";

/** What other plugins (for example Templater) can call: app.plugins.plugins["fantasy-content-generator"].api */
export interface FantasyGeneratorApi {
	/** One result from any generator key that works inline (built-in or custom). Throws on an unknown key. */
	generate(key: string): string;
	/** Every key, built-in first, then custom. */
	keys(): string[];
}

export default class FantasyPlugin extends Plugin {
	settings: FantasyPluginSettings;
	customs: CustomGeneratorStore;
	api: FantasyGeneratorApi;
	/** The generator window remembers the last amount used this session (starts at the Default amount setting). */
	lastAmount: number | null = null;
	private builtIns = inlineGenerators();
	private groups = groupOfKey();

	async onload() {
		await this.loadSettings();
		this.customs = new CustomGeneratorStore(this);
		this.customs.watch();
		this.api = {
			generate: (key: string) => this.generate(key),
			keys: () => this.inlineKeys(),
		};

		this.addCommand({
			id: "open-fantasy-generator",
			name: "Open generator",
			callback: () => this.openGenerator(),
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
		this.addRibbonIcon("book", "Open fantasy generator", () => this.openGenerator());
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
	generate(key: string, depth = 0): string {
		const builtIn = this.builtIns[key];
		if (builtIn) return builtIn(this.settings);
		const custom = this.customs.active.get(key);
		if (custom) return runCustom(custom, { call: (k, d) => this.generate(this.matchKey(k), d) }, depth);
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

	/** Open the generator window; copied results go to the clipboard. */
	openGenerator(): void {
		new GeneratorModal(this.app, this, (text) => { void this.copyToClipboard(text); }).open();
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
