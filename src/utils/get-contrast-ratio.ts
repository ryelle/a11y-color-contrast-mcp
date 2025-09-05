import { TinyColor, readability } from "@ctrl/tinycolor";

export default function (colorA: string, colorB: string): number {
	const tinycolorA = new TinyColor(colorA);
	const tinycolorB = new TinyColor(colorB);
	if (!tinycolorA.isValid || !tinycolorB.isValid) {
		return -1;
	}

	return readability(colorA, colorB);
}
