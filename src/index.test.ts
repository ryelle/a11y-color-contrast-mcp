import { describe, expect, test } from "@jest/globals";
import { spawn } from "node:child_process";

// Helper function to communicate with MCP server
async function sendMCPRequest(request: any): Promise<any> {
	return new Promise((resolve, reject) => {
		const child = spawn("node", ["./build/index.js"], {
			stdio: ["pipe", "pipe", "pipe"],
		});

		let stdout = "";
		let stderr = "";

		child.stdout.on("data", (data) => {
			stdout += data.toString();
		});

		child.stderr.on("data", (data) => {
			stderr += data.toString();
		});

		child.on("close", (code) => {
			try {
				// Parse the JSON response from stdout
				const lines = stdout.trim().split("\n");
				const jsonResponse = lines.find((line) => {
					try {
						const parsed = JSON.parse(line);
						return parsed.jsonrpc && parsed.id === request.id;
					} catch {
						return false;
					}
				});

				if (jsonResponse) {
					resolve({
						response: JSON.parse(jsonResponse),
						stderr: stderr,
						code: code,
					});
				} else {
					reject(
						new Error(
							`No valid JSON response found. stdout: ${stdout}, stderr: ${stderr}`,
						),
					);
				}
			} catch (error) {
				reject(
					new Error(
						`Failed to parse response: ${error}. stdout: ${stdout}, stderr: ${stderr}`,
					),
				);
			}
		});

		child.on("error", (error) => {
			reject(error);
		});

		// Send the request
		child.stdin.write(JSON.stringify(request) + "\n");
		child.stdin.end();
	});
}

describe("MCP stdio Server", () => {
	test("It should initialize and respond to tools/list", async () => {
		const request = {
			jsonrpc: "2.0",
			method: "tools/list",
			params: {},
			id: 1,
		};

		const result = await sendMCPRequest(request);

		expect(result.response).toHaveProperty("jsonrpc", "2.0");
		expect(result.response).toHaveProperty("id", 1);
		expect(result.response).toHaveProperty("result");
		expect(result.response.result).toHaveProperty("tools");
		expect(Array.isArray(result.response.result.tools)).toBe(true);

		// Check that our tools are present
		const toolNames = result.response.result.tools.map((tool: any) => tool.name);
		expect(toolNames).toContain("get-color-contrast");
		expect(toolNames).toContain("are-colors-accessible");
		expect(toolNames).toContain("use-light-or-dark");
	});

	test.each([
		{ expected: "8.59", colorA: "#00f", colorB: "#fff" },
		{ expected: "21.00", colorA: "#000", colorB: "#fff" },
		{ expected: "1.00", colorA: "#fff", colorB: "#fff" },
	])(
		"It should return the contrast ratio $expected between $colorA and $colorB",
		async ({ colorA, colorB, expected }) => {
			const request = {
				jsonrpc: "2.0",
				method: "tools/call",
				params: {
					name: "get-color-contrast",
					arguments: {
						colorA,
						colorB,
					},
				},
				id: 2,
			};

			const result = await sendMCPRequest(request);

			expect(result.response).toHaveProperty("jsonrpc", "2.0");
			expect(result.response).toHaveProperty("id", 2);
			expect(result.response).toHaveProperty("result");
			expect(result.response.result).toHaveProperty("content");
			expect(Array.isArray(result.response.result.content)).toBe(true);
			expect(result.response.result.content[0]).toHaveProperty("type", "text");
			expect(result.response.result.content[0].text).toBe(expected);
		},
	);

	test.each([
		{
			expected: "Pass: ",
			colorA: "#007070",
			colorB: "#000",
			level: "AA",
			size: "large",
		},
		{
			expected: "Fail: ",
			colorA: "#007070",
			colorB: "#000",
			level: "AA",
			size: "small",
		},
	])("It should test color accessibility", async ({ colorA, colorB, level, size, expected }) => {
		const request = {
			jsonrpc: "2.0",
			method: "tools/call",
			params: {
				name: "are-colors-accessible",
				arguments: {
					colorA,
					colorB,
					level,
					size,
				},
			},
			id: 3,
		};

		const result = await sendMCPRequest(request);

		expect(result.response).toHaveProperty("jsonrpc", "2.0");
		expect(result.response).toHaveProperty("id", 3);
		expect(result.response).toHaveProperty("result");
		expect(result.response.result.content[0].text).toContain(expected);
	});

	test.each([
		{
			expected: "higher with light",
			color: "#007070",
			level: "AA",
			size: "large",
		},
	])("It should test color accessibility", async ({ color, level, size, expected }) => {
		const request = {
			jsonrpc: "2.0",
			method: "tools/call",
			params: {
				name: "use-light-or-dark",
				arguments: {
					color,
					level,
					size,
				},
			},
			id: 4,
		};

		const result = await sendMCPRequest(request);

		expect(result.response).toHaveProperty("jsonrpc", "2.0");
		expect(result.response).toHaveProperty("id", 4);
		expect(result.response).toHaveProperty("result");
		expect(result.response.result.content[0].text).toContain(expected);
	});
});
