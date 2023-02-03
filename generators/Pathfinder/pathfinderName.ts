import { catfolkFamilyNames } from "lists/catfolkFamilyNames";
import { familyNameList } from "lists/humanFamilyNames";
import { titleLastNames } from "lists/titleLastNames";

const pathfinderRaceMap = [{ race: "aasimars", generator: generateAasimars},
    {race: "catfolk", generator: generateCatfolk },
    {race: "fetchlings", generator: generateFetchlings},
    {race: "halfelf", generator: generateHalfElf},
    {race: "halforc", generator: generateHalfOrc},
    {race: "hobgoblin", generator: generateHobgoblin},
    {race: "ifrits", generator: generateIfrits},
    {race: "kobalds", generator: generateKobalds},
    {race: "oreads", generator: generateOreads},
    {race: "ratfolk", generator: generateRatfolk},
    {race: "sylphs", generator: generateSylphs},
    {race: "tengu", generator: generateTengu},
    {race: "tians", generator: generateTians},
    {race: "tiefling", generator: generateTiefling},
    {race: "undines", generator: generateUndines}];

function randomItemFromArray(array:string[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generatePathfinderName(race: string, gender: string, familyName: boolean) {
    let name;
    pathfinderRaceMap.forEach((e) => {
        if (e.race === race) {
            if (gender === "male") {
                name = e.generator(0, familyName);
            } else {
               name = e.generator(1, familyName);
            }
        }
    })
    return name
}

function generateAasimars(type: number, genLastName : boolean) {
    const nm1 = ["", "", "", "", "", "b", "c", "cr", "d", "gr", "k", "kr", "l", "m", "n", "p", "s", "t", "w", "z"];
	const nm2 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "y", "ai", "au", "ie", "ia", "ea"];
	const nm3 = ["b", "b", "d", "d", "dr", "g", "g", "gr", "gn", "k", "k", "kw", "kr", "l", "l", "lw", "lr", "lm", "ln", "lg", "lt", "m", "m", "mr", "ml", "mw", "n", "n", "nr", "nl", "ng", "nv", "nw", "r", "r", "rl", "rw", "rg", "rn", "t", "t"];
	const nm4 = ["l", "m", "n", "n", "n", "nt", "r"];
	const nm5 = ["", "", "", "", "b", "br", "d", "dr", "h", "l", "m", "n", "p", "ph", "r", "rh", "v", "vh", "w"];
	const nm6 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "oe", "ou", "ua", "ea", "ia"];
	const nm7 = ["d", "d", "dr", "dy", "gr", "j", "j", "l", "l", "ll", "lt", "ld", "lm", "ln", "ldr", "ls", "m", "m", "mr", "mk", "ml", "n", "n", "ndr", "nd", "nk", "ng", "nd", "ny", "nm", "p", "p", "pr", "r", "r", "rk", "rl", "s", "s", "v", "v", "y", "y", "z", "z"];
	const nm8 = ["", "", "", "", "", "", "", "", "", "h", "l", "n", "r"];
	const nm9 = ["", "", "", "", "b", "br", "d", "dr", "h", "k", "kr", "l", "m", "n", "p", "r", "s", "t", "v", "w", "z"];
	const nm10 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "y"];
	const nm11 = ["b", "d", "g", "gr", "h", "k", "kr", "km", "l", "ll", "lr", "ls", "lg", "ldr", "lm", "lw", "m", "mr", "ml", "n", "nm", "ng", "nv", "nk", "p", "pr", "r", "rl", "rg", "rv", "rw", "s", "v", "z"];
	const nm12 = ["", "", "", "l", "m", "n", "r"];


    const i = Math.floor(Math.random() * 10); {
        let nameLast = '';
        let names = '';
		const rnd10 = Math.floor(Math.random() * nm9.length);
		const rnd11 = Math.floor(Math.random() * nm10.length);
		const rnd12 = Math.floor(Math.random() * nm12.length);
		const rnd13 = Math.floor(Math.random() * nm11.length);
		const rnd14 = Math.floor(Math.random() * nm10.length);
		if (i % 2 === 0) {
			const rnd15 = Math.floor(Math.random() * nm11.length);
			const rnd16 = Math.floor(Math.random() * nm10.length);
			nameLast = genLastName ? nm9[rnd10] + nm10[rnd11] + nm11[rnd13] + nm10[rnd14] + nm11[rnd15] + nm10[rnd16] + nm12[rnd12] : '';
		} else {
			nameLast = genLastName ? nm9[rnd10] + nm10[rnd11] + nm11[rnd13] + nm10[rnd14] + nm12[rnd12] : '';
		}
		if (type === 1) {
			const rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm6.length);
			const rnd3 = Math.floor(Math.random() * nm7.length);
			const rnd4 = Math.floor(Math.random() * nm6.length);
			const rnd5 = Math.floor(Math.random() * nm8.length);
			if (i < 6) {
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm8[rnd5] + " " + nameLast;
			} else {
				const rnd6 = Math.floor(Math.random() * nm7.length);
				const rnd7 = Math.floor(Math.random() * nm6.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm7[rnd6] + nm6[rnd7] + nm8[rnd5] + " " + nameLast;
			}
		} else {
			const rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm3.length);
			const rnd4 = Math.floor(Math.random() * nm2.length);
			const rnd5 = Math.floor(Math.random() * nm4.length);
			if (i < 7) {
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5] + " " + nameLast;
			} else {
				const rnd6 = Math.floor(Math.random() * nm3.length);
				const rnd7 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm3[rnd6] + nm2[rnd7] + nm4[rnd5] + " " + nameLast;
			}
		}
		return names;
	}
}
function generateCatfolk(type: number, genLastName : boolean) {
    const nm1 = ["br", "c", "cr", "dr", "f", "g", "gr", "j", "k", "kr", "m", "n", "p", "pr", "q", "qr", "r", "t", "z"];
	const nm2 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "y", "y", "ou", "au", "ei"];
	const nm3 = ["c", "cc", "cd", "cb", "g", "gg", "gt", "gb", "gd", "k", "kk", "kh", "kt", "mb", "mk", "mq", "nq", "nk", "ng", "q", "qh", "r", "rr", "rq", "rk", "th", "w"];
	const nm4 = ["", "m", "n", "r", "s", "th"];
	const nm5 = ["", "", "", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "z"];
	const nm6 = ["a", "e", "i", "o", "u"];
	const nm7 = ["f", "ff", "l", "ly", "lh", "ls", "lr", "lm", "ln", "m", "my", "mh", "n", "ny", "nh", "ph", "phr", "r", "rr", "ry", "rh", "sy", "sh", "sr", "sl", "th", "ty", "y"];
	const nm8 = ["", "", "", "", "", "", "", "", "", "", "h", "s"];


    const i = Math.floor(Math.random() * 10); {
        let names;
		if (type === 1) {
			const rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm6.length);
			const rnd3 = Math.floor(Math.random() * nm7.length);
			const rnd4 = Math.floor(Math.random() * nm6.length);
			const rnd5 = Math.floor(Math.random() * nm8.length);
			if (i < 6) {
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm8[rnd5];
			} else {
				const rnd6 = Math.floor(Math.random() * nm7.length);
				const rnd7 = Math.floor(Math.random() * nm6.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm7[rnd6] + nm6[rnd7] + nm8[rnd5];
			}
		} else {
			const rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm3.length);
			const rnd4 = Math.floor(Math.random() * nm2.length);
			const rnd5 = Math.floor(Math.random() * nm4.length);
			if (i < 7) {
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5];
			} else {
				const rnd6 = Math.floor(Math.random() * nm3.length);
				const rnd7 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm3[rnd6] + nm2[rnd7] + nm4[rnd5];
			}
		}
        return genLastName ? `${capitalizeFirstLetter(names)}  ${ randomItemFromArray(catfolkFamilyNames) }` : capitalizeFirstLetter(names);
	}
}

