import { GeneratorModal } from 'modal';
import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

export type currency = {
	name: string,
	rarity: string
}

export type groupGenSettings = {
	adj: string[],
	nouns: string[],
	nounsP: string[],
	groupTypes: string[],
	singleDescriptors : string[]
}

export type lootTables = {
	adj: string[]
	nouns: string[];
}

export type drinkGeneratorSettings = {
	adj : string[],
	nouns : string[],
}

export type cityGeneratorSetting = {
	prefixArray: string[],
	suffixArray: string[]
}

export type innGeneratorSettings = {
	prefixes: string[],
	innType: string[],
	nouns: string[],
	desc: string[],
	rumors: string[]
}

interface MyPluginSettings {
	enableCurrency: boolean;
	citySettings: cityGeneratorSetting;
	currencyTypes: currency[];
	currencyFrequency: number;
	innSettings: innGeneratorSettings;
	drinkSettings: drinkGeneratorSettings;
	lootSettings: lootTables;
	groupSettings: groupGenSettings;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	enableCurrency: false,
	citySettings: {
		prefixArray: ["camp", "castle", "east", "edge", "ever", "great", "mount", "new", "north", "red", "rose", "south", "west"],
		suffixArray: ["wood", "avon", "bank", "bark", "barrow", "bay", "beach", "bell", "borough", "berg", "bourne", "broad", "bridge", "brook", "brough", "burgh", "burn", "bury", "by", "canyon", "caster", "chester", "cliffe", "combe", "cot", "cott", "cote", "cove", "creek", "croft", "crook", "dale", "den", "din", "dine", "don", "downs", "falls", "field", "fin", "flats", "ford", "fork", "gate", "grove", "gum", "ham", "harbour", "heights", "hill", "holm", "hurst", "ing", "kirk", "land", "lake", "latch", "lea", "leigh", "ley", "marsh", "mere", "minster", "mond", "mont", "more", "ness", "park", "pilly", "pine", "point", "pond", "ridge", "river", "rock", "sett", "side", "son", "stead", "stoke", "stone", "stow", "terrace", "thorpe", "ton", "tor", "town", "vale", "valley", "view", "village", "ville", "water", "well", "wharf", "wick", "wood", "worth"],
	},
	innSettings: {
		prefixes: ["The Rusty", "The Cosy", "The Grand", "The Quiet", "The Friendly", "Bashur's", "Harmony", "Harmonic", "Bald Faced", "Black", "Grey", "Silver", "White", "Blue", "Purple", "Green", "The Ugly", "The Pretty", "Ye Ol' Fighting", "The Drunk", "One", "Two", "Three", "Four", "Five", "Busta", "The Terrified"],
		innType: ["Inn", "Lodge", "Tavern", "Rest", "Stop"],
		nouns: ["Phoenix", "Centaur", "Dragon", "Selkie", "Griffin", "Bandersnatch", "Mermaid", "Werewolf", "Dryad", "Golem", "Bugbear", "Goblin", "Tiger", "Cat", "Warrior", "Wizard", "Drop Bear", "Bear", "Lagoon", "Bunyip", "Rat King", "King's", "Automaton", "Beach", "Reaper", "Grim", "Ogre", "Skeleton", "Ghost"],
		desc: [
			"located in the heart of the city, surrounded by bustling marketplaces and busy streets.",
			"nestled in a peaceful and serene countryside, with picturesque views of rolling hills and sprawling fields.",
			"overlooking the sea, with panoramic views of the ocean and a nearby sandy beach.",
			"situated in the heart of a dense forest, surrounded by towering trees and the chirping of birds.",
			"located at the foot of a grand mountain, with stunning views of the rugged peaks and snow-capped summits.",
			"perched on the edge of a cliff, with breathtaking views of the valley below and the distant horizon.",
			"hidden away in a remote corner of the world, surrounded by untouched nature and wildlife.",
			"tucked away in a hidden valley, with tranquil meadows and a crystal-clear lake.",
			"perched on the top of a hill, with magnificent views of the city and the surrounding countryside.",
			"set in a bustling harbour town, with the sound of boats and seagulls in the air.",
			"located in a bustling port city, surrounded by the hustle and bustle of daily life.",
			"nestled in the heart of a peaceful village, surrounded by rolling hills and lush greenery.",
			"overlooking the ocean, with views of the horizon and a nearby pier.",
			"settled deep in the heart of a mysterious jungle, with a cacophony of tropical sounds and vibrant life.",
			"positioned at the edge of a desert, with sweeping views of the sand dunes and the distant horizon.",
			"hidden away in a forgotten corner of the world, surrounded by ancient ruins and mysterious artifacts.",
			"tucked away in a bustling city, with the sound of music and laughter in the air.",
			"perched atop a tall mountain, with sweeping views of the countryside and a majestic waterfall.",
			"set in a serene lake town, with magnificent views of the shimmering lake and the surrounding mountains.",
			"located in the heart of a bustling market town, with the smell of spices and exotic foods wafting in the air.",
			"nestled in a quiet corner of the countryside, surrounded by rolling hills and picturesque views.",
			"overlooking a river, with stunning views of the cascading rapids and the lush riverbank.",
			"situated in the heart of a dense forest, with the sound of birds singing and a canopy of trees.",
			"located at the foot of a majestic mountain range, with breathtaking views of the snow-capped peaks and the distant horizon.",
			"hidden away in a forgotten corner of the world, surrounded by untouched nature and mysterious creatures.",
			"tucked away in a peaceful valley, with tranquil meadows and a babbling brook running nearby.",
			"perched atop a large hill, with sweeping views of the surrounding countryside and a nearby lake.",
			"set in a bustling harbour town, with the sound of waves and seagulls in the air.",
			"located in an ancient city, surrounded by vibrant culture and the bustling of daily life.",
			"nestled in the heart of a peaceful village, surrounded by rolling fields and lush greenery.",
			"overlooking a bustling port town, with breathtaking views of the harbor and its many boats.",
			"situated deep in the heart of a mysterious swamp, with a cacophony of strange sounds and vibrant wildlife.",
			"positioned at the edge of a vast desert, with magnificent views of the sand dunes and the distant horizon.",
			"hidden away in a secret corner of the world, surrounded by ancient ruins and magical artifacts.",
			"tucked away in a bustling market town, with the smell of exotic spices and fresh produce in the air.",
			"perched atop a steep cliff, with sweeping views of the valley and a nearby waterfall.",
			"set in a tranquil mountain town, with magnificent views of the snow-capped peaks and the surrounding countryside.",
			"located in the heart of a bustling city, surrounded by vibrant culture and the sound of music.",
			"nestled in a peaceful corner of the countryside, surrounded by rolling hills and lush greenery.",
			"overlooking a calm lake, with stunning views of the shimmering water and a nearby pier.",
			"situated in the heart of a dense forest, with the sound of birdsong and a canopy of trees.",
			"located at the foot of a grand mountain range, with breathtaking views of the rugged peaks and distant horizon.",
			"hidden away in a forgotten corner of the world, surrounded by untouched nature and mysterious creatures.",
			"tucked away in a hidden valley, with tranquil meadows and a crystal-clear stream.",
			"perched atop a tall hill, with sweeping views of the surrounding countryside and a nearby lake.",
			"set in a quaint harbour town, with the sound of waves and seagulls in the air.",
			"located in the heart of an ancient city, surrounded by vibrant culture and the bustling of daily life.",
			"nestled in a peaceful corner of the countryside, surrounded by rolling hills and picturesque views.",
			"overlooking a bustling port town, with breathtaking views of the harbor and its many ships.",
			"situated deep in the heart of a mysterious jungle, with a cacophony of tropical sounds and vibrant wildlife.",
			"positioned at the edge of a vast desert, with magnificent views of the sand dunes and distant horizon.",
			"hidden away in a secret corner of the world, surrounded by ancient ruins and mysterious artifacts.",
			"tucked away in a bustling market town, with the smell of spices and exotic foods wafting in the air.",
			"perched atop a steep cliff, with sweeping views of the valley and a majestic waterfall.",
			"set in a serene mountain town, with magnificent views of the snow-capped peaks and the surrounding countryside.",
			"located in a bustling port city, surrounded by the hustle and bustle of daily life.",
			"nestled in a peaceful corner of the countryside, surrounded by rolling fields and lush greenery.",
			"overlooking the sea, with panoramic views of the ocean and a nearby sandy beach.",
			"situated in the heart of a dense forest, with the sound of birds singing and a canopy of trees.",
			"located at the foot of a majestic mountain range, with breathtaking views of the rugged peaks and the distant horizon.",
			"hidden away in a forgotten corner of the world, surrounded by untouched nature and mysterious creatures.",
			"tucked away in a hidden valley, with tranquil meadows and a crystal-clear lake.",
		],
		rumors: [
			"My niece told me about a fugitive found an old tomb when discovered a lake snake. And now defeated a superior foe in single combat.",
			"My stepson told me about a monarchist found a magic item when discovered a vampire. And now the moon might fracture!.",
			"They say that a religious emissary was seen with a drunk down near the merchant quarter and there was a lich. People heard it from a viking warrior, so it is probably just idle gossip.",
			"Passers-by talk about the disappearance of someone. They mention a hidden fort said to house something truly abnormal, somewhere out by the waterfall. If asked further, people will tell you, it should be avoided at all cost. In addition a priest at a local temple asks the players to collect something from there.",
			"People have heard that a disgraced executioner was seen with snake wine down near the mages guild and there was a hippogriff.",
			"Believably a historical archivist was seen with a strange man from the inn down near the crafts guild and there was a soul gathering demon. People heard it from eighty-six pixies in a trench coat, so it is likely true.",
			"Nailed to a tree is a small note with a warning to all about a dark park with the etchings of a dark ritual, somewhere in the catacombs. If asked further, people will tell you, people who’ve seen it are not the same. In addition a local shopkeeper hushes on the players and leads them to his/her home, when asked about the place.",
			"When they want to scare the children, the locals tell a story of a dragon-tamer in the mountains was seen with an escaped convict down near the crafts guild and nearby there was a dead noble.",
			"Apparently the local dragon has been cursed by a witch to ceaselessly wander through the forest, spontaneously combusting. People heard it from an old Guard, so it is probably true.",
			"A rumor is circulating that a strange creature lurks in the depths of the nearby forest. It is said that it draws its strength from the shadows and that it can only be seen with the help of a special amulet.",
			"Rumor has it that a royal knight was seen with a strange woman down near the druid grove and there was a banshee.",
			"It is said that a lost city exists in the desert, full of treasures, guarded by a powerful being. People heard it from a strange old man at the market, so it is likely true.",
			"The villagers talk of a witch that lives in the nearby swamp. It is said that she can be seen during the full moon, dancing around a fire in the night sky.",
			"A rather silly rumour has been circulating that a powerful wizard has opened a portal to the underworld. People heard it from a mysterious traveller, so it is probably just idle gossip.",
			"People whisper that a foreign prince has been in the area. It is said that he is searching for a magical artifact that will give him untold power.",
			"The bards tell a tale of a powerful warrior who has laid claim to a cursed temple in the mountains. It is said that anyone who enters risks being trapped forever.",
			"Word on the street is that a strange creature lurks in the sewers. It is said to be able to control the minds of lesser creatures and even humans.",
			"People whisper that a powerful mage has been seen in the area. It is said that he is searching for an ancient artifact that will grant him immortality.",
			"Rumors abound of a powerful dragon that protects a hidden cave somewhere in the mountains. It is said that anyone who enters must face the dragon in battle.",
			"People have heard that a group of adventurers is on a quest for a magical gem. It is said that it will grant them great power and wealth.",
			"The locals tell a story of a powerful vampire who rules a castle in the mountains. It is said that anyone who enters must face the vampire in battle.",
			"They say that a mysterious stranger has been seen in the area. It is said that he is searching for a magical artifact that will grant him untold power.",
			"People have heard that a powerful witch has opened a portal to the underworld. It is said that anyone who enters will be cursed for eternity.",
			"The bards tell a tale of a powerful wizard who has laid claim to a haunted castle in the forest. It is said that anyone who enters risks his/her life.",
			"Word on the street is that a strange creature is living in the sewers. It is said to be able to manipulate the minds of lesser creatures and even humans.",
			"People whisper that a powerful necromancer has been seen in the area. It is said that he is searching for a powerful artifact that will give him domination over death.",
			"Rumors abound of a powerful dragon that is guarding a hidden temple in the mountains. It is said that anyone who enters must face the dragon in single combat.",
			"People have heard that a group of adventurers are on a quest for a magical amulet. It is said that it will give them great power and wealth.",
			"The locals tell a story of a powerful warlock who rules a castle in the forest. It is said that anyone who enters must face the warlock in single combat.",
			"They say that a mysterious figure has been seen in the area. It is said that he is searching for a magical item that will grant him ultimate power.",
			"People have heard that a powerful witch has opened a portal to the spirit realm. It is said that anyone who enters will be cursed for all eternity.",
			"The bards tell a tale of a powerful mage who has laid claim to an ancient temple in the mountains. It is said that anyone who enters risks being trapped forever.",
			"Word on the street is that a strange creature lurks in the depths of the nearby lake. It is said to be able to control the minds of lesser creatures and even humans.",
			"People whisper that a powerful sorcerer has been seen in the area. It is said that he is searching for a powerful relic that will give him control over the elements.",
			"Rumors abound of a powerful dragon that is guarding a hidden city in the mountains. It is said that anyone who enters must face the dragon in single combat.",
			"People have heard that a group of mercenaries are on a quest for a magical sword. It is said that it will grant them great power and wealth.",
			"The locals tell a story of a powerful witch who rules a castle in the forest. It is said that anyone who enters must face the witch in single combat.",
			"They say that a mysterious figure has been seen in the area. It is said that he is searching for a magical artifact that will grant him total power.",
			"People have heard that a powerful wizard has opened a portal to the astral plane. It is said that anyone who enters will be cursed for eternity.",
			"The bards tell a tale of a powerful necromancer who has laid claim to a haunted tower in the forest. It is said that anyone who enters risks his/her life.",
			"Word on the street is that a strange creature is living in the sewers. It is said to be able to manipulate the minds of lesser creatures and even humans.",
			"People whisper that a powerful warlock has been seen in the area. It is said that he is searching for a powerful relic that will give him mastery over death.",
			"Rumors abound of a powerful dragon that protects a hidden shrine somewhere in the mountains. It is said that anyone who enters must face the dragon in battle.",
			"People have heard that a group of adventurers are on a quest for a magical staff. It is said that it will grant them great power and wealth.",
			"The locals tell a story of a powerful vampire who rules a castle in the mountains. It is said that anyone who enters must face the vampire in single combat.",
		]
	},
	currencyTypes: [{
		"name": "GP",
		"rarity": "rare"
	},
	{
		"name": "CP",
		"rarity": "common"
	},
	{
		"name": "SP",
		"rarity": "common"
	},
	{
		"name": "PP",
		"rarity": "rarest"
	}],
	currencyFrequency: 50,
	drinkSettings: {
		adj: ["Almond", "Amazing", "Ancient", "Angel", "Angelic", "Apple", "Apricot", "Arctic", "Aromatic", "Autumn", "Avocado", "Balanced", "Banana", "Basil", "Bay Leaf", "Beautiful", "Beetroot", "Black", "Blue", "Blueberry", "Boiled", "Brilliant", "Brown", "Brutal", "Burning", "Calm", "Capital", "Caramel", "Catnip", "Cherry", "Cherry Blossom", "Chestnut", "Chilled", "Chilli", "Cinnamon", "Clouded", "Cloudy", "Coconut", "Cool", "Coriander", "Cosmic", "Cranberry", "Crazy", "Crimson", "Cucumber", "Demon", "Demonic", "Dire", "Eastern", "Easy", "Electric", "Elemental", "Evil", "Extreme", "Fainting", "Fallen", "Fancy", "Fantasy", "Fast", "Final", "First", "Flaming", "Flower", "Flying", "Forest", "Fresh", "Frosted", "Frozen", "Fruity", "Garlic", "Gentle", "Ginger", "Gingerroot", "Gleaming", "Glowing", "Grape", "Grapefruit", "Green", "Hazelnut", "High", "Holy", "Honest", "Honey", "Hot", "Hushed", "Icy", "Imaginary", "Incredible", "Infinite", "Innocent", "Insane", "Insanity", "Jasmine", "Kiwi", "Lavender", "Lavish", "Lemon", "Lemonade", "Lemongrass", "Lemony", "Lime", "Low", "Lucky", "Mad", "Mango", "Melon", "Mild", "Milk", "Milky", "Mint", "Minty", "Molten", "Mountain", "Mystic", "Nasty", "Nimble", "Noble", "Northern", "Noxious", "Numb", "Nutmeg", "Nutty", "Oak", "Oaken", "Oblivious", "Obvious", "Orange", "Oregano", "Palm", "Paranoid", "Passion Fruit", "Peacan", "Peanut", "Pear", "Peppermint", "Perfect", "Pineapple", "Pink", "Potato", "Precious", "Pure", "Rainbow", "Red", "River", "Rose", "Rose Petal", "Rosemary", "Rotten", "Rough", "Rude", "Rushed", "Saffron", "Salt 'n Pepper", "Salty", "Sanguine", "Savage", "Scented", "Secret", "Silent", "Smooth", "Southern", "Spearmint", "Spiced", "Spicy", "Spirit", "Spring", "Stale", "Steamy", "Sticky", "Strawberry", "Sugar", "Sugary", "Summer", "Surprised", "Sweet", "Tarragon", "Thyme", "Tiny", "Tomato", "Tropic", "Tropical", "Twisting", "Ultimate", "Unholy", "Universal", "Unlucky", "Vanilla", "Vanillabean", "Vibrant", "Warm", "Wasabi", "Watermelon", "Western", "Wet", "Whimsical", "Whipped", "White", "Wicked", "Wild", "Willow", "Winged", "Winter", "Wonderful", "Wonderous", "Yellow", "Spicy", "Fruity", "Sour", "Sweet", "Smooth", "Bitter", "Refreshing", "Amigo", "Arrow", "Ball", "Barrage", "Bear", "Blast", "Blaze", "Bliss", "Blitz", "Blizzard", "Blood", "Blossom", "Bolt", "Bomb", "Breeze", "Bruiser", "Bubble", "Bull", "Burst", "Buzzer", "Cooler", "Crash", "Critter", "Crush", "Crusher", "Crystal", "Delight", "Dog", "Double", "Drop", "Duke", "Dutchess", "Earthquake", "Eclipse", "Eight", "Enigma", "Eye", "Five", "Flash", "Fluff", "Fluffy", "Four", "Freedom", "Fury", "Giant", "Gloom", "Grog", "Heaven", "Hell", "Hopper", "Horn", "Horror", "Hound", "Howler", "Infusion", "Jam", "Joke", "Joker", "Joy", "Killer", "Kiss", "Kisses", "Knight", "Lady", "Lagoon", "Light", "Lion", "Lord", "Lotus", "Lover", "Major", "Minor", "Mix", "Monsoon", "Moonshine", "Mud", "Murder", "Nectar", "Night", "Nightfall", "Orb", "Paradise", "Paralyzer", "Parody", "Passion", "Pearl", "Pecker", "Petal", "Phantom", "Plus", "Pop", "Puff", "Punch", "Rage", "Riddle", "Roar", "Rumble", "Rush", "Score", "Scream", "Seven", "Shadow", "Shield", "Shot", "Shrub", "Silence", "Sip", "Six", "Sizzle", "Slammer", "Slap", "Slapper", "Sling", "Slingshot", "Slush", "Smash", "Smooch", "Snake", "Snowball", "Sour", "Special", "Squeeze", "Stardust", "Starlight", "Stinger", "Storm", "Striker", "Sunrise", "Sunset", "Surge", "Talon", "Teaser", "Temper", "Tempest", "Thrill", "Thriller", "Thunder", "Ticker", "Tickle", "Tonic", "Tornado", "Torrent", "Touch", "Tremor", "Twilight", "Twister", "Velour", "Velvet", "Vengeance", "Volcano", "Volley", "Wacker", "Walk", "Walker", "Wave", "Whisper", "Whistle", "Wink", "Wonder", "Zombie"],
		nouns: ["Cocktail", "Smoothie", "Shake", "Juice", "Iced Tea", "Lemonade", "Soda", "Ale", "Brandy", "Tea", "Tea", "Sherry", "Brew", "Cappuchino", "Cider", "Coffee", "Cognac", "Dark Ale", "Dark Beer", "Drink", "Espresso", "Gin", "Java", "Lager", "Light Ale", "Light Beer", "Mead", "Mocha", "Red Wine", "Rum", "Sake", "Tea", "Tonic", "Vodka", "Whiskey", "White Wine", "Wine"]
	},
	lootSettings: {
		adj: ["old", "tattered", "rotten", "shiny", "polished", "rusty", "broken", "priceless", "ancient", "precious"],
		nouns: ["bag", "scroll", "book", "map", "key", "ring", "necklace", "potion", "ball bearing", "alchemists fire", "antitoxin", "caltrop", "book", "candle", "map scroll", "chain", "climbers kit", "crowbar", "fishing tackle", "holy water", "hunting trap", "lantern", "lock", "oil", "poison", "ram portable", "spyglass", "tent", "bucket", "glass bottle", "chest", "signet ring", "sealing wax", "whetstone", "arrows", "bolt", "censer", "dice set", "dragonchess set", "flute", "glass blowers tool", "holy oil", "lute", "playing card set", "sack", "saddle", "sovereign glue", "universal solvent", "prosthetic wooden arm", "hook hand", "peg leg", "glass eye", "bag of marbles", "hatchet", "alchemists supplies", "brewers supplies", "burglars pack", "lockpicks", "calligrapher’s supplies", "carpenter's tool", "cartographers tool", "chain mail", "cooks utensil", "disguise kit", "dungeoneers pack", "entertainers pack", "explorers pack", "forgery kit", "half plate", "healers kit", "ink", "ink pen", "parchment", "shovel", "leather worker's tool", "masons tool", "navigator's tool", "net", "painters supplies", "perfume", "plate armor", "potters tool", "priests pack", "ring mail", "scale mail", "scholar's pack", "scimitar", "shield", "whistle", "smiths tool", "thieves tool", "torch", "weaver's tool", "cobblers tool", "jewelers tools", "tinkers tool", "poisoners kit", "herbalism kit", "bell", "block and tackle", "animal or pet", "traveler's clothes", "fine clothes"]
	},
	groupSettings: {
		adj: ["azure", "black", "blue", "brass", "bronze", "brown", "cardinal", "cobalt", "copper", "crimson", "crystal", "demon", "denim", "diamond", "ebony", "electric", "emerald", "fire", "flame", "gold", "green", "grey", "grizzly", "ice", "ivory", "jade", "onyx", "orange", "red", "royal", "ruby", "sanguine", "sapphire", "scarlet", "thunder", "violet", "white", "yellow", "", "", "", "", "", "", "", "", "", "", "", ""],
		nouns: ["alien", "alligator", "angel", "badger", "banner", "bat", "bear", "blood", "blooddrop", "blossom", "boar", "bull", "bulldog", "butterfly", "chainsaw", "cobra", "coyote", "crocodile", "cross", "crow", "death", "demon", "devil", "dragon", "dragonfly", "dragontooth", "dwarf", "eagle", "elephant", "enigma", "fang", "forsaken", "ghost", "gorilla", "hand", "hog", "honey badger", "horn", "jackal", "knife", "knuckle", "leopard", "lily", "lion", "liontooth", "mamba", "mammoth", "monkey", "moth", "needle", "owl", "phantom", "pygmy", "pincer", "pistol", "rat", "raven", "ravenclaw", "razor", "reaper", "rebel", "rider", "rose", "saber", "sabortooth", "serpent", "shark", "sharkfin", "sharktooth", "skeleton", "skull", "snake", "spider", "sword", "tear", "thorn", "tiger", "toad", "troll", "undead", "viper", "vulture", "warthog", "water", "wolf", "wolverine"],
		nounsP: ["aliens", "alligators", "angels", "badgers", "bats", "bears", "blooddrops", "bloods", "blossoms", "boars", "bulldogs", "bulls", "butterflies", "chainsaws", "cobras", "coyotes", "crocs", "crosses", "crows", "demons", "devils", "dragonflies", "dragons", "dwarves", "eagles", "elephants", "enigmas", "fangs", "forsaken", "ghosts", "gorillas", "growlers", "hogs", "honey badgers", "horns", "jackals", "knives", "knuckles", "leopards", "lilies", "lions", "mambas", "mammoths", "monkeys", "moths", "needles", "owls", "phantoms", "pigmies", "pillagers", "pincers", "pistols", "plunderers", "rats", "ravenclaws", "ravens", "razors", "reapers", "rebels", "riders", "roses", "sabors", "seals", "serpents", "sharkfins", "sharks", "sharkteeth", "skeletons", "skulls", "slicers", "snakes", "spiders", "swords", "takers", "tears", "thorns", "tigers", "toads", "trolls", "undead", "vipers", "vultures", "warthogs", "wolverines", "wolves"],
		groupTypes: ["association", "band", "brotherhood", "clan", "company", "crew", "gang", "posse", "riders", "soldiers", "squad", "syndicate", "tribe"],
		singleDescriptors: ["abandoned", "anarchists", "anonymous", "chargers", "damnation", "day walkers", "dead eyes", "destroyers", "disciples", "doom bringers", "dreamers", "liberated", "liberation front", "empty eyes", "eternals", "faceless ones", "fallen angels", "forsaken", "grim reapers", "hopeless", "hopeless ones", "hunters", "idealists", "immortals", "invincibles", "invisibles", "kings", "life takers", "loners", "men of limbo", "men of the night", "women of limbo", "women of the night", "mob", "nameless", "night stalkers", "poison ivies", "purgatory", "ravagers", "risen demons", "salvation", "shadows", "silence", "silent death", "silent footsteps", "soul stealers", "soulless ones", "united front", "unseen", "untamed", "voiceless ones", "void", "whisperers", "wild ones", "wildlings"]
	}
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {  
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('book', 'Fantasy Generators', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			//this.activateView();
			new GeneratorModal(this.app, (result) => {
				const copyContent = async () => {
					try {
						await navigator.clipboard.writeText(result);
						new Notice(`${result} was copied to the clipboard.`);
					} catch (err) {
						console.error('Failed to copy: ', err);
						new Notice("Failed to copy, Check error in console.");
					}
				}
				
				copyContent();

			}, this).open();
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	convertStringToArray(string:string, arr:string[]): void {
		//const newString = string.replace(/\s/g, '');
		const array = string.split(',');
		array.forEach((el) => {
			arr.push(el);
		})
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	createSettingsBlock(containerEl: HTMLElement, textA: string, arr: any[], type: string): void {
		new Setting(containerEl)
		.setName("New Addition:")
		.addTextArea((text) => {
			text.onChange((value) => {
				textA = value;
			})
		})
		.addButton((btn) => {
			btn.setCta().setButtonText("Add")
				.onClick(async () => {
					this.convertStringToArray(textA, arr);
					this.display();
					await this.plugin.saveSettings();
				})
		})

		
		containerEl.createEl("p", { text: "Click 'remove' on a prefix you would like to removed" });

		const foldDiv = containerEl.createEl('details',{cls: "OFCGDetails"});
		foldDiv.createEl("summary", { text: type, cls: "OFCGSummary" });

		for (let index = 0; index < arr.length; index++) {
			new Setting(foldDiv)
				.setName(arr[index])
				.addButton((btn) => btn
					.setCta()
					.setButtonText("Remove")
					.onClick(async() => {
						arr.splice(index, 1);
						this.display();
						await this.plugin.saveSettings();
					})
			)
			
		}

		containerEl.createEl('hr');
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h1', { text: 'Fantasy Content Generator' });

		new Setting(containerEl)
			.setName('Reset To Defaults')
			.setDesc('Click if you would like to use the default settings again')
			.addButton((btn) => {
				btn.setCta()
					.setButtonText("Reset")
					.onClick(async() => {
						this.plugin.settings = DEFAULT_SETTINGS;
						this.display();
						await this.plugin.saveSettings();
				})
			})

		// CURRENCEY SETTINGS //
		
		containerEl.createEl("h2", { text: "Currency Settings" });

		new Setting(containerEl)
			.setName('Enable Currency for Loot Generation.')
			.setDesc('If you have Currency in your World or game consider Activating this')
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.enableCurrency);
				toggle.onChange(async (value) => {
					this.plugin.settings.enableCurrency = value;
					this.display();
					await this.plugin.saveSettings();
				})
			})
		
		if (this.plugin.settings.enableCurrency) {

			new Setting(containerEl).setName("Occurance Rate:").setDesc("Set How Frequently Loot generates currency as a percentage of 100")
				.addText((text) => { 
					text.setValue(String(this.plugin.settings.currencyFrequency));
					text.onChange(async(value) => {
						if (!(isNaN(+value))) {
							this.plugin.settings.currencyFrequency = Number(value);
							await this.plugin.saveSettings();
						}
						
					})
				})

			const ctext = {
				name: '',
				rarity: 'common'
			}
			new Setting(containerEl)
			.setName("Currency Name:")
			.addText((text) => {
				text.onChange((value) => {
					ctext.name = value;
				})
			}).addDropdown((drop) => {
				drop.addOption("common", "Common");
				drop.addOption("uncommon", "Uncommon");
				drop.addOption("rare", "Rare");
				drop.addOption("rarest", "Rarest");
				drop.onChange((value) => {
					ctext.rarity = value;
				})
			})
			.addButton((btn) => {
				btn.setCta().setButtonText("Add")
					.onClick(async () => {
						this.plugin.settings.currencyTypes.push(ctext);
						this.display();
						await this.plugin.saveSettings();
					})
			})

			containerEl.createEl("h4", { text: "Added Currency" });
			containerEl.createEl("p", { text: "Click remove on a currency you would like to removed" });

			const foldDiv = containerEl.createEl('details',{cls: "OFCGDetails"});
			foldDiv.createEl("summary", { text: "Currency", cls: "OFCGSummary" });

			for (let index = 0; index < this.plugin.settings.currencyTypes.length; index++) {
				new Setting(foldDiv)
					.setName(this.plugin.settings.currencyTypes[index].name)
					.addButton((btn) => btn
						.setCta()
						.setButtonText("Remove")
						.onClick(async() => {
							this.plugin.settings.currencyTypes.splice(index, 1);
							this.display();
							await this.plugin.saveSettings();
						})
				)
				
			}
				
		}

		// END CURRENCY SETTINGS //

		containerEl.createEl('hr');

		//SETTLEMENT SETTINGS//

		containerEl.createEl("h2", { text: "Settlement Settings" });

		let preText = "";
		let sufText = "";
		containerEl.createEl("h4", { text: "Prefixes being used" });
		new Setting(containerEl)
		.setName("New Prefix:")
		.addTextArea((text) => {
			text.onChange((value) => {
				preText = value;
			})
		})
		.addButton((btn) => {
			btn.setCta().setButtonText("Add")
				.onClick(async () => {
					this.convertStringToArray(preText, this.plugin.settings.citySettings.prefixArray);
					this.display();
					await this.plugin.saveSettings();
				})
		})

		
		containerEl.createEl("p", { text: "Click 'remove' on a prefix you would like to removed" });

		const foldDiv = containerEl.createEl('details',{cls: "OFCGDetails"});
		foldDiv.createEl("summary", { text: "Prefixes", cls: "OFCGSummary" });

		for (let index = 0; index < this.plugin.settings.citySettings.prefixArray.length; index++) {
			new Setting(foldDiv)
				.setName(this.plugin.settings.citySettings.prefixArray[index])
				.addButton((btn) => btn
					.setCta()
					.setButtonText("Remove")
					.onClick(async() => {
						this.plugin.settings.citySettings.prefixArray.splice(index, 1);
						this.display();
						await this.plugin.saveSettings();
					})
			)
			
		}

		containerEl.createEl('hr');

		containerEl.createEl("h4", { text: "Suffixes being used" });
		new Setting(containerEl)
		.setName("New Suffix:")
		.addTextArea((text) => {
			text.onChange((value) => {
				sufText = value;
			})
		})
		.addButton((btn) => {
			btn.setCta().setButtonText("Add")
				.onClick(async () => {
					this.convertStringToArray(sufText, this.plugin.settings.citySettings.suffixArray);
					this.display();
					await this.plugin.saveSettings();
				})
		})

		
		containerEl.createEl("p", { text: "Click 'remove' on a suffix you would like to removed" });

		const foldDiv2 = containerEl.createEl('details',{cls: "OFCGDetails"});
		foldDiv2.createEl("summary", { text: "Suffixes", cls: "OFCGSummary" });

		for (let index = 0; index < this.plugin.settings.citySettings.suffixArray.length; index++) {
			new Setting(foldDiv2)
				.setName(this.plugin.settings.citySettings.suffixArray[index])
				.addButton((btn) => btn
					.setCta()
					.setButtonText("Remove")
					.onClick(async() => {
						this.plugin.settings.citySettings.suffixArray.splice(index, 1);
						this.display();
						await this.plugin.saveSettings();
					})
			)
			
		}

		// END SETTLEMENT SETTINGS //

		containerEl.createEl('hr');
		
		// INN'S / TAVERN SETTINGS //
		containerEl.createEl("h2", { text: "Inn & Tavern Settings" });

		const innPreText = "";
		const innTypeText = "";
		const innNounText = "";
		const innDescText = "";
		const innRumorText = "";
		
		containerEl.createEl("h4", { text: "Prefixes being used" });
		this.createSettingsBlock(containerEl, innPreText, this.plugin.settings.innSettings.prefixes, "Prefixes");

		containerEl.createEl("h4", { text: "Type's being used" });
		this.createSettingsBlock(containerEl, innTypeText, this.plugin.settings.innSettings.innType, "Type's");

		containerEl.createEl("h4", { text: "Nouns being used" });
		this.createSettingsBlock(containerEl, innNounText, this.plugin.settings.innSettings.nouns, "Nouns");

		containerEl.createEl("h4", { text: "Description's being used" });
		this.createSettingsBlock(containerEl, innDescText, this.plugin.settings.innSettings.desc, "Description's");

		containerEl.createEl("h4", { text: "Rumors being used" });
		this.createSettingsBlock(containerEl, innRumorText, this.plugin.settings.innSettings.rumors, "Rumors");

		// END INN'S / TAVERN SETTINGS //

		// DRINK SETTINGS //

		containerEl.createEl("h2", { text: "Drink Generator Settings" });

		const drinkNounText = "";
		const drinkAdjText = "";

		containerEl.createEl("h4", { text: "Adjectives being used" });
		this.createSettingsBlock(containerEl, drinkAdjText, this.plugin.settings.drinkSettings.adj, "Adjectives");

		containerEl.createEl("h4", { text: "Nouns being used" });
		this.createSettingsBlock(containerEl, drinkNounText, this.plugin.settings.drinkSettings.nouns, "Nouns");

		// LOOT SETTINGS //

		containerEl.createEl("h2", { text: "Loot Generator Settings" });
		
		const lootNounText = "";
		const lootAdjText = "";

		containerEl.createEl("h4", { text: "Adjectives being used" });
		this.createSettingsBlock(containerEl, lootAdjText, this.plugin.settings.drinkSettings.adj, "Adjectives");

		containerEl.createEl("h4", { text: "Nouns being used" });
		this.createSettingsBlock(containerEl, lootNounText, this.plugin.settings.drinkSettings.nouns, "Nouns");

		// GROUP SETTINGS //

		containerEl.createEl("h2", { text: "Group Generator Settings" });

		const groupAdjectives =''
		const groupNouns = ''
		const groupNounsPlural = ''
		const groupTypes = ''
		const groupSingleDescriptors = ''

		containerEl.createEl("h4", { text: "Adjectives being used" });
		this.createSettingsBlock(containerEl, groupAdjectives, this.plugin.settings.groupSettings.adj, "Adjectives");

		containerEl.createEl("h4", { text: "Nouns being used" });
		this.createSettingsBlock(containerEl, groupNouns, this.plugin.settings.groupSettings.nouns, "Nouns");

		containerEl.createEl("h4", { text: "Plural Nouns being used" });
		this.createSettingsBlock(containerEl, groupNounsPlural, this.plugin.settings.groupSettings.nounsP, "Plural Nouns");

		containerEl.createEl("h4", { text: "Group Types being used" });
		this.createSettingsBlock(containerEl, groupTypes, this.plugin.settings.groupSettings.groupTypes, "Types");

		containerEl.createEl("h4", { text: "Single Descriptors being used" });
		this.createSettingsBlock(containerEl, groupSingleDescriptors, this.plugin.settings.groupSettings.singleDescriptors, "Descriptors");
	
	}
}
