export function generateCityName() {
    const prefixes = ["bald", "bank", "belle", "box", "bridge", "camp", "cannon", "castle", "clear", "day", "east", "edge", "ever", "fern", "forest", "fresh", "great", "knob", "knox", "mount", "morning", "new", "north", "pacific", "queens", "red", "ridge", "ring", "river", "rose", "sand", "south", "spring", "strath", "stock", "stoke", "stone", "water", "well", "west", "wood"];
    const suffixes = ["avon","bank", "bark", "barrow", "bay", "beach", "bell", "borough","berg", "bourne", "broad", "bridge", "brook", "brough", "burgh", "burn", "bury", "by", "canyon", "caster", "chester", "cliffe", "combe", "cot, cott", "cote", "cove", "creek", "croft", "crook", "dale", "den", "din", "dine", "don", "downs", "falls", "field", "fin", "flats", "ford", "fork", "gate", "grove", "gum", "ham", "harbour", "heights", "hill", "holm", "hurst", "ing", "kirk", "land", "lake", "latch", "lea", "leigh", "ley", "marsh", "mere", "minster", "mond", "mont", "more", "ness", "park", "pilly", "pine", "point", "pond", "ridge", "river", "rock", "sett", "side", "son", "stead", "stoke", "stone", "stow", "terrace", "thorpe", "ton", "tor", "town", "vale", "valley", "view", "village", "ville", "water", "well", "wharf", "wick", "wood", "worth"];
  
    const syllables = ["avon","ard","aber","ac","acc","ock","an", "ar", "ast", "at","ay","y","ey", "cal", "chi", "cy", "dan", "eir", "ba", "th", "tho", "tre","tro","tr", "tri", "tr", "el", "end",
        "ent", "est", "ian", "ic", "il", "in", "ir", "it", "kil", "kor", "ler", "lor",
        "man", "mar", "mei", "mon", "ner", "or", "ore", "rak", "ri", "ris", "ry", "se",
        "ser", "tor", "tos", "um", "ys", "zor", "ka", "ra", "go", "shi", "ma", "to", "zo", "ro", "lo",'ad',
        'blanc',
        'falc',
        'mil',
        'adel',
        'boff',
        'ferd',
        'mung',
        'adr',
        'bomb',
        'frob',
        'od',
        'ail',
        'bram',
        'fulb',
        'oth',
        'alb',
        'bung',
        'gam',
        'sab',
        'alm',
        'droc',
        'hald',
        'sam',
        'amb',
        'drog',
        'ham',
        'seg',
        'band',
        'durl',
        'hasc',
        'serl',
        'bard',
        'emm',
        'hod',
        'tob',
        'ben',
        'erd',
        'hug',
        'wan',
        'biff',
        'ern',
        'iv',
        'wig',
        'bild',
        'ever',
        'mark',
        'wyd'];

    let prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    let generatedName = '';
    const numSyllables = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < numSyllables; i++) {
        const syllableIndex = Math.floor(Math.random() * syllables.length);
        generatedName += syllables[syllableIndex];
    }
  
    generatedName = capitalizeFirstLetter(generatedName);
    prefix = capitalizeFirstLetter(prefix);
    return numSyllables > 2 ? `${prefix} ${generatedName}` : `${generatedName}${suffix}`;
}
  
function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}