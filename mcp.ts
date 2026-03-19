import type { MCPRequest } from './index';
import type { KnowledgeBase } from './knowledge';
import {
  toolListComponents,
  toolGetComponent,
  toolSearchComponents,
  toolGetTheming,
  toolSearchIcons,
  toolGetPattern,
  toolListPatterns,
} from './tools';

// ── Tool definitions (returned to the agent on tools/list) ───────────────────

export const TOOL_DEFINITIONS = [
  {
    name: 'list_components',
    description:
      'Returns the full list of Fabkit components grouped by category (layout, navigation, form, content, etc.). Use this first to discover what is available.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description:
            'Optional filter: layout | navigation | form | content | data | feedback | misc',
        },
      },
    },
  },
  {
    name: 'get_component',
    description:
      'Returns complete documentation for a single Fabkit component: description, all props with types and defaults, usage examples in Svelte 5 syntax, and important notes.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Exact component name, e.g. "Button", "HBox", "SideLayout", "DataTable"',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'search_components',
    description:
      'Full-text search across all component docs. Use when you know what you want to do (e.g. "resizable split", "tabs", "dropdown") but not the exact component name.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Natural language search query' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_theming',
    description:
      'Returns the full Fabkit theming API: initTheme() signature, all CSS variables (background, text, border, shadow, action, dimensions), dark mode setup, and fine-tuning with Skeleton props.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'search_icons',
    description:
      'Search Fabkit\'s 1514 Phosphor icons by keyword. Returns matching icon export names (Ph prefix) ready to import from "fabkit". Always use this before writing an icon name.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keyword to match, e.g. "arrow", "home", "trash", "settings"',
        },
        limit: {
          type: 'number',
          description: 'Max results to return (default 20)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_pattern',
    description:
      'Returns a complete, ready-to-use Svelte code pattern for common UI layouts built with Fabkit components. Use this to scaffold pages or feature areas quickly.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description:
            'Pattern name: "app-shell" | "sidebar-layout" | "settings-page" | "data-table-page" | "login-form" | "dashboard" | "dark-mode-toggle"',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'list_patterns',
    description: 'Lists all available ready-to-use Fabkit patterns with a short description of each.',
    inputSchema: { type: 'object', properties: {} },
  },
];

// ── MCP protocol handler ─────────────────────────────────────────────────────

export async function handleMCP(req: MCPRequest, kb: KnowledgeBase): Promise<unknown> {
  const { method, params, id } = req;

  const ok = (result: unknown) => ({ jsonrpc: '2.0', result, id });
  const err = (code: number, message: string) => ({ jsonrpc: '2.0', error: { code, message }, id });

  switch (method) {
    // ── Lifecycle ──────────────────────────────────────────────────────────
    case 'initialize':
      return ok({
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'fabkit-mcp', version: '1.0.0' },
        instructions:
          'This MCP server provides complete documentation for the Fabkit Svelte 5 UI library. ' +
          'Always call list_components or search_components before writing any component code. ' +
          'Always call search_icons before using any Ph* icon name. ' +
          'Always call get_theming before calling initTheme().',
      });

    case 'notifications/initialized':
      return ok({});

    // ── Tools ──────────────────────────────────────────────────────────────
    case 'tools/list':
      return ok({ tools: TOOL_DEFINITIONS });

    case 'tools/call': {
      const { name, arguments: args = {} } = params ?? {};
      try {
        let content: string;
        switch (name) {
          case 'list_components':    content = toolListComponents(kb, args); break;
          case 'get_component':      content = toolGetComponent(kb, args); break;
          case 'search_components':  content = toolSearchComponents(kb, args); break;
          case 'get_theming':        content = toolGetTheming(kb); break;
          case 'search_icons':       content = toolSearchIcons(kb, args); break;
          case 'get_pattern':        content = toolGetPattern(args); break;
          case 'list_patterns':      content = toolListPatterns(); break;
          default:
            return err(-32601, `Unknown tool: ${name}`);
        }
        return ok({ content: [{ type: 'text', text: content }] });
      } catch (e: any) {
        return err(-32603, e.message ?? 'Internal error');
      }
    }

    // ── Resources / Prompts (stubs) ────────────────────────────────────────
    case 'resources/list':
      return ok({ resources: [] });
    case 'prompts/list':
      return ok({ prompts: [] });

    default:
      return err(-32601, `Method not found: ${method}`);
  }
}
