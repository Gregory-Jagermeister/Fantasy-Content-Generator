import { App, Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, Notice } from "obsidian";
import type FantasyPlugin from "main";
import { inlineGenerators } from "generators/registry";
import { FantasyPluginSettings } from "settings/Datatypes";

/** Type the trigger (default "@") then a generator name, e.g. "@ElfFemale", and pick it to insert a result. */
export class InlineGeneratorSuggester extends EditorSuggest<string> {
    private readonly plugin: FantasyPlugin;
    private readonly generators: Record<string, (settings: FantasyPluginSettings) => string>;
    private readonly keys: string[];

    constructor(app: App, plugin: FantasyPlugin) {
        super(app);
        this.plugin = plugin;
        this.generators = inlineGenerators();
        this.keys = Object.keys(this.generators);
    }

    onTrigger(cursor: EditorPosition, editor: Editor): EditorSuggestTriggerInfo | null {
        const callOut = this.plugin.settings.inlineCallout;
        if (!callOut) return null;
        const escaped = callOut.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const match = editor.getLine(cursor.line).slice(0, cursor.ch).match(new RegExp(`${escaped}(\\S*)$`));
        if (!match) return null;
        return {
            start: { line: cursor.line, ch: cursor.ch - match[1].length - callOut.length },
            end: { line: cursor.line, ch: cursor.ch },
            query: match[1],
        };
    }

    getSuggestions(context: EditorSuggestContext): string[] {
        const q = context.query.toLowerCase();
        return this.keys.filter((k) => k.toLowerCase().startsWith(q));
    }

    renderSuggestion(value: string, el: HTMLElement): void {
        el.createDiv({ text: value });
    }

    selectSuggestion(value: string): void {
        // Write through the editor this suggestion belongs to (a note, or a note card on a canvas).
        const context = this.context;
        if (!context) return;
        let text: string;
        try {
            text = this.generators[value](this.plugin.settings);
        } catch (e) {
            new Notice(`Couldn't generate ${value}: ${e instanceof Error ? e.message : String(e)}`);
            return;
        }
        context.editor.replaceRange(text, context.start, context.end);
    }
}
