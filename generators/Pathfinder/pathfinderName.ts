import { catfolkFamilyNames } from "lists/catfolkFamilyNames";
import { elfFamilyNames } from "lists/elvenFamilyNames";
import { familyNameList } from "lists/humanFamilyNames";
import { ratfolkFamilyNames } from "lists/ratfolkFamilyNames";
import { tianFamilyNames } from "lists/tianFamilyName";
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

export function generatePathfinderName(race: string, gender: string, familyName: boolean) : string {
    let name = '';
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
    const nm1 = ["", "", "", "", "", "br", "cr", "dr", "d", "dh", "g", "gh", "gr", "j", "k", "m", "n", "q", "qr", "r", "rh", "v", "vr", "vh", "z"];
	const nm2 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "i", "o", "a", "i", "o", "aa", "ea", "oo", "ee"];
	const nm3 = ["d", "dd", "dr", "dz", "dh", "gn", "gm", "gr", "gz", "gh", "k", "kk", "kn", "kz", "km", "kr", "l", "lz", "ll", "lr", "ld", "ln", "m", "mk", "mz", "n", "nz", "nr", "pm", "pz", "pr", "r", "rl", "rn", "rm", "rg", "rk", "rd", "rz", "rr", "t", "tr", "tz", "x", "zh", "z", "zz", "zr", "zk"];
	const nm4 = ["", "", "", "", "", "b", "d", "g", "k", "l", "ld", "lk", "lp", "n", "nk", "p", "rk", "s", "sk", "x"];
	const nm5 = ["", "", "", "", "d", "f", "g", "h", "l", "m", "n", "p", "r", "s", "t", "v", "z"];
	//const nm6 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "o", "a", "o", "a", "o", "aa", "ia", "ai", "ee"];
	const nm7 = ["d", "dk", "dr", "gr", "gl", "g", "h", "hr", "k", "kr", "kkr", "ks", "l", "lr", "lk", "ls", "r", "rk", "rs", "rg", "rl", "s", "ss", "sr", "sk", "sg", "sgr", "skr", "ssr", "tr", "th", "thr", "z", "zr", "zk", "zn", "zl"];
	const nm8 = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "h", "k", "l", "n", "m", "r", "s"];


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
			let rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm3.length);
			const rnd4 = Math.floor(Math.random() * nm2.length);
			let rnd5 = Math.floor(Math.random() * nm4.length);
			if (i < 3) {
				while (rnd < 5) {
					rnd = Math.floor(Math.random() * nm1.length);
				}
				while (rnd5 < 5) {
					rnd5 = Math.floor(Math.random() * nm4.length);
				}
				names = nm1[rnd] + nm2[rnd2] + nm4[rnd5];
			} else if (i < 7) {
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5];
			} else {
				const rnd6 = Math.floor(Math.random() * nm3.length);
				const rnd7 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm3[rnd6] + nm2[rnd7] + nm4[rnd5];
			}
		}
		return genLastName ? `${capitalizeFirstLetter(names)}  ${ randomItemFromArray(titleLastNames) }` : capitalizeFirstLetter(names);
	}
}

function generateOreads(type: number, genLastName: boolean) {
	const nm1 = ["", "", "", "b", "d", "g", "j", "l", "m", "n", "p", "r", "s", "t", "v"];
	const nm2 = ["a", "e", "i", "o", "u", "a", "o", "u", "y"];
	const nm3 = ["d", "dd", "f", "fd", "ft", "hd", "hn", "hv", "l", "ll", "ln", "lm", "ld", "lv", "lt", "lth", "lm", "m", "md", "mt", "mh", "mv", "n", "nd", "nt", "nv", "nh", "nn", "nm", "nh", "nr", "r", "rt", "rh", "rn", "rm", "rl", "rv", "rr", "rd", "th", "tr", "thr", "v", "vh", "vr"];
	const nm4 = ["", "m", "n", "r", "s", "t"];
	const nm5 = ["", "", "", "b", "bh", "d", "dh", "gh", "h", "l", "m", "n", "p", "r", "rh", "s", "sh", "t", "th", "v", "w"];
	const nm6 = ["a", "e", "i", "o", "u", "a", "i", "e"];
	const nm7 = ["c", "ch", "d", "dh", "f", "ff", "fh", "fth", "h", "hn", "hv", "hl", "hs", "l", "lh", "ln", "lm", "ls", "lsh", "m", "mn", "mm", "mh", "my", "n", "nn", "nh", "ny", "ns", "nth", "nf", "r", "ry", "rh", "rs", "rsh", "rth", "s", "sh", "sth", "sht", "sn", "sm", "sy", "sl", "t", "th", "ty", "thy", "y"];


	const i = Math.floor(Math.random() * 10); {
		let names;
		if (type === 1) {
			const rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm6.length);
			const rnd3 = Math.floor(Math.random() * nm7.length);
			const rnd4 = Math.floor(Math.random() * nm6.length);
			if (i < 5) {
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4];
			} else {
				const rnd6 = Math.floor(Math.random() * nm7.length);
				const rnd7 = Math.floor(Math.random() * nm6.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm7[rnd6] + nm6[rnd7];
			}
		} else {
			const rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm3.length);
			const rnd4 = Math.floor(Math.random() * nm2.length);
			const rnd5 = Math.floor(Math.random() * nm4.length);
			if (i < 5) {
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5];
			} else {
				const rnd6 = Math.floor(Math.random() * nm3.length);
				const rnd7 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm3[rnd6] + nm2[rnd7] + nm4[rnd5];
			}
		}

		let elvishHumanTitleFamilyNames = familyNameList.concat(elfFamilyNames);
		elvishHumanTitleFamilyNames = elvishHumanTitleFamilyNames.concat(titleLastNames);
		return genLastName ? `${capitalizeFirstLetter(names)}  ${randomItemFromArray(elvishHumanTitleFamilyNames)}` : capitalizeFirstLetter(names);
	}
}

