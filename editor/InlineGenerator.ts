import { App, Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, Notice } from "obsidian";
import type FantasyPlugin from "main";
import { rankKeys } from "generators/custom";
import { retiredMessage } from "generators/registry";

/** The @ list's "Add a starter set" choice, offered while no starter sets are added (1.6.0, H1). */
export const ADD_STARTER = "\u0000add-starter";
const ADD_STARTER_WORDS = "add a starter set names";

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

    /**
     * Keys that start with what was typed come first, then keys that contain it, then keys whose
     * second line contains it ("tavern" finds InnsTaverns). Retired keys only show when typed in full.
     */
    getSuggestions(context: EditorSuggestContext): string[] {
        const keys = this.plugin.suggestKeys();
        const ranked = rankKeys(keys, context.query);
        const q = context.query.toLowerCase();
        if (q) {
            const seen = new Set(ranked);
            for (const k of keys) if (!seen.has(k) && this.plugin.describeKey(k).toLowerCase().includes(q)) ranked.push(k);
        }
        const retired = this.plugin.retiredMatch(context.query);
        const out = retired ? [retired, ...ranked] : ranked;
        // No name generators yet: offer to add one (when nothing typed, when the words match, or when nothing else does).
        if (!this.plugin.hasStarterSets() && (!q || ADD_STARTER_WORDS.includes(q) || !out.length)) out.push(ADD_STARTER);
        return out;
    }

    renderSuggestion(value: string, el: HTMLElement): void {
        if (value === ADD_STARTER) {
            el.createDiv({ text: "Add a starter set" });
            el.createDiv({ text: "No name generators yet", cls: "fcg-suggestion-note" });
            return;
        }
        el.createDiv({ text: value });
        const note = this.plugin.describeKey(value);
        if (note) el.createDiv({ text: note, cls: "fcg-suggestion-note" });
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
        if (value === ADD_STARTER) {
            editor.replaceRange("", start, end);
            this.plugin.openStarters();
            return;
        }
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
