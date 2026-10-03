/* Settlement type and population (replaces the fantasy-content-generator package, D18). */
import { pick, randomInt } from "utils/random";

export interface SettlementType {
    label: string;
    minPop: number;
    maxPop: number;
}

/** Smallest to largest. Ranges set by Daniel (Decisions D18, 2026-10-03). */
export const SETTLEMENT_TYPES: readonly SettlementType[] = [
    { label: "Thorp", minPop: 5, maxPop: 20 },
    { label: "Hamlet", minPop: 20, maxPop: 80 },
    { label: "Village", minPop: 80, maxPop: 400 },
    { label: "Small Town", minPop: 400, maxPop: 900 },
    { label: "Medium Town", minPop: 900, maxPop: 2000 },
    { label: "Large Town", minPop: 2000, maxPop: 5000 },
    { label: "Small City", minPop: 5000, maxPop: 10000 },
    { label: "Medium City", minPop: 10000, maxPop: 20000 },
    { label: "Large City", minPop: 20000, maxPop: 50000 },
    { label: "Great City", minPop: 50000, maxPop: 100000 },
    { label: "Metropolis", minPop: 100000, maxPop: 5000000 },
];

/** A random settlement type with a population inside its range. */
export function generateSettlement(): { type: SettlementType; population: number } {
    const type = pick(SETTLEMENT_TYPES);
    return { type, population: randomInt(type.minPop, type.maxPop) };
}
