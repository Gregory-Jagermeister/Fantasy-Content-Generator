import { Notice, Plugin } from "obsidian";
import { GeneratorModal } from "editor/GeneratorModal";
import { InlineGeneratorSuggester } from "editor/InlineGenerator";
import { FantasyPluginSettings } from "settings/Datatypes";
import { DEFAULT_SETTINGS } from "settings/DefaultSetting";
import { SettingTab } from "settings/SettingsTab";
import { clonePlain, mergeSettings } from "settings/settingsData";
import { groupOfKey, inlineGenerators, RETIRED_KEYS, retiredMessage } from "generators/registry";
import { runCustom } from "generators/custom";
import { CustomGeneratorStore } from "custom/store";

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

	/** Keys for the inline list: hidden groups left out (they still work when called). */
	suggestKeys(): string[] {
		return this.inlineKeys().filter((k) => {
			const group = this.groups.get(k);
			return !group || this.customs.active.has(k) || !this.isGroupHidden(group);
		});
	}

	/** The key as written in a note ({@drinks}), matched to a real key ignoring case. */
	matchKey(key: string): string {
		if (this.builtIns[key] || this.customs.active.has(key)) return key;
		const lower = key.toLowerCase();
		return this.inlineKeys().find((k) => k.toLowerCase() === lower) ?? key;
	}

	/** Keys removed in 1.3.1 that no custom generator has taken over. Shown in the inline list, marked retired. */
	retiredKeys(): string[] {
		return RETIRED_KEYS.filter((k) => !this.customs.active.has(k));
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

	/** Open the generator window; copied results go to the clipboard. */
	openGenerator(): void {
		new GeneratorModal(this.app, this, (text) => { void this.copyToClipboard(text); }).open();
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
