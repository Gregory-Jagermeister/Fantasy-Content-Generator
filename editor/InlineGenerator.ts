import { App, Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, Notice } from "obsidian";
import type FantasyPlugin from "main";
import { rankKeys } from "generators/custom";
import { RETIRED, retiredMessage } from "generators/registry";

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
        return rankKeys([...this.plugin.suggestKeys(), ...this.plugin.retiredKeys()], context.query);
    }

    renderSuggestion(value: string, el: HTMLElement): void {
        el.createDiv({ text: value });
        const custom = this.plugin.customs.active.get(value);
        if (custom) el.createDiv({ text: custom.name, cls: "fcg-suggestion-note" });
        else if (this.plugin.isRetired(value)) el.createDiv({ text: `Retired in ${RETIRED[value]}`, cls: "fcg-suggestion-note" });
    }

    selectSuggestion(value: string): void {
        // Write through the editor this suggestion belongs to (a note, or a note card on a canvas).
        const context = this.context;
        if (!context) return;
        const { editor, start, end } = context;
        this.close();
        // The list can still be showing for a moment after an insert; a second pick (a quick Enter)
        // would then point past the text. Only insert while the typed "@Key" is still there.
        const trigger = this.plugin.settings.inlineCallout || "@";
        const inDoc = end.line <= editor.lastLine() && end.ch <= editor.getLine(end.line).length;
        if (!inDoc || !editor.getRange(start, end).startsWith(trigger)) return;
        if (this.plugin.isRetired(value)) {
            new Notice(retiredMessage(value, trigger));
            return;
        }
        let text: string;
        try {
            text = this.plugin.generate(value);
        } catch (e) {
            new Notice(`Couldn't generate ${value}: ${e instanceof Error ? e.message : String(e)}`);
            return;
        }
        editor.replaceRange(text, start, end);
        editor.setCursor(editor.offsetToPos(editor.posToOffset(start) + text.length));
    }

}
