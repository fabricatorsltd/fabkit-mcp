# Fabkit MCP Server

A **Model Context Protocol** server for the [Fabkit](https://github.com/fabricatorsltd/fabkit) Svelte 5 UI library, deployed as a **Cloudflare Worker**.

Agents (Claude, Cursor, Copilot…) can call this server to get accurate, up-to-date Fabkit documentation without hallucinating component names, props, or icon names.

---

## Tools exposed

| Tool                | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `list_components`   | All components grouped by category, with optional filter    |
| `get_component`     | Full docs for a single component (props, examples, notes)   |
| `search_components` | Full-text search across all component docs                  |
| `get_theming`       | Complete theming API: initTheme, CSS variables, dark mode   |
| `search_icons`      | Search 1500+ Phosphor icons by keyword → exact Ph\* names   |
| `get_pattern`       | Ready-to-use Svelte code patterns (app-shell, dashboard, …) |
| `list_patterns`     | List all available patterns                                 |

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
# → http://localhost:5173
```

### 3. Deploy to Cloudflare Workers

```bash
npm run deploy
# → https://fabkit-mcp.fabricators.dev
```

---

## Connecting to Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "fabkit": {
      "url": "https://fabkit-mcp.fabricators.dev/mcp",
      "transport": "http"
    }
  }
}
```

## Connecting to Cursor

In `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "fabkit": {
      "url": "https://fabkit-mcp.fabricators.dev/mcp"
    }
  }
}
```

---

## MCP Protocol

The server implements **MCP 2024-11-05** over **Streamable HTTP** (POST `/mcp`).

All requests are JSON-RPC 2.0:

```bash
# Initialize
curl -X POST https://fabkit-mcp.fabricators.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{}},"id":1}'

# List tools
curl -X POST https://fabkit-mcp.fabricators.dev/mcp \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":2}'

# Call a tool
curl -X POST https://fabkit-mcp.fabricators.dev/mcp \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get_component","arguments":{"name":"Button"}},"id":3}'
```

---

## Extending the knowledge base

Edit `src/knowledge.ts` — add entries to the `COMPONENTS` array or extend `ALL_ICONS`.  
Edit `src/tools.ts` — add new entries to the `PATTERNS` object.  
Then redeploy: `npm run deploy`.

---

## Architecture

```
src/
  index.ts      ← Cloudflare Worker entry, routing, CORS
  mcp.ts        ← JSON-RPC 2.0 dispatch, tool registry
  knowledge.ts  ← All Fabkit docs embedded as typed data
  tools.ts      ← Tool implementations (pure functions)
```

Everything is **stateless** — no KV, no R2, no external APIs.  
The Worker cold-starts in < 5ms because all knowledge is bundled inline.
