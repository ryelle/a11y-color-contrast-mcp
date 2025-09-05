import { describe, expect, test } from "@jest/globals";
import getContrastRatio from "./get-contrast-ratio";

describe("getContrastRatio", () => {
	test.each([
		{ expected: 8.59, colorA: "#00f", colorB: "#fff" },
		{ expected: 5.87, colorA: "#ff228d", colorB: "#000" },
		{ expected: 3.55, colorA: "#007070", colorB: "#000" },
		{ expected: 1.93, colorA: "#521B92", colorB: "#000" },
	])(
		"It should return the contrast ratio $expected between $colorA and $colorB",
		({ colorA, colorB, expected }) => {
			const contrast = getContrastRatio(colorA, colorB);
			const result = Math.round(contrast * 100) / 100;
			expect(result).toBe(expected);
		},
	);

	test("It should return -1 if either/both colors are invalid.", () => {
		const result = getContrastRatio("#f00", "fakecolor");
		expect(result).toBe(-1);
	});
});
