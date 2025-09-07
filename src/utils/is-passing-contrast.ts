import getContrastRatio from "./get-contrast-ratio.ts";

export default function (
	colorA: string,
	colorB: string,
	level: string = "AA",
	size: string = "small",
): boolean {
	const contrast = getContrastRatio(colorA, colorB);
	if (contrast < 0) {
		return false;
	}

	let pass = false;
	if ("large" === size) {
		pass = level === "AAA" ? contrast >= 4.5 : contrast >= 3;
	} else {
		pass = level === "AAA" ? contrast >= 7 : contrast >= 4.5;
	}

	return pass;
}
