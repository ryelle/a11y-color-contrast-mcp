import { describe, expect, test } from "@jest/globals";
import isPassingContrast from "./is-passing-contrast";

describe("isPassingContrast", () => {
	test.each([
		{ expected: true, colorA: "#00f", colorB: "#fff", level: "AAA", size: "large" }, //8.59
		{ expected: true, colorA: "#00f", colorB: "#fff", level: "AAA", size: "small" }, //8.59
		{ expected: true, colorA: "#00f", colorB: "#fff", level: "AA", size: "large" }, //8.59
		{ expected: true, colorA: "#00f", colorB: "#fff", level: "AA", size: "small" }, //8.59

		{ expected: true, colorA: "#ff228d", colorB: "#000", level: "AAA", size: "large" }, //5.87
		{ expected: false, colorA: "#ff228d", colorB: "#000", level: "AAA", size: "small" }, //5.87
		{ expected: true, colorA: "#ff228d", colorB: "#000", level: "AA", size: "large" }, //5.87
		{ expected: true, colorA: "#ff228d", colorB: "#000", level: "AA", size: "small" }, //5.87

		{ expected: false, colorA: "#007070", colorB: "#000", level: "AAA", size: "large" }, //3.55
		{ expected: false, colorA: "#007070", colorB: "#000", level: "AAA", size: "small" }, //3.55
		{ expected: true, colorA: "#007070", colorB: "#000", level: "AA", size: "large" }, //3.55
		{ expected: false, colorA: "#007070", colorB: "#000", level: "AA", size: "small" }, //3.55

		{ expected: false, colorA: "#521B92", colorB: "#000", level: "AAA", size: "large" }, //1.93
		{ expected: false, colorA: "#521B92", colorB: "#000", level: "AAA", size: "small" }, //1.93
		{ expected: false, colorA: "#521B92", colorB: "#000", level: "AA", size: "large" }, //1.93
		{ expected: false, colorA: "#521B92", colorB: "#000", level: "AA", size: "small" }, //1.93
	])(
		"It should return $expected for if the contrast between $colorA and $colorB for $size text passes WCAG $level.",
		({ colorA, colorB, level, size, expected }) => {
			expect(isPassingContrast(colorA, colorB, level, size)).toBe(expected);
		},
	);

	test("It should return false if either/both colors are invalid.", () => {
		const result = isPassingContrast("#f00", "fakecolor");
		expect(result).toBe(false);
	});
});
