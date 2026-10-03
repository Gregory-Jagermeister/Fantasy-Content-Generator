import { App, Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, Notice } from "obsidian";
import type FantasyPlugin from "main";
import { rankKeys } from "generators/custom";

/** Type the trigger (default "@") then a generator name, e.g. "@ElfFemale", and pick it to insert a result. */
export class InlineGeneratorSuggester extends EditorSuggest<string> {
    private readonly plugin: FantasyPlugin;

    constructor(app: App, plugin: FantasyPlugin) {
        super(app);
        this.plugin = plugin;
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

    /** Names that start with what was typed come first, then names that contain it. */
    getSuggestions(context: EditorSuggestContext): string[] {
        return rankKeys(this.plugin.inlineKeys(), context.query);
    }

    renderSuggestion(value: string, el: HTMLElement): void {
        el.createDiv({ text: value });
        const custom = this.plugin.customs.active.get(value);
        if (custom) el.createDiv({ text: custom.name, cls: "fcg-suggestion-note" });
    }

    selectSuggestion(value: string): void {
        // Write through the editor this suggestion belongs to (a note, or a note card on a canvas).
        const context = this.context;
        if (!context) return;
        let text: string;
        try {
            text = this.plugin.generate(value);
        } catch (e) {
            new Notice(`Couldn't generate ${value}: ${e instanceof Error ? e.message : String(e)}`);
            return;
        }
        context.editor.replaceRange(text, context.start, context.end);
    }
}
