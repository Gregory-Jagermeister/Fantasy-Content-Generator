const adjectives = ["Mighty", "Grand", "Brave", "Fearless", "Majestic", "Mighty", "Powerful", "Glorious", "Magnificent", "Majestic"];
const nouns = ["Wind", "Wave", "Storm", "Thunder", "Sea", "Ocean", "Voyager", "Adventurer", "Explorer", "Navigator"];

const prefixes = ["AE", "AFS", "AHT", "AHTS", "AO","AE",
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

const vowels = ['a', 'e', 'i', 'o', 'u'];
const syllables = ["an", "ar", "ast", "at", "cal", "chi", "cy", "dan", "eir","ba","th","tho","tri","tr", "el", "end",
"ent", "est", "ian", "ic", "il", "in", "ir", "it", "kil", "kor", "ler", "lor",
"man", "mar", "mei", "mon", "ner", "or", "ore", "rak", "ri", "ris", "ry", "se",
    "ser", "tor", "tos", "um", "ys", "zor","ka","ra","go","shi","ma","to","zo","ro","lo"];

export function generateShipName() {
    const adjective = randomItemFromArray(adjectives);
    const prefix = randomItemFromArray(prefixes);
    const noun = randomItemFromArray(nouns);
    let generatedName = '';
    const numSyllables = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < numSyllables; i++) {
        const syllableIndex = Math.floor(Math.random() * syllables.length);
        generatedName += syllables[syllableIndex];
        if (i < numSyllables - 1) {
            const vowelIndex = Math.floor(Math.random() * vowels.length);
            generatedName += vowels[vowelIndex];
        }
    }
    generatedName = capitalizeFirstLetter(generatedName);
    return Math.random() < 0.5 ? `${adjective} ${noun} of ${generatedName}` : `${prefix} ${adjective} ${generatedName}`;
}


function randomItemFromArray(array:string[]) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}