export function generatorMetals() {
	const nm1 = ["", "", "", "", "", "b", "c", "d", "f", "g", "h", "i", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
	const nm2 = ["a", "e", "o", "u"];
	const nm3 = ["br", "cr", "dr", "fr", "gr", "pr", "str", "tr", "bl", "cl", "fl", "gl", "pl", "sl", "sc", "sk", "sm", "sn", "sp", "st", "sw", "ch", "sh", "th", "wh", "kr"];
	const nm4 = ["ae", "ai", "ao", "au", "a", "ay", "ea", "ei", "eo", "eu", "e", "ey", "ua", "ue", "ui", "uo", "u", "uy", "ia", "ie", "iu", "io", "iy", "oa", "oe", "ou", "oi", "o", "oy"];
	const nm5 = ["sium", "cium", "lium", "rium", "trium", "tium", "nese", "nium", "sten", "nor", "tine", "ntine", "rhil", "thil", "nyx", "dian"];
	const nm6 = ["ium", "ese", "alt", "um", "ian", "il", "ine", "yx", "ite"];


    const i = Math.floor(Math.random() * 10); {
        let names;
		if (i < 4) {
			const rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm3.length);
			const rnd4 = Math.floor(Math.random() * nm4.length);
			const rnd5 = Math.floor(Math.random() * nm5.length);
			names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm4[rnd4] + nm5[rnd5];
		} else if (i < 7) {
			const rnd3 = Math.floor(Math.random() * nm3.length);
			const rnd4 = Math.floor(Math.random() * nm4.length);
			const rnd5 = Math.floor(Math.random() * nm5.length);
			names = nm3[rnd3] + nm4[rnd4] + nm5[rnd5];
		} else {
			const rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			const rnd3 = Math.floor(Math.random() * nm3.length);
			const rnd4 = Math.floor(Math.random() * nm6.length);
			names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm6[rnd4];
		}
		return names;
	}

}