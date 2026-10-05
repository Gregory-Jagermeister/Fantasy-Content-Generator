/* When the @ list writes a generator's key instead of a result (1.6.0, Decisions.md 2026-10-06, option C).
   Pure functions, no Obsidian imports, unit-tested. */

/**
 * - "brace": the @ comes straight after "{" (a call being written: "{@Dwa" → "{@Dwarvish")
 * - "block": inside a ```pattern block, not after "{" ("@Dwa" → "{@Dwarvish}")
 * - null: anywhere else, so a result is inserted as usual
 * @param lineBefore the line up to the trigger ("@")
 * @param linesAbove the note's lines above the trigger's line
 */
export function keyMode(lineBefore: string, linesAbove: readonly string[]): "brace" | "block" | null {
    if (lineBefore.endsWith("{")) return "brace";
    return inPatternBlock(linesAbove) ? "block" : null;
}

/** Is the line after these inside an open ```pattern (or ~~~pattern) block? Other code blocks are skipped. */
export function inPatternBlock(linesAbove: readonly string[]): boolean {
    let fence: { char: string; len: number; pattern: boolean } | null = null;
    for (const line of linesAbove) {
        if (fence) {
            const close = /^\s*(`{3,}|~{3,})\s*$/.exec(line);
            if (close && close[1][0] === fence.char && close[1].length >= fence.len) fence = null;
            continue;
        }
        const open = /^\s*(`{3,}|~{3,})\s*(\S*)/.exec(line);
        if (open) fence = { char: open[1][0], len: open[1].length, pattern: open[2].toLowerCase() === "pattern" };
    }
    return !!fence && fence.pattern;
}

/** What picking `key` writes in that mode. Calls in patterns always use "@", whatever the inline trigger is. */
export function keyText(key: string, mode: "brace" | "block"): string {
    return mode === "brace" ? `@${key}` : `{@${key}}`;
}