function generateFetchlings(type: number, genLastName : boolean) {
    const nm1 = ["", "", "", "br", "dr", "gr", "j", "m", "n", "q", "qr", "r", "s", "tr", "x", "y", "z"];
	const nm2 = ["a", "e", "i", "o", "u"];
	const nm3 = ["c", "d", "g", "h", "j", "k", "l", "m", "n", "r", "s", "t", "v", "z"];
	const nm4 = ["", "", "", "c", "h", "l", "m", "n", "r", "t", "x"];
	const nm5 = ["c", "f", "g", "h", "l", "m", "n", "q", "r", "s", "t", "th", "v", "y", "z"];
	const nm7 = ["c", "fz", "fn", "g", "gv", "gn", "gz", "h", "hn", "hv", "hz", "l", "lv", "lr", "ls", "lz", "m", "mr", "mv", "mz", "nv", "nz", "nr", "r", "rr", "rs", "rz", "rh", "rv", "sc", "sh", "sr", "sv", "th", "thr", "tv", "tn"];
	const nm8 = ["", "", "", "", "", "", "", "", "", "", "", "", "", "h", "l", "m", "n", "s", "x"];


    const i = Math.floor(Math.random() * 10); {
        let names;
		if (type === 1) {
			const rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm7.length);
			const rnd4 = Math.floor(Math.random() * nm2.length);
			const rnd5 = Math.floor(Math.random() * nm8.length);
			if (i < 6) {
				names = nm5[rnd] + nm2[rnd2] + nm7[rnd3] + nm2[rnd4] + nm8[rnd5];
			} else {
				const rnd6 = Math.floor(Math.random() * nm7.length);
				const rnd7 = Math.floor(Math.random() * nm2.length);
				names = nm5[rnd] + nm2[rnd2] + nm7[rnd3] + nm2[rnd4] + nm7[rnd6] + nm2[rnd7] + nm8[rnd5];
			}
		} else {
			const rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm3.length);
			const rnd4 = Math.floor(Math.random() * nm2.length);
			let rnd5 = Math.floor(Math.random() * nm4.length);
			if (rnd < 3) {
				while (rnd5 < 3) {
					rnd5 = Math.floor(Math.random() * nm4.length);
				}
			}
			names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5];
		}
		return genLastName ? `${capitalizeFirstLetter(names)}  ${ randomItemFromArray(familyNameList) }` : capitalizeFirstLetter(names);
	}
}

