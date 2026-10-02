import { Notice, Plugin } from "obsidian";
import { GeneratorModal } from "editor/GeneratorModal";
import { InlineGeneratorSuggester } from "editor/InlineGenerator";
import { FantasyPluginSettings } from "settings/Datatypes";
import { DEFAULT_SETTINGS } from "settings/DefaultSetting";
import { SettingTab } from "settings/SettingsTab";
import { clonePlain, mergeSettings } from "settings/settingsData";

export default class FantasyPlugin extends Plugin {
	settings: FantasyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "open-fantasy-generator",
			name: "Open generator",
			callback: () => this.openGenerator(),
		});
		this.addRibbonIcon("book", "Open fantasy generator", () => this.openGenerator());
		this.registerEditorSuggest(new InlineGeneratorSuggester(this.app, this));
		this.addSettingTab(new SettingTab(this.app, this));
	}

	/** Open the generator window; copied results go to the clipboard. */
	openGenerator(): void {
		new GeneratorModal(this.app, this, (text) => { void this.copyToClipboard(text); }).open();
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
	}
}
