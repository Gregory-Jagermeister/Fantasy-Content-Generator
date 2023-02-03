export function generatorReligions() {
	const names1 = ["A", "Ar", "Al", "B", "Br", "Bl", "C", "Cr", "Cl", "D", "Dl", "Dr", "E", "Er", "El", "F", "Fl", "G", "Gl", "Gr", "H", "I", "Il", "J", "K", "Kl", "Kr", "L", "M", "N", "O", "Or", "Ol", "P", "Pl", "Ph", "Pr", "R", "S", "Sl", "Str", "T", "Tr", "U", "Ur", "Ul", "V", "Vr", "W", "Wr", "X", "Z"];
	const names2 = ["a", "e", "i", "o", "u", "y"];
	const names3 = ["b", "br", "bl", "c", "cr", "cl", "d", "dl", "dr", "f", "fl", "g", "gl", "gr", "h", "j", "k", "kl", "kr", "l", "m", "n", "p", "pl", "ph", "pr", "r", "s", "sl", "str", "t", "tr", "v", "vr", "w", "wr", "x", "z", "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "z", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
	const names4 = ["a", "e", "i", "o", "u", "", "", "", "", ""];
	const names5 = ["cism", "do", "fis", "gar", "hin", "khi", "kyo", "lly", "ndo", "ng", "ni", "nis", "nity", "ns", "phy", "qir", "rity", "sha", "shi", "sm", "sni", "sy", "thos", "thy", "tism", "to", "ty", "was", "zen", "zor"];
	const names6 = ["Healers", "Wanders", "Children", "Angels", "Chosen Ones", "Oracles", "Paragons", "Band", "Church", "Communion", "Congregation", "Creed", "Cult", "Faith", "Followers", "Gathering", "Order", "Sect"];
	const names7 = ["of Ancestral Spirits", "of the Holy Light", "of Answers", "of Atonement", "of Awe", "of Balance", "of Brothers", "of Clarity", "of Cooperation", "of Darkness", "of Dawn", "of Defiance", "of Devotion", "of Dragons", "of Dreams", "of Dusk", "of Eternal Doom", "of Eternal Rain", "of Eventuality", "of Fire", "of Fortune", "of Gold", "of Harmony", "of Honor", "of Hope", "of Humanity", "of Illumination", "of Insight", "of Iron", "of Kinship", "of Light", "of Luck", "of Men", "of Nature", "of New Hope", "of Order", "of Origins", "of Our Origins", "of Parellels", "of Perfection", "of Piety", "of Purity", "of Radiance", "of Redemption", "of Reparations", "of Revelations", "of Sacrifice", "of Secrets", "of Shadows", "of Silence", "of Silver", "of Steel", "of Symmetry", "of Sympathy", "of Tranquility", "of Truth", "of Twilight", "of Unity", "of Valor", "of Virtue", "of Visions", "of Water", "of Whispers", "of Women", "of World Balance", "of our New Lord", "of the Accord", "of the All Seeing Eye", "of the Alpha", "of the Ancestors", "of the Apocalypse", "of the Attuned", "of the Aurora", "of the Black Bear", "of the Black Hand", "of the Black Sign", "of the Burning Crown", "of the Celestials", "of the Chosen", "of the Clean", "of the Comet", "of the Conqueror", "of the Crown", "of the Damned", "of the Divine", "of the Dragon", "of the Eight Divines", "of the Eight Gods", "of the Elements", "of the Emperor", "of the End", "of the Enigma", "of the Enlightened", "of the Eye", "of the False Prophet", "of the Five Divines", "of the Five Gods", "of the Flaming Sword", "of the Four Divines", "of the Four Gods", "of the Free", "of the Glorious One", "of the Illuminated", "of the Innocent", "of the King", "of the Light", "of the Martyr", "of the Messiah", "of the Mind", "of the Moon", "of the Mutants", "of the New Order", "of the Night", "of the Nine Divines", "of the Nine Gods", "of the Obscure", "of the Omega", "of the One", "of the One God", "of the Oracle", "of the Paragon", "of the Paragons", "of the Prodigy", "of the Prophecy", "of the Prophet", "of the Rapture", "of the Red Dog", "of the Sacrifice", "of the Sacrificed", "of the Serpent", "of the Seven Divines", "of the Seven Gods", "of the Sinless", "of the Six Divines", "of the Six Gods", "of the Son", "of the Soothsayer", "of the Spirits", "of the Stars", "of the Studied", "of the Sun", "of the Three Divines", "of the Three Gods", "of the Titans", "of the True Emperor", "of the True King", "of the True Prophet", "of the Two Divines", "of the Two Gods", "of the United", "of the Unsullied", "of the Virgin", "of the White Sign", "of the White Wolf", "of the Wilds", "of the World"];


	const i = Math.floor(Math.random() * 10);
  let names;
  
  const generateComponent = () => {
    const rnd0 = Math.floor(Math.random() * names1.length);
    const rnd1 = Math.floor(Math.random() * names2.length);
      const rnd2 = Math.floor(Math.random() * names3.length);
      let rnd3 = Math.floor(Math.random() * names4.length);
    
    if (rnd2 < 57) {
      while (rnd3 > 4) {
        rnd3 = Math.floor(Math.random() * names4.length);
      }
    }
    
    const rnd4 = Math.floor(Math.random() * names5.length);
    return names1[rnd0] + names2[rnd1] + names3[rnd2] + names4[rnd3] + names5[rnd4];
  };
  
  if (i < 3) {
    names = generateComponent();
  } else if (i < 7) {
    const rnd0 = Math.floor(Math.random() * names6.length);
    const rnd1 = Math.floor(Math.random() * names7.length);
    names = names6[rnd0] + " " + names7[rnd1];
  } else {
    const rnd5 = Math.floor(Math.random() * names6.length);
    names = names6[rnd5] + " of " + generateComponent();
  }
  
  return names;

}