function generateHalfElf(type: number, genLastName : boolean) {
    const nm1 = ["", "", "", "", "", "b", "c", "d", "g", "h", "j", "jh", "k", "kh", "kr", "l", "m", "n", "p", "q", "r", "s", "t", "tr", "v", "vr", "z", "zr"];
	const nm2 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "y", "y", "y", "ai", "ae", "ia", "ue", "ie", "ui"];
	const nm3 = ["d", "d", "d", "dr", "dl", "dw", "g", "g", "g", "gr", "gl", "gg", "gw", "l", "l", "l", "l", "ld", "lv", "lgr", "lbr", "lc", "ldr", "lg", "lgg", "lr", "lt", "lth", "m", "m", "m", "mr", "ml", "n", "n", "n", "nc", "nn", "nr", "nd", "ngr", "nv", "nvr", "r", "r", "r", "rc", "rg", "rr", "rth", "rv", "rvr", "rl", "rd", "rdr", "rgr", "rw", "s", "s", "s", "sh", "sl", "sr", "ss", "st", "str", "svr", "t", "t", "t", "th", "tt", "tr"];
	const nm4 = ["", "", "", "c", "h", "k", "l", "n", "nn", "r", "s"];
	const nm5 = ["", "", "", "", "c", "ch", "d", "j", "k", "kr", "l", "m", "n", "r", "s", "sh", "t", "thr", "th", "tr", "v", "vr", "vh", "z", "zr", "zh"];
	const nm6 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "ia", "au", "ie", "ua", "oi", "ou", "ae"];
	const nm7 = ["b", "b", "br", "cl", "cr", "d", "d", "gs", "gl", "gn", "gm", "gsh", "l", "l", "l", "lm", "lr", "lsr", "ltr", "ly", "lly", "ld", "ll", "lsb", "lv", "m", "m", "m", "my", "mr", "n", "n", "n", "nd", "nr", "nw", "nn", "ns", "nv", "ny", "pt", "pr", "r", "r", "r", "r", "rg", "rr", "rl", "rv", "ry", "s", "s", "s", "ss", "sy", "str", "sw", "thr", "tr", "th", "y", "y", "y"];
	const nm8 = ["", "", "", "", "", "", "", "", "", "", "h", "l", "n", "s", "ss", "th"];
	const nm9 = ["", "", "", "", "b", "bl", "cl", "d", "dr", "f", "fl", "fr", "g", "gl", "gr", "h", "j", "k", "kl", "kr", "l", "m", "n", "p", "pr", "s", "sl", "sk", "st", "t", "tr", "wr", "y", "z"];
	const nm10 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "aa", "io", "ei", "iu", "ai", "ea", "ee"];
	const nm11 = ["d", "d", "d", "dr", "dw", "gr", "gw", "gn", "g", "g", "gg", "h", "h", "h", "j", "j", "j", "k", "k", "k", "kr", "kl", "km", "kn", "l", "l", "ll", "l", "lr", "lg", "ld", "ldr", "lmr", "ly", "m", "mg", "mr", "m", "m", "m", "n", "n", "n", "nn", "n", "nr", "ng", "ngr", "ndr", "nd", "nsh", "ntr", "r", "r", "r", "r", "rr", "rd", "rdr", "rg", "rgr", "rl", "rm", "rt", "s", "s", "s", "sdr", "sgr", "sg", "sh", "ssr", "t", "tr", "t", "t", "th", "v", "v", "vr", "vl", "w", "xh", "xt", "y", "yh", "zm"];
	const nm12 = ["", "", "", "", "", "", "", "ht", "l", "m", "n", "nd", "nn", "r", "rks", "rt", "s", "th", "w", "ys"];


    const i = Math.floor(Math.random() * 10); {
        let names;
        let nameLast;
		let rnd10 = Math.floor(Math.random() * nm9.length);
		const rnd11 = Math.floor(Math.random() * nm10.length);
		let rnd12 = Math.floor(Math.random() * nm12.length);
		if (i % 3 === 0 && i % 2 != 0) {
			const rnd13 = Math.floor(Math.random() * nm11.length);
			const rnd14 = Math.floor(Math.random() * nm10.length);
			nameLast = genLastName ? nm9[rnd10] + nm10[rnd11] + nm11[rnd13] + nm10[rnd14] + nm12[rnd12] : "";
		} else if (i % 2 === 0) {
			const rnd13 = Math.floor(Math.random() * nm11.length);
			const rnd14 = Math.floor(Math.random() * nm10.length);
			const rnd15 = Math.floor(Math.random() * nm11.length);
			const rnd16 = Math.floor(Math.random() * nm10.length);
			nameLast = genLastName ? nm9[rnd10] + nm10[rnd11] + nm11[rnd13] + nm10[rnd14] + nm11[rnd15] + nm10[rnd16] + nm12[rnd12] : "";
		} else {
			while (rnd10 < 4) {
				rnd10 = Math.floor(Math.random() * nm9.length);
			}
			while (rnd12 < 7) {
				rnd12 = Math.floor(Math.random() * nm12.length);
			}
			nameLast = genLastName ? nm9[rnd10] + nm10[rnd11] + nm12[rnd12] : "";
		}
		if (type === 1) {
			let rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm6.length);
			const rnd5 = Math.floor(Math.random() * nm8.length);
			if (i < 3) {
				while (rnd < 4) {
					rnd = Math.floor(Math.random() * nm1.length);
				}
				names = nm5[rnd] + nm6[rnd2] + nm8[rnd5] + " " + nameLast;
			} else if (i < 6) {
				const rnd3 = Math.floor(Math.random() * nm7.length);
				const rnd4 = Math.floor(Math.random() * nm6.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm8[rnd5] + " " + nameLast;
			} else {
				const rnd3 = Math.floor(Math.random() * nm7.length);
				const rnd4 = Math.floor(Math.random() * nm6.length);
				const rnd6 = Math.floor(Math.random() * nm7.length);
				const rnd7 = Math.floor(Math.random() * nm6.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm7[rnd6] + nm6[rnd7] + nm8[rnd5] + " " + nameLast;
			}
		} else {
			let rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			let rnd5 = Math.floor(Math.random() * nm4.length);
			if (i < 3) {
				while (rnd < 5) {
					rnd = Math.floor(Math.random() * nm1.length);
				}
				while (rnd5 < 3) {
					rnd5 = Math.floor(Math.random() * nm4.length);
				}
				names = nm1[rnd] + nm2[rnd2] + nm4[rnd5] + "  " + nameLast;
			} else if (i < 7) {
				const rnd3 = Math.floor(Math.random() * nm3.length);
				const rnd4 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5] + " " + nameLast;
			} else {
				const rnd3 = Math.floor(Math.random() * nm3.length);
				const rnd4 = Math.floor(Math.random() * nm2.length);
				const rnd6 = Math.floor(Math.random() * nm3.length);
				const rnd7 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm3[rnd6] + nm2[rnd7] + nm4[rnd5] + " " + nameLast;
			}
		}
		return names;
	}
}

