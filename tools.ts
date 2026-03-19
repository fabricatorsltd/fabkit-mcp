import type { KnowledgeBase, ComponentDoc } from './knowledge';

// ── list_components ───────────────────────────────────────────────────────────

export function toolListComponents(kb: KnowledgeBase, args: any): string {
  const { category } = args;
  const groups: Record<string, ComponentDoc[]> = {};

  for (const c of kb.components) {
    if (category && c.category !== category) continue;
    (groups[c.category] ??= []).push(c);
  }

  if (Object.keys(groups).length === 0) {
    return `No components found${category ? ` for category "${category}"` : ''}.`;
  }

  const lines: string[] = ['# Fabkit Components\n'];
  for (const [cat, comps] of Object.entries(groups)) {
    lines.push(`## ${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
    for (const c of comps) {
      lines.push(`- **${c.name}** — ${c.description.split('.')[0]}.`);
    }
    lines.push('');
  }
  lines.push('\nCall `get_component` with a component name for full documentation.');
  return lines.join('\n');
}

// ── get_component ─────────────────────────────────────────────────────────────

export function toolGetComponent(kb: KnowledgeBase, args: any): string {
  const { name } = args;
  if (!name) return 'Error: `name` is required.';

  const comp = kb.components.find(
    c => c.name.toLowerCase() === name.toLowerCase()
  );
  if (!comp) {
    const suggestions = kb.components
      .filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
      .map(c => c.name)
      .slice(0, 5);
    return (
      `Component "${name}" not found.` +
      (suggestions.length ? `\n\nDid you mean: ${suggestions.join(', ')}?` : '') +
      '\n\nCall `list_components` to see all available components.'
    );
  }

  const lines: string[] = [
    `# ${comp.name}`,
    `**Category:** ${comp.category}`,
    '',
    comp.description,
    '',
    '## Import',
    '```js',
    `import { ${comp.name} } from 'fabkit';`,
    '```',
    '',
  ];

  if (comp.props.length > 0) {
    lines.push('## Props');
    lines.push('| Prop | Type | Default | Description |');
    lines.push('|---|---|---|---|');
    for (const p of comp.props) {
      lines.push(`| \`${p.name}\` | \`${p.type}\` | ${p.default ?? '—'} | ${p.description} |`);
    }
    lines.push('');
  }

  if (comp.notes.length > 0) {
    lines.push('## Notes');
    for (const n of comp.notes) lines.push(`- ${n}`);
    lines.push('');
  }

  if (comp.examples.length > 0) {
    lines.push('## Examples');
    for (const ex of comp.examples) {
      lines.push('```svelte');
      lines.push(ex);
      lines.push('```');
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ── search_components ─────────────────────────────────────────────────────────

export function toolSearchComponents(kb: KnowledgeBase, args: any): string {
  const { query } = args;
  if (!query) return 'Error: `query` is required.';

  const q = query.toLowerCase();
  const scored: Array<{ comp: ComponentDoc; score: number }> = [];

  for (const comp of kb.components) {
    let score = 0;
    if (comp.name.toLowerCase().includes(q)) score += 10;
    if (comp.description.toLowerCase().includes(q)) score += 5;
    for (const tag of comp.tags) {
      if (tag.toLowerCase().includes(q)) score += 3;
    }
    for (const ex of comp.examples) {
      if (ex.toLowerCase().includes(q)) score += 1;
    }
    if (score > 0) scored.push({ comp, score });
  }

  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return `No components found matching "${query}". Try a different keyword or call \`list_components\`.`;
  }

  const lines = [`# Search results for "${query}"\n`];
  for (const { comp } of scored.slice(0, 8)) {
    lines.push(`## ${comp.name} *(${comp.category})*`);
    lines.push(comp.description);
    if (comp.examples[0]) {
      lines.push('```svelte');
      lines.push(comp.examples[0]);
      lines.push('```');
    }
    lines.push('');
  }
  lines.push('Call `get_component` with a name for complete prop documentation.');
  return lines.join('\n');
}

// ── get_theming ───────────────────────────────────────────────────────────────

export function toolGetTheming(kb: KnowledgeBase): string {
  return kb.themingDoc;
}

// ── search_icons ──────────────────────────────────────────────────────────────

export function toolSearchIcons(kb: KnowledgeBase, args: any): string {
  const { query, limit = 20 } = args;
  if (!query) return 'Error: `query` is required.';

  const q = query.toLowerCase().replace(/[^a-z]/g, '');

  const matches = kb.icons.filter(icon => {
    const name = icon.slice(2).toLowerCase(); // strip Ph prefix
    return name.includes(q);
  });

  if (matches.length === 0) {
    return (
      `No icons found matching "${query}".\n\n` +
      'Icons follow the Phosphor naming convention with the "Ph" prefix.\n' +
      'Try shorter keywords: "arrow", "house", "trash", "gear", "user".'
    );
  }

  const shown = matches.slice(0, Number(limit));
  const lines = [
    `# Icon search: "${query}"`,
    `Found ${matches.length} match${matches.length === 1 ? '' : 'es'}${matches.length > limit ? ` (showing first ${limit})` : ''}.`,
    '',
    '## Import',
    '```js',
    `import { ${shown.slice(0, 3).join(', ')} } from 'fabkit';`,
    '```',
    '',
    '## Matching icons',
    ...shown.map(n => `- \`${n}\``),
    '',
    '## Usage',
    '```svelte',
    `<${shown[0]} size={24} weight="regular" />`,
    `<${shown[0]} size={16} color="var(--text-secondary)" weight="bold" />`,
    '```',
    '',
    '## Icon props',
    '| Prop | Type | Default |',
    '|---|---|---|',
    '| `size` | `number \\| string` | `24` |',
    '| `color` | `string` | `"currentColor"` |',
    '| `weight` | `"thin" \\| "light" \\| "regular" \\| "bold" \\| "fill" \\| "duotone"` | `"regular"` |',
    '| `mirrored` | `boolean` | `false` |',
    '| `class` | `string` | `""` |',
  ];
  return lines.join('\n');
}

// ── list_patterns ─────────────────────────────────────────────────────────────

const PATTERNS: Record<string, { description: string; code: string }> = {
  'app-shell': {
    description: 'Basic SvelteKit app shell with Window, TitleBar, and a content area.',
    code: `<!-- src/routes/+layout.svelte -->
<script>
  import { onMount } from 'svelte';
  import { initTheme, Window, TitleBar } from 'fabkit';

  onMount(() => initTheme({ colors: { primary: '#6366f1' } }));
</script>

<Window>
  <TitleBar title="My App" />
  <slot />
</Window>`,
  },
  'sidebar-layout': {
    description: 'App shell with a resizable sidebar and main content area.',
    code: `<!-- src/routes/+layout.svelte -->
<script>
  import { onMount } from 'svelte';
  import { initTheme, Window, TitleBar, SideLayout, VBox } from 'fabkit';

  onMount(() => initTheme());
</script>

<Window>
  <TitleBar title="My App" />
  <SideLayout size={{ left: 240, right: 1 }}>
    {#snippet sidebar()}
      <VBox padding={[12]} spacing={4}>
        <nav><!-- nav items --></nav>
      </VBox>
    {/snippet}
    {#snippet content()}
      <main style="padding: 24px; overflow-y: auto; flex: 1;">
        <slot />
      </main>
    {/snippet}
  </SideLayout>
</Window>`,
  },
  'settings-page': {
    description: 'Full settings page with libadwaita-style preferences groups.',
    code: `<script>
  import {
    PreferencesPage, PreferencesGroup,
    SwitchRow, SpinRow, EntryRow, ActionRow,
    Switcher
  } from 'fabkit';

  let darkMode = $state(false);
  let fontSize = $state(15);
  let apiKey = $state('');
</script>

<PreferencesPage title="Settings" description="Manage your preferences">
  <PreferencesGroup title="Appearance" description="Visual settings">
    <SwitchRow
      title="Dark mode"
      subtitle="Switch to dark theme"
      bind:model={darkMode}
    />
    <SpinRow
      title="Font size"
      subtitle="Interface font size in px"
      bind:value={fontSize}
      min={12} max={24} step={1}
    />
  </PreferencesGroup>

  <PreferencesGroup title="Developer" description="Advanced options">
    <EntryRow title="API Key" bind:value={apiKey} type="password" />
    <ActionRow title="Reset to defaults" activatable onClick={reset} />
  </PreferencesGroup>
</PreferencesPage>`,
  },
  'data-table-page': {
    description: 'Page with a searchable, sortable DataTable and an action bar.',
    code: `<script>
  import { VBox, HBox, SearchField, ActionBar, DataTable, PhPlus, PhTrash, PhDownload } from 'fabkit';

  let query = $state('');
  let selectedRows = $state([]);

  const columns = [
    { key: 'name',   label: 'Name',   sortable: true },
    { key: 'email',  label: 'Email',  sortable: true },
    { key: 'role',   label: 'Role',   sortable: false },
  ];

  const rows = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob',   email: 'bob@example.com',   role: 'Editor' },
  ];

  $derived: filteredRows = rows.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );
</script>

<VBox padding={[24]} spacing={16} height="100%">
  <HBox spacing={12} justify="space-between">
    <SearchField bind:value={query} placeholder="Search users..." />
    <ActionBar items={[
      { label: 'New',    icon: PhPlus,     onClick: () => {}, variant: 'suggested' },
      { label: 'Export', icon: PhDownload, onClick: () => {} },
      { label: 'Delete', icon: PhTrash,    onClick: () => {}, variant: 'destructive',
        disabled: selectedRows.length === 0 },
    ]} />
  </HBox>

  <DataTable
    {columns}
    rows={filteredRows}
    selectable
    bind:selectedRows
    flex="1"
    overflow="auto"
  />
</VBox>`,
  },
  'login-form': {
    description: 'Centered login form with email, password, and submit button.',
    code: `<script>
  import { Window, Clamp, VBox, Card, TextField, Button, PhEnvelope, PhLockSimple } from 'fabkit';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);

  async function login() {
    loading = true;
    // await authService.login(email, password);
    loading = false;
  }
</script>

<Window>
  <VBox align="center" justify="center" height="100vh">
    <Clamp maxWidth={400} width="100%">
      <Card padding={[32]} spacing={20}>
        <VBox spacing={4} align="center">
          <h1 style="font-size: 24px; font-weight: 600; margin: 0;">Welcome back</h1>
          <p style="color: var(--text-secondary); margin: 0;">Sign in to your account</p>
        </VBox>

        <VBox spacing={12}>
          <TextField bind:value={email} label="Email" type="email" icon={PhEnvelope} />
          <TextField bind:value={password} label="Password" type="password" icon={PhLockSimple} />
        </VBox>

        <Button
          label={loading ? 'Signing in…' : 'Sign in'}
          variant="suggested"
          disabled={loading || !email || !password}
          onClick={login}
          width="100%"
        />
      </Card>
    </Clamp>
  </VBox>
</Window>`,
  },
  dashboard: {
    description: 'Dashboard layout with stat cards, a chart placeholder, and a data table.',
    code: `<script>
  import { VBox, HBox, Grid, Card, DataTable, Skeleton, PhUsers, PhCurrencyDollar, PhChartLine, PhArrowUp } from 'fabkit';

  const stats = [
    { label: 'Total users',    value: '12,480', icon: PhUsers,          delta: '+8.2%' },
    { label: 'Revenue',        value: '$48,200', icon: PhCurrencyDollar, delta: '+12.4%' },
    { label: 'Active sessions',value: '3,291',  icon: PhChartLine,      delta: '+3.1%' },
  ];
</script>

<VBox padding={[24]} spacing={24} overflow="auto">
  <!-- Header -->
  <HBox justify="space-between" align="center">
    <h1 style="margin:0; font-size:20px; font-weight:600;">Dashboard</h1>
  </HBox>

  <!-- Stat cards -->
  <Grid columns={3} spacing={16}>
    {#each stats as stat}
      <Card padding={[20]}>
        <HBox justify="space-between" align="flex-start">
          <VBox spacing={4}>
            <span style="color: var(--text-secondary); font-size: 13px;">{stat.label}</span>
            <span style="font-size: 28px; font-weight: 700;">{stat.value}</span>
            <HBox spacing={4} align="center">
              <svelte:component this={PhArrowUp} size={14} color="var(--action-suggested)" />
              <span style="color: var(--action-suggested); font-size: 13px;">{stat.delta}</span>
            </HBox>
          </VBox>
          <Skeleton
            bg="var(--action-suggested)"
            borderRadius={[10,10,10,10]}
            padding={[10]}
            opacity={0.12}
          >
            <svelte:component this={stat.icon} size={24} color="var(--action-suggested)" />
          </Skeleton>
        </HBox>
      </Card>
    {/each}
  </Grid>

  <!-- Chart placeholder -->
  <Card padding={[20]} height={240}>
    <VBox align="center" justify="center" height="100%">
      <span style="color: var(--text-secondary);">Chart goes here</span>
    </VBox>
  </Card>
</VBox>`,
  },
  'dark-mode-toggle': {
    description: 'Dark mode toggle using Switcher and initTheme().',
    code: `<script>
  import { Switcher } from 'fabkit';

  let dark = $state(false);

  function toggleDark(value: boolean) {
    dark = value;
    document.documentElement.classList.toggle('dark', dark);
    document.body.classList.toggle('dark', dark);
    import('fabkit').then(({ initTheme }) => initTheme());
  }
</script>

<Switcher model={dark} onchange={e => toggleDark(e.target.checked)} />`,
  },
};

export function toolListPatterns(): string {
  const lines = ['# Available Fabkit Patterns\n'];
  for (const [name, p] of Object.entries(PATTERNS)) {
    lines.push(`- **\`${name}\`** — ${p.description}`);
  }
  lines.push('\nCall `get_pattern` with a pattern name to get the full Svelte code.');
  return lines.join('\n');
}

export function toolGetPattern(args: any): string {
  const { name } = args;
  if (!name) return 'Error: `name` is required. Call `list_patterns` to see available patterns.';

  const pattern = PATTERNS[name];
  if (!pattern) {
    const available = Object.keys(PATTERNS).join(', ');
    return `Pattern "${name}" not found.\n\nAvailable patterns: ${available}`;
  }

  return [
    `# Pattern: ${name}`,
    '',
    pattern.description,
    '',
    '```svelte',
    pattern.code,
    '```',
  ].join('\n');
}
