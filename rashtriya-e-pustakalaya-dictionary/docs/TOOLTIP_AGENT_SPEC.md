# Tooltip Knowledge Agent — System Specification

**Version:** 1.1  
**Status:** Design specification  
**Constraint:** No LLM; all content from a pre-built JSON knowledge dataset.

---

## 1. Executive Summary

The **Tooltip Knowledge Agent** is a client-side subsystem for an interactive digital reader. It shows quick explanations **primarily on hover** over a word, with an optional expanded "Learn More" panel. All content is served from a **pre-built multilingual JSON** knowledge store (6 languages). It is fast (&lt;200ms), modular, and keeps a clear separation between input detection, knowledge retrieval, and UI.

---

## 2. Interaction Model

- **Primary trigger:** **Hover** over a word (with a short delay, e.g. 300ms, to avoid flicker).
- **Secondary (optional):** Selection can also trigger the same tooltip for accessibility.
- **Language:** User picks one of **6 languages**; content is **retrieved from JSON** in that language (no translation API for tooltip content).
- **Audio:** Text-to-speech via an **external TTS API** (future); not stored in JSON.

---

## 3. UI Layers

### 3.1 Standard Tooltip (default, on hover)

- **Word header** — selected word
- **Definition** — short definition (from JSON, in chosen language)
- **Contextual explanation** — meaning in the current sentence
- **Actions:** Save, Translate (change language), Learn More
- **Feedback:** 👍 Helpful / 👎 Not Helpful

### 3.2 Expanded Concept Panel (Learn More)

- **Concept header** — word
- **Definition** — expanded (chosen language)
- **Contextual explanation**
- **Detailed explanation**
- **Example**
- **Related concepts** (list)
- **Actions:** Save, Translate (change language), Audio (TTS via API, future)

---

## 4. Knowledge Source — JSON Schema

All tooltip data is stored in a single JSON file (or API returning JSON). Each **concept** is keyed by a **normalized word** (e.g. lowercase, no punctuation). Each concept has **one object per language**; the **6 languages** are fixed in the schema.

### 4.1 Supported languages (codes)

Use these **language codes** as keys inside each concept. The app lets the user pick one; retrieval returns the object for that code.

| Code | Language (example label) |
|------|---------------------------|
| `en` | English |
| `hi` | Hindi (हिंदी) |
| `bn` | Bangla (বাংলা) |
| `ta` | Tamil (தமிழ்) |
| `te` | Telugu (తెలుగు) |
| `mr` | Marathi (मराठी) |

You can rename labels in the UI; the schema only requires these **keys** for each concept.

### 4.2 Root structure

The JSON root is an **object**. Each **key** is a **concept key** (the word/phrase used for lookup, e.g. `transformer`, `democracy`). The **value** is the **multilingual concept**: an object whose keys are language codes (`en`, `hi`, `bn`, `ta`, `te`, `mr`) and whose values are **concept entries** (definition, contextual_explanation, etc.).

```json
{
  "<concept_key_1>": {
    "en": { "<concept_entry>" },
    "hi": { "<concept_entry>" },
    "bn": { "<concept_entry>" },
    "ta": { "<concept_entry>" },
    "te": { "<concept_entry>" },
    "mr": { "<concept_entry>" }
  },
  "<concept_key_2>": { ... }
}
```

### 4.3 Concept entry (per language)

Each language block inside a concept has the same shape. All fields are **strings** except `related_concepts`, which is an **array of strings**.

| Field | Required | Description |
|-------|----------|-------------|
| `definition` | Yes | Short dictionary-style definition. |
| `contextual_explanation` | Yes | Short explanation of the word in context. |
| `detailed_explanation` | No | Longer conceptual explanation (for Expanded Panel). |
| `example` | No | Example sentence or real-world usage. |
| `related_concepts` | No | Array of related term strings (e.g. `["self attention", "bert", "gpt"]`). |

### 4.4 Example JSON (one concept, two languages shown)

