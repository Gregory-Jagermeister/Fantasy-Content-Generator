import { currency, lootTables } from "settings/Datatypes";

export function generateLoot(enableCurrency: boolean, currencyFrequency: number, currencyTypes: currency[], lootTable: lootTables) {
    const { adj, items } = lootTable;
    const itemAmount = Math.floor(Math.random() * 5) + 1;

    let loot = '';
    for (let index = 0; index < itemAmount; index++) {
        const randomAdjective = adj[Math.floor(Math.random() * adj.length)];
        const amount = generateRareHighNumber(50, 0.1);
        const randomNoun = getRandomElement(items);
        const article = /^[aeiou]/i.test(randomAdjective) ? 'an' : 'a';
        const plural = randomNoun?.endsWith('s') ? `${randomNoun}'` : `${randomNoun}s`;

        loot += `${amount > 1 ? `${amount} ${randomAdjective} ${plural}` : `${article} ${randomAdjective} ${randomNoun}`}, `;
    }

    if (enableCurrency) {
        const shouldGenCurrency = Math.random() * 100;
        const currencyLoot = currencyTypes
            .map((element) => {
                const randomCurrencyAmount = generateRareHighNumberByRarity(element.rarity);
                return randomCurrencyAmount > 0 ? `${randomCurrencyAmount} ${element.name}, ` : '';
            })
            .join('');

        if (shouldGenCurrency < currencyFrequency) {
            loot += currencyLoot;
        }
    }

    return loot.slice(0, -2);
}

function generateRareHighNumber(maxNumber: number, rarityFactor: number) {
    const randomNumber = Math.random();
    const rarity = randomNumber < rarityFactor ? rarityFactor : rarityFactor / 10;

    return Math.floor(Math.random() * maxNumber * rarity);
}

function generateRareHighNumberByRarity(rarity: string) {
    const rarityFactors: { [key: string]: number } = { common: 0.7, uncommon: 0.5, rare: 0.2, rarest: 0.02 };
    const maxNumbers: { [key: string]: number } = { common: 300, uncommon: 150, rare: 30, rarest: 10 };
    const randomNumber = Math.random();

    if (randomNumber > rarityFactors[rarity] || rarityFactors[rarity] === undefined) {
        return 0;
    }

    return Math.floor(Math.random() * maxNumbers[rarity]);
}

function getRandomElement<T>(arr: { item: T, weight: number }[]): T | undefined {
    const totalWeight = arr.reduce((acc, cur) => acc + cur.weight, 0);
    let randomWeight = Math.random() * totalWeight;
    for (const { item, weight } of arr) {
        if (randomWeight < weight) {
            return item;
        }
        randomWeight -= weight;
    }
    return undefined;
}