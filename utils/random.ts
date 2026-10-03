/* Shared random helpers for every generator. No Obsidian imports (unit-testable). */

/** One random item from a list. Throws on an empty list so a broken word list is noticed. */
export function pick<T>(list: readonly T[]): T {
    if (!list.length) throw new Error("This list is empty. Add some entries in the plugin settings.");
    return list[Math.floor(Math.random() * list.length)];
}

/** One random item where each entry has a weight (weight 2 = twice as likely). */
export function pickWeighted<T>(items: readonly { item: T; weight: number }[]): T {
    if (!items.length) throw new Error("This list is empty. Add some entries in the plugin settings.");
    const total = items.reduce((sum, i) => sum + Math.max(0, i.weight), 0);
    let roll = Math.random() * total;
    for (const i of items) {
        roll -= Math.max(0, i.weight);
        if (roll < 0) return i.item;
    }
    return items[items.length - 1].item;
}

/** "hello" -> "Hello". */
export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/** A whole number from min to max, both included. */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
