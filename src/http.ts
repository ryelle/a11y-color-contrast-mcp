import express, { Request, Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import getServer from "./server.ts";

const app = express();
app.use(express.json());

app.post("/mcp", async (req: Request, res: Response) => {
	try {
		const server: McpServer = getServer();
		const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
			sessionIdGenerator: undefined,
		});

		console.log("Request initiated");
		res.on("close", () => {
			console.log("Request closed");
			transport.close();
			server.close();
		});

		await server.connect(transport);
		await transport.handleRequest(req, res, req.body);
	} catch (error) {
		console.error("Error handling MCP request:", error);
		if (!res.headersSent) {
			res.status(500).json({
				jsonrpc: "2.0",
				error: {
					code: -32603,
					message: "Internal server error",
				},
				id: null,
			});
		}
	}
});

// Health check endpoint (optional)
app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Stateless MCP server (SDK) listening on port ${PORT}`);
});