```json
{
  "transformer": {
    "en": {
      "definition": "A model architecture that uses self-attention to process sequences.",
      "contextual_explanation": "Here it refers to the Transformer model used in natural language processing.",
      "detailed_explanation": "The Transformer architecture, introduced in 'Attention Is All You Need', relies entirely on self-attention mechanisms without recurrence. It underpins models like BERT and GPT.",
      "example": "BERT and GPT are based on the Transformer architecture.",
      "related_concepts": ["self attention", "bert", "gpt"]
    },
    "hi": {
      "definition": "एक मॉडल आर्किटेक्चर जो अनुक्रमों को संसाधित करने के लिए स्व-ध्यान का उपयोग करता है।",
      "contextual_explanation": "यहाँ यह प्राकृतिक भाषा प्रसंस्करण में उपयोग किए जाने वाले ट्रांसफॉर्मर मॉडल को संदर्भित करता है।",
      "detailed_explanation": "ट्रांसफॉर्मर आर्किटेक्चर...",
      "example": "BERT और GPT ट्रांसफॉर्मर आर्किटेक्चर पर आधारित हैं।",
      "related_concepts": ["स्व-ध्यान", "bert", "gpt"]
    },
    "bn": { ... },
    "ta": { ... },
    "te": { ... },
    "mr": { ... }
  },
  "democracy": {
    "en": { ... },
    "hi": { ... },
    "bn": { ... },
    "ta": { ... },
    "te": { ... },
    "mr": { ... }
  }
}
```

### 4.5 Lookup rules

- **Concept key:** Normalize the hovered/selected word (e.g. lowercase, trim). Use it as the key into the root object.
- **Language:** Use the **user-selected language** (stored in context/LocalStorage). Read the object under `concept[language]`.
- **Missing concept:** If the key is not in the JSON, return null (show "No definition" or hide tooltip).
- **Missing language:** If the concept exists but not for the chosen language, fall back to `en` or show "Not available in this language."

---

## 5. JSON Schema (machine-readable)

Below is a **JSON Schema** (draft-07) you can use to validate your knowledge file or generate types. Save it as `tooltip-knowledge.schema.json` and point your editor/validator at it.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/tooltip-knowledge.json",
  "title": "Tooltip Knowledge Database",
  "description": "Multilingual concept entries for the Tooltip Knowledge Agent. Keys are concept keys (e.g. word); values are objects keyed by language code.",
  "type": "object",
  "additionalProperties": {
    "$ref": "#/$defs/MultilingualConcept"
  },
  "$defs": {
    "MultilingualConcept": {
      "type": "object",
      "description": "One concept in up to 6 languages",
      "properties": {
        "en": { "$ref": "#/$defs/ConceptEntry" },
        "hi": { "$ref": "#/$defs/ConceptEntry" },
        "bn": { "$ref": "#/$defs/ConceptEntry" },
        "ta": { "$ref": "#/$defs/ConceptEntry" },
        "te": { "$ref": "#/$defs/ConceptEntry" },
        "mr": { "$ref": "#/$defs/ConceptEntry" }
      },
      "additionalProperties": false,
      "minProperties": 1
    },
    "ConceptEntry": {
      "type": "object",
      "description": "Concept content for one language",
      "required": ["definition", "contextual_explanation"],
      "properties": {
        "definition": { "type": "string" },
        "contextual_explanation": { "type": "string" },
        "detailed_explanation": { "type": "string" },
        "example": { "type": "string" },
        "related_concepts": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "additionalProperties": false
    }
  }
}
```

If you prefer to allow extra languages later, change `additionalProperties` in `MultilingualConcept` to `true` or add more language codes to `properties`.

---

## 6. Module Summary (aligned with spec)

| Module | Responsibility |
|--------|----------------|
| **Input Detection** | Detect **hover** (primary) and optional selection; emit word + sentence + clientRect. |
| **Knowledge Retrieval** | Load/cache JSON; lookup by **concept key** and **language**; return `ConceptEntry` for that language. |
| **Language Selection** | Store selected language (one of 6); show language picker; no translation API — content from JSON. |
| **Tooltip Renderer** | Render Standard Tooltip (word, definition, contextual explanation, actions, feedback). |
| **Expanded Panel Renderer** | Render Learn More panel (full concept in chosen language, related concepts, actions). |
| **Save Manager** | Persist saved concepts (LocalStorage or API). |
| **Feedback Manager** | Persist 👍/👎 (LocalStorage or API). |
| **Audio (TTS)** | Future: send current text to TTS API and play; not in JSON. |

---

## 7. Data Flow (summary)

1. User **hovers** word → Input Detection emits word + sentence + position.
2. Controller calls Knowledge Retrieval with **word** and **current language** → returns `ConceptEntry` from JSON.
3. Tooltip Renderer shows definition + contextual explanation in chosen language.
4. User clicks **Learn More** → Expanded Panel shows full concept (same language).
5. User changes **language** in picker → stored language updates; same concept re-fetched in new language → UI updates.
6. Save / Feedback / Audio (TTS) as in previous spec.

---

## 8. References

- Portable reader-dictionary library plan: `portable_context-aware_dictionary_library` (packages/reader-dictionary).
- JSON Schema file: `docs/tooltip-knowledge.schema.json`.
