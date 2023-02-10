import { dungeonGenSettings } from "main";

export function generateDungeonName(settings: dungeonGenSettings): string {
    const prefix: string[] = settings.dungeonTypes;
    const adjective: string[] = settings.adjectives;
    const noun: string[] = settings.nouns;
    const locations: string[] = settings.locations;
    const randomDesc: string[] = settings.randomDesc;

    const prefixIndex = Math.floor(Math.random() * prefix.length);
    const adjIndex = Math.floor(Math.random() * adjective.length);
    const locIndex = Math.floor(Math.random() * locations.length);
    const randomDescIndex = Math.floor(Math.random() * randomDesc.length);
    const nounIndex = Math.floor(Math.random() * noun.length);
    const usePrefix = Math.random() > 0.5;

    let result;

    if (usePrefix) {
        result = {
            name: `${prefix[prefixIndex]} of the ${adjective[adjIndex]}  ${noun[nounIndex]}`,
            description: generateDungeonDescription(locations[locIndex], prefix[prefixIndex], randomDesc[randomDescIndex])
        };
    } else {
        result = {
            name: `The ${adjective[adjIndex]} ${noun[nounIndex]}`,
            description: generateDungeonDescription(locations[locIndex], prefix[prefixIndex], randomDesc[randomDescIndex])
        }
    }

    return `${result.name}\nDescription: ${result.description}`
}

function generateDungeonDescription(location: string, dungeonType: string, randomDesc: string): string {
    const templates = [
        `Located in ${location}, this ${dungeonType} is known for ${randomDesc}.`,
        `A ${dungeonType} that is known for ${randomDesc}.`,
        `In the heart of ${location} lies this ${dungeonType}, notorious for ${randomDesc}.`,
        `Deep within ${location}, the ${dungeonType} is feared for its ${randomDesc}.`,
        `This ${dungeonType} located in ${location} is infamous for its ${randomDesc}.`,
        `The ${dungeonType} in ${location} is a place to be reckoned with, famous for its ${randomDesc}.`
    ];

    const templateIndex = Math.floor(Math.random() * templates.length);

    return templates[templateIndex];
}