export function generatorAirships() {
	const nm1 = ["Ace", "Aetherwing", "Agamemnon", "Apollo", "Arcadia", "Atlas", "Azrael", "Benediction", "Blackjack", "Bliss", "Calypso", "Ceres", "Charity", "Cloudsong", "Curio", "Curiosity", "Dawn", "Dominus", "Duchess Emily", "Elysium", "Epoch", "Glee", "Grace", "Hailstone", "Helios", "Heritage", "Honor", "Horizon", "Invincible", "Joy", "Jupiter", "Justice", "Lady Liberty", "Luminus", "Memento", "Mercy", "Nemo", "Neptune", "Nightmare", "Olympus", "Orbit", "Pandora", "Patience", "Prometheus", "Proximus", "Rara Avis", "Red Rose", "Saturn", "Scarlet", "Star Gazer", "Starlight", "Stormlight", "Summersong", "Sweetwater", "The Albatross", "The Allure", "The Amaranth", "The Ambassador", "The Andromeda", "The Animus", "The Anomaly", "The Artifact", "The Aspect", "The Aura", "The Aurora", "The Azure", "The Babylon", "The Baron", "The Bastion", "The Behemoth", "The Borealis", "The Buccaneer", "The Cardinal", "The Clemency", "The Climax", "The Condor", "The Conundrum", "The Courtesy", "The Crown", "The Crusader", "The Dauntless", "The Daydream", "The Decadence", "The Delight", "The Destiny", "The Dragonfly", "The Dreadnaught", "The Duchess", "The Duke", "The Eagle", "The Eclipse", "The Ecstasy", "The Endeavor", "The Endurance", "The Enigma", "The Enterprise", "The Equinox", "The Euphoria", "The Excelsior", "The Falcon", "The Felicity", "The Figment", "The Freebird", "The Frigate", "The Galaxy", "The Genius", "The Gryphon", "The Halcyon", "The Happening", "The Harlot", "The Harmony", "The Heirloom", "The Herald", "The Heritage", "The Hummingbird", "The Icarus", "The Indulgence", "The Intrepid", "The Javelin", "The Jubilation", "The Jubilee", "The Juggernaut", "The Legacy", "The Leviathan", "The Lullaby", "The Macaw", "The Maiden", "The Majesty", "The Masquerade", "The Mayflower", "The Miracle", "The Mirth", "The Nautilus", "The Nemesis", "The Night Lady", "The Nightingale", "The Nightwish", "The Nirvana", "The Obelisk", "The Odyssey", "The Oracle", "The Orion", "The Outlook", "The Parable", "The Paradox", "The Paragon", "The Pathfinder", "The Pegasus", "The Pelican", "The Phantasm", "The Phenomenon", "The Phoenix", "The Pinnacle", "The Pioneer", "The Prism", "The Prodigy", "The Prosperity", "The Providence", "The Renegade", "The Repose", "The Reticence", "The Reticent", "The Revelation", "The Revenant", "The Riddle", "The Rose Blossom", "The Sanctity", "The Saturninity", "The Sentinel", "The Serenity", "The Skyshadow", "The Skywarden", "The Solitude", "The Solstice", "The Spectacle", "The Spire", "The Stormherald", "The Summit", "The Sunbird", "The Surge", "The Tempest", "The Titan", "The Tribute", "The Triumph", "The Utopia", "The Valhalla", "The Valiant", "The Valkyrie", "The Vestige", "The Vision", "The Warden", "The Wayfarer", "The Zephyr", "The Zodiac", "Tranquillity", "Triton", "Wanderlust", "Wishmaster", "Zenith", "Zion"];
	const nm2 = ["Adventurous", "Agile", "Ample", "Anchored", "Ancient", "Angelic", "Angry", "Antique", "Arctic", "Austere", "Azure", "Bare", "Barren", "Beloved", "Big", "Bitter", "Black", "Blank", "Blind", "Blond", "Blushing", "Bold", "Brave", "Bright", "Brilliant", "Bronze", "Brown", "Burly", "Canine", "Capital", "Cold", "Crafty", "Crazy", "Crimson", "Crooked", "Crown", "Curvy", "Dapper", "Daring", "Darling", "Dazzling", "Dear", "Defiant", "Delayed", "Devoted", "Diligent", "Discrete", "Distant", "Eager", "Ebon", "Elder", "Elegant", "Emerald", "Enchanted", "Enlightened", "Euphoric", "Exalted", "Faithful", "False", "Fancy", "Fantastic", "Fearless", "Feisty", "Feline", "First", "Forsaken", "Gentle", "Giant", "Glass", "Glorious", "Golden", "Graceful", "Grand", "Great", "Grim", "Happy", "Heavy", "High", "Hollow", "Honest", "Humble", "Humming", "Husky", "Idle", "Infamous", "Intrepid", "Ivory", "Jagged", "Last", "Little", "Lone", "Lonely", "Lost", "Loyal", "Lucky", "Majestic", "Merry", "Nimble", "Odd", "Old", "Pale", "Plump", "Precious", "Prime", "Pure", "Quiet", "Rapid", "Red", "Round", "Royal", "Scented", "Serene", "Silent", "Silver", "Skinny", "Slim", "Soft", "Striped", "Swift", "Tender", "Tiny", "Vibrant", "Violet", "Warm", "White", "Wicked"];
	const nm3 = ["Allure", "Ambassador", "Ambience", "Amity", "Apex", "Aspect", "Aura", "Aurora", "Baron", "Baroness", "Bastion", "Behemoth", "Bolt", "Bounty", "Buccaneer", "Bullet", "Bulwark", "Cardinal", "Champion", "Charity", "Citadel", "Clemency", "Climax", "Cloud", "Concord", "Condor", "Countess", "Crown", "Crusader", "Crux", "Dame", "Dawn", "Daydream", "Delight", "Destiny", "Dominion", "Dragonfly", "Dream", "Duchess", "Duke", "Eagle", "Eclipse", "Emissary", "Endeavor", "Enigma", "Enterprise", "Envoy", "Falcon", "Felicity", "Fortress", "Fortune", "Frigate", "Genesis", "Grace", "Gryphon", "Harmony", "Heirloom", "Herald", "Heritage", "Homage", "Honor", "Horizon", "Hummingbird", "Javelin", "Jewel", "Joy", "Justice", "Lady", "Legacy", "Lord", "Maiden", "Majesty", "Marvel", "Matron", "Mercy", "Miracle", "Mirage", "Mistress", "Monarch", "Monument", "Muse", "Needle", "Nemesis", "Nightingale", "Obelisk", "Odyssey", "Omen", "Oracle", "Parable", "Paradox", "Paragon", "Parapet", "Pegasus", "Phantasm", "Phenomenon", "Phoenix", "Pinnacle", "Pioneer", "Prestige", "Princess", "Prodigy", "Prophecy", "Quest", "Relic", "Renegade", "Revenant", "Riddle", "Sentinel", "Sentry", "Serenity", "Shade", "Shadow", "Shroud", "Solstice", "Spectacle", "Specter", "Summit", "Surge", "Tempest", "Titan", "Tribute", "Triumph", "Unity", "Valkyrie", "Vertex", "Vestige", "Vision", "Voyage", "Warden", "Wish", "Zenith", "Zodiac"];

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


    const i = Math.floor(Math.random() * 10);
    {
        let names;
		if (i < 5) {
			const rnd = Math.floor(Math.random() * nm1.length);
			names = nm1[rnd];
		} else {
			const rnd = Math.floor(Math.random() * nm2.length);
			const rnd2 = Math.floor(Math.random() * nm3.length);
			names = nm2[rnd] + " " + nm3[rnd2];
		}
		return randomItemFromArray(prefixes) + " " + names;
	}

}

function randomItemFromArray(array:string[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}