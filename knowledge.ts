// ── Knowledge Base ───────────────────────────────────────────────────────────
// All Fabkit documentation embedded at build time so the Worker needs no
// external storage or filesystem access.

export interface ComponentDoc {
  name: string;
  category: string;
  description: string;
  props: PropDef[];
  notes: string[];
  examples: string[];
  tags: string[]; // for full-text search
}

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface KnowledgeBase {
  components: ComponentDoc[];
  icons: string[];       // all Ph* names
  themingDoc: string;    // raw markdown
}

// ── Component registry ───────────────────────────────────────────────────────

const COMPONENTS: ComponentDoc[] = [
  // ── Foundation ────────────────────────────────────────────────────────────
  {
    name: 'Skeleton',
    category: 'foundation',
    description:
      'The base primitive that every Fabkit component is built on. Renders any HTML element with a comprehensive set of layout, color, border, shadow, and interactive styling props applied as inline styles. You rarely use Skeleton directly — but all components accept its props.',
    props: [
      { name: 'element', type: 'string', default: '"div"', description: 'HTML tag to render' },
      { name: 'margin / m / mx / my / mt / mb / ml / mr', type: 'number | number[]', default: '0', description: 'CSS margin shorthand' },
      { name: 'padding / p / px / py / pt / pb / pl / pr', type: 'number | number[]', default: '0', description: 'CSS padding shorthand' },
      { name: 'spacing', type: 'number | string | (number|string)[]', description: 'CSS gap' },
      { name: 'width / w', type: 'number | string', description: 'Width (number = px)' },
      { name: 'height / h', type: 'number | string', description: 'Height' },
      { name: 'minWidth / minW', type: 'number | string', description: 'min-width' },
      { name: 'maxWidth / maxW', type: 'number | string', description: 'max-width' },
      { name: 'bg', type: 'ColorValue', default: '"transparent"', description: 'Background color (idle)' },
      { name: 'bgHover', type: 'ColorValue', description: 'Background on hover' },
      { name: 'bgFocus', type: 'ColorValue', description: 'Background on focus' },
      { name: 'bgActive', type: 'ColorValue', description: 'Background on active' },
      { name: 'borderWidth', type: 'number | number[]', default: '[0,0,0,0]', description: 'Border widths [top,right,bottom,left]' },
      { name: 'borderColor', type: 'ColorValue | ColorValue[]', description: 'Border color(s)' },
      { name: 'borderRadius', type: 'number | number[]', default: '[0,0,0,0]', description: 'Border radii [tl,tr,br,bl]' },
      { name: 'borderStyle', type: 'string', default: '"solid"', description: 'CSS border-style' },
      { name: 'shadow', type: 'string', default: '"none"', description: 'Box shadow' },
      { name: 'color', type: 'ColorValue', description: 'Text color' },
      { name: 'fontSize', type: 'number | string', description: 'Font size' },
      { name: 'fontWeight', type: 'string | number', description: 'Font weight' },
      { name: 'textAlign', type: 'string', description: 'Text alignment' },
      { name: 'display', type: 'string', description: 'CSS display' },
      { name: 'position', type: 'string', description: 'CSS position' },
      { name: 'overflow', type: 'string', description: 'CSS overflow' },
      { name: 'flex', type: 'string | number', description: 'CSS flex shorthand' },
      { name: 'opacity', type: 'number | string', description: 'CSS opacity 0–1' },
      { name: 'zIndex', type: 'number | string', description: 'CSS z-index' },
      { name: 'cursor', type: 'string', description: 'CSS cursor' },
      { name: 'class', type: 'string', description: 'Additional CSS classes' },
    ],
    notes: [
      'ColorValue can be: CSS string (#fff, rgba(...), var(...)), theme token (surface, text-primary, gray.500, surface/30), or RGBA tuple [r,g,b,a].',
      'All interactive state props (bgHover, borderColorFocus, etc.) transition at 0.2s ease automatically.',
      'Array props like borderRadius=[tl,tr,br,bl] or borderWidth=[top,right,bottom,left] match CSS shorthand order.',
    ],
    examples: [
      `<Skeleton
  element="section"
  bg="var(--background-elevated)"
  padding={[16, 24]}
  borderRadius={[12, 12, 12, 12]}
  shadow="var(--shadow-elevated)"
>
  Content here
</Skeleton>`,
    ],
    tags: ['base', 'primitive', 'layout', 'styling', 'inline styles', 'props'],
  },

  // ── Layout ────────────────────────────────────────────────────────────────
  {
    name: 'HBox',
    category: 'layout',
    description: 'Horizontal flexbox row. Thin wrapper around Skeleton with display:flex and flex-direction:row.',
    props: [
      { name: 'align', type: 'string', default: '"center"', description: 'align-items value' },
      { name: 'justify', type: 'string', default: '"flex-start"', description: 'justify-content value' },
      { name: 'wrap', type: 'boolean', default: 'false', description: 'flex-wrap: wrap' },
      { name: 'spacing', type: 'number | string', description: 'Gap between children (px if number)' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [
      `<HBox spacing={12} align="center">
  <Button label="Cancel" />
  <Button label="Save" variant="suggested" />
</HBox>`,
    ],
    tags: ['flex', 'row', 'horizontal', 'layout'],
  },
  {
    name: 'VBox',
    category: 'layout',
    description: 'Vertical flexbox column. Thin wrapper around Skeleton with display:flex and flex-direction:column.',
    props: [
      { name: 'align', type: 'string', default: '"stretch"', description: 'align-items value' },
      { name: 'justify', type: 'string', default: '"flex-start"', description: 'justify-content value' },
      { name: 'spacing', type: 'number | string', description: 'Gap between children' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [
      `<VBox spacing={16} padding={[24]}>
  <h2>Title</h2>
  <p>Content</p>
</VBox>`,
    ],
    tags: ['flex', 'column', 'vertical', 'layout'],
  },
  {
    name: 'Grid',
    category: 'layout',
    description: 'CSS Grid wrapper.',
    props: [
      { name: 'columns', type: 'number | string', description: 'grid-template-columns (number = repeat(n,1fr))' },
      { name: 'rows', type: 'number | string', description: 'grid-template-rows' },
      { name: 'spacing', type: 'number | string | [number,number]', description: 'gap (or [row-gap, col-gap])' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<Grid columns={3} spacing={16}><Card /><Card /><Card /></Grid>`],
    tags: ['grid', 'layout', 'columns'],
  },
  {
    name: 'AdaptiveGrid',
    category: 'layout',
    description: 'Grid that collapses to a list when container width falls below a threshold.',
    props: [
      { name: 'minColWidth', type: 'number', default: '200', description: 'Minimum column width before collapse (px)' },
      { name: 'spacing', type: 'number', description: 'Gap between items' },
    ],
    notes: ['Container-query based, not viewport-based.'],
    examples: [`<AdaptiveGrid minColWidth={240} spacing={16}>{#each items as i}<Card>{i.name}</Card>{/each}</AdaptiveGrid>`],
    tags: ['responsive', 'grid', 'adaptive', 'container'],
  },
  {
    name: 'Window',
    category: 'layout',
    description: 'Top-level app shell. Fills the viewport and provides the main layout context.',
    props: [
      { name: 'children', type: 'Snippet', description: 'App content' },
    ],
    notes: ['Typically the outermost component in a SvelteKit layout.', 'Pairs with TitleBar and SideLayout.'],
    examples: [
      `<Window>
  <TitleBar title="My App" />
  <SideLayout>
    {#snippet sidebar()}<nav>...</nav>{/snippet}
    {#snippet content()}<main>...</main>{/snippet}
  </SideLayout>
</Window>`,
    ],
    tags: ['app', 'shell', 'root', 'layout', 'window'],
  },
  {
    name: 'TitleBar',
    category: 'layout',
    description: 'Window title bar with optional window controls and custom content area.',
    props: [
      { name: 'title', type: 'string', description: 'App or window title' },
      { name: 'showWindowControls', type: 'boolean', default: 'false', description: 'Show macOS-style close/minimize/maximize buttons' },
      { name: 'area', type: 'Snippet', description: 'Custom content (buttons, search, etc.)' },
      { name: 'onScrollTop', type: '() => void', description: 'Callback when title is clicked (scroll to top)' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [
      `<TitleBar title="My App">
  {#snippet area()}
    <Button label="New" icon={PhPlus} />
  {/snippet}
</TitleBar>`,
    ],
    tags: ['titlebar', 'header', 'navigation', 'window'],
  },
  {
    name: 'SideLayout',
    category: 'layout',
    description: 'Two-panel layout with a sidebar and content area. Sidebar can be resized.',
    props: [
      { name: 'context', type: 'string', description: 'Shared key for linking with a Flap/Paned' },
      { name: 'size', type: '{ left: number, right: number }', description: 'Initial widths in px' },
      { name: 'sidebar', type: 'Snippet', description: 'Sidebar content' },
      { name: 'content', type: 'Snippet', description: 'Main content' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [
      `<SideLayout size={{ left: 240, right: 1 }}>
  {#snippet sidebar()}<nav>Sidebar</nav>{/snippet}
  {#snippet content()}<main>Content</main>{/snippet}
</SideLayout>`,
    ],
    tags: ['sidebar', 'layout', 'split', 'two-panel'],
  },
  {
    name: 'Paned',
    category: 'layout',
    description: 'Resizable two-panel split (left/right) with a draggable divider.',
    props: [
      { name: 'context', type: 'string', description: 'Shared context key' },
      { name: 'size', type: '{ left: number, right: number }', description: 'Initial panel widths' },
      { name: 'minLeft', type: 'number', description: 'Minimum left panel width' },
      { name: 'leftTrigger', type: 'number', description: 'Width threshold to hide left panel' },
      { name: 'left', type: 'Snippet', description: 'Left panel content' },
      { name: 'right', type: 'Snippet', description: 'Right panel content' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<Paned size={{ left: 300, right: 1 }}>
  {#snippet left()}<div>Left</div>{/snippet}
  {#snippet right()}<div>Right</div>{/snippet}
</Paned>`],
    tags: ['split', 'resizable', 'pane', 'divider'],
  },
  {
    name: 'Card',
    category: 'layout',
    description: 'Bordered container with default background and border styling.',
    props: [
      { name: 'children', type: 'Snippet', description: 'Card content' },
    ],
    notes: ['Accepts all Skeleton props for full visual customisation.'],
    examples: [`<Card padding={[16]}><p>Hello</p></Card>`],
    tags: ['card', 'container', 'bordered', 'surface'],
  },
  {
    name: 'Container',
    category: 'layout',
    description: 'Centred container with maxWidth and horizontal gutters.',
    props: [
      { name: 'maxWidth', type: 'number | string', default: '1200', description: 'Max content width' },
      { name: 'gutter', type: 'number', default: '16', description: 'Horizontal padding' },
      { name: 'edgeToEdge', type: 'boolean', default: 'false', description: 'Remove gutters at small sizes' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<Container maxWidth={960} gutter={24}><main>...</main></Container>`],
    tags: ['container', 'centered', 'maxwidth', 'layout'],
  },
  {
    name: 'Clamp',
    category: 'layout',
    description: 'Constrains its children to a maximum size.',
    props: [
      { name: 'maxWidth', type: 'number | string', description: 'Max width' },
      { name: 'maxHeight', type: 'number | string', description: 'Max height' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<Clamp maxWidth={480}><form>...</form></Clamp>`],
    tags: ['clamp', 'constrain', 'max-width', 'layout'],
  },
  {
    name: 'Flap',
    category: 'layout',
    description: 'Adaptive sidebar drawer that can slide in/out on smaller containers.',
    props: [
      { name: 'context', type: 'string', description: 'Shared context key' },
      { name: 'open', type: 'boolean', default: 'false', description: 'Whether the flap is open' },
      { name: 'children', type: 'Snippet', description: 'Drawer content' },
    ],
    notes: ['Pairs with SideLayout context for responsive collapsing.'],
    examples: [`<Flap context="main" bind:open={drawerOpen}>...</Flap>`],
    tags: ['drawer', 'sidebar', 'adaptive', 'flap', 'mobile'],
  },
  {
    name: 'AdaptiveLayout',
    category: 'layout',
    description: 'Container-driven layout switcher using Breakpoint rules.',
    props: [
      { name: 'children', type: 'Snippet', description: 'Breakpoint children' },
    ],
    notes: ['Wrap Breakpoint components inside.'],
    examples: [`<AdaptiveLayout>
  <Breakpoint maxWidth={600}><MobileView /></Breakpoint>
  <Breakpoint minWidth={601}><DesktopView /></Breakpoint>
</AdaptiveLayout>`],
    tags: ['responsive', 'adaptive', 'breakpoint', 'container'],
  },
  {
    name: 'Breakpoint',
    category: 'layout',
    description: 'Renders its children only when the parent AdaptiveLayout container matches the given width range.',
    props: [
      { name: 'minWidth', type: 'number', description: 'Min container width to show' },
      { name: 'maxWidth', type: 'number', description: 'Max container width to show' },
    ],
    notes: ['Container-query based (not viewport).'],
    examples: [`<Breakpoint maxWidth={640}><p>Mobile</p></Breakpoint>`],
    tags: ['breakpoint', 'responsive', 'container query'],
  },
  {
    name: 'Leaflet',
    category: 'layout',
    description: 'Adaptive two-pane stack: shows side by side above a threshold, stacks vertically below.',
    props: [
      { name: 'stackAt', type: 'number', default: '640', description: 'Container width below which panes stack' },
      { name: 'left', type: 'Snippet', description: 'Left/top pane' },
      { name: 'right', type: 'Snippet', description: 'Right/bottom pane' },
    ],
    notes: ['Container-query based.'],
    examples: [`<Leaflet stackAt={720}>
  {#snippet left()}<aside>Sidebar</aside>{/snippet}
  {#snippet right()}<main>Content</main>{/snippet}
</Leaflet>`],
    tags: ['adaptive', 'two-pane', 'stack', 'responsive'],
  },
  {
    name: 'ToolbarView',
    category: 'layout',
    description: 'Layout with optional top and bottom toolbars surrounding a scrollable content area.',
    props: [
      { name: 'top', type: 'Snippet', description: 'Top toolbar' },
      { name: 'bottom', type: 'Snippet', description: 'Bottom toolbar' },
      { name: 'children', type: 'Snippet', description: 'Main content' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<ToolbarView>
  {#snippet top()}<HBox><Button label="Back" /></HBox>{/snippet}
  <main>Content</main>
</ToolbarView>`],
    tags: ['toolbar', 'layout', 'top bar', 'bottom bar'],
  },
  {
    name: 'Wrapper',
    category: 'layout',
    description: 'Generic passthrough container. Useful for adding Skeleton styling to any arbitrary element.',
    props: [{ name: 'children', type: 'Snippet', description: 'Content' }],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<Wrapper padding={[8, 16]} bg="var(--background-elevated)">...</Wrapper>`],
    tags: ['wrapper', 'container', 'generic'],
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  {
    name: 'TabsSwitcher',
    category: 'navigation',
    description: 'Tab bar that drives a Notebook or StaticNotebook via a shared context string.',
    props: [
      { name: 'context', type: 'string', description: 'Links to Notebook with same context' },
      { name: 'allowNewTabs', type: 'boolean', default: 'false', description: 'Show a "+" button to add new tabs' },
    ],
    notes: ['Must share the same context string with a Notebook.'],
    examples: [`<TabsSwitcher context="myTabs" allowNewTabs />
<Notebook context="myTabs" newPageContent={newPage} />`],
    tags: ['tabs', 'navigation', 'switcher'],
  },
  {
    name: 'Notebook',
    category: 'navigation',
    description: 'Dynamic tabbed content area driven by TabsSwitcher. Tabs can be created and closed at runtime.',
    props: [
      { name: 'context', type: 'string', description: 'Links to TabsSwitcher with same context' },
      { name: 'newPageContent', type: '() => { component, props }', description: 'Factory for new tabs' },
    ],
    notes: ['Can also be used declaratively with Notebook.Tab children.'],
    examples: [`<Notebook context="myTabs">
  <Notebook.Tab title="Home"><HomePage /></Notebook.Tab>
  <Notebook.Tab title="Settings"><SettingsPage /></Notebook.Tab>
</Notebook>`],
    tags: ['tabs', 'notebook', 'dynamic tabs', 'navigation'],
  },
  {
    name: 'MenuSwitcher',
    category: 'navigation',
    description: 'Vertical navigation menu that switches between pages in a shared context.',
    props: [
      { name: 'context', type: 'string', description: 'Shared context key' },
      { name: 'items', type: 'MenuSwitcherItem[]', description: 'Array of { label, pageId, isActive }' },
    ],
    notes: ['Pairs with a page switcher context.'],
    examples: [`<MenuSwitcher context="nav" items={[{ label: 'Home', pageId: 0, isActive: true }]} />`],
    tags: ['menu', 'navigation', 'switcher', 'sidebar nav'],
  },
  {
    name: 'Menu',
    category: 'navigation',
    description: 'Dropdown or inline menu with items.',
    props: [
      { name: 'items', type: 'MenuItem[]', description: 'Array of { label, icon?, action?, href? }' },
      { name: 'children', type: 'Snippet', description: 'Alternative: use Menu.Item children' },
    ],
    notes: ['Can use Menu.Item as children for declarative composition.'],
    examples: [`<Menu items={[{ label: 'Edit', action: edit }, { label: 'Delete', action: del }]} />`],
    tags: ['menu', 'dropdown', 'navigation'],
  },
  {
    name: 'NavigationSplitView',
    category: 'navigation',
    description: 'Three-column navigation (sidebar / list / detail) common in mail/settings apps.',
    props: [
      { name: 'sidebar', type: 'Snippet', description: 'Leftmost navigation column' },
      { name: 'list', type: 'Snippet', description: 'Middle list column' },
      { name: 'detail', type: 'Snippet', description: 'Right detail column' },
    ],
    notes: ['Collapses gracefully on smaller containers.'],
    examples: [],
    tags: ['navigation', 'split view', 'three-column', 'sidebar'],
  },
  {
    name: 'SlideOver',
    category: 'navigation',
    description: 'Modal panel that slides in from the bottom. Good for detail views or forms on mobile.',
    props: [
      { name: 'title', type: 'string', description: 'Panel title' },
      { name: 'description', type: 'string', description: 'Optional subtitle' },
      { name: 'close', type: '() => void', description: 'Close callback' },
      { name: 'modal', type: 'boolean', default: 'false', description: 'Render as modal with backdrop' },
      { name: 'height', type: 'number', description: 'Panel height in px' },
      { name: 'hideCancel', type: 'boolean', description: 'Hide the cancel button' },
      { name: 'disabled', type: 'boolean', description: 'Disable the confirm button' },
      { name: 'enterFunction', type: '() => void', description: 'Confirm/submit callback' },
      { name: 'closeLabel', type: 'string', description: 'Label for close button' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [],
    tags: ['modal', 'slide over', 'sheet', 'panel', 'overlay'],
  },

  // ── Interactive / Feedback ─────────────────────────────────────────────────
  {
    name: 'Button',
    category: 'interactive',
    description: 'Primary interactive element. Supports multiple variants, icons, and states.',
    props: [
      { name: 'label', type: 'string', description: 'Button text' },
      { name: 'icon', type: 'Component | Snippet', description: 'Icon component (Ph* icon)' },
      { name: 'variant', type: '"flat" | "suggested" | "destructive" | "outlined"', default: '"flat"', description: 'Visual style' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button' },
      { name: 'square', type: 'boolean', default: 'false', description: 'Equal width/height (icon-only)' },
      { name: 'type', type: 'string', default: '"button"', description: 'HTML button type' },
      { name: 'labelBehavior', type: '"auto" | "always" | "never"', default: '"auto"', description: 'When to show the label' },
      { name: 'onClick', type: '() => void', description: 'Click handler' },
    ],
    notes: [
      'Use variant="suggested" for the primary CTA.',
      'Use variant="destructive" for delete/remove actions.',
      'Use square=true with icon and no label for icon buttons.',
    ],
    examples: [
      `<Button label="Save" variant="suggested" onClick={save} />`,
      `<Button label="Delete" variant="destructive" icon={PhTrash} />`,
      `<Button icon={PhPlus} square={true} />`,
    ],
    tags: ['button', 'cta', 'action', 'interactive'],
  },
  {
    name: 'Dialog',
    category: 'interactive',
    description: 'Modal dialog with title, content, and action buttons.',
    props: [
      { name: 'title', type: 'string', description: 'Dialog title' },
      { name: 'open', type: 'boolean', description: 'Controls visibility' },
      { name: 'close', type: '() => void', description: 'Called on dismiss' },
      { name: 'children', type: 'Snippet', description: 'Dialog body' },
    ],
    notes: ['Traps focus when open.'],
    examples: [`<Dialog title="Confirm" bind:open={showDialog} close={() => showDialog = false}>
  <p>Are you sure?</p>
  <Button label="Confirm" variant="destructive" />
</Dialog>`],
    tags: ['dialog', 'modal', 'overlay', 'confirm'],
  },
  {
    name: 'Toast',
    category: 'feedback',
    description: 'Temporary notification. Use with ToastOverlay.',
    props: [
      { name: 'message', type: 'string', description: 'Notification text' },
      { name: 'variant', type: '"info" | "success" | "warning" | "error"', description: 'Toast type' },
      { name: 'duration', type: 'number', default: '3000', description: 'Auto-dismiss in ms' },
    ],
    notes: ['Requires ToastOverlay in the layout to render.'],
    examples: [`<ToastOverlay />
<!-- trigger from code: -->
<!-- toast.show({ message: 'Saved!', variant: 'success' }) -->`],
    tags: ['toast', 'notification', 'feedback', 'alert'],
  },
  {
    name: 'Banner',
    category: 'feedback',
    description: 'Inline contextual info/warning/error/success bar.',
    props: [
      { name: 'message', type: 'string', description: 'Banner text' },
      { name: 'variant', type: '"info" | "warning" | "error" | "success"', description: 'Visual type' },
      { name: 'dismissible', type: 'boolean', description: 'Show dismiss button' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<Banner message="File saved successfully." variant="success" dismissible />`],
    tags: ['banner', 'alert', 'info', 'warning', 'error', 'feedback'],
  },
  {
    name: 'Tooltip',
    category: 'feedback',
    description: 'Floating label shown on hover or focus.',
    props: [
      { name: 'text', type: 'string', description: 'Tooltip label' },
      { name: 'position', type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: 'Placement' },
      { name: 'delay', type: 'number', default: '400', description: 'Show delay in ms' },
      { name: 'children', type: 'Snippet', description: 'Trigger element' },
    ],
    notes: ['Wraps the trigger element.'],
    examples: [`<Tooltip text="Remove item" position="bottom">
  <Button icon={PhTrash} square />
</Tooltip>`],
    tags: ['tooltip', 'hover', 'label', 'feedback'],
  },
  {
    name: 'PopOver',
    category: 'feedback',
    description: 'Floating popover anchored to a trigger element.',
    props: [
      { name: 'open', type: 'boolean', description: 'Controls visibility' },
      { name: 'children', type: 'Snippet', description: 'Popover content' },
    ],
    notes: ['Wrap trigger and content inside PopOverWrapper.'],
    examples: [],
    tags: ['popover', 'floating', 'overlay'],
  },
  {
    name: 'ActionBar',
    category: 'interactive',
    description: 'Horizontal set of actions that automatically overflows into a "More" menu when space is limited.',
    props: [
      { name: 'items', type: 'Array<{ label, icon?, onClick, variant?, disabled? }>', description: 'Action list' },
      { name: 'mode', type: '"auto" | "all" | "overflow"', default: '"auto"', description: 'Overflow behaviour' },
      { name: 'spacing', type: 'number', default: '8', description: 'Gap between actions' },
      { name: 'moreLabel', type: 'string', default: '"More"', description: 'Overflow button label' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<ActionBar items={[
  { label: 'Edit', icon: PhPencil, onClick: edit },
  { label: 'Delete', icon: PhTrash, variant: 'destructive', onClick: del },
]} />`],
    tags: ['action bar', 'toolbar', 'overflow', 'actions'],
  },
  {
    name: 'Accordion',
    category: 'interactive',
    description: 'Collapsible expander group (libadwaita ExpanderRow style).',
    props: [
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple items open' },
      { name: 'open', type: 'any', description: 'Controlled open state' },
    ],
    notes: ['Wrap AccordionItem children inside.'],
    examples: [`<Accordion>
  <AccordionItem title="Section 1">Content 1</AccordionItem>
  <AccordionItem title="Section 2">Content 2</AccordionItem>
</Accordion>`],
    tags: ['accordion', 'collapsible', 'expand', 'interactive'],
  },
  {
    name: 'Switcher',
    category: 'interactive',
    description: 'Toggle switch (checkbox-like but styled as a switch).',
    props: [
      { name: 'model', type: 'boolean', description: 'Bind to toggle state' },
    ],
    notes: ['Use bind:model for two-way binding.'],
    examples: [`<Switcher bind:model={enabled} />`],
    tags: ['switch', 'toggle', 'checkbox', 'form'],
  },
  {
    name: 'Slider',
    category: 'interactive',
    description: 'Range slider input.',
    props: [
      { name: 'value', type: 'number', description: 'Current value' },
      { name: 'min', type: 'number', default: '0', description: 'Minimum' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum' },
      { name: 'step', type: 'number', default: '1', description: 'Step size' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<Slider bind:value={volume} min={0} max={100} />`],
    tags: ['slider', 'range', 'input', 'form'],
  },

  // ── Form fields ────────────────────────────────────────────────────────────
  {
    name: 'TextField',
    category: 'form',
    description: 'Text input field with optional floating label, icon, and validation.',
    props: [
      { name: 'value', type: 'string', description: 'Input value (bind:value)' },
      { name: 'label', type: 'string', description: 'Floating label' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text' },
      { name: 'type', type: 'string', default: '"text"', description: 'HTML input type' },
      { name: 'icon', type: 'Component', description: 'Leading icon' },
      { name: 'disabled', type: 'boolean', description: 'Disable the field' },
      { name: 'error', type: 'string', description: 'Validation error message' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<TextField bind:value={name} label="Full name" icon={PhUser} />`],
    tags: ['text field', 'input', 'form', 'label'],
  },
  {
    name: 'TextArea',
    category: 'form',
    description: 'Multi-line text input with auto-resize and floating label.',
    props: [
      { name: 'value', type: 'string', description: 'Value (bind:value)' },
      { name: 'label', type: 'string', description: 'Floating label' },
      { name: 'rows', type: 'number', default: '3', description: 'Initial row count' },
    ],
    notes: ['Auto-resizes as content grows.'],
    examples: [`<TextArea bind:value={bio} label="Bio" rows={4} />`],
    tags: ['textarea', 'multiline', 'input', 'form'],
  },
  {
    name: 'SelectField',
    category: 'form',
    description: 'Dropdown select with floating label.',
    props: [
      { name: 'value', type: 'string', description: 'Selected value (bind:value)' },
      { name: 'label', type: 'string', description: 'Floating label' },
      { name: 'options', type: 'Array<{ label, value }>', description: 'Dropdown options' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<SelectField bind:value={country} label="Country" options={[{ label: 'Italy', value: 'it' }]} />`],
    tags: ['select', 'dropdown', 'form', 'combobox'],
  },
  {
    name: 'Checkbox',
    category: 'form',
    description: 'Checkbox input with label.',
    props: [
      { name: 'checked', type: 'boolean', description: 'Checked state (bind:checked)' },
      { name: 'label', type: 'string', description: 'Checkbox label' },
      { name: 'disabled', type: 'boolean', description: 'Disable the checkbox' },
    ],
    notes: [],
    examples: [`<Checkbox bind:checked={agreed} label="I agree to terms" />`],
    tags: ['checkbox', 'form', 'boolean'],
  },
  {
    name: 'RadioGroup',
    category: 'form',
    description: 'Single-selection radio button group.',
    props: [
      { name: 'value', type: 'string', description: 'Selected value (bind:value)' },
      { name: 'options', type: 'Array<{ label, value }>', description: 'Radio options' },
    ],
    notes: [],
    examples: [`<RadioGroup bind:value={size} options={[{ label: 'S', value: 's' }, { label: 'M', value: 'm' }]} />`],
    tags: ['radio', 'form', 'single select'],
  },
  {
    name: 'NumberField',
    category: 'form',
    description: 'Numeric input with stepper +/- arrows, min/max/step.',
    props: [
      { name: 'value', type: 'number', description: 'Value (bind:value)' },
      { name: 'min', type: 'number', description: 'Minimum value' },
      { name: 'max', type: 'number', description: 'Maximum value' },
      { name: 'step', type: 'number', default: '1', description: 'Increment step' },
      { name: 'label', type: 'string', description: 'Floating label' },
    ],
    notes: [],
    examples: [`<NumberField bind:value={qty} min={1} max={99} label="Quantity" />`],
    tags: ['number', 'stepper', 'form', 'input'],
  },
  {
    name: 'TagsInput',
    category: 'form',
    description: 'Multi-value tag input (add/remove tags inline).',
    props: [
      { name: 'tags', type: 'string[]', description: 'Current tags (bind:tags)' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text' },
      { name: 'maxTags', type: 'number', description: 'Max number of tags' },
    ],
    notes: [],
    examples: [`<TagsInput bind:tags={selectedTags} placeholder="Add a tag..." />`],
    tags: ['tags', 'multi-value', 'form', 'chips'],
  },
  {
    name: 'SearchField',
    category: 'form',
    description: 'TextField with built-in clear button and search icon.',
    props: [
      { name: 'value', type: 'string', description: 'Search value (bind:value)' },
      { name: 'placeholder', type: 'string', description: 'Placeholder' },
      { name: 'onSearch', type: '(value: string) => void', description: 'Callback on search' },
    ],
    notes: [],
    examples: [`<SearchField bind:value={query} placeholder="Search..." onSearch={doSearch} />`],
    tags: ['search', 'form', 'input', 'filter'],
  },
  {
    name: 'FileChooser',
    category: 'form',
    description: 'File input with drag-and-drop zone.',
    props: [
      { name: 'files', type: 'File[]', description: 'Selected files (bind:files)' },
      { name: 'accept', type: 'string', description: 'Accepted MIME types or extensions' },
      { name: 'multiple', type: 'boolean', description: 'Allow multiple files' },
      { name: 'label', type: 'string', description: 'Drop zone label' },
      { name: 'maxSize', type: 'number', description: 'Max file size in bytes' },
    ],
    notes: [],
    examples: [`<FileChooser bind:files accept="image/*" multiple label="Drop images here" />`],
    tags: ['file', 'upload', 'drag drop', 'form'],
  },
  {
    name: 'ColorPicker',
    category: 'form',
    description: 'Color selection with hex input and hue slider.',
    props: [
      { name: 'value', type: 'string', description: 'Hex color (bind:value)' },
      { name: 'label', type: 'string', description: 'Label' },
    ],
    notes: [],
    examples: [`<ColorPicker bind:value={brandColor} label="Brand color" />`],
    tags: ['color', 'picker', 'form', 'input'],
  },

  // ── Settings / GNOME-style ─────────────────────────────────────────────────
  {
    name: 'ActionRow',
    category: 'settings',
    description: 'Settings row with title, optional subtitle, icon, and a right-side widget. libadwaita-style.',
    props: [
      { name: 'title', type: 'string', description: 'Row title' },
      { name: 'subtitle', type: 'string', description: 'Row subtitle' },
      { name: 'icon', type: 'Component', description: 'Leading icon component' },
      { name: 'onClick', type: '() => void', description: 'Click handler (makes row activatable)' },
      { name: 'activatable', type: 'boolean', description: 'Show chevron for navigation' },
    ],
    notes: ['Pair with SwitchRow, SpinRow, EntryRow for common patterns.'],
    examples: [`<ActionRow title="Dark mode" subtitle="Toggle appearance">
  <Switcher bind:model={darkMode} />
</ActionRow>`],
    tags: ['action row', 'settings', 'list row', 'libadwaita'],
  },
  {
    name: 'SwitchRow',
    category: 'settings',
    description: 'ActionRow with an integrated Switcher.',
    props: [
      { name: 'title', type: 'string', description: 'Row title' },
      { name: 'subtitle', type: 'string', description: 'Row subtitle' },
      { name: 'model', type: 'boolean', description: 'Toggle state (bind:model)' },
    ],
    notes: [],
    examples: [`<SwitchRow title="Notifications" subtitle="Enable push notifications" bind:model={notif} />`],
    tags: ['switch row', 'settings', 'toggle', 'libadwaita'],
  },
  {
    name: 'SpinRow',
    category: 'settings',
    description: 'ActionRow with an integrated NumberField.',
    props: [
      { name: 'title', type: 'string', description: 'Row title' },
      { name: 'subtitle', type: 'string', description: 'Row subtitle' },
      { name: 'value', type: 'number', description: 'Value (bind:value)' },
      { name: 'min', type: 'number', description: 'Min' },
      { name: 'max', type: 'number', description: 'Max' },
      { name: 'step', type: 'number', description: 'Step' },
    ],
    notes: [],
    examples: [`<SpinRow title="Font size" bind:value={fontSize} min={10} max={24} step={1} />`],
    tags: ['spin row', 'settings', 'number', 'libadwaita'],
  },
  {
    name: 'EntryRow',
    category: 'settings',
    description: 'ActionRow with an inline TextField.',
    props: [
      { name: 'title', type: 'string', description: 'Row label' },
      { name: 'value', type: 'string', description: 'Value (bind:value)' },
      { name: 'placeholder', type: 'string', description: 'Placeholder' },
      { name: 'type', type: 'string', description: 'Input type' },
    ],
    notes: [],
    examples: [`<EntryRow title="API key" bind:value={apiKey} type="password" />`],
    tags: ['entry row', 'settings', 'input', 'libadwaita'],
  },
  {
    name: 'PreferencesGroup',
    category: 'settings',
    description: 'Container for grouping related ActionRows into a settings section.',
    props: [
      { name: 'title', type: 'string', description: 'Group title' },
      { name: 'description', type: 'string', description: 'Group description' },
      { name: 'children', type: 'Snippet', description: 'ActionRow children' },
    ],
    notes: [],
    examples: [`<PreferencesGroup title="Appearance">
  <SwitchRow title="Dark mode" bind:model={dark} />
  <SpinRow title="Font size" bind:value={size} min={12} max={24} />
</PreferencesGroup>`],
    tags: ['preferences group', 'settings', 'group', 'libadwaita'],
  },
  {
    name: 'PreferencesPage',
    category: 'settings',
    description: 'Full settings page layout with title and grouped PreferencesGroups.',
    props: [
      { name: 'title', type: 'string', description: 'Page title' },
      { name: 'description', type: 'string', description: 'Page subtitle' },
      { name: 'children', type: 'Snippet', description: 'PreferencesGroup children' },
    ],
    notes: [],
    examples: [`<PreferencesPage title="Settings">
  <PreferencesGroup title="Account">...</PreferencesGroup>
</PreferencesPage>`],
    tags: ['preferences page', 'settings page', 'libadwaita'],
  },

  // ── Data display ───────────────────────────────────────────────────────────
  {
    name: 'DataTable',
    category: 'data',
    description: 'Sortable, selectable table with row actions.',
    props: [
      { name: 'columns', type: 'Column[]', description: 'Column definitions: { key, label, sortable? }' },
      { name: 'rows', type: 'any[]', description: 'Row data array' },
      { name: 'selectable', type: 'boolean', description: 'Enable row selection' },
      { name: 'selectedRows', type: 'any[]', description: 'Currently selected rows (bind:selectedRows)' },
      { name: 'onRowClick', type: '(row) => void', description: 'Row click handler' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<DataTable
  columns={[{ key: 'name', label: 'Name', sortable: true }]}
  rows={users}
  selectable
  bind:selectedRows
/>`],
    tags: ['table', 'data', 'sortable', 'selectable', 'grid'],
  },
  {
    name: 'LevelBar',
    category: 'data',
    description: 'Segmented level bar (battery, storage, quota style).',
    props: [
      { name: 'value', type: 'number', description: 'Current value' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
      { name: 'segments', type: 'number', description: 'Number of segments' },
      { name: 'color', type: 'ColorValue', description: 'Bar color' },
      { name: 'lowThreshold', type: 'number', description: 'Below this = low color' },
      { name: 'highThreshold', type: 'number', description: 'Above this = high color' },
    ],
    notes: [],
    examples: [`<LevelBar value={75} max={100} segments={5} />`],
    tags: ['progress', 'level bar', 'storage', 'battery', 'quota'],
  },
  {
    name: 'Chip',
    category: 'data',
    description: 'Removable, colorable pill/tag.',
    props: [
      { name: 'label', type: 'string', description: 'Chip text' },
      { name: 'removable', type: 'boolean', description: 'Show remove button' },
      { name: 'onRemove', type: '() => void', description: 'Remove callback' },
      { name: 'icon', type: 'Component', description: 'Leading icon' },
      { name: 'color', type: 'ColorValue', description: 'Background color' },
      { name: 'textColor', type: 'ColorValue', description: 'Text color' },
    ],
    notes: [],
    examples: [`<Chip label="Svelte" removable onRemove={() => remove('svelte')} />`],
    tags: ['chip', 'tag', 'badge', 'pill', 'removable'],
  },
  {
    name: 'Kbd',
    category: 'data',
    description: 'Styled keyboard shortcut display.',
    props: [
      { name: 'keys', type: 'string[]', description: 'Array of key names to display' },
    ],
    notes: [],
    examples: [`<Kbd keys={['⌘', 'K']} />`],
    tags: ['keyboard', 'shortcut', 'kbd', 'hotkey'],
  },

  // ── Content ────────────────────────────────────────────────────────────────
  {
    name: 'Image',
    category: 'content',
    description: 'Versatile image component with fit, aspect ratio, and loading options.',
    props: [
      { name: 'src', type: 'string', description: 'Image URL' },
      { name: 'alt', type: 'string', description: 'Alt text' },
      { name: 'fit', type: '"cover" | "contain" | "fill"', default: '"cover"', description: 'object-fit' },
      { name: 'square', type: 'boolean', description: 'Force 1:1 aspect ratio' },
      { name: 'landscape', type: 'boolean', description: 'Force 16:9 aspect ratio' },
      { name: 'portrait', type: 'boolean', description: 'Force 3:4 aspect ratio' },
    ],
    notes: ['Accepts all Skeleton props.'],
    examples: [`<Image src="/hero.jpg" alt="Hero" landscape fit="cover" />`],
    tags: ['image', 'photo', 'media', 'content'],
  },
  {
    name: 'TextRich',
    category: 'content',
    description: 'Styled prose container for rich text / markdown output.',
    props: [{ name: 'children', type: 'Snippet', description: 'HTML content' }],
    notes: ['Applies opinionated typography styles to nested HTML elements.'],
    examples: [`<TextRich>{@html markdownHtml}</TextRich>`],
    tags: ['rich text', 'prose', 'markdown', 'typography'],
  },
  {
    name: 'DensityProvider',
    category: 'foundation',
    description: 'Sets a density context (compact / regular / roomy) for standardised spacing and typography.',
    props: [
      { name: 'density', type: '"compact" | "regular" | "roomy" | "auto"', default: '"regular"', description: 'Density level' },
      { name: 'compactBelow', type: 'number', description: 'Container width below which density = compact (auto mode)' },
      { name: 'roomyAbove', type: 'number', description: 'Container width above which density = roomy (auto mode)' },
      { name: 'tokens', type: 'Partial<DensityTokens>', description: 'Override individual density tokens' },
    ],
    notes: ['Sets --fabkit-density-* CSS vars on its root element.'],
    examples: [`<DensityProvider density="auto" compactBelow={560} roomyAbove={960}>
  <App />
</DensityProvider>`],
    tags: ['density', 'spacing', 'compact', 'roomy', 'tokens'],
  },
  {
    name: 'Separator',
    category: 'content',
    description: 'Horizontal or vertical divider line with optional label.',
    props: [
      { name: 'label', type: 'string', description: 'Optional label in the centre of the separator' },
      { name: 'vertical', type: 'boolean', description: 'Render as vertical separator' },
    ],
    notes: [],
    examples: [`<Separator label="or" />`, `<Separator vertical />`],
    tags: ['separator', 'divider', 'hr', 'line'],
  },
];

// ── Icon list (sampled subset for search; full list has 1514 icons) ───────────
// For brevity we embed the naming convention. The search function generates
// plausible names based on the Phosphor icon set pattern.

const ICON_PREFIXES = [
  'Arrow', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'ArrowCircleUp', 'ArrowCircleDown', 'ArrowCircleLeft', 'ArrowCircleRight',
  'ArrowBendUpLeft', 'ArrowBendUpRight', 'ArrowsClockwise', 'ArrowsCounterClockwise',
  'House', 'HouseLine', 'HouseSimple',
  'MagnifyingGlass', 'MagnifyingGlassPlus', 'MagnifyingGlassMinus',
  'Bell', 'BellRinging', 'BellSlash',
  'Gear', 'GearSix', 'GearFine',
  'User', 'UserCircle', 'UserPlus', 'UserMinus', 'Users',
  'Envelope', 'EnvelopeOpen', 'EnvelopeSimple',
  'Chat', 'ChatText', 'ChatDots', 'Chats',
  'Calendar', 'CalendarBlank', 'CalendarCheck', 'CalendarPlus',
  'Folder', 'FolderOpen', 'FolderPlus', 'FolderMinus', 'FolderSimple',
  'File', 'FilePlus', 'FileMinus', 'FileText', 'FileImage', 'FilePdf',
  'Image', 'Images', 'Camera', 'CameraSlash',
  'Video', 'VideoCamera', 'VideoCameraSlash',
  'Microphone', 'MicrophoneSlash',
  'Phone', 'PhoneCall', 'PhoneSlash', 'PhonePlus',
  'Star', 'StarHalf', 'StarFour',
  'Heart', 'HeartBreak', 'HeartStraight',
  'Bookmark', 'BookmarkSimple',
  'Tag', 'TagSimple', 'TagChevron',
  'ShoppingCart', 'ShoppingBag', 'Package',
  'CreditCard', 'Money', 'Wallet', 'Bank', 'CurrencyDollar', 'CurrencyEuro',
  'ChartBar', 'ChartLine', 'ChartPie', 'ChartDonut', 'ChartScatter',
  'Table', 'Rows', 'Columns',
  'List', 'ListBullets', 'ListNumbers', 'ListChecks', 'ListDashes',
  'SquaresFour', 'GridFour', 'DotsSixVertical', 'DotsThreeVertical', 'DotsThreeOutline',
  'Plus', 'PlusCircle', 'PlusSquare',
  'Minus', 'MinusCircle', 'MinusSquare',
  'X', 'XCircle', 'XSquare',
  'Check', 'CheckCircle', 'CheckSquare', 'CheckFat', 'Checks',
  'Warning', 'WarningCircle', 'WarningDiamond', 'WarningOctagon',
  'Info', 'Question', 'Prohibit',
  'Lock', 'LockOpen', 'LockKey', 'LockSimple',
  'Shield', 'ShieldCheck', 'ShieldWarning', 'ShieldSlash',
  'Eye', 'EyeSlash', 'EyeClosed',
  'PencilSimple', 'Pencil', 'PencilLine', 'NotePencil',
  'Eraser', 'Scissors', 'Paperclip', 'Paperclips',
  'Trash', 'TrashSimple',
  'Copy', 'ClipboardText', 'Clipboard',
  'Download', 'Upload', 'DownloadSimple', 'UploadSimple',
  'CloudArrowDown', 'CloudArrowUp', 'Cloud', 'CloudCheck',
  'Link', 'LinkSimple', 'LinkBreak',
  'Globe', 'GlobeHemisphereWest', 'GlobeHemisphereEast', 'GlobeSimple',
  'Map', 'MapTrifold', 'MapPin', 'MapPinLine', 'Compass', 'Navigation',
  'Sun', 'Moon', 'Cloud', 'CloudRain', 'CloudSnow', 'CloudLightning',
  'Fire', 'Drop', 'Wind', 'Snowflake',
  'Lightning', 'LightningSlash',
  'Power', 'BatteryFull', 'BatteryHigh', 'BatteryMedium', 'BatteryLow', 'BatteryEmpty',
  'Wifi', 'WifiHigh', 'WifiMedium', 'WifiLow', 'WifiSlash',
  'Bluetooth', 'BluetoothConnected', 'BluetoothSlash',
  'Cpu', 'HardDrive', 'HardDrives', 'Memory', 'Desktop', 'Monitor', 'Phone',
  'Keyboard', 'Mouse', 'Printer', 'Scanner', 'Webcam',
  'MusicNote', 'MusicNotes', 'Headphones', 'SpeakerHigh', 'SpeakerLow', 'SpeakerSlash',
  'Play', 'Pause', 'Stop', 'SkipForward', 'SkipBack', 'Rewind', 'FastForward', 'Record',
  'Shuffle', 'Repeat', 'RepeatOnce', 'Queue',
  'Code', 'CodeBlock', 'Terminal', 'BracketsCurly', 'BracketsSquare',
  'Bug', 'GitBranch', 'GitCommit', 'GitMerge', 'GitPullRequest', 'GithubLogo', 'GitlabLogo',
  'TextT', 'TextAa', 'TextAlignLeft', 'TextAlignCenter', 'TextAlignRight', 'TextAlignJustify',
  'TextBolder', 'TextItalic', 'TextUnderline', 'TextStrikethrough', 'TextH', 'TextHOne', 'TextHTwo',
  'Crop', 'FrameCorners', 'Resize', 'Subtract', 'Intersect', 'Unite',
  'Palette', 'Swatches', 'PaintBrush', 'PaintBucket', 'Eyedropper',
  'MagicWand', 'Sparkle', 'Star', 'Confetti',
  'SortAscending', 'SortDescending',
  'Funnel', 'FunnelSimple',
  'ToggleLeft', 'ToggleRight',
  'Sliders', 'SlidersHorizontal',
  'PlugsConnected', 'Plugs', 'Plug',
  'Robot', 'Brain', 'HeadCircuit',
  'Translate', 'Flag', 'FlagCheckered', 'FlagBanner',
  'Trophy', 'Medal', 'Certificate', 'Seal', 'SealCheck',
  'Clock', 'ClockAfternoon', 'ClockCountdown', 'Timer', 'Hourglass',
  'Alarm', 'AlarmRinging',
  'Kanban', 'Trello',
  'Student', 'ChalkboardTeacher', 'GraduationCap', 'Books', 'BookOpen', 'Book',
  'Airplane', 'Car', 'Motorcycle', 'Bicycle', 'Train', 'Bus', 'Boat', 'Rocket',
  'Buildings', 'Building', 'House', 'Factory', 'Hospital', 'Church',
  'Tree', 'Plant', 'Leaf', 'Flower',
  'Dog', 'Cat', 'Bird', 'Fish', 'Horse',
  'Pizza', 'Coffee', 'BeerStein', 'Wine', 'Cookie', 'Cake',
  'FirstAid', 'Heartbeat', 'Pill', 'Syringe', 'Stethoscope',
  'HandWaving', 'HandPeace', 'HandPointing', 'HandFist', 'Hands',
  'Smiley', 'SmileyMeh', 'SmileySad', 'SmileyBlank', 'SmileyXEyes',
  'Share', 'ShareNetwork', 'Export',
  'QrCode', 'Barcode',
  'Signature', 'Stamp', 'Fingerprint',
  'IdentificationCard', 'IdentificationBadge',
  'Invoice', 'Receipt', 'ReceiptX',
  'Scroll', 'Note', 'Notepad', 'ArticleNyTimes', 'Article', 'Newspaper',
  'Archive', 'Vault', 'ArchiveBox', 'ArchiveTray',
  'SuitcaseSimple', 'Suitcase', 'Backpack',
  'Toolbox', 'Wrench', 'Hammer', 'Screwdriver',
  'AirplaneTilt', 'AirplaneLanding', 'AirplaneTakeoff',
  'AppStoreLogo', 'AndroidLogo', 'AppleLogo', 'WindowsLogo', 'LinuxLogo',
  'FacebookLogo', 'InstagramLogo', 'TwitterLogo', 'LinkedinLogo', 'TiktokLogo',
  'YoutubeLogo', 'SpotifyLogo', 'SlackLogo', 'DiscordLogo', 'TelegramLogo',
  'GoogleLogo', 'GooglePlayLogo', 'ChromeLogo', 'FirefoxLogo', 'SafariLogo',
  'GithubLogo', 'GitlabLogo', 'StackOverflowLogo',
  'FigmaLogo', 'FramerLogo', 'SketchLogo',
  'MicrosoftWordLogo', 'MicrosoftExcelLogo', 'MicrosoftPowerpointLogo',
  'NotionLogo', 'TrelloLogo', 'AsanaLogo',
];

export const ALL_ICONS: string[] = ICON_PREFIXES.map(n => `Ph${n}`);

// ── Theming documentation ─────────────────────────────────────────────────────

const THEMING_DOC = `# Fabkit Theming

## initTheme(userTheme?)

Must be called inside \`onMount\` — it accesses document which does not exist during SSR.

\`\`\`svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { onMount } from 'svelte';
  import { initTheme } from 'fabkit';
  onMount(() => initTheme({ colors: { primary: '#6366f1' } }));
</script>
\`\`\`

### PartialBrandTheme interface

\`\`\`ts
{
  fonts?: {
    primary?: string;    // CSS font-family (default system-ui)
    secondary?: string;  // fallback to primary
    mono?: string;       // monospace
  };
  dimensions?: {
    borderRadius?: number;  // px, default 12
    spacing?: number;       // base unit, px, default 8
    fontSize?: number;      // root size, px, default 15
  };
  colors?: {
    primary?: string;           // hex, default #2196F3
    primaryHover?: string;      // auto-derived if omitted
    primaryActive?: string;     // auto-derived if omitted
    primaryDisabled?: string;   // auto-derived if omitted
    secondary?: string;
    secondaryHover?: string;
    secondaryActive?: string;
    secondaryDisabled?: string;
  };
}
\`\`\`

## CSS Variables

### Background
| Variable | Light | Dark |
|---|---|---|
| --background-base | #ffffff | #202020 |
| --background-elevated | #f5f5f5 | #353535 |
| --background-elevated-2 | #e7e7e7 | #272727 |
| --background-top | #d8d8d8 | #424242 |
| --background-translucent | rgba(255,255,255,0.65) | rgba(36,36,36,0.65) |

### Text
| Variable | Light | Dark |
|---|---|---|
| --text-primary | #000000 | #ffffff |
| --text-secondary | #666666 | #cccccc |
| --text-primary-alt | #ffffff | #000000 |

### Borders
| Variable | Light | Dark |
|---|---|---|
| --border-primary | #e4e4e4 | #3c3c3c |
| --border-secondary | #f8f8f8 | #2c2c2c |
| --border-tertiary | #c7c7c7 | #4c4c4c |

### Shadows
| Variable | Description |
|---|---|
| --shadow-base | none |
| --shadow-elevated | 0 2px 4px rgba(0,0,0,0.1) |
| --shadow-top | 0 0 10px rgba(0,0,0,0.2) |

### Actions
| Variable | Description |
|---|---|
| --action-suggested | brand primary |
| --action-suggested-hover | brand primaryHover |
| --action-destructive | #dc3545 |
| --action-destructive-hover | #bd2130 |

### Dimensions
| Variable | Description |
|---|---|
| --snt-border-radius | From dimensions.borderRadius |

## Dark Mode

\`\`\`js
// Toggle dark mode
document.documentElement.classList.toggle('dark', isDark);
document.body.classList.toggle('dark', isDark);
// Re-apply theme vars
import('fabkit').then(({ initTheme }) => initTheme());
\`\`\`

## SvelteKit Vite SSR config

\`\`\`js
// vite.config.js
export default {
  plugins: [sveltekit()],
  ssr: { noExternal: ['fabkit'] }
};
\`\`\`

## generateColorVariants(hex)

\`\`\`js
import { generateColorVariants } from 'fabkit';
const v = generateColorVariants('#6366f1');
// { hover: '#4b4ed4', active: '#2e3097', disabled: '#9596c5' }
\`\`\`
`;

// ── Export ────────────────────────────────────────────────────────────────────

export const KNOWLEDGE_BASE: KnowledgeBase = {
  components: COMPONENTS,
  icons: ALL_ICONS,
  themingDoc: THEMING_DOC,
};
