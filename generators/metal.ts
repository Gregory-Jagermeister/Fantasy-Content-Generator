export const METAL_SUFFIXES = ["sium", "cium", "lium", "rium", "trium", "tium", "nese", "nium", "sten", "nor", "tine", "ntine", "rhil", "thil", "nyx", "dian","ium", "ese", "alt", "um", "ian", "il", "ine", "yx", "ite"];
export const METAL_SYLLABLES = ["zor", "lyn", "kae", "vel", "dris", "ris", "lin", "mal", "zet", "ver", "cor", "ron", "ten", "tan", "del", "per"];

export function generatorMetals() {

	let name = "";
	const suffix = METAL_SUFFIXES[Math.floor(Math.random() * METAL_SUFFIXES.length)];
	const syllablesCount = Math.floor(Math.random() * 2) + 1;

	for (let i = 0; i < syllablesCount; i++) {
		name += METAL_SYLLABLES[Math.floor(Math.random() * METAL_SYLLABLES.length)];
	}

	return name[0].toUpperCase() + name.slice(1) + suffix;

}