function generateRatfolk(type: number, genLastName : boolean) {
    const nm1 = ["", "", "", "", "", "", "", "b", "br", "c", "cr", "ch", "d", "dr", "dj", "g", "gr", "gn", "gl", "j", "k", "kr", "kv", "kn", "m", "n", "p", "pr", "r", "s", "st", "sr", "skr", "sc", "scr", "sk", "t", "tr", "v", "vr", "z", "zr"];
	const nm2 = ["a", "e", "i", "o", "a", "e", "i"];
	const nm3 = ["cc", "cd", "cr", "gg", "gr", "gk", "gv", "gd", "kk", "kr", "kv", "kz", "m", "mm", "md", "mk", "mv", "mz", "n", "nn", "nd", "nv", "nk", "ng", "nz", "rr", "r", "rk", "rv", "rz", "rc", "rg", "rd", "vv", "v", "vd", "vk", "vz"];
	const nm4 = ["c", "g", "c", "g", "hl", "hz", "hk", "hn", "hc", "k", "m", "n", "q", "r", "s", "t", "z", "k", "m", "n", "q", "r", "s", "t", "z"];
	const nm5 = ["b", "bh", "c", "ch", "dh", "f", "fr", "fh", "gh", "j", "k", "m", "n", "nh", "p", "r", "s", "sh", "t", "th", "v", "vh", "z", "zh"];
	const nm6 = ["a", "e", "i", "o", "u", "e", "e", "e", "i", "i", "i"];
	const nm7 = ["b", "bb", "c", "cc", "f", "ff", "g", "gg", "j", "k", "kk", "l", "ll", "m", "mm", "n", "nn", "p", "pp", "r", "rr", "s", "ss", "t", "tt", "z", "zz"];
	const nm8 = ["", "", "", "", "", "", "", "", "ch", "f", "hm", "hl", "ks", "l", "m", "n", "r", "s", "sh", "t", "th", "tch", "x"];


	const i = Math.floor(Math.random() * 10); {
		let names;
		if (type === 1) {
			const rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm6.length);
			let rnd5 = Math.floor(Math.random() * nm8.length);
			if (i < 5) {
				while (rnd5 < 8) {
					rnd5 = Math.floor(Math.random() * nm8.length);
				}
				names = nm5[rnd] + nm6[rnd2] + nm8[rnd5];
			} else {
				const rnd3 = Math.floor(Math.random() * nm7.length);
				const rnd4 = Math.floor(Math.random() * nm6.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm8[rnd5];
			}
		} else {
			let rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd5 = Math.floor(Math.random() * nm4.length);
			if (i < 5) {
				while (rnd < 7) {
					rnd = Math.floor(Math.random() * nm1.length);
				}
				names = nm1[rnd] + nm2[rnd2] + nm4[rnd5];
			} else {
				const rnd3 = Math.floor(Math.random() * nm3.length);
				const rnd4 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5];
			}
		}
		return genLastName ? `${capitalizeFirstLetter(names)}  ${randomItemFromArray(ratfolkFamilyNames)}` : capitalizeFirstLetter(names);
	}
}

function generateSylphs(type: number, genLastName : boolean) {
    const nm1 = ["", "", "", "", "", "c", "d", "f", "g", "h", "j", "l", "m", "n", "s", "v", "w", "z"];
	const nm2 = ["a", "e", "i", "u", "a", "e", "i", "u", "a", "e", "i", "u", "a", "e", "i", "u", "a", "e", "i", "u", "aa", "uu", "ii"];
	const nm3 = ["d", "f", "g", "j", "k", "l", "m", "n", "s", "v", "w", "z"];
	const nm4 = ["d", "l", "m", "n", "sh"];
	const nm5 = ["", "", "", "", "", "d", "f", "h", "k", "l", "m", "n", "r", "s", "t", "v", "w", "z"];
	const nm6 = ["a", "e", "i", "a", "e", "i", "a", "e", "i", "a", "e", "i", "a", "e", "i", "a", "a", "a", "ee", "aa"];
	const nm7 = ["d", "f", "ff", "h", "l", "ll", "m", "mm", "n", "nn", "s", "ss", "v", "y", "w"];
	const nm8 = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "h", "m", "n", "sh"];


	const i = Math.floor(Math.random() * 10); {
		let names;
		if (type === 1) {
			const rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm6.length);
			const rnd3 = Math.floor(Math.random() * nm7.length);
			const rnd4 = Math.floor(Math.random() * nm6.length);
			if (i < 5) {
				const rnd5 = Math.floor(Math.random() * nm8.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm8[rnd5];
			} else {
				const rnd6 = Math.floor(Math.random() * nm7.length);
				const rnd7 = Math.floor(Math.random() * nm6.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm7[rnd6] + nm6[rnd7];
			}
		} else {
			const rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd5 = Math.floor(Math.random() * nm4.length);
			const rnd3 = Math.floor(Math.random() * nm3.length);
			const rnd4 = Math.floor(Math.random() * nm2.length);
			names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5];
		}
		let elvishHumanTitleFamilyNames = familyNameList.concat(elfFamilyNames);
		elvishHumanTitleFamilyNames = elvishHumanTitleFamilyNames.concat(titleLastNames);
		return genLastName ? `${capitalizeFirstLetter(names)}  ${randomItemFromArray(elvishHumanTitleFamilyNames)}` : capitalizeFirstLetter(names);
	}
}

function generateTengu(type: number, genLastName : boolean) {
    const nm1 = ["", "", "", "", "", "b", "ch", "gr", "j", "k", "kr", "p", "pr", "q", "qr", "r", "s", "t", "tr", "tch", "x", "v", "z"];
	const nm2 = ["a", "e", "o", "u", "a", "e", "o", "u", "a", "e", "o", "u", "a", "e", "o", "u", "i", "i", "a", "e", "o", "u", "au", "ai", "oi", "ou"];
	const nm3 = ["ch", "j", "k", "kk", "l", "ll", "m", "n", "nn", "p", "pp", "q", "r", "rr", "s", "t", "v", "y", "x", "z", "zz"];
	const nm4 = ["", "", "", "", "", "", "", "", "", "", "ck", "gh", "k", "l", "n", "r"];
	const nm5 = ["", "", "", "", "", "ch", "d", "g", "gh", "k", "kh", "m", "n", "p", "q", "r", "s", "sh", "t", "th", "v", "z", "zh"];
	const nm6 = ["a", "e", "o", "u", "a", "e", "o", "u", "a", "e", "o", "u", "a", "e", "o", "u", "i", "i", "a", "e", "o", "u", "ai", "io", "ee", "ae"];
	const nm7 = ["b", "ch", "g", "j", "k", "ky", "lk", "l", "ll", "ly", "m", "mk", "nk", "ny", "p", "py", "r", "rr", "rk", "s", "t", "ty", "tch", "v", "vy", "z", "zz"];
	const nm8 = ["", "", "", "", "", "", "", "", "", "", "k", "l", "n", "r"];
	const nm9 = ["", "", "", "", "", "b", "ch", "d", "g", "j", "k", "kr", "m", "n", "p", "pr", "q", "r", "s", "t", "tch", "v", "z"];
	const nm10 = ["a", "e", "i", "o", "u", "a", "o", "e", "a", "o", "e", "u"];
	const nm11 = ["ch", "g", "j", "k", "kk", "ky", "l", "ll", "m", "n", "ng", "nk", "p", "pp", "q", "r", "rr", "s", "t", "tch", "v", "y", "z", "zz"];
	const nm12 = ["", "", "ck", "k", "l", "n", "r", "t"];


	const i = Math.floor(Math.random() * 10); {
		let lastName = '';
		let names;
		const rnd8 = Math.floor(Math.random() * nm9.length);
		const rnd9 = Math.floor(Math.random() * nm10.length);
		const rnd10 = Math.floor(Math.random() * nm11.length);
		const rnd11 = Math.floor(Math.random() * nm10.length);
		const rnd12 = Math.floor(Math.random() * nm12.length);
		lastName = genLastName ? nm9[rnd8] + nm10[rnd9] + nm11[rnd10] + nm10[rnd11] + nm12[rnd12] : "";
		if (type === 1) {
			let rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm6.length);
			let rnd5 = Math.floor(Math.random() * nm8.length);
			if (i < 3) {
				while (rnd < 5) {
					rnd = Math.floor(Math.random() * nm5.length);
				}
				while (rnd5 < 10) {
					rnd5 = Math.floor(Math.random() * nm8.length);
				}
				names = nm5[rnd] + nm6[rnd2] + nm8[rnd5] + " " + lastName;
			} else if (i < 7) {
				const rnd3 = Math.floor(Math.random() * nm7.length);
				const rnd4 = Math.floor(Math.random() * nm6.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm8[rnd5] + " " + lastName;
			} else {
				const rnd3 = Math.floor(Math.random() * nm7.length);
				const rnd4 = Math.floor(Math.random() * nm6.length);
				const rnd6 = Math.floor(Math.random() * nm7.length);
				const rnd7 = Math.floor(Math.random() * nm6.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm7[rnd6] + nm6[rnd7] + nm8[rnd5] + " " + lastName;
			}
		} else {
			let rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			let rnd5 = Math.floor(Math.random() * nm4.length);
			if (i < 3) {
				while (rnd < 5) {
					rnd = Math.floor(Math.random() * nm1.length);
				}
				while (rnd5 < 10) {
					rnd5 = Math.floor(Math.random() * nm4.length);
				}
				names = nm1[rnd] + nm2[rnd2] + nm4[rnd5] + " " + lastName;
			} else if (i < 7) {
				const rnd3 = Math.floor(Math.random() * nm3.length);
				const rnd4 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5] + " " + lastName;
			} else {
				const rnd3 = Math.floor(Math.random() * nm3.length);
				const rnd4 = Math.floor(Math.random() * nm2.length);
				const rnd6 = Math.floor(Math.random() * nm3.length);
				const rnd7 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm3[rnd6] + nm2[rnd7] + nm4[rnd5] + " " + lastName;
			}
		}
		return names;
	}
}

