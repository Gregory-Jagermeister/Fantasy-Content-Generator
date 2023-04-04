import { rollD100, rollD20, weightedRandomItem } from "settings/Datatypes";

//Inspiration for this Generator Was taken from Spectactular Settlements Published By Nord Games. https://nordgamesllc.com/product/spectacular-settlements/ Please Buy the Book if you like this Generator.
const specialtyOptions: string[] = ["Atypical Shipping Methods", "Food & Drink", "Hospitality", "Information", "Purchasing Connections", "Unscrupulous Contractors"];

const ageOptions: { string: string, range: number[] }[] = [
    { string: "Established", range: [4, 8] },
    { string: "Mature", range: [9, 13] },
    { string: "Old", range: [14, 17] },
    { string: "Recently Established", range: [1, 3] },
    { string: "Ancient", range: [18, 19] },
    { string: "Unknown", range: [20, 20] },
];

const conditionOptions: { string: string, range: number[] }[] = [
    { string: "Ramshackled", range: [1, 2] },
    { string: "Poor", range: [3, 6] },
    { string: "Fair", range: [7, 14] },
    { string: "Good", range: [15, 18] },
    { string: "Immaculate", range: [19, 20] },
];

const visitorTrafficOptions: { string: string, range: number[] }[] = [
    { string: "Vacant: No one is really visiting.", range: [1, 2] },
    { string: "Groups: Visitors are a rarity, though a few might be around.", range: [3, 6] },
    { string: "Crowds: It's typical to see new visitors most days.", range: [7, 14] },
    { string: "Droves: New people come in and out of this trading post.", range: [15, 18] },
    { string: "Masses: The post is swarming with faces that would not be deemed as familiar.", range: [19, 20] },
];

const sizeOptions: { string: string, range: number[] }[] = [
    { string: "Tiny", range: [1, 2] },
    { string: "Small", range: [3, 6] },
    { string: "Medium", range: [7, 14] },
    { string: "Large", range: [15, 18] },
    { string: "Very Large", range: [19, 20] },
];

const environmentOptions: { string: string, range: number[] }[] = [
    { string: "Mountainous", range: [1, 2] },
    { string: "Desert", range: [3, 4] },
    { string: "Valley", range: [5, 6] },
    { string: "Swamp", range: [7, 8] },
    { string: "Plains", range: [9, 10] },
    { string: "Coastal", range: [11, 12] },
    { string: "Forest", range: [13, 14] },
    { string: "River", range: [15, 16] },
    { string: "Tundra", range: [17, 18] },
    { string: "Underground", range: [19, 20] }
];

const residentPopulationOptions: { string: string, range: number[] }[] = [
    { string: "Nearly Deserted", range: [1, 2] },
    { string: "Sparse", range: [3, 6] },
    { string: "Comfortable", range: [7, 14] },
    { string: "Congested", range: [15, 18] },
    { string: "Overwhelmed", range: [19, 20] },
];

const visitorDispositionOptions: { string: string, range: number[] }[] = [
    { string: "Hostile", range: [1, 2] },
    { string: "Unfriendly", range: [3, 6] },
    { string: "Neutral", range: [7, 14] },
    { string: "Friendly", range: [15, 18] },
    { string: "Open", range: [19, 20] },
];

const lawEnforcementOptions = [
    { string: "None", range: [1, 2] },
    { string: "Sheriff", range: [3, 6] },
    { string: "Local Watch", range: [7, 14] },
    { string: "Well-equipped", range: [15, 18] },
    { string: "Overwhelmingly Present", range: [19, 20] },
];

const leadershipOptions: { string: string, range: number[] }[] = [
    { string: "No Leader", range: [1, 1] },
    { string: "Hereditary", range: [2, 4] },
    { string: "Merchant Monarch", range: [5, 7] },
    { string: "Underworld or Criminal", range: [8, 10] },
    { string: "Oligarchy", range: [11, 13] },
    { string: "Local Council", range: [14, 16] },
    { string: "Single Elected Leader", range: [17, 19] },
    { string: "Commune", range: [20, 20] }
];

const wealthOptions: { string: string, range: number[] }[] = [
    { string: "Destitute", range: [1, 2] },
    { string: "Impoverished", range: [3, 6] },
    { string: "Average", range: [7, 14] },
    { string: "Prosperous", range: [15, 17] },
    { string: "Wealthy", range: [18, 19] },
    { string: "Affluent", range: [20, 20] }
];

const crimeOptions: { string: string, range: number[] }[] = [
    { string: "Regular", range: [1, 2] },
    { string: "Common", range: [3, 6] },
    { string: "Average", range: [7, 14] },
    { string: "Uncommon", range: [15, 18] },
    { string: "Rare", range: [19, 20] }
];

