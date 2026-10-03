import { pick, capitalize } from "utils/random";
export const SHIP_ADJECTIVES = ["Mighty", "Grand", "Brave", "Fearless", "Majestic", "Mighty", "Powerful", "Glorious", "Magnificent", "Majestic"];
export const SHIP_NOUNS = ["Wind", "Wave", "Storm", "Thunder", "Sea", "Ocean", "Voyager", "Adventurer", "Explorer", "Navigator"];

export const SHIP_PREFIXES = ["AE", "AFS", "AHT", "AHTS", "AO","AE",
"AFS",
"AHT",
"AHTS",
"AO",
"AOG",
"AOR",
"AOT",
"ASDS",
"ATB",
"CRV",
"C/F",
"CS",
"DB",
"DEPV",
"DLB",
"DCV",
"DSV",
"DV",
"ERRV",
"EV",
"FPSO",
"FPV",
"FPV",
"FT",
"FV",
"GTS",
"HLV",
"HMT",
"HMHS",
"HSC",
"HSF",
"HTV",
"IRV",
"ITB",
"LB",
    "LNG",
"LPG",
"MF",
"MFV",
"MS",
"MSV",
"MSY",
"MT",
"MTS",
"MV",
"MY",
"NB",
"NRV",
"NS",
"OSV",
"PS",
"PSV",
"QSMV",
"QTEV",
"RMS",
"RNLB",
"RRS",
    "RV",
    "RSV",
"SB",
"SL",
"SS",
"SSCV",
"SSS",
"SSV",
"ST",
"STS",
"STV",
"SV",
"SY",
"TB",
"TIV",
"TEV",
"TRSS",
"TS",
    "TRS",
"TSMV",
"TSS",
"TST",
"TT",
"TV",
"ULCC",
"VLCC",
"YD",
"YT",
"YMT",
"YTB",
"YTL",
"YTM",
"YW",
"YWN",
"YOS",
]

export const SHIP_VOWELS = ['a', 'e', 'i', 'o', 'u'];
export const SHIP_SYLLABLES = ["an", "ar", "ast", "at", "cal", "chi", "cy", "dan", "eir","ba","th","tho","tri","tr", "el", "end",
"ent", "est", "ian", "ic", "il", "in", "ir", "it", "kil", "kor", "ler", "lor",
"man", "mar", "mei", "mon", "ner", "or", "ore", "rak", "ri", "ris", "ry", "se",
    "ser", "tor", "tos", "um", "ys", "zor","ka","ra","go","shi","ma","to","zo","ro","lo"];

export function generateShipName() {
    const adjective = pick(SHIP_ADJECTIVES);
    const prefix = pick(SHIP_PREFIXES);
    const noun = pick(SHIP_NOUNS);
    let generatedName = '';
    const numSyllables = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < numSyllables; i++) {
        const syllableIndex = Math.floor(Math.random() * SHIP_SYLLABLES.length);
        generatedName += SHIP_SYLLABLES[syllableIndex];
        if (i < numSyllables - 1) {
            const vowelIndex = Math.floor(Math.random() * SHIP_VOWELS.length);
            generatedName += SHIP_VOWELS[vowelIndex];
        }
    }
    generatedName = capitalize(generatedName);
    return Math.random() < 0.5 ? `${adjective} ${noun} of ${generatedName}` : `${prefix} ${adjective} ${generatedName}`;
}