function generateHalfOrc(type: number, genLastName : boolean) {
    const nm1 = ["", "", "", "b", "br", "c", "cr", "d", "dr", "g", "gr", "h", "hr", "k", "m", "n", "p", "t", "th", "ts", "z"];
	const nm2 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "a", "o", "o", "aa", "au", "oa", "ia", "ai", "uu"];
	const nm3 = ["br", "b", "d", "dh", "dr", "dz", "g", "gr", "gd", "gh", "k", "kh", "kt", "kd", "kr", "lgr", "ltr", "ldr", "lr", "lkr", "nd", "ng", "ngr", "ndr", "nv", "r", "rv", "rg", "rdr", "st", "sd", "str", "tr", "v", "zr", "zz", "zv", "zvr"];
	const nm4 = ["", "", "", "ch", "d", "g", "k", "l", "lm", "n", "r", "rg", "rm", "rv", "s", "sk", "t", "x", "zhg"];
	const nm5 = ["", "", "", "", "", "b", "br", "c", "d", "dr", "g", "h", "k", "m", "n", "r", "rz", "s", "sh", "str", "t", "v", "w", "z"];
	const nm6 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "a", "o", "o", "ay", "ou", "ai", "uo"];
	const nm7 = ["b", "br", "bl", "c", "cl", "cr", "d", "dl", "dr", "g", "gh", "gr", "gl", "hg", "hk", "hr", "jk", "l", "ljk", "ll", "ln", "lr", "lt", "m", "mr", "mg", "ml", "n", "ng", "nl", "nc", "r", "rg", "rl", "rd", "s", "sl", "sr", "t", "tt", "tr", "v", "vr", "z", "zr"];
	const nm8 = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "h", "n", "sh", "th", "x"];
	const nm9 = ["", "", "", "", "", "b", "c", "d", "g", "gn", "h", "j", "k", "m", "n", "r", "s", "sh", "t", "th", "v", "w", "z"];
	const nm10 = ["a", "e", "i", "o", "u"];
	const nm11 = ["b", "br", "d", "dr", "dk", "g", "gr", "gh", "gl", "k", "kr", "l", "lk", "lgr", "ln", "lr", "lr", "m", "mk", "n", "nr", "nk", "nd", "ndr", "ng", "rg", "rv", "rk", "r", "rr", "rsh", "shk", "st", "sk", "sr", "sv", "svr", "tsk", "tk", "tr", "v", "xl", "xn", "z", "zr", "zk"];
	const nm12 = ["", "", "", "", "", "ch", "d", "k", "ld", "lm", "m", "n", "r", "shky", "tsky", "v", "x", "z"];


    const i = Math.floor(Math.random() * 10); {
        let names;
        let nameLast;
		let rnd10 = Math.floor(Math.random() * nm9.length);
		const rnd11 = Math.floor(Math.random() * nm10.length);
		let rnd12 = Math.floor(Math.random() * nm12.length);
		if (i % 3 === 0 && i % 2 != 0) {
			const rnd13 = Math.floor(Math.random() * nm11.length);
			const rnd14 = Math.floor(Math.random() * nm10.length);
			const rnd15 = Math.floor(Math.random() * nm11.length);
			const rnd16 = Math.floor(Math.random() * nm10.length);
			nameLast = genLastName ? nm9[rnd10] + nm10[rnd11] + nm11[rnd13] + nm10[rnd14] + nm11[rnd15] + nm10[rnd16] + nm12[rnd12] : "";
		} else if (i % 2 === 0) {
			while (rnd10 < 5) {
				rnd10 = Math.floor(Math.random() * nm9.length);
			}
			while (rnd12 < 5) {
				rnd12 = Math.floor(Math.random() * nm12.length);
			}
			nameLast = genLastName ? nm9[rnd10] + nm10[rnd11] + nm12[rnd12] : "";
		} else {
			const rnd13 = Math.floor(Math.random() * nm11.length);
			const rnd14 = Math.floor(Math.random() * nm10.length);
			nameLast = genLastName ? nm9[rnd10] + nm10[rnd11] + nm11[rnd13] + nm10[rnd14] + nm12[rnd12] : "";
		}
		if (type === 1) {
			const rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm6.length);
			const rnd3 = Math.floor(Math.random() * nm7.length);
			const rnd4 = Math.floor(Math.random() * nm6.length);
			const rnd5 = Math.floor(Math.random() * nm8.length);
			if (i < 8) {
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm8[rnd5] + " " + nameLast;
			} else {
				const rnd6 = Math.floor(Math.random() * nm7.length);
				const rnd7 = Math.floor(Math.random() * nm6.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm7[rnd6] + nm6[rnd7] + nm8[rnd5] + " " + nameLast;
			}
		} else {
			let rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			let rnd5 = Math.floor(Math.random() * nm4.length);
			if (i < 5) {
				while (rnd < 3) {
					rnd = Math.floor(Math.random() * nm1.length);
				}
				while (rnd5 < 3) {
					rnd5 = Math.floor(Math.random() * nm4.length);
				}
				names = nm1[rnd] + nm2[rnd2] + nm4[rnd5] + "  " + nameLast;
			} else if (i < 9) {
				const rnd3 = Math.floor(Math.random() * nm3.length);
				const rnd4 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5] + " " + nameLast;
			} else {
				const rnd3 = Math.floor(Math.random() * nm3.length);
				const rnd4 = Math.floor(Math.random() * nm2.length);
				const rnd6 = Math.floor(Math.random() * nm3.length);
				const rnd7 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm3[rnd6] + nm2[rnd7] + nm4[rnd5] + " " + nameLast;
			}
		}
		return names;
	}
}

