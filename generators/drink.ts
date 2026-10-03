import { drinkGeneratorSettings } from "settings/Datatypes";
import { pick } from "utils/random";

export function generatorDrinks(settings: drinkGeneratorSettings): string {
    // Some words are both an adjective and part of a drink ("Cherry Blossom", "Tonic"), so a few
    // combinations repeat a word ("Tonic Tonic"); try again when that happens.
    let drink = oneDrink(settings);
    for (let i = 0; i < 20 && /\b(\S+) \1\b/i.test(drink); i++) drink = oneDrink(settings);
    return drink;
}

function oneDrink(settings: drinkGeneratorSettings): string {
    const first = pick(settings.adj);
    const words = [first];
    if (Math.random() < 0.5 && settings.adj.length > 1) {
        let second = pick(settings.adj);
        for (let i = 0; i < 5 && second === first; i++) second = pick(settings.adj);
        if (second !== first) words.push(second);
    }
    return `${words.join(" ")} ${pick(settings.nouns)}`;
}
