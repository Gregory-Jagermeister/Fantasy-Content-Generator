export function generatorMagical_trees() {
	const nm1 = ["Abyss", "Aching", "Angel", "Angel's", "Anxious", "Aquatic", "Arching", "Aromatic", "Assassin", "Banshee", "Barbed", "Bitter", "Black", "Bleak", "Blight", "Blister", "Blood", "Blue", "Bone", "Boomerang", "Bouncing", "Bright", "Bronze", "Candy", "Cave", "Chilling", "Cliff", "Cold", "Corrupt", "Corrupted", "Corrupting", "Coughing", "Crawling", "Creeping", "Dancing", "Dawn", "Deadly", "Death's", "Delicious", "Demon", "Demon's", "Devil's", "Dim", "Dire", "Dragon", "Drifting", "Drowsy", "Dusk", "Dwarf", "Eagle", "Fake", "Fanged", "Fatigue", "Fear", "Fearful", "Fever", "Fire", "Fjord", "Flying", "Fragrant", "Frozen", "Funeral", "Funky", "Ghost", "Giant", "Glacier", "Glowing", "Golden", "Grand", "Grave", "Gray", "Green", "Grim", "Grumpy", "Hammer", "Happy", "Harmless", "Hate", "Hidden", "Hollow", "Horned", "Hot", "Hovering", "Humble", "Ice", "Imperial", "Infecting", "Invisible", "Island", "Itching", "Jealous", "Jester", "Joyful", "King's", "Lethal", "Life's", "Lion", "Love", "Lunar", "Mage's", "Majestic", "Mammoth", "Marsh", "Mercy's", "Mimic", "Mock", "Mocking", "Monk's", "Moon", "Mound", "Mountain", "Nasty", "Naughty", "Nervous", "Noxious", "Ocean", "Orange", "Ordinary", "Perfumed", "Pest", "Phantom", "Pink", "Piranha", "Pixy", "Plague", "Pleasant", "Poisonous", "Prancing", "Putrid", "Pygmy", "Queen's", "Quiet", "Rare", "Rash", "Raven", "Red", "Regal", "Restoration", "River", "Rotten", "Royal", "Sad", "Salty", "Sanguine", "Savage", "Scented", "Screaming", "Sentient", "Serpent", "Shadow", "Shield", "Shocking", "Shrine", "Shy", "Silver", "Skeletal", "Skulking", "Sleeping", "Sleepy", "Smelly", "Smooth", "Sneeze", "Sneezing", "Solar", "Sore", "Sour", "Spicy", "Spiky", "Spirit", "Spitfire", "Stink", "Stinking", "Sugar", "Sun", "Sunny", "Swamp", "Sweet", "Tall", "Tangle", "Tangled", "Taunting", "Tickle", "Toxic", "Twilight", "Twisted", "Urban", "Venomous", "Vision", "Volcano", "Walking", "Warm", "Weeping", "Whisper", "White", "Whomping", "Wicked", "Wild", "Wisdom", "Wolf", "Yellow"];
	const nm2 = ["Acacia", "Alder", "Ash", "Aspen", "Azalea", "Balsa", "Bamboo", "Baobab", "Bayonet", "Beech", "Birch", "Box", "Buckeye", "Buckthorn", "Bunya", "Bush", "Cassava", "Catalpa", "Cedar", "Conifer", "Cycad", "Cypress", "Elder", "Elm", "Eucalyptus", "Fir", "Hawthorn", "Hazel", "Hemlock", "Hickory", "Holly", "Hornbeam", "Juniper", "Larch", "Leaf", "Locust", "Magnolia", "Mahogany", "Mangrove", "Maple", "Medlar", "Milkbark", "Oak", "Oleander", "Palm", "Palmetto", "Persimmon", "Pine", "Poplar", "Privet", "Rhododendron", "Rowan", "Sequoia", "Spruce", "Strongbark", "Sumac", "Sycamore", "Tree", "Viburnum", "Willow", "Wood", "Yew", "Yucca"];
	const nm3 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "ea", "ei", "eo", "ae", "ai", "ia", "io", "ua", "aa", "ee", "oo", "ou", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
	const nm4 = ["b", "c", "d", "f", "g", "h", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "x", "y", "z", "bl", "br", "ch", "chr", "cl", "cr", "dl", "dr", "fl", "fr", "fy", "gl", "gr", "kl", "kn", "kr", "ph", "phr", "pl", "pr", "sc", "sh", "shr", "sl", "sm", "sn", "sp", "sr", "str", "th", "thr", "tr", "vl"];
	const nm5 = ["a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "ea", "ei", "eo", "ae", "ai", "ia", "io", "ua", "aa", "ee", "oo", "ou"];
	const nm6 = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z", "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z", "bb", "bd", "bg", "bl", "br", "bs", "cc", "ch", "chr", "cl", "cr", "dd", "df", "dg", "dl", "dr", "ds", "dt", "fd", "ff", "fg", "fl", "fm", "fn", "fp", "fr", "fy", "gd", "gg", "ght", "gl", "gr", "gth", "hh", "hl", "hm", "hn", "hs", "ht", "kd", "kk", "kl", "km", "kn", "kr", "lb", "ld", "lf", "lg", "lk", "ll", "lm", "ln", "lp", "ls", "lt", "ly", "mb", "md", "mf", "mk", "ml", "mm", "mn", "mp", "ms", "my", "nc", "nd", "nf", "ng", "nk", "nl", "nm", "nn", "np", "ns", "nt", "ny", "ph", "phr", "pl", "pp", "pr", "ql", "qr", "qs", "rc", "rd", "rf", "rg", "rh", "rk", "rl", "rm", "rn", "rp", "rr", "rs", "rsh", "rt", "rth", "rw", "sb", "sc", "sd", "sf", "sg", "sh", "shr", "sk", "sl", "sm", "sn", "sp", "sr", "ss", "st", "str", "sw", "sy", "th", "thr", "tr", "tt", "vl", "zh", "zl", "zr", "zz"];
	const nm7 = ["ab", "ac", "acca", "acia", "alea", "an", "ander", "ant", "any", "ar", "arch", "ark", "ava", "eaf", "eam", "eech", "en", "er", "ess", "et", "etto", "ew", "eye", "ifer", "immon", "ine", "iper", "irch", "ock", "olia", "on", "onet", "ood", "ore", "orn", "ory", "ove", "ow", "uce", "um", "us"];


    const i = Math.floor(Math.random() * 10); {
        let names;
		if (i < 6) {
			const rnd = Math.floor(Math.random() * nm1.length);
			const rnd2 = Math.floor(Math.random() * nm2.length);
			names = nm1[rnd] + " " + nm2[rnd2];
		} else if (i < 8) {
			const rnd = Math.floor(Math.random() * nm3.length);
			const rnd2 = Math.floor(Math.random() * nm4.length);
			const rnd3 = Math.floor(Math.random() * nm7.length);
			names = nm3[rnd] + nm4[rnd2] + nm7[rnd3];
		} else {
			const rnd = Math.floor(Math.random() * nm3.length);
			const rnd2 = Math.floor(Math.random() * nm4.length);
			let rnd3 = Math.floor(Math.random() * nm5.length);
			if (rnd > 9) {
				while (rnd3 > 9) {
					rnd3 = Math.floor(Math.random() * nm5.length);
				}
			}
			const rnd4 = Math.floor(Math.random() * nm6.length);
			const rnd5 = Math.floor(Math.random() * nm7.length);
			names = nm3[rnd] + nm4[rnd2] + nm5[rnd3] + nm6[rnd4] + nm7[rnd5];
		}
		return names;
	}

}