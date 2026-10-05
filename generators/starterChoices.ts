/* What "Add a starter set" offers (1.5.0). Pure functions, no Obsidian imports, unit-tested. */
import { STARTERS, StarterKit } from "generators/starters";

export interface StarterChoice {
    /** What the list shows: the starter set, e.g. "Elvish names" */
    label: string;
    /** Second line: the races it is for, e.g. "Elf, High elf, Dark elf, Drow" */
    detail: string;
    kit: StarterKit;
}

/** The kit's generator name ("Elvish names"), which is also its note's file name. */
export function starterTitle(kit: StarterKit): string {
    return /^fcg-generator: (.+)$/m.exec(kit.note)?.[1].trim() ?? `${kit.language} names`;
}

/** Picker labels that differ from the kit's name (Daniel, 2026-10-05). */
const LABELS: Record<string, { label: string; detail?: string }> = {
    Planar: { label: "Planar", detail: "Light and Dark together" },
    PlanarLight: { label: "Planar: Light" },
    PlanarDark: { label: "Planar: Dark" },
};

/**
 * One choice per starter set, sorted by label, with its races on the second line
 * (Daniel, 2026-10-05: race names as titles confused). The search reads the second line too,
 * so typing "drow" still finds Elvish names.
 */
export function starterChoices(kits: StarterKit[] = STARTERS): StarterChoice[] {
    return kits
        .map((kit) => {
            const custom = LABELS[kit.key];
            return { label: custom?.label ?? starterTitle(kit), detail: custom?.detail ?? kit.races.join(", "), kit };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
}
