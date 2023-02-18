import { innGeneratorSettings } from "settings/Datatypes";
interface Inn {
    name: string;
    description: string;
    rumors: string[];
  }
    
export function generateInn(settings: innGeneratorSettings): Inn {
  
    const prefixes = settings.prefixes;
    const innType = settings.innType
    const nouns = settings.nouns
    const descriptions = settings.desc;
    const rumor = settings.rumors;

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