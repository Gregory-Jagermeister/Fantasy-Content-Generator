interface Inn {
    name: string;
    description: string;
    rumors: string[];
  }
  
  const prefixes = ["The Rusty", "The Cosy", "The Grand", "The Quiet", "The Friendly", "Bashur's", "Harmony", "Harmonic", "Bald Faced", "Black", "Grey","Silver", "White","Blue", "Purple","Green", "The Ugly", "The Pretty", "Ye Ol' Fighting", "The Drunk", "One", "Two", "Three", "Four","Five", "Busta", "The Terrified"];
    const innType = ["Inn", "Lodge", "Tavern", "Rest", "Stop"];
  const nouns = ["Phoenix", "Centaur", "Dragon","Selkie", "Griffin", "Bandersnatch", "Mermaid", "Werewolf", "Dryad","Golem", "Bugbear", "Goblin", "Tiger", "Cat", "Warrior", "Wizard", "Drop Bear", "Bear", "Lagoon", "Bunyip", "Rat King", "King's", "Automaton", "Beach", "Reaper", "Grim", "Ogre", "Skeleton", "Ghost"]
  const descriptions = [
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
];
  
const rumor = [
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
  
export function generateInn(): Inn {
    const prefixIndex = Math.floor(Math.random() * prefixes.length);
    const innTypeIndex = Math.floor(Math.random() * innType.length);
    const nounIndex = Math.floor(Math.random() * nouns.length);
    const descriptionIndex = Math.floor(Math.random() * descriptions.length);
    const rumorsIndexes = generateUniqueNumbers(0, rumor.length);
  
    return {
      name: prefixes[prefixIndex] + " " + nouns[nounIndex] + " " + innType[innTypeIndex],
      description: descriptions[descriptionIndex],
      rumors:[rumor[rumorsIndexes[0]], rumor[rumorsIndexes[1]], rumor[rumorsIndexes[2]]],
    };
}
  
function generateUniqueNumbers(min: number, max:number) {
    const numbers: number[] = [];
    while (numbers.length < 3) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!numbers.includes(randomNumber)) {
        numbers.push(randomNumber);
      }
    }
    return numbers;
  }