const shopOptions: { string: string, range: number[] }[] = [
    { string: "Baker", range: [1, 4] },
    { string: "Butcher", range: [5, 8] },
    { string: "Cooper", range: [9, 12] },
    { string: "Carpenter", range: [13, 16] },
    { string: "General Store", range: [17, 24] },
    { string: "Herbalist", range: [25, 28] },
    { string: "Smithy", range: [29, 36] },
    { string: "Tailor", range: [37, 40] },
    { string: "Tanner", range: [41, 44] },
    { string: "Thatcher", range: [45, 48] },
    { string: "Wainwright", range: [49, 52] },
    { string: "Weaver", range: [53, 56] },
    { string: "Alchemist", range: [57, 59] },
    { string: "Artist", range: [60, 62] },
    { string: "Bank/Exchange", range: [63, 65] },
    { string: "Cobbler", range: [66, 68] },
    { string: "Foundry", range: [69, 71] },
    { string: "Mill", range: [72, 74] },
    { string: "Textile Production", range: [75, 77] },
    { string: "Shipwright", range: [78, 80] },
    { string: "Rare Botanicals", range: [81, 82] },
    { string: "Luxury Furnishings", range: [83, 84] },
    { string: "Rare Trade Goods", range: [85, 86] },
    { string: "Rare Drink Brewery", range: [87, 88] },
    { string: "Magic Shop-Armor", range: [89, 90] },
    { string: "Magic Shop-Books", range: [91, 92] },
    { string: "Magic Shop-Clothing", range: [93, 94] },
    { string: "Magic Shop-Jewelry", range: [95, 96] },
    { string: "Magic Shop-Weapons", range: [97, 98] },
    { string: "Magic Shop-Miscellaneous & Curiosities", range: [99, 100] }
];

const serviceOptions: { string: string, range: number[] }[] = [
    { string: "Barber", range: [1, 8] },
    { string: "Bathhouse", range: [9, 16] },
    { string: "Doctor/Apothercary", range: [17, 24] },
    { string: "House of Leisure (GM Discretion)", range: [25, 32] },
    { string: "Inn", range: [33, 44] },
    { string: "Club", range: [45, 52] },
    { string: "Soothsayer", range: [53, 60] },
    { string: "Stable", range: [61, 68] },
    { string: "Tavern", range: [69, 80] },
    { string: "Hired Help - Muscle", range: [81, 82] },
    { string: "Hired Help - Assassins/Thieves", range: [83, 84] },
    { string: "Hired Help - Ranged Attack Specialists", range: [85, 86] },
    { string: "Hired Help - Scribes and Clerks", range: [87, 88] },
    { string: "Hired Help - Caravans and Mounts", range: [89, 90] },
    { string: "Hired Help - Arcane Academics/Inventors", range: [91, 92] },
    { string: "Hired Help - Magic Mercs", range: [93, 94] },
    { string: "Hired Help - Religious Guidance", range: [95, 96] },
    { string: "Hired Help - Divine Specialists", range: [97, 98] },
    { string: "Hired Help - Guides and Trackers", range: [99, 100] }
];
const origins: string[] = [
    "Accidental: 'the trading post came about due to an accident, such as a caravan breaking down or mistaken directions. What was set up to deal with the eventually become the trading post.'",
    "Business Venture: 'The trading post was established by a wealthy entrepreneur specifically to be a trading post from the start.'",
    "Crossroads: 'The trading post is at the intersection of more than one major trade route.'",
    "Military Outpost: 'The trading post was built on the remnants of an old fortress or watchtower, the structures of which have long since fallen down or been repurposed by the locals.'",
    "No Man's Land: 'The trading post was established as a neutral place where opposing forces could purchase wares, without encroaching on enemy territory.'",
    "Native: 'The trading post was started by someone native to the area, who saw potential in trade with passersby.'",
    "Overnight Stop: 'The trading post was originally a single, large house for overnight stays for weary travellers, which soon grew, along with the demand for accommodations.'",
    "Wilderness Expert: 'The trading post was started when a trapper, hunter or guide set up a camp, in order to aid those passing through the area.'",
    "Religious: 'The trading post was established by a religious order, as a means of supporting their ministry.'",
    "River Crossing: 'The trading post was built near a major river crossing so that traders could more easily cross and barter their goods.'",
    "Pilgrimage: 'The trading post was set up to serve the needs of people travelling on a pilgrimage.'",
    "King's Grant: 'The trading post was established as part of a royal grant, as a means of encouraging trade and commerce in the region.'",
    "Scavengers: 'The trading post was created by a group of scavengers, who had discovered a valuable resource or sought to capitalize on the needs of travellers.'",
    "Fishing Group: 'The trading post was established by a Group of Fishermen, in order to support a nearby population and capitalize on the sea trade.'",
    "Frontier Expansion: 'The trading post was established as part of a larger effort to expand the kingdom's frontier, and to open up new trade routes.'"
];



