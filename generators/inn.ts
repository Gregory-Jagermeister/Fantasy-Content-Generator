import { innGeneratorSettings } from "settings/Datatypes";
import { pick } from "utils/random";
interface Inn {
    name: string;
    description: string;
    rumors: string[];
  }
    
export function generateInn(settings: innGeneratorSettings): Inn {
    const { prefixes, innType, nouns, desc, rumors } = settings;
    return {
        name: `${pick(prefixes)} ${pick(nouns)} ${pick(innType)}`,
        description: pick(desc),
        rumors: pickDistinct(rumors, 3),
    };
}

/** Up to `n` different items from a list (fewer if it has fewer different items). */
export function pickDistinct<T>(list: readonly T[], n: number): T[] {
    const pool = [...new Set(list)];
    const out: T[] = [];
    while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    return out;
}
