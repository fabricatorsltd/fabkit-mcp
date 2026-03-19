/**
 * Fabkit MCP Server — Cloudflare Worker
 *
 * Implements the Model Context Protocol (MCP) over HTTP (Streamable HTTP transport).
 * Exposes Fabkit component docs, theming, icons and patterns as MCP tools.
 */

import { KNOWLEDGE_BASE } from './knowledge';
import { handleMCP } from './mcp';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return cors(new Response(null, { status: 204 }));
    }

    // Health check
    if (url.pathname === '/health') {
      return cors(json({ status: 'ok', name: 'fabkit-mcp', version: '1.0.0' }));
    }

    // MCP endpoint (Streamable HTTP transport)
    if (url.pathname === '/mcp' || url.pathname === '/') {
      if (request.method !== 'POST') {
        return cors(json({ error: 'Method not allowed' }, 405));
      }
      try {
        const body = await request.json() as MCPRequest;
        const response = await handleMCP(body, KNOWLEDGE_BASE);
        return cors(json(response));
      } catch (e: any) {
        return cors(json({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null }, 400));
      }
    }

    return cors(json({ error: 'Not found' }, 404));
  }
};

// ── helpers ──────────────────────────────────────────────────────────────────

export type MCPRequest = { jsonrpc: string; method: string; params?: any; id?: any };

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function cors(res: Response): Response {
  const h = new Headers(res.headers);
  h.set('Access-Control-Allow-Origin', '*');
  h.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Mcp-Session-Id');
  return new Response(res.body, { status: res.status, headers: h });
}
