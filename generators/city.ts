import { cityGeneratorSetting } from "settings/Datatypes";

export function generateCityName(settings : cityGeneratorSetting) {
    const prefixes = settings.prefixArray;
    const suffixes = settings.suffixArray;
  
    const syllables = [
        'ab', 'ac', 'ad', 'al', 'an', 'ap', 'ar', 'as', 'at', 'au',
        'ba', 'be', 'bi', 'bo', 'bu',
        'ca', 'ce', 'ci', 'co', 'cu',
        'da', 'de', 'di', 'do', 'du',
        'ea', 'eb', 'ec', 'ed', 'el', 'em', 'en', 'er', 'es', 'et', 'eu',
        'fa', 'fe', 'fi', 'fo', 'fu',
        'ga', 'ge', 'gi', 'go', 'gu',
        'ha', 'he', 'hi', 'ho', 'hu',
        'ia', 'ib', 'ic', 'id', 'ie', 'if', 'ig', 'il', 'im', 'in', 'io', 'ip', 'ir', 'is', 'it', 'iu',
        'ja', 'je', 'ji', 'jo', 'ju',
        'ka', 'ke', 'ki', 'ko', 'ku',
        'la', 'le', 'li', 'lo', 'lu',
        'ma', 'me', 'mi', 'mo', 'mu',
        'na', 'ne', 'ni', 'no', 'nu',
        'oa', 'ob', 'oc', 'od', 'oe', 'of', 'og', 'oi', 'oj', 'ok', 'ol', 'om', 'on', 'oo', 'op', 'or', 'os', 'ot', 'ou', 'ov', 'ow', 'ox', 'oz',
        'pa', 'pe', 'pi', 'po', 'pu',
        'qa', 'qe', 'qi', 'qo', 'qu',
        'ra', 're', 'ri', 'ro', 'ru',
        'sa', 'se', 'si', 'so', 'su',
        'ta', 'te', 'ti', 'to', 'tu',
        'wa', 'we', 'wi', 'wo', 'wu',
        'xa', 'xe', 'xi', 'xo', 'xu',
        'ya', 'ye', 'yi', 'yo', 'yu',
        'za', 'ze', 'zi', 'zo'
    ];

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
    return numSyllables > 3 ? `${prefix} ${generatedName}` : `${generatedName}${suffix}`;
}
  
function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}