# Accessible Color Contrast MCP

A simple MCP (Model Context Protocol) server for checking accessible color pairings. This uses the WCAG (Web Content Accessibility Guidelines) contrast algorithm to calculate real contrast ratios, which can inform your AI when working with colors.

[More about WCAG Contrast requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

## Setup

Add this to your AI platform:

```json
{
  "mcpServers": {
    "accessibility": {
      "command": "npx",
      "args": ["-y", "a11y-color-contrast-mcp"]
    }
  }
}
```

Note, if you use `nvm`, you might need to use the path to the correct `node` and `npx` versions (22), for example:

```json
"accessibility": {
  "command": "/path-user-home/.nvm/versions/node/v22.9.0/bin/node",
  "args": ["/path-user-home/.nvm/versions/node/v22.9.0/bin/npx", "-y", "a11y-color-contrast-mcp"]
}
```

### Example Usage

- What is the contrast between #481bef and #c3eecb?
- If I have a background color #22d3ee, should I use light or dark text on it?
- What color text should I use for a background #6a4ba7 if I need to meet WCAG AAA level support?
- Can you suggest 3 color pairs that are accessible? The colors should not be black or white, and should be reminiscent of fall.

## Available Tools

### Get Color Contrast

Get the WCAG constrast value between two colors.

**Parameters**

- `colorA` (required): First color (hex, rgb, hsl, or named color).
- `colorB` (required): Second color (hex, rgb, hsl, or named color).

### Are Colors Accessible

Test two colors for WCAG accessible contrast.

**Parameters**

- `colorA`: First color (hex, rgb, hsl, or named color).
- `colorB`: Second color (hex, rgb, hsl, or named color).
- `level`: WCAG level to test against, AA or AAA. Default "AA".
- `size`: Font size of text, larger font has a lower threshold. Can be small or large. Default "small".

### Use Light or Dark

Detect whether to pair a light or dark color against a given color for best contrast.

**Parameters**

- `color`: Color (hex, rgb, hsl, or named color).
- `level`: WCAG level to test against, AA or AAA. Default "AA".
- `size`: Font size of text, larger font has a lower threshold. Can be small or large. Default "small".

## Development

This package contains a stdio and an http server, though the stdio is the recommended method for interacting with it.

### Requirements

- Node v22

Install the dependencies with `npm install`. The MCP server itself lives in `src/server.ts`, with the stdio server in `index.ts` and the http server in `http.ts`.

### Scripts

- `npm run build`: Builds the src files into build.
- `npm run stdio`: Builds the src files, then starts the stdio server.
- `npm run serve`: Builds the src files, then starts the http server.
- `npm run test`: Run the Jest tests.

### http server

This is a work in progress while I figure out if it's worth setting up as a remote server. For now, it's developer-only. Once running (see above), you can access this on port 3000.

Here's an example interaction you can test with a tool like [Insomnia](https://insomnia.rest/).

POST http://localhost:3000/mcp

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get-color-contrast",
    "arguments": {
      "colorA": "#ff0000",
      "colorB": "#ffffff"
    }
  },
  "id": 1
}
```

```
HTTP/1.1 200 OK
Content-Type: text/event-stream

event: message
data: {"result":{"content":[{"type":"text","text":"4.00"}]},"jsonrpc":"2.0","id":1}
```