export function generateTradingPost(): string {
    let visitorTrafficMod = 0;
    let popWealth = 0;
    let sizeMod = 0;
    let crimeMod = 0;

    const origin = origins[Math.floor(Math.random() * origins.length)];
    const specialiaty = specialtyOptions[Math.floor(Math.random() * specialtyOptions.length)];

    const age = ageRoll();
    visitorTrafficMod += age.mod;

    const condition = conditionRoll();
    popWealth += condition.mod;

    const visitorTraffic = visitorTrafficRoll(visitorTrafficMod);
    sizeMod += visitorTraffic.mod[0];
    crimeMod += visitorTraffic.mod[1];

    const postSize = weightedRandomItem(sizeOptions, rollD20(sizeMod));
    const environment = weightedRandomItem(environmentOptions, rollD20(0));

    const residentPop = residentPopRoll();
    crimeMod += residentPop.mod;

    const visitorDisposition = weightedRandomItem(visitorDispositionOptions, rollD20(0));
    const lawEnforcement = lawEnforcementRoll();
    crimeMod += lawEnforcement.mod;

    const leadership = leadershipRoll();
    const wealth = wealthRoll(popWealth);

    crimeMod += wealth.mod;

    const crime = weightedRandomItem(crimeOptions, rollD20(crimeMod));

    const shops = shopRoll(postSize as string);
    const services = serviceRoll(postSize as string);

    return `Origin: ${origin}\nSpeciality: ${specialiaty}\nAge: ${age.string}\nCondition: ${condition.string}\nVisitor Traffic: ${visitorTraffic.string}\nTrading Post Size: ${postSize}\nEnvironment: ${environment}\nResident Population: ${residentPop.string}\nDisposition to Visitors: ${visitorDisposition}\nLaw Enforcement: ${lawEnforcement.string}\nLeadership: ${leadership}\nWealth: ${wealth.string}\nCrime: ${crime}\nShops: ${shops}\nServices: ${services}`

}

function serviceRoll(tradingPostSize: string): string {
    let shopAmount = 0;

    switch (tradingPostSize) {
        case "Tiny":
            shopAmount = Math.floor((Math.random() * 6) + 1);
            break;
        case "Small":
            shopAmount = Math.floor((Math.random() * 6) + 1) + 1;
            break;
        case "Medium":
            shopAmount = Math.floor((Math.random() * 6) + 1) + 3;
            break;
        case "Large":
            shopAmount = Math.floor((Math.random() * 6) + 1) + 5;
            break;
        case "Very Large":
            shopAmount = Math.floor((Math.random() * 6) + 1) + 7;
            break;

        default:
            break;
    }

    const services: string[] = [];
    for (let index = 0; index < shopAmount; index++) {
        const roll: string = weightedRandomItem(serviceOptions, rollD100(0)) as string;
        let hiredHelp = "";
        if (roll.includes("Hired Help")) {
            const helpSize = Math.floor((Math.random() * 12) + 1);
            if (helpSize <= 6) {
                hiredHelp = ": An Individual Person who is hiring out their services of this type";
            }
            if (helpSize <= 10) {
                hiredHelp = ": A Team of people who are hiring out their services of this type";
            } else {
                hiredHelp = ": A Guild that is organised for this type of service "
            }
        }
        services.push(`${roll + hiredHelp}`);
    }

    return generateStringWithCounts(services);
}


function shopRoll(tradingPostSize: string): string {
    let shopAmount = 0;

    switch (tradingPostSize) {
        case "Tiny":
            shopAmount = Math.floor((Math.random() * 8) + 1) + 2;
            break;
        case "Small":
            shopAmount = Math.floor((Math.random() * 8) + 1) + 4;
            break;
        case "Medium":
            shopAmount = Math.floor((Math.random() * 8) + 1) + 6;
            break;
        case "Large":
            shopAmount = Math.floor((Math.random() * 8) + 1) + 8;
            break;
        case "Very Large":
            shopAmount = Math.floor((Math.random() * 8) + 1) + 10;
            break;

        default:
            break;
    }

    const shops: string[] = [];
    for (let index = 0; index < shopAmount; index++) {
        const roll: string = weightedRandomItem(shopOptions, rollD100(0)) as string;
        shops.push(roll);
    }

    console.log(shops);

    return generateStringWithCounts(shops);
}

