import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import getServer from "./server.js";

const server = getServer();

// Start the stdio server
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Accessibility MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