function generateHobgoblin(type: number, genLastName : boolean) {
    const nm1 = ["", "", "", "b", "d", "dr", "f", "g", "gr", "h", "k", "kr", "m", "n", "p", "pr", "r", "s", "t", "z"];
	const nm2 = ["a", "e", "i", "o", "u"];
	const nm3 = ["d", "dr", "gl", "gr", "gt", "gh", "kr", "kt", "kh", "kl", "l", "lgr", "lt", "ld", "ldr", "lg", "lb", "lbr", "ll", "r", "rg", "rd", "rt", "rdr", "rgr", "rk", "rl", "th", "tt", "tr", "thr", "vl", "vr", "vt"];
	const nm4 = ["", "d", "g", "k", "m", "n", "ng", "r", "t"];
	const nm5 = ["", "", "", "", "b", "c", "d", "f", "h", "k", "m", "n", "ph", "r", "s", "t", "v", "w", "z"];
	const nm7 = ["cl", "cn", "cm", "cd", "f", "ff", "fn", "fm", "fl", "kl", "kr", "kn", "km", "kd", "kt", "ks", "l", "lz", "ln", "lm", "ld", "lg", "m", "mz", "ms", "mr", "md", "mg", "mk", "n", "ns", "nd", "nr", "ng", "ns", "nk", "r", "rm", "rg", "rn", "rd", "rk", "s", "sm", "st", "ss", "sz", "sm", "sn", "sd", "sg", "th", "tr", "tn", "tz", "ts", "yd", "yn", "yg", "yk", "yr", "yz"];
	const nm8 = ["", "", "", "", "", "", "", "", "", "", "f", "h", "l", "m", "n", "s", "t"];


    const i = Math.floor(Math.random() * 10); {
        let names;
		if (type === 1) {
			const rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm7.length);
			const rnd4 = Math.floor(Math.random() * nm2.length);
			const rnd5 = Math.floor(Math.random() * nm8.length);
			if (i < 8) {
				names = nm5[rnd] + nm2[rnd2] + nm7[rnd3] + nm2[rnd4] + nm8[rnd5];
			} else {
				const rnd6 = Math.floor(Math.random() * nm7.length);
				const rnd7 = Math.floor(Math.random() * nm2.length);
				names = nm5[rnd] + nm2[rnd2] + nm7[rnd3] + nm2[rnd4] + nm7[rnd6] + nm2[rnd7] + nm8[rnd5];
			}
		} else {
			const rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm3.length);
			const rnd4 = Math.floor(Math.random() * nm2.length);
			let rnd5 = Math.floor(Math.random() * nm4.length);
			if (rnd < 3) {
				while (rnd5 === 0) {
					rnd5 = Math.floor(Math.random() * nm4.length);
				}
			}
			names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5];
		}
		return genLastName ? `${capitalizeFirstLetter(names)}  ${ randomItemFromArray(titleLastNames) }` : capitalizeFirstLetter(names);
	}
}

