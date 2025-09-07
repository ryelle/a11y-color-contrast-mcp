import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import getContrastRatio from "./utils/get-contrast-ratio.js";
import isPassingContrast from "./utils/is-passing-contrast.js";

export default function getServer() {
	const server = new McpServer({
		name: "accessible-contrast",
		version: "1.0.0",
	});

	server.registerTool(
		"get-color-contrast",
		{
			title: "Get Color Contrast",
			description: "Get the WCAG constrast value between two colors.",
			inputSchema: {
				colorA: z.string().describe("First color (hex, rgb, hsl, or named color)"),
				colorB: z.string().describe("Second color (hex, rgb, hsl, or named color)"),
			},
		},
		async ({ colorA, colorB }) => {
			const contrast = getContrastRatio(colorA, colorB);

			if (!contrast) {
				return {
					content: [
						{
							type: "text",
							text: "Failed to process color data",
						},
					],
				};
			}

			return {
				content: [
					{
						type: "text",
						text: contrast.toFixed(2),
					},
				],
			};
		},
	);

	server.registerTool(
		"are-colors-accessible",
		{
			title: "Are Colors Accessible",
			description: "Test two colors for WCAG accessible contrast",
			inputSchema: {
				colorA: z.string().describe("First color (hex, rgb, hsl, or named color)"),
				colorB: z.string().describe("Second color (hex, rgb, hsl, or named color)"),
				level: z
					.enum(["AA", "AAA"])
					.optional()
					.describe("WCAG level to test against, AA or AAA")
					.default("AA"),
				size: z
					.enum(["small", "large"])
					.optional()
					.describe(
						"Font size of text, larger font has a lower threshold. Can be small or large.",
					)
					.default("small"),
			},
		},
		async ({ colorA, colorB, level, size }) => {
			const passing = isPassingContrast(colorA, colorB, level, size);

			return {
				content: [
					{
						type: "text",
						text: passing
							? `Colors: ${colorA} and ${colorB} have sufficient contrast`
							: `Colors: ${colorA} and ${colorB} do not have sufficient contrast`,
					},
				],
			};
		},
	);

	server.registerTool(
		"use-light-or-dark",
		{
			title: "Use Light or Dark",
			description:
				"Detect whether to pair a light or dark color against a given color for best contrast.",
			inputSchema: {
				color: z.string().describe("Color (hex, rgb, hsl, or named color)"),
				level: z
					.enum(["AA", "AAA"])
					.optional()
					.describe("WCAG level to test against, AA or AAA")
					.default("AA"),
				size: z
					.enum(["small", "large"])
					.optional()
					.describe(
						"Font size of text, larger font has a lower threshold. Can be small or large.",
					)
					.default("small"),
			},
		},
		async ({ color, level, size }) => {
			const lightPassing = isPassingContrast(color, "white", level, size);
			const lightRatio = getContrastRatio(color, "white");
			const darkPassing = isPassingContrast(color, "black", level, size);
			const darkRatio = getContrastRatio(color, "black");

			let message;
			if (lightPassing && darkPassing) {
				if (lightRatio > darkRatio) {
					message = `Color ${color} can be used with either light or dark, but the contrast is higher with light, ${lightRatio}.`;
				} else {
					message = `Color ${color} can be used with either light or dark, but the contrast is higher with dark, ${darkRatio}.`;
				}
			} else if (lightPassing && !darkPassing) {
				message = `Color ${color} should be used with a light color for contrast ${lightRatio}.`;
			} else if (darkPassing && !lightPassing) {
				message = `Color ${color} should be used with a dark color for contrast ${darkRatio}.`;
			} else {
				message = `Color ${color} should not be used, it does not have contrast with either light or dark.`;
			}

			return {
				content: [
					{
						type: "text",
						text: message,
					},
				],
			};
		},
	);

	return server;
}
