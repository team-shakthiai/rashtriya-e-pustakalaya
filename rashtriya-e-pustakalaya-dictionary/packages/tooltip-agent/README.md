# tooltip-agent

Modular **Tooltip Knowledge Agent** for digital readers. Shows definitions and contextual explanations on **hover** over words, with an optional **Learn More** panel. All content comes from a **pre-built multilingual JSON** knowledge store (no LLM).

## Features

- **Hover-first**: Tooltip appears after a short delay when hovering over a word
- **6 languages**: Content retrieved from JSON by language (en, hi, bn, ta, te, mr)
- **Standard tooltip**: Word, definition, contextual explanation, Save / Language / Learn More, feedback (👍/👎)
- **Expanded panel**: Full concept (detailed explanation, example, related terms)
- **Save & feedback**: LocalStorage (or pluggable API) for saved concepts and thumbs up/down
- **Portable**: Use in any React reader app; no changes to your content DOM required beyond wrapping with the provider

## Install

```bash
npm install tooltip-agent
```

Peer dependencies: `react` and `react-dom` ^18.0.0.

## Quick start

1. **Prepare your knowledge JSON**  
   Use the schema in `docs/tooltip-knowledge.schema.json` (in the repo that ships this package or in your app). Root keys are concept keys (e.g. `transformer`, `democracy`); each value is an object keyed by language code (`en`, `hi`, `bn`, `ta`, `te`, `mr`), each containing `definition`, `contextual_explanation`, and optionally `detailed_explanation`, `example`, `related_concepts`.

2. **Wrap your reader with the provider and mount the controller**

```jsx
import { TooltipAgentProvider, TooltipController } from 'tooltip-agent'
import 'tooltip-agent/styles.css'

function ReaderLayout() {
  const readerRef = useRef(null)
  const knowledgeSource = '/path/to/knowledge.json' // or an object

  return (
    <TooltipAgentProvider
      knowledgeSource={knowledgeSource}
      containerRef={readerRef}
    >
      <div ref={readerRef} className="reader-content">
        {/* Your reader content (HTML text, etc.) */}
      </div>
      <TooltipController />
    </TooltipAgentProvider>
  )
}
```

3. **Optional**: Override styles with CSS variables (see below).

## API

### `TooltipAgentProvider`

| Prop | Type | Description |
|------|------|-------------|
| `knowledgeSource` | `string \| object` | URL to JSON or in-memory object (multilingual by concept + language). |
| `containerRef` | `React.RefObject<HTMLElement>` | Ref to the reader DOM node; hover is detected inside this container. |
| `hoverDelayMs` | `number` | Delay before showing tooltip (default 300). |
| `storagePrefix` | `string` | Prefix for LocalStorage keys (default `'tooltip-agent'`). |

### `useTooltipAgent()`

Returns:

- `open`, `panelExpanded`, `word`, `sentence`, `concept`, `position`, `loading`, `error`
- `language`, `setLanguage(code)`, `languages`, `languageLabels`
- `openTooltip(input)`, `closeTooltip()`, `openLearnMore()`, `closePanel()`
- `lookup(word, lang?)`
- `saveConcept(id, payload)`, `unsaveConcept(id)`, `isSaved(id)`
- `submitFeedback(conceptId, helpful)`, `hasVoted(conceptId)`

### JSON shape (minimal)

```json
{
  "wordkey": {
    "en": {
      "definition": "Short definition.",
      "contextual_explanation": "Meaning in context."
    },
    "hi": { ... },
    "bn": { ... },
    "ta": { ... },
    "te": { ... },
    "mr": { ... }
  }
}
```

Optional per language: `detailed_explanation`, `example`, `related_concepts` (array of strings).

## Theming

Use CSS variables on a parent (e.g. `:root` or `.reader-content`):

- `--ta-bg`, `--ta-text`, `--ta-muted`, `--ta-border`, `--ta-shadow`, `--ta-radius`
- `--ta-word-color`, `--ta-accent`, `--ta-btn-bg`, `--ta-btn-hover`, `--ta-font`, `--ta-font-size`
- `--ta-error`, `--ta-tag-bg`

## License

MIT