function generateTians(type: number, genLastName : boolean) {
    /* Tian-Dan - Vietnamese */
	const nm1 = ["", "", "", "b", "c", "ch", "d", "g", "h", "kh", "l", "m", "ng", "nh", "ph", "q", "s", "th", "t", "tr", "v", "x"];
	const nm2 = ["a", "ai", "ao", "i", "ia", "ie", "ieu", "o", "oa", "oai", "u", "ua", "ue", "ui", "uo", "uu"];
	const nm3 = ["", "c", "n", "ng", "nh", "t", "y"];
	const nm4 = ["", "", "", "b", "c", "ch", "d", "g", "h", "hy", "k", "kh", "l", "m", "n", "ng", "nh", "ph", "q", "s", "t", "th", "tr", "v", "x", "y"];
	const nm5 = ["a", "ai", "ao", "au", "e", "h", "i", "ia", "ie", "ieu", "iu", "o", "oa", "u", "ua", "ue", "uo"];
	const nm6 = ["", "", "", "c", "ch", "m", "n", "ng", "nh", "p", "t", "y"];
	const nm7 = ["b", "c", "ch", "d", "g", "h", "k", "kh", "l", "m", "ng", "nh", "nz", "ph", "q", "s", "t", "th", "tr", "v"];
	const nm8 = ["a", "ai", "ao", "au", "i", "ia", "ie", "ieu", "o", "oa", "oi", "oo", "ou", "u", "ua", "ue", "ui", "uo", "uu", "uy", "uye"];
	const nm9 = ["", "", "c", "ch", "m", "n", "ng", "nh", "p", "y"];
	/* Tian-Dtang - Cambodian/Khmer */
	const nm10 = ["b", "ch", "chh", "d", "h", "kh", "k", "kr", "l", "m", "n", "ph", "p", "pr", "r", "s", "sr", "th", "v"];
	const nm11 = ["oeu", "ou", "ea", "ei", "ia", "ao", "au", "ai", "uo", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u"];
	const nm12 = ["b", "ch", "d", "h", "k", "kb", "kd", "kh", "kng", "kr", "ks", "ksm", "ktr", "l", "m", "mb", "ml", "mn", "mph", "mr", "n", "nch", "ngh", "ngs", "nkr", "nl", "nm", "nn", "nr", "ns", "nth", "ntr", "nv", "ny", "p", "ph", "r", "rk", "ry", "s", "sm", "sn", "t", "td", "th", "tt", "v", "y"];
	const nm13 = ["k", "l", "m", "n", "ng", "nn", "p", "r", "s", "th", "y"];
	const nm14 = ["b", "ch", "d", "j", "k", "kr", "l", "m", "n", "ph", "p", "r", "s", "sr", "t", "th", "v"];
	const nm15 = ["b", "ch", "d", "k", "kd", "kh", "kkl", "kr", "kry", "ksm", "l", "ll", "lth", "m", "mb", "md", "mj", "mp", "mph", "mr", "n", "nch", "nd", "ngs", "nkr", "nl", "nm", "nn", "nnl", "nt", "nth", "ntr", "nv", "ny", "p", "ph", "r", "rk", "rph", "rsd", "rt", "rv", "ry", "s", "sm", "sn", "sn", "t", "td", "th", "tr", "tt", "v", "vy", "w", "y", "yh", "ym", "yn", "yp"];
	const nm16 = ["ch", "k", "kry", "l", "lly", "ly", "m", "mphy", "n", "ng", "nn", "nny", "ny", "ry", "s", "ss", "th", "vy", "y"];
	const nm17 = ["b", "ch", "chh", "d", "h", "j", "k", "kh", "khl", "l", "m", "nh", "n", "p", "ph", "r", "s", "t", "th", "v", "y"];
	const nm18 = ["a", "aa", "ae", "ao", "e", "ea", "eo", "i", "ia", "ie", "o", "oe", "ou", "u", "uo"];
	const nm19 = ["ch", "k", "l", "m", "n", "ng", "r", "rn", "s", "t", "th", "v", "y"];
	/* Tian-Hwan - Korean*/
	const nm20 = ["b", "by", "ch", "d", "g", "h", "hy", "j", "k", "kw", "ky", "m", "my", "n", "p", "py", "s", "sh", "t", "w", "y"];
	const nm21 = ["a", "ae", "am", "an", "ang", "e", "ee", "ejun", "eo", "eon", "eong", "eung", "i", "ihu", "ihun", "in", "injae", "injun", "o", "ochun", "ohyon", "on", "ong", "onghyon", "ongmin", "onjun", "onu", "oo", "oon", "oung", "u", "uck", "uk", "ul", "un", "ung", "unghyon", "unho", "unso", "unyong", "uwon"];
	const nm22 = ["bok", "bong", "cheol", "chol", "chuk", "chul", "dae", "eun", "gi", "gu", "gun", "gyu", "hae", "han", "hee", "heon", "ho", "hoo", "hoon", "hu", "hui", "hun", "hwa", "hwan", "hyeon", "hyok", "hyon", "hyuk", "hyun", "il", "ja", "jae", "jin", "jo", "joon", "jun", "jung", "ki", "kyu", "kyung", "min", "mo", "mun", "nam", "sam", "sang", "seo", "seok", "seon", "seong", "shik", "sik", "song", "soo", "sook", "su", "sun", "sung", "tae", "u", "won", "woo", "wook", "woong", "yeol", "yeon", "yeong", "yol", "yong", "yoon", "young", "yul"];
	const nm23 = ["b", "ch", "d", "g", "gr", "h", "hy", "j", "k", "ky", "l", "m", "my", "n", "r", "ry", "s", "sh", "t", "w", "y"];
	const nm24 = ["a", "ae", "am", "an", "ang", "ara", "e", "ee", "eh", "eo", "eon", "eong", "eul", "eum", "eun", "eung", "i", "ihye", "ihyon", "im", "imin", "in", "inji", "inso", "it", "iyeon", "iyong", "iyun", "o", "ohyon", "on", "ong", "oo", "ook", "oon", "oung", "oyon", "oyun", "u", "ubin", "uk", "un", "ung", "unji", "unso"];
	const nm25 = ["ae", "ah", "ahn", "bi", "bin", "bon", "byul", "chae", "dong", "eum", "eun", "gyo", "gyong", "gyung", "ha", "hae", "hee", "ho", "hui", "hwa", "hyang", "hye", "hyo", "hyun", "hyung", "in", "ja", "jeong", "ji", "jin", "jong", "joo", "joong", "ju", "jung", "kyeong", "kyung", "min", "na", "neul", "ok", "ra", "rae", "rang", "ri", "rim", "rin", "ryung", "seo", "seon", "shil", "so", "song", "soo", "sook", "soon", "su", "suk", "sun", "u", "un", "won", "woo", "woon", "yeon", "yon", "yong", "yoon", "young", "yun", "yung"];
	const nm26 = ["Ae", "Ah", "An", "Ch'a", "Ch'ae", "Ch'ang", "Ch'o", "Ch'oe", "Ch'on", "Ch'u", "Cha", "Chang", "Changgok", "Che", "Chegal", "Chi", "Chin", "Cho", "Chom", "Chon", "Chong", "Chu", "Chun", "Chung", "Chup", "Chwa", "Eoh", "Ha", "Hae", "Hak", "Ham", "Han", "Ho", "Hong", "Hu", "Hung", "Hwa", "Hwan", "Hwang", "Hwangbo", "Hyon", "Hyong", "Im", "In", "Ka", "Kae", "Kal", "Kam", "Kan", "Kang", "Kangjon", "Ki", "Kil", "Kim", "Ko", "Kok", "Kong", "Ku", "Kuk", "Kum", "Kun", "Kung", "Kwak", "Kwok", "Kwon", "Kye", "Kyo", "Kyon", "Kyong", "Ma", "Mae", "Maeng", "Man", "Mangjol", "Mi", "Min", "Mo", "Mok", "Muk", "Mun", "Myo", "Myong", "Na", "Nae", "Nam", "Namgung", "Nan", "Nang", "No", "Noe", "Nu", "Ogum", "Oh", "Ok", "Om", "On", "Ong", "P'aeng", "P'an", "P'i", "P'il", "P'o", "P'ung", "P'yo", "P'yon", "P'yong", "Pae", "Paek", "Pak", "Pan", "Pang", "Pi", "Pin", "Ping", "Pok", "Pom", "Pong", "Pu", "Pyon", "Ra", "Ran", "Rang", "Ri", "Rim", "Ro", "Roe", "Ru", "Ryang", "Ryo", "Ryom", "Ryon", "Ryong", "Ryu", "Ryuk", "Sa", "Sagong", "Sam", "Sang", "Si", "Sim", "Sin", "Sip", "So", "Sobong", "Sok", "Sol", "Somun", "Son", "Song", "Sonu", "Sop", "Su", "Sun", "Sung", "T'ae", "T'ak", "T'an", "Tae", "Tam", "Tan", "Tang", "To", "Tokko", "Ton", "Tong", "Tongbang", "Tu", "Uh", "Um", "Un", "Wang", "Wi", "Won", "Wu", "Ya", "Yang", "Ye", "Yi", "Yo", "Yom", "Yon", "Yong", "Yop", "Yu", "Yuk", "Yun"];
	/* Tian-La - Mongolian */
	const nm27 = ["", "", "", "b", "c", "ch", "d", "dh", "g", "gh", "h", "j", "k", "kh", "l", "m", "n", "q", "s", "sh", "t", "th", "ts", "x", "y", "z", "zh"];
	const nm28 = ["aie", "aa", "ei", "aiu", "ua", "uu", "eio", "oi", "ai", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u"];
	const nm29 = ["b", "cch", "ch", "d", "dk", "dy", "g", "gh", "ght", "gm", "gs", "j", "k", "kh", "khg", "khj", "kt", "l", "lb", "lch", "ld", "lg", "lgh", "lj", "lt", "lz", "m", "mb", "ml", "n", "nb", "ndj", "ng", "ngg", "ngs", "nksh", "nt", "nz", "q", "r", "rch", "rd", "rg", "rgh", "rk", "rkh", "rt", "s", "sg", "sh", "sl", "t", "tb", "tg", "tl", "ts", "y", "z", "zb", "zh"];
	const nm30 = ["", "", "", "d", "g", "gh", "gt", "l", "ld", "m", "n", "nt", "r", "t", "y"];
	const nm31 = ["", "", "", "b", "ch", "c", "d", "dh", "g", "gh", "h", "j", "k", "kh", "l", "m", "n", "s", "sh", "t", "th", "ts", "y", "z", "zh"];
	const nm32 = ["aa", "ui", "ei", "oa", "ui", "ai", "uu", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u"];
	const nm33 = ["b", "ch", "d", "dts", "dv", "g", "gch", "gh", "gm", "gtb", "j", "k", "kh", "khg", "khts", "l", "lj", "lm", "lt", "m", "mb", "n", "nb", "nch", "ng", "nkhh", "nkht", "nkhts", "nts", "nts", "nz", "q", "r", "rb", "rd", "rdz", "rg", "rgh", "rm", "rt", "rz", "s", "t", "ts", "tts", "y", "z"];
	const nm34 = ["", "", "", "d", "g", "gh", "l", "m", "n", "r", "sh"];
	/* Tian-Min - Japanese */
	const nm35 = ["a", "ba", "bai", "be", "bo", "bu", "chi", "da", "dai", "ei", "fu", "ga", "ge", "gi", "go", "ha", "hei", "hi", "ho", "hyo", "i", "ie", "jo", "ju", "ka", "ke", "kei", "ki", "ko", "ku", "kyu", "ma", "mi", "mo", "mu", "na", "nao", "ni", "no", "o", "ri", "ro", "ryo", "ryu", "sa", "se", "sei", "shi", "sho", "shu", "so", "su", "ta", "te", "tei", "to", "tsu", "u", "wa", "ya", "yo", "yu"];
	const nm36 = ["bumi", "buro", "buru", "chemon", "chi", "chiro", "chiyo", "chizo", "dayu", "deki", "do", "fu", "fumi", "gobei", "goro", "hari", "haru", "hide", "hiko", "hira", "hiro", "hisa", "hito", "ji", "jio", "jiro", "juro", "kado", "kan", "kao", "karu", "kazu", "kei", "ki", "kichi", "kin", "kio", "kira", "ko", "koto", "kuchu", "kudo", "kumi", "kuni", "kusai", "kushi", "kusho", "kuzo", "mane", "maro", "masu", "matsu", "mei", "miaki", "michi", "mio", "mitsu", "mon", "mori", "moru", "moto", "mune", "nabu", "naga", "nari", "nji", "njiro", "nkei", "nko", "nobu", "nori", "noru", "noto", "noye", "npaku", "nshiro", "ntaro", "nzo", "rata", "rei", "ro", "roji", "roshi", "ru", "sada", "sake", "saku", "sami", "samu", "sashi", "sato", "seki", "setsu", "shashi", "shi", "shige", "shiko", "shiro", "sho", "shushu", "soshi", "su", "suke", "suki", "ta", "tada", "taka", "tane", "tari", "taro", "taru", "toki", "toku", "tomo", "tora", "toshi", "tsu", "tsugu", "tsumi", "tsuna", "tsune", "tsuta", "tsuyo", "tzumi", "wane", "yaki", "yasu", "yori", "yoshi", "yuki", "zane", "zo", "zuka", "zuki", "zuko", "zuma", "zumi", "zumo", "zushi"];
	const nm37 = ["a", "ai", "ba", "be", "chi", "e", "ei", "fu", "ge", "ha", "hai", "hi", "ho", "i", "jo", "ka", "kae", "ki", "ko", "ku", "ma", "mae", "me", "mi", "mo", "mu", "na", "nao", "ni", "no", "o", "rai", "rei", "ri", "ro", "ru", "sa", "sai", "se", "shi", "su", "ta", "te", "to", "tsu", "u", "wa", "ya", "yae", "yo", "yu"];
	const nm38 = ["bari", "chi", "chiha", "chiho", "chiko", "cho", "deko", "doka", "fumi", "fuyu", "gino", "gusa", "haru", "hiro", "ho", "hoko", "homi", "hori", "jiko", "ka", "kage", "kako", "kami", "kane", "kari", "karu", "kaze", "ki", "kichi", "kiko", "kina", "kio", "kira", "ko", "koto", "kuko", "kuma", "kuro", "kyo", "maki", "mako", "mari", "maya", "meka", "meko", "mi", "miho", "mika", "miki", "miko", "mina", "miri", "miya", "mugi", "na", "nae", "nai", "nako", "nami", "natsu", "neka", "neko", "niko", "no", "noka", "nomi", "noue", "nu", "nuko", "nuye", "nuyo", "ra", "rako", "rante", "rari", "rea", "ri", "rika", "riko", "rime", "rimi", "rino", "risa", "risu", "rize", "ro", "roe", "roko", "romi", "roshi", "ru", "rui", "ruka", "ruko", "rumi", "sa", "sae", "sahi", "saji", "saki", "sako", "sami", "samu", "sano", "sato", "se", "shi", "shiko", "shiyo", "soko", "sono", "suka", "suki", "sumi", "suzu", "taba", "tako", "taru", "to", "tomi", "tomo", "tose", "toshi", "tsu", "tsue", "tsuka", "tsuko", "tsumi", "tsune", "tsuyo", "yaka", "yako", "yame", "yano", "yeko", "yo", "yu", "yuka", "yuki", "yuko", "yume", "yumi", "yuri", "zami", "zu", "zue", "zuki", "zuko", "zumi", "zuru", "zusa"];
	const nm39 = ["a", "aka", "ama", "ao", "ara", "asa", "ashi", "azu", "chi", "e", "fu", "fuji", "fuku", "furu", "go", "ha", "hagi", "hama", "hara", "hata", "haya", "hi", "hira", "hiro", "ho", "i", "ichi", "iga", "ike", "ima", "ina", "ise", "ishi", "iwa", "ka", "kaga", "kane", "kawa", "ki", "kishi", "kita", "ko", "koya", "ku", "kura", "kuri", "kuro", "kusu", "ma", "mae", "masu", "matsu", "mi", "mika", "miya", "mo", "mori", "mu", "mura", "na", "naga", "naka", "ni", "nishi", "no", "nomu", "nona", "o", "oga", "oka", "oku", "osa", "sa", "saka", "saku", "sawa", "saza", "se", "shi", "shiba", "shima", "shimi", "shimo", "shino", "so", "su", "suga", "sugi", "sumi", "ta", "taba", "tachi", "taga", "taha", "taka", "tama", "tana", "tani", "te", "tera", "to", "toku", "tsu", "u", "ue", "uye", "wa", "waka", "wata", "ya", "yama", "yoko", "yoshi"];
	const nm40 = ["ba", "bara", "bashi", "bata", "be", "bota", "chi", "chida", "da", "dama", "gai", "gamine", "gano", "gashi", "gata", "gawa", "gi", "guchi", "hara", "hira", "hita", "jima", "jino", "kada", "kaga", "kai", "kaki", "kama", "kami", "kawa", "ki", "kino", "kuchi", "kuda", "kui", "ma", "mada", "magai", "mano", "mari", "matsu", "maya", "mei", "mine", "miya", "mori", "moto", "mura", "naga", "nagi", "nai", "naka", "name", "nda", "ndo", "neko", "nishi", "nno", "no", "ra", "rada", "rai", "rano", "rashi", "rata", "raya", "ri", "rine", "rino", "rita", "roda", "rose", "rota", "ruta", "ruya", "sai", "saki", "sano", "sato", "sawa", "se", "shi", "shida", "shigawa", "shige", "shima", "shino", "shiro", "shita", "suda", "ta", "tani", "to", "tori", "tsuda", "tsuno", "wa", "wano", "wara", "wata", "ya", "yabu", "yake", "yama", "yashi", "yata", "yeda", "yoshi", "zaki", "zuki", "zuma", "zumi"];
	/* Tian-Shu - Chinese */
	const nm41 = ["b", "ch", "d", "f", "g", "h", "j", "k", "l", "m", "p", "q", "r", "sh", "s", "t", "ts", "w", "x", "y", "z", "zh"];
	const nm42 = ["ai", "uo", "ao", "eu", "ia", "ua", "uo", "ei", "ui", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u"];
	const nm43 = ["ch", "d", "g", "h", "j", "k", "l", "m", "n", "nch", "nf", "ng", "ngb", "ngf", "ngg", "ngh", "ngk", "ngl", "ngm", "ngp", "ngq", "ngsh", "ngw", "ngx", "ngzh", "nh", "nj", "nl", "nm", "nsh", "ny", "nz", "q", "r", "sh", "t", "w", "x", "y", "z", "zh"];
	const nm44 = ["", "", "", "n", "ng"];
	const nm45 = ["b", "ch", "c", "d", "f", "g", "h", "j", "k", "kw", "l", "m", "n", "p", "q", "r", "sh", "s", "t", "w", "x", "y", "zh", "z"];
	const nm46 = ["ao", "ua", "ai", "ui", "ia", "ei", "ue", "iu", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u"];
	const nm47 = ["b", "c", "ch", "d", "f", "h", "hw", "j", "k", "l", "m", "n", "nd", "nf", "ng", "ngch", "ngg", "ngh", "ngj", "ngl", "ngm", "ngt", "ngx", "ngy", "ngzh", "nh", "nl", "nm", "nq", "nr", "nt", "nx", "ny", "nzh", "q", "r", "sh", "t", "w", "x", "y", "zh"];
	const nm48 = ["b", "c", "ch", "d", "f", "g", "h", "hs", "hw", "j", "k", "kh", "kw", "l", "m", "n", "p", "q", "r", "s", "sh", "sz", "t", "ts", "w", "x", "y", "zh", "z"];
	const nm49 = ["ai", "ao", "au", "ee", "ea", "eo", "eu", "ia", "iao", "ie", "io", "ua", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u"];
	/* Tian-Sing - Indonesian */
	const nm50 = ["b", "c", "d", "dj", "dw", "g", "h", "j", "kr", "k", "p", "r", "s", "sl", "t", "tr", "w", "y"];
	const nm51 = ["ua", "ia", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u"];
	const nm52 = ["b", "d", "dd", "dw", "g", "h", "hy", "j", "k", "l", "m", "mb", "md", "n", "nd", "ndr", "ngk", "nn", "nt", "o", "r", "rj", "rm", "rn", "rt", "rw", "ry", "s", "sk", "sn", "t", "tr", "v", "w", "y"];
	const nm53 = ["", "", "", "h", "n", "ng", "r", "s", "t"];
	const nm54 = ["b", "c", "d", "dw", "f", "gl", "h", "k", "l", "m", "n", "p", "r", "s", "sh", "sr", "tr", "v", "w", "y"];
	const nm55 = ["ia", "eo", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u"];
	const nm56 = ["c", "d", "dy", "g", "h", "hy", "k", "l", "m", "nn", "nt", "nd", "ng", "nn", "nt", "r", "rj", "rl", "rm", "rt", "s", "sk", "st", "t", "th", "tn", "tr", "v", "w", "y"];
	const nm57 = ["", "", "", "h", "n", "r"];


	const i = Math.floor(Math.random() * 14); {
		let names;
		if (type === 1) {
			if (i < 2) {
				const rnd = Math.floor(Math.random() * nm4.length);
				const rnd2 = Math.floor(Math.random() * nm5.length);
				let rnd3 = Math.floor(Math.random() * nm6.length);
				if (rnd < 3) {
					while (rnd3 < 3) {
						rnd3 = Math.floor(Math.random() * nm6.length);
					}
				}
				const rnd4 = Math.floor(Math.random() * nm7.length);
				const rnd5 = Math.floor(Math.random() * nm8.length);
				const rnd6 = Math.floor(Math.random() * nm9.length);
				names = nm7[rnd4] + nm8[rnd5] + nm9[rnd6] + "  " + nm4[rnd] + nm5[rnd2] + nm6[rnd3];
			} else if (i < 4) {
				const rnd = Math.floor(Math.random() * nm14.length);
				const rnd2 = Math.floor(Math.random() * nm11.length);
				const rnd3 = Math.floor(Math.random() * nm15.length);
				const rnd4 = Math.floor(Math.random() * nm11.length);
				const rnd5 = Math.floor(Math.random() * nm16.length);
				const rnd6 = Math.floor(Math.random() * nm17.length);
				const rnd7 = Math.floor(Math.random() * nm18.length);
				const rnd8 = Math.floor(Math.random() * nm19.length);
				names = nm17[rnd6] + nm18[rnd7] + nm19[rnd8] + "  " + nm14[rnd] + nm11[rnd2] + nm15[rnd3] + nm11[rnd4] + nm16[rnd5];
			} else if (i < 6) {
				const rnd = Math.floor(Math.random() * nm23.length);
				const rnd2 = Math.floor(Math.random() * nm24.length);
				const rnd3 = Math.floor(Math.random() * nm25.length);
				const rnd4 = Math.floor(Math.random() * nm26.length);
				names = nm26[rnd4] + "  " + nm23[rnd] + nm24[rnd2] + "  " + nm25[rnd3];
			} else if (i < 8) {
				const rnd = Math.floor(Math.random() * nm31.length);
				const rnd2 = Math.floor(Math.random() * nm32.length);
				const rnd3 = Math.floor(Math.random() * nm33.length);
				const rnd4 = Math.floor(Math.random() * nm32.length);
				let rnd5 = Math.floor(Math.random() * nm34.length);
				if (rnd < 3) {
					while (rnd5 < 3) {
						rnd5 = Math.floor(Math.random() * nm34.length);
					}
				}
				names = nm31[rnd] + nm32[rnd2] + nm33[rnd3] + nm32[rnd4] + nm34[rnd5];
			} else if (i < 10) {
				const rnd = Math.floor(Math.random() * nm37.length);
				const rnd2 = Math.floor(Math.random() * nm38.length);
				const rnd3 = Math.floor(Math.random() * nm39.length);
				const rnd4 = Math.floor(Math.random() * nm40.length);
				names = nm39[rnd3] + nm40[rnd4] + "  " + nm37[rnd] + nm38[rnd2];
			} else if (i < 12) {
				const rnd = Math.floor(Math.random() * nm45.length);
				const rnd2 = Math.floor(Math.random() * nm46.length);
				const rnd3 = Math.floor(Math.random() * nm47.length);
				const rnd4 = Math.floor(Math.random() * nm46.length);
				const rnd5 = Math.floor(Math.random() * nm44.length);
				const rnd6 = Math.floor(Math.random() * nm48.length);
				const rnd7 = Math.floor(Math.random() * nm49.length);
				names = nm48[rnd6] + nm49[rnd7] + "  " + nm45[rnd] + nm46[rnd2] + nm47[rnd3] + nm46[rnd4] + nm44[rnd5];
			} else {
				const rnd = Math.floor(Math.random() * nm54.length);
				const rnd2 = Math.floor(Math.random() * nm55.length);
				const rnd3 = Math.floor(Math.random() * nm56.length);
				const rnd4 = Math.floor(Math.random() * nm55.length);
				const rnd5 = Math.floor(Math.random() * nm57.length);
				names = nm54[rnd] + nm55[rnd2] + nm56[rnd3] + nm55[rnd4] + nm57[rnd5];
			}
		} else {
			if (i < 2) {
				const rnd = Math.floor(Math.random() * nm1.length);
				const rnd2 = Math.floor(Math.random() * nm2.length);
				let rnd3 = Math.floor(Math.random() * nm3.length);
				if (rnd < 3) {
					while (rnd3 === 0) {
						rnd3 = Math.floor(Math.random() * nm3.length);
					}
				}
				const rnd4 = Math.floor(Math.random() * nm7.length);
				const rnd5 = Math.floor(Math.random() * nm8.length);
				const rnd6 = Math.floor(Math.random() * nm9.length);
				names = nm7[rnd4] + nm8[rnd5] + nm9[rnd6] + "  " + nm1[rnd] + nm2[rnd2] + nm3[rnd3];
			} else if (i < 4) {
				const rnd = Math.floor(Math.random() * nm10.length);
				const rnd2 = Math.floor(Math.random() * nm11.length);
				const rnd3 = Math.floor(Math.random() * nm12.length);
				const rnd4 = Math.floor(Math.random() * nm11.length);
				const rnd5 = Math.floor(Math.random() * nm13.length);
				const rnd6 = Math.floor(Math.random() * nm17.length);
				const rnd7 = Math.floor(Math.random() * nm18.length);
				const rnd8 = Math.floor(Math.random() * nm19.length);
				names = nm17[rnd6] + nm18[rnd7] + nm19[rnd8] + "  " + nm10[rnd] + nm11[rnd2] + nm12[rnd3] + nm11[rnd4] + nm13[rnd5];
			} else if (i < 6) {
				const rnd = Math.floor(Math.random() * nm20.length);
				const rnd2 = Math.floor(Math.random() * nm21.length);
				const rnd3 = Math.floor(Math.random() * nm22.length);
				const rnd4 = Math.floor(Math.random() * nm26.length);
				names = nm26[rnd4] + "  " + nm20[rnd] + nm21[rnd2] + "  " + nm22[rnd3];
			} else if (i < 8) {
				const rnd = Math.floor(Math.random() * nm27.length);
				const rnd2 = Math.floor(Math.random() * nm28.length);
				const rnd3 = Math.floor(Math.random() * nm29.length);
				const rnd4 = Math.floor(Math.random() * nm28.length);
				let rnd5 = Math.floor(Math.random() * nm30.length);
				if (rnd < 3) {
					while (rnd5 < 3) {
						rnd5 = Math.floor(Math.random() * nm30.length);
					}
				}
				names = nm27[rnd] + nm28[rnd2] + nm29[rnd3] + nm28[rnd4] + nm30[rnd5];
			} else if (i < 10) {
				const rnd = Math.floor(Math.random() * nm35.length);
				const rnd2 = Math.floor(Math.random() * nm36.length);
				const rnd3 = Math.floor(Math.random() * nm39.length);
				const rnd4 = Math.floor(Math.random() * nm40.length);
				names = nm39[rnd3] + nm40[rnd4] + "  " + nm35[rnd] + nm36[rnd2];
			} else if (i < 12) {
				const rnd = Math.floor(Math.random() * nm41.length);
				const rnd2 = Math.floor(Math.random() * nm42.length);
				const rnd3 = Math.floor(Math.random() * nm43.length);
				const rnd4 = Math.floor(Math.random() * nm42.length);
				const rnd5 = Math.floor(Math.random() * nm44.length);
				const rnd6 = Math.floor(Math.random() * nm48.length);
				const rnd7 = Math.floor(Math.random() * nm49.length);
				names = nm48[rnd6] + nm49[rnd7] + "  " + nm41[rnd] + nm42[rnd2] + nm43[rnd3] + nm42[rnd4] + nm44[rnd5];
			} else {
				const rnd = Math.floor(Math.random() * nm50.length);
				const rnd2 = Math.floor(Math.random() * nm51.length);
				const rnd3 = Math.floor(Math.random() * nm52.length);
				const rnd4 = Math.floor(Math.random() * nm51.length);
				const rnd5 = Math.floor(Math.random() * nm53.length);
				names = nm50[rnd] + nm51[rnd2] + nm52[rnd3] + nm51[rnd4] + nm53[rnd5];
			}
		}
		return genLastName ? `${capitalizeFirstLetter(names)}  ${randomItemFromArray(tianFamilyNames)}` : capitalizeFirstLetter(names);
	}
}

function generateTiefling(type: number, genLastName : boolean) {
    const nm1 = ["", "", "", "", "", "b", "cr", "d", "g", "h", "k", "kr", "m", "r", "s", "sh", "t", "v", "y", "z"];
	const nm2 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "y", "ia", "io"];
	const nm3 = ["c", "cr", "cn", "d", "dr", "g", "gr", "gg", "k", "kr", "l", "ldr", "lv", "ll", "m", "nst", "nv", "nr", "r", "rn", "rd", "rk", "rrd", "rt", "rv", "s", "sr", "sk", "t", "tr", "v", "c", "d", "g", "k", "l", "m", "n", "r", "s", "t", "v"];
	const nm4 = ["", "", "", "c", "k", "n", "r", "s", "t", "th"];
	const nm5 = ["d", "f", "h", "k", "kh", "l", "m", "n", "r", "s", "sh", "str", "t", "th", "v", "z"];
	const nm6 = ["a", "e", "i", "o", "a", "a", "e", "a", "e", "i", "o", "a", "a", "e", "a", "o", "e", "a", "o", "e", "i", "i", "ei", "ia", "ea", "ai"];
	const nm7 = ["d", "dr", "f", "fr", "ff", "l", "ll", "ld", "ldr", "lr", "ln", "ls", "m", "mr", "mdr", "ms", "nd", "ndr", "nn", "n", "nz", "r", "rdr", "rr", "rs", "rz", "s", "sh", "sz", "sr", "t", "tr", "v", "vr", "y", "zs", "d", "f", "l", "m", "n", "r", "s", "t", "v", "y"];
	const nm8 = ["h", "l", "n", "s", "th"];
	const nm9 = ["", "", "", "", "b", "br", "d", "dr", "f", "g", "h", "l", "m", "n", "p", "r", "s", "sh", "t", "v", "z"];
	const nm10 = ["a", "e", "i", "o", "a", "e", "i", "o", "a", "e", "i", "o", "a", "e", "i", "o", "a", "e", "i", "o", "a", "e", "i", "o", "a", "a", "e", "e", "i", "aa", "ae", "ia", "ea"];
	const nm11 = ["b", "br", "c", "d", "dr", "fr", "g", "gg", "gr", "gv", "k", "l", "ll", "lr", "lv", "ldr", "m", "mm", "mr", "mdr", "n", "nd", "ng", "ndr", "nst", "nv", "nr", "r", "rh", "rv", "rr", "rz", "rd", "rdr", "s", "ss", "sr", "sh", "st", "t", "tr", "v", "vr", "b", "c", "d", "g", "k", "l", "m", "n", "r", "s", "t", "v"];
	const nm12 = ["", "", "", "", "", "", "", "", "", "", "d", "ld", "lt", "m", "n", "nd", "r", "rd", "s", "t", "th"];


	const i = Math.floor(Math.random() * 10); {
		let lastName = '';
		let names;
		const rnd8 = Math.floor(Math.random() * nm9.length);
		const rnd9 = Math.floor(Math.random() * nm10.length);
		const rnd10 = Math.floor(Math.random() * nm11.length);
		const rnd11 = Math.floor(Math.random() * nm10.length);
		const rnd12 = Math.floor(Math.random() * nm12.length);
		if (i % 2 === 0) {
			lastName = genLastName ? nm9[rnd8] + nm10[rnd9] + nm11[rnd10] + nm10[rnd11] + nm12[rnd12] : "";
		} else {
			const rnd13 = Math.floor(Math.random() * nm11.length);
			const rnd14 = Math.floor(Math.random() * nm10.length);
			lastName = genLastName ? nm9[rnd8] + nm10[rnd9] + nm11[rnd10] + nm10[rnd11] + nm11[rnd13] + nm10[rnd14] + nm12[rnd12] : "";
		}
		if (type === 1) {
			const rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm6.length);
			const rnd3 = Math.floor(Math.random() * nm7.length);
			const rnd4 = Math.floor(Math.random() * nm6.length);
			const rnd5 = Math.floor(Math.random() * nm8.length);
			if (i < 5) {
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm8[rnd5] + " " + lastName;
			} else {
				const rnd6 = Math.floor(Math.random() * nm7.length);
				const rnd7 = Math.floor(Math.random() * nm6.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm7[rnd6] + nm6[rnd7] + nm8[rnd5] + " " + lastName;
			}
		} else {
			const rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm3.length);
			const rnd4 = Math.floor(Math.random() * nm2.length);
			const rnd5 = Math.floor(Math.random() * nm4.length);
			if (i < 5) {
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5] + " " + lastName;
			} else {
				const rnd6 = Math.floor(Math.random() * nm3.length);
				const rnd7 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm3[rnd6] + nm2[rnd7] + nm4[rnd5] + " " + lastName;
			}
		}
		return names;
	}
}

function generateUndines(type: number, genLastName : boolean) {
    const nm1 = ["", "", "", "", "", "bh", "d", "dh", "g", "gh", "j", "kh", "m", "n", "r", "rh", "sh", "v", "z"];
	const nm2 = ["a", "e", "i", "o", "a", "e", "i", "o", "a", "e", "i", "o", "a", "e", "i", "o", "a", "e", "i", "o", "a", "e", "i", "o", "aa", "oo"];
	const nm3 = ["b", "bd", "c", "cd", "d", "dd", "db", "g", "gd", "gv", "gn", "gm", "j", "k", "kb", "kd", "kn", "km", "kv", "m", "md", "mm", "mb", "n", "nn", "nb", "nd", "r", "rd", "rg", "rv", "rz", "v", "b", "c", "d", "g", "j", "k", "m", "n", "r", "v"];
	const nm4 = ["d", "hz", "j", "k", "m", "n", "r", "sh", "v"];
	const nm5 = ["", "", "", "b", "c", "d", "f", "h", "l", "m", "n", "p", "r", "s", "w", "z"];
	const nm6 = ["a", "e", "i", "u", "a", "e", "i", "u", "a", "e", "i", "u", "a", "e", "i", "u", "a", "e", "i", "u", "y", "y", "y", "ya", "aa"];
	const nm7 = ["b", "bh", "d", "dz", "dh", "fd", "fn", "ff", "f", "fz", "hn", "hl", "hr", "hm", "h", "hh", "l", "lg", "ld", "lb", "lf", "ln", "m", "mm", "mn", "mr", "mf", "n", "nn", "nr", "nd", "nf", "nh", "r", "rh", "rb", "rv", "rd", "rz", "v", "vr", "b", "d", "f", "h", "l", "n", "m", "r", "v", "b", "d", "f", "h", "l", "n", "m", "r", "v"];
	const nm8 = ["", "", "", "", "", "", "", "", "", "", "h", "n"];


	const i = Math.floor(Math.random() * 10); {

		let names;

		if (type === 1) {
			const rnd = Math.floor(Math.random() * nm5.length);
			const rnd2 = Math.floor(Math.random() * nm6.length);
			const rnd3 = Math.floor(Math.random() * nm7.length);
			const rnd4 = Math.floor(Math.random() * nm6.length);
			const rnd5 = Math.floor(Math.random() * nm8.length);
			if (i < 5) {
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm8[rnd5];
			} else {
				const rnd6 = Math.floor(Math.random() * nm7.length);
				const rnd7 = Math.floor(Math.random() * nm6.length);
				names = nm5[rnd] + nm6[rnd2] + nm7[rnd3] + nm6[rnd4] + nm7[rnd6] + nm6[rnd7] + nm8[rnd5];
			}
		} else {
			let rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd5 = Math.floor(Math.random() * nm4.length);
			if (i < 3) {
				while (rnd < 5) {
					rnd = Math.floor(Math.random() * nm1.length);
				}
				names = nm1[rnd] + nm2[rnd2] + nm4[rnd5];
			} else if (i < 7) {
				const rnd3 = Math.floor(Math.random() * nm3.length);
				const rnd4 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm4[rnd5];
			} else {
				const rnd3 = Math.floor(Math.random() * nm3.length);
				const rnd4 = Math.floor(Math.random() * nm2.length);
				const rnd6 = Math.floor(Math.random() * nm3.length);
				const rnd7 = Math.floor(Math.random() * nm2.length);
				names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd4] + nm3[rnd6] + nm2[rnd7] + nm4[rnd5];
			}
		}
		let elvishHumanTitleFamilyNames = familyNameList.concat(elfFamilyNames);
		elvishHumanTitleFamilyNames = elvishHumanTitleFamilyNames.concat(titleLastNames);
		return genLastName ? `${capitalizeFirstLetter(names)}  ${randomItemFromArray(elvishHumanTitleFamilyNames)}` : capitalizeFirstLetter(names);
	}
}