function generateIfrits(type: number, genLastName : boolean) {
    const nm1 = ["", "", "", "", "b", "d", "g", "j", "k", "m", "n", "r", "t", "v", "z"];
	const nm2 = ["a", "e", "i", "u"];
	const nm3 = ["c", "f", "g", "j", "k", "l", "m", "n", "q", "r", "v"];
	const nm4 = ["", "", "", "d", "g", "h", "j", "l", "m", "n", "q", "t"];
	const nm5 = ["", "", "", "c", "f", "g", "h", "l", "m", "n", "q", "s", "w", "z"];
	//const nm6 = ["a", "e", "i"];
	const nm7 = ["d", "dw", "dr", "h", "l", "lr", "ly", "m", "ml", "mr", "n", "nr", "nl", "q", "qh", "qr", "r", "rh", "ry", "rl", "t", "ty", "th", "tw", "tr", "w", "y"];
	const nm8 = ["", "", "", "", "", "", "", "", "h", "n", "s"];


    const i = Math.floor(Math.random() * 10); {
        let names;
		if (type === 1) {
			const rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm7.length);
			const rnd4 = Math.floor(Math.random() * nm2.length);
			const rnd5 = Math.floor(Math.random() * nm8.length);
			if (i < 8) {
				names = nm5[rnd] + nm2[rnd2] + nm7[rnd3] + nm2[rnd4] + nm8[rnd5];
			} else {
				const rnd6 = Math.floor(Math.random() * nm7.length);
				const rnd7 = Math.floor(Math.random() * nm2.length);
				names = nm5[rnd] + nm2[rnd2] + nm7[rnd3] + nm2[rnd4] + nm7[rnd6] + nm2[rnd7] + nm8[rnd5];
			}
		} else {
			const rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm3.length);
			const rnd4 = Math.floor(Math.random() * nm2.length);
			const rnd5 = Math.floor(Math.random() * nm4.length);
			names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5];
		}
		return genLastName ? `${capitalizeFirstLetter(names)}  ${ randomItemFromArray(familyNameList) }` : capitalizeFirstLetter(names);
	}
}

function generateKobalds(type: number, genLastName : boolean) {
    throw new Error("Function not implemented.");
}

function generateOreads(type: number, genLastName : boolean) {
    throw new Error("Function not implemented.");
}

function generateRatfolk(type: number, genLastName : boolean) {
    throw new Error("Function not implemented.");
}

function generateSylphs(type: number, genLastName : boolean) {
    throw new Error("Function not implemented.");
}

function generateTengu(type: number, genLastName : boolean) {
    throw new Error("Function not implemented.");
}

function generateTians(type: number, genLastName : boolean) {
    throw new Error("Function not implemented.");
}

function generateTiefling(type: number, genLastName : boolean) {
    throw new Error("Function not implemented.");
}

function generateUndines(type: number, genLastName : boolean) {
    throw new Error("Function not implemented.");
}

