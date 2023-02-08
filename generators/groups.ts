import { groupGenSettings } from "main";

export function generatorGroups(settings:groupGenSettings) {
	const adjectives = settings.adj;
	const nouns = settings.nouns;
	const nounsPlural = settings.nounsP;
	const groupTypes = settings.groupTypes;
	const singleDescriptors = settings.singleDescriptors;


	const i = Math.floor(Math.random() * 10); {
        let names;
        if (i < 4) {
			const rnd0 = Math.floor(Math.random() * adjectives.length);
			const rnd1 = Math.floor(Math.random() * nouns.length);
			const rnd2 = Math.floor(Math.random() * groupTypes.length);
			names = "The " + adjectives[rnd0] + " " + nouns[rnd1] + " " + groupTypes[rnd2];
		} else if (i < 8) {
			const rnd0 = Math.floor(Math.random() * adjectives.length);
			const rnd1 = Math.floor(Math.random() * nounsPlural.length);
			names = "The " + adjectives[rnd0] + " " + nounsPlural[rnd1];
		} else {
			const rnd0 = Math.floor(Math.random() * singleDescriptors.length);
			names = "The " + singleDescriptors[rnd0];
		}
		return names;
	}

}