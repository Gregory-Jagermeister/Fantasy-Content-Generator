import { cityGeneratorSetting } from "settings/Datatypes";

export function generateCityName(settings : cityGeneratorSetting) {
    const prefixes = settings.prefixArray;
    const suffixes = settings.suffixArray;
  
    const syllables = ["ab", "ac", "al", "am", "an", "ap", "apo", "ar", "arr", "as", "ast", "at", "ate", "au", "av", "ay", "aye", "ba", "be", "ben", "bo", "br", "bri", "bu", "bur", "ca", "cal", "car", "ce", "chi", "ci", "ck", "co", "com", "con", "cor", "cy", "d", "da", "dan", "dar", "de", "den", "di", "do", "dor", "du", "dur", "ed", "el", "en", "eon", "er", "es", "ey", "fa", "far", "fe", "fi", "fin", "fo", "for", "foy", "fr", "fu", "ga", "gal", "ge", "gi", "gil", "gin", "go", "gor", "gr", "gu", "ha", "han", "har", "he", "hi", "hin", "ho", "hoe", "hos", "hu", "ic", "il", "ill", "in", "ing", "ion", "ir", "irk", "is", "ja", "je", "jen", "jo", "ju", "ka", "ke", "ker", "ki", "kir", "ko", "la", "lan", "las", "le", "ler", "li", "lin", "lis", "lo", "lor", "loy", "lu", "ma", "mac", "mal", "man", "mas", "me", "mi", "mo", "mon", "mu", "mul", "mur", "na", "nal", "ne", "ni", "no", "nor", "nov", "nu", "och", "ode", "oka", "ol", "ome", "on", "op", "or", "ore", "os", "ou", "ous", "pa", "par", "pe", "pen", "pi", "po", "pol", "pon", "por", "pu", "qu", "ra", "re", "ri", "ro", "ru", "sa", "se", "si", "so", "su", "ta", "te", "ti", "to", "tu", "ul", "un", "ur", "us", "va", "ve", "vi", "vo", "vu", "wa", "we", "wi", "wo", "wu", "y", "ya", "ye", "yi", "yo", "yu", "za", "ze", "zi", "zo"];

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