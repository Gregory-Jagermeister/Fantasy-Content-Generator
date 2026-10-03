import { normalizePath, TAbstractFile, TFile, TFolder } from "obsidian";
import type FantasyPlugin from "main";
import { CustomGenerator, EXAMPLE_NOTE, parseGeneratorNote, resolveCustom, starterNote } from "generators/custom";

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

    /**
     * Create the generator folder (with the example note the first time) and a new starter note.
     * @returns the new note
     */
    async newGenerator(): Promise<TFile> {
        const { vault } = this.plugin.app;
        const folder = this.folder() || "Generators";
        if (!this.plugin.settings.generatorFolder) {
            this.plugin.settings.generatorFolder = folder;
            await this.plugin.saveSettings();
        }
        if (!(vault.getAbstractFileByPath(folder) instanceof TFolder)) {
            await vault.createFolder(folder);
            await vault.create(`${folder}/Example generator.md`, EXAMPLE_NOTE);
        }
        let n = 1;
        let path = `${folder}/New generator.md`;
        while (vault.getAbstractFileByPath(path)) path = `${folder}/New generator ${++n}.md`;
        const name = n === 1 ? "New generator" : `New generator ${n}`;
        return vault.create(path, starterNote(name));
    }
}
