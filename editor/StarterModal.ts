import { App, FuzzySuggestModal } from "obsidian";
import type FantasyPlugin from "main";
import { StarterChoice, starterChoices } from "generators/starterChoices";

/** "Add a starter set": search races and kits, then write the chosen kit into the generator folder. */
export class StarterModal extends FuzzySuggestModal<StarterChoice> {
    constructor(app: App, private readonly plugin: FantasyPlugin) {
        super(app);
        this.setPlaceholder("Search races and languages");
    }

    getItems(): StarterChoice[] {
        return starterChoices();
    }

    getItemText(choice: StarterChoice): string {
        return `${choice.label} ${choice.detail}`;
    }

    renderSuggestion(match: { item: StarterChoice }, el: HTMLElement): void {
        el.createDiv({ text: match.item.label });
        el.createDiv({ text: match.item.detail, cls: "fcg-suggestion-note" });
    }

    onChooseItem(choice: StarterChoice): void {
        if (choice.kit) void this.plugin.addStarter(choice.kit);
        else void this.plugin.addAllStarters();
    }
}