function leadershipRoll(): string {
    const roll: string = weightedRandomItem(leadershipOptions, rollD20(0)) as string;
    let result = roll;

    leadershipOptions.forEach(element => {
        if (element.string === roll) {
            if (element.string === leadershipOptions[4].string) {
                const sway = Math.floor((Math.random() * 4) + 1);
                switch (sway) {
                    case 1:
                        result = "Plutocracy (Merchant Group Runs the Post)";
                        break;
                    case 2:
                        result = "Magocracy (Mages and Magic users Run the Post)";
                        break;
                    case 3:
                        result = "Theocracy (Priests and Religious Orders Run the Post)";
                        break;
                    case 4:
                        result = "A Small unknown group Runs the Post";
                        break;
                    default:
                        break;
                }
            }
        }
    });

    return result;
}

function ageRoll(): { string: string, mod: number } {
    const roll: string = weightedRandomItem(ageOptions, rollD20(0)) as string;

    if (roll === ageOptions[0].string) {
        return { string: roll, mod: 0 }
    }

    if (roll === ageOptions[1].string) {
        return { string: roll, mod: 1 };
    }

    if (roll === ageOptions[2].string) {
        return { string: roll, mod: 2 };
    }

    if (roll === ageOptions[3].string) {
        return { string: roll, mod: -1 };
    }

    if (roll === ageOptions[4].string) {
        return { string: roll, mod: 3 };
    }
    return { string: roll, mod: 4 };
}

function wealthRoll(mod: number): { string: string, mod: number } {
    const roll: string = weightedRandomItem(wealthOptions, rollD20(mod)) as string;

    if (roll === ageOptions[0].string) {
        return { string: roll, mod: -4 }
    }

    if (roll === ageOptions[1].string) {
        return { string: roll, mod: -2 };
    }

    if (roll === ageOptions[2].string) {
        return { string: roll, mod: 0 };
    }

    if (roll === ageOptions[3].string) {
        return { string: roll, mod: -1 };
    }

    if (roll === ageOptions[4].string) {
        return { string: roll, mod: -2 };
    }

    return { string: roll, mod: -4 };

}



function conditionRoll(): { string: string, mod: number } {
    const roll: string = weightedRandomItem(conditionOptions, rollD20(0)) as string;

    if (roll === ageOptions[0].string) {
        return { string: roll, mod: -6 }
    }

    if (roll === ageOptions[1].string) {
        return { string: roll, mod: -3 };
    }

    if (roll === ageOptions[2].string) {
        return { string: roll, mod: 0 };
    }

    if (roll === ageOptions[3].string) {
        return { string: roll, mod: 3 };
    }

    return { string: roll, mod: 6 };

}

function visitorTrafficRoll(mod: number): { string: string, mod: number[] } {
    const roll: string = weightedRandomItem(visitorTrafficOptions, rollD20(mod)) as string;

    if (roll === ageOptions[0].string) {
        return { string: roll, mod: [0, 2] }
    }

    if (roll === ageOptions[1].string) {
        return { string: roll, mod: [1, 1] };
    }

    if (roll === ageOptions[2].string) {
        return { string: roll, mod: [2, 0] };
    }

    if (roll === ageOptions[3].string) {
        return { string: roll, mod: [3, -1] };
    }

    return { string: roll, mod: [4, -2] };

}

function residentPopRoll(): { string: string, mod: number } {
    const roll: string = weightedRandomItem(residentPopulationOptions, rollD20(0)) as string;

    if (roll === ageOptions[0].string) {
        return { string: roll, mod: 2 }
    }

    if (roll === ageOptions[1].string) {
        return { string: roll, mod: 1 };
    }

    if (roll === ageOptions[2].string) {
        return { string: roll, mod: 0 };
    }

    if (roll === ageOptions[3].string) {
        return { string: roll, mod: -1 };
    }

    return { string: roll, mod: -2 };

}

function lawEnforcementRoll(): { string: string, mod: number } {
    const roll: string = weightedRandomItem(lawEnforcementOptions, rollD20(0)) as string;

    if (roll === ageOptions[0].string) {
        return { string: roll, mod: -8 }
    }

    if (roll === ageOptions[1].string) {
        return { string: roll, mod: -4 };
    }

    if (roll === ageOptions[2].string) {
        return { string: roll, mod: 0 };
    }

    if (roll === ageOptions[3].string) {
        return { string: roll, mod: 4 };
    }

    return { string: roll, mod: 8 };

}

function generateStringWithCounts(arr: string[]): string {
    const counts: Record<string, number> = {};
    for (const item of arr) {
        counts[item] = (counts[item] || 0) + 1;
    }
    let result = "";
    for (const item in counts) {
        const count = counts[item];
        const itemString = count > 1 ? `${item}s` : item;
        if (result === "") {
            result = `${count} ${itemString}`;
        } else {
            result = `${result}, ${count} ${itemString}`;
        }
    }
    return result;
}