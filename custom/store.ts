import { normalizePath, TAbstractFile, TFile, TFolder } from "obsidian";
import type FantasyPlugin from "main";
import { copyNote } from "generators/copies";
import { CustomGenerator, EXAMPLE_NAMING_KIT, EXAMPLE_NOTE, parseGeneratorNote, resolveCustom, starterNote } from "generators/custom";
import type { StarterKit } from "generators/starters";
import { starterTitle } from "generators/starterChoices";

/** Keeps the custom generators from the generator folder up to date. */
export class CustomGeneratorStore {
    private readonly plugin: FantasyPlugin;
    /** Every generator note read, including ones with problems or a clashing key */
    all: CustomGenerator[] = [];
    /** Generators in use, by key */
    active = new Map<string, CustomGenerator>();
    private timer: number | null = null;

    constructor(plugin: FantasyPlugin) {
        this.plugin = plugin;
    }

    /** The generator folder from settings, without slashes at either end ("" = not set). */
    folder(): string {
        return normalizePath(this.plugin.settings.generatorFolder || "").replace(/^\/+|\/+$/g, "");
    }

    /** Is this file inside the generator folder (or one of its subfolders)? */
    inFolder(file: TAbstractFile): boolean {
        const folder = this.folder();
        return folder !== "" && file.path.startsWith(folder + "/");
    }

    /** Start watching for changes. Call once from onload. */
    watch(): void {
        const { app } = this.plugin;
        const refreshIf = (file: TAbstractFile, oldPath?: string) => {
            const folder = this.folder();
            if (this.inFolder(file) || (oldPath !== undefined && folder !== "" && oldPath.startsWith(folder + "/"))) this.scheduleReload();
        };
        this.plugin.registerEvent(app.metadataCache.on("changed", (file) => refreshIf(file)));
        this.plugin.registerEvent(app.vault.on("delete", (file) => refreshIf(file)));
        this.plugin.registerEvent(app.vault.on("rename", (file, oldPath) => refreshIf(file, oldPath)));
        app.workspace.onLayoutReady(() => { void this.reload(); });
    }

    /** Reload shortly (many change events can arrive together). */
    scheduleReload(): void {
        if (this.timer !== null) window.clearTimeout(this.timer);
        this.timer = window.setTimeout(() => {
            this.timer = null;
            void this.reload();
        }, 300);
    }

    /** Read every generator note again. */
    async reload(): Promise<void> {
        const { app } = this.plugin;
        const gens: CustomGenerator[] = [];
        for (const file of app.vault.getMarkdownFiles()) {
            if (!this.inFolder(file)) continue;
            const fm: Record<string, unknown> | undefined = app.metadataCache.getFileCache(file)?.frontmatter;
            if (!fm || !("fcg-generator" in fm)) continue;
            try {
                const gen = parseGeneratorNote(file.path, fm, await app.vault.cachedRead(file));
                if (gen) gens.push(gen);
            } catch (e) {
                console.error(`Fantasy Content Generator: couldn't read ${file.path}`, e);
            }
        }
        this.active = resolveCustom(gens, this.plugin.builtInKeys());
        this.all = gens.sort((a, b) => a.path.localeCompare(b.path));
    }

    /** The generator folder, created (with the example notes) if it doesn't exist yet. */
    private async ensureFolder(): Promise<string> {
        const { vault } = this.plugin.app;
        const folder = this.folder() || "Generators";
        if (!this.plugin.settings.generatorFolder) {
            this.plugin.settings.generatorFolder = folder;
            await this.plugin.saveSettings();
        }
        if (!(vault.getAbstractFileByPath(folder) instanceof TFolder)) {
            await vault.createFolder(folder);
            await vault.create(`${folder}/Example generator.md`, EXAMPLE_NOTE);
            await vault.create(`${folder}/Example naming kit.md`, EXAMPLE_NAMING_KIT);
        }
        return folder;
    }

    /**
     * Write an editable copy of a built-in generator into the generator folder.
     * @returns the new note, or null if that generator can't be copied
     */
    async copyBuiltIn(key: string): Promise<TFile | null> {
        const note = copyNote(key, this.plugin.settings);
        if (!note) return null;
        const { vault } = this.plugin.app;
        const folder = await this.ensureFolder();
        let path = `${folder}/${note.name}.md`;
        let text = note.text;
        for (let n = 2; vault.getAbstractFileByPath(path); n++) {
            path = `${folder}/${note.name} ${n}.md`;
            text = note.text.replace(`fcg-key: ${note.key}`, `fcg-key: ${note.key}${n}`).replace(`(my copy)"`, `(my copy ${n})"`).replace(`@${note.key}**`, `@${note.key}${n}**`);
        }
        return vault.create(path, text);
    }

    /**
     * Write a starter kit into the generator folder as "<its name>.md".
     * Never overwrites: if that note already exists it is returned unchanged.
     */
    async addStarter(kit: StarterKit): Promise<{ file: TFile; existed: boolean }> {
        const { vault } = this.plugin.app;
        const folder = await this.ensureFolder();
        const path = normalizePath(`${folder}/${starterTitle(kit)}.md`);
        const existing = vault.getAbstractFileByPath(path);
        if (existing instanceof TFile) return { file: existing, existed: true };
        if (existing) throw new Error(`${path} exists and isn't a note`);
        return { file: await vault.create(path, kit.note), existed: false };
    }

    /**
     * Create the generator folder (with the example note the first time) and a new starter note.
     * @returns the new note
     */
    async newGenerator(): Promise<TFile> {
        const { vault } = this.plugin.app;
        const folder = await this.ensureFolder();
        let n = 1;
        let path = `${folder}/New generator.md`;
        while (vault.getAbstractFileByPath(path)) path = `${folder}/New generator ${++n}.md`;
        const name = n === 1 ? "New generator" : `New generator ${n}`;
        return vault.create(path, starterNote(name));
    }
}
