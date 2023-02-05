import { currency } from "main";

export function generateLoot(enableCurrency: boolean, currencyFrequency: number, currencyTypes: currency[]) {
    const adjectives = ["old", "tattered", "rotten", "shiny", "polished", "rusty", "broken", "priceless", "ancient", "precious"];
    const nouns = ["bag", "scroll", "book", "map", "key", "ring", "necklace", "potion","ball bearing", "alchemists fire", "antitoxin", "caltrop", "book", "candle", "map scroll", "chain", "climbers kit", "crowbar", "fishing tackle", "holy water", "hunting trap", "lantern", "lock", "oil", "poison", "ram portable", "spyglass", "tent", "bucket", "glass bottle", "chest", "signet ring", "sealing wax", "whetstone", "arrows", "bolt", "censer", "dice set", "dragonchess set", "flute", "glass blowers tool", "holy oil", "lute", "playing card set", "sack", "saddle", "sovereign glue", "universal solvent", "prosthetic wooden arm", "hook hand", "peg leg", "glass eye", "bag of marbles", "hatchet", "alchemists supplies", "brewers supplies", "burglars pack", "lockpicks", "calligrapher’s supplies", "carpenter's tool", "cartographers tool", "chain mail", "cooks utensil", "disguise kit", "dungeoneers pack", "entertainers pack", "explorers pack", "forgery kit", "half plate", "healers kit", "ink", "ink pen", "parchment", "shovel", "leather worker's tool", "masons tool", "navigator's tool", "net", "painters supplies", "perfume", "plate armor", "potters tool", "priests pack", "ring mail", "scale mail", "scholar's pack", "scimitar", "shield", "whistle", "smiths tool", "thieves tool", "torch", "weaver's tool", "cobblers tool", "jewelers tools", "tinkers tool", "poisoners kit", "herbalism kit", "bell", "block and tackle", "animal or pet", "traveler's clothes", "fine clothes"];
    
    const ItemAmount = Math.floor(Math.random() * (5 - 1 + 1)) + 1;

    let loot = '';

    for (let index = 0; index < ItemAmount; index++) {
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const amount = generateRareHighNumber(50, 0.1);
        const vowels = ["a", "e", "i", "o", "u"];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]; 
        const vowelOrNot = isFirstCharInArray(vowels, randomAdjective) ? "an" : "a";
        let addS = randomNoun;
        if (!(randomNoun[randomNoun.length-1] === "e") && !(randomNoun[randomNoun.length] === "s")) {
            addS = randomNoun[randomNoun.length] === "s" ? randomNoun + "'s" : randomNoun + "s";
        }
            amount > 1 ? loot += `${amount} ${randomAdjective} ${addS}` : loot += `${vowelOrNot} ${randomAdjective} ${randomNoun}`;
        loot += ", "
    }

    if (enableCurrency) {
        let currencyLoot = '';
        const shouldGenCurrency = Math.floor(Math.random() * 100);
        if (shouldGenCurrency < currencyFrequency) {
            currencyTypes.forEach(element => {
                const randomCurrencyAmount = generateRareHighNumberByRarity(element.rarity);
                if (randomCurrencyAmount > 0) {
                    currencyLoot += randomCurrencyAmount + " " + element.name + ", ";
                }
            });
        }

        loot += currencyLoot;
    }

    return loot;
}
function isFirstCharInArray(array: string[], string: string) {
    return array.includes(string[0]);
}
 
function generateRareHighNumber(maxNumber: number, rarityFactor: number) {
    const randomNumber = Math.random();
    
    if (randomNumber < rarityFactor) {
      return Math.floor(Math.random() * maxNumber);
    } else {
      return Math.floor(Math.random() * (maxNumber / 10));
    }
}
  
function generateRareHighNumberByRarity(rarity: string) {
    let rarityFactor = 0;
    let maxNumber = 0;
    const randomNumber = Math.random();
    const isZero = Math.random();

    if (rarity === "common" && isZero > 0.3) {
        rarityFactor = 0.7;
        maxNumber = 300;
    }

    if (rarity === "uncommon" && isZero > 0.5) {
        rarityFactor = 0.5;
        maxNumber = 150;
    }

    if (rarity === "rare" && isZero > 0.8) {
        rarityFactor = 0.2
        maxNumber = 30
    }

    if (rarity === "rarest" && isZero > 0.98) {
        rarityFactor = 0.02
        maxNumber = 10
    }

    if (rarityFactor === 0) {
        return 0;
    }
    
    if (randomNumber < rarityFactor) {
      return Math.floor(Math.random() * maxNumber);
    } else {
      return Math.floor(Math.random() * (maxNumber / 10));
    }
}