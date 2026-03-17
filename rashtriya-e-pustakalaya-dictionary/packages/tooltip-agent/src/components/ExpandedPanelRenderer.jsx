import { createPortal } from 'react-dom'
import { useTooltipAgent } from '../context/TooltipAgentContext.jsx'

export function ExpandedPanelRenderer() {
  const {
    panelExpanded,
    word,
    concept,
    language,
    languageLabels,
    setLanguage,
    closePanel,
    saveConcept,
    unsaveConcept,
    isSaved,
    languages,
  } = useTooltipAgent()

  if (!panelExpanded) return null

  const conceptId = word ? word.trim().toLowerCase() : ''
  const saved = conceptId && isSaved(conceptId)

  const content = (
    <>
      <div className="ta-panel__backdrop" onClick={closePanel} aria-hidden />
      <aside className="ta-panel" role="dialog" aria-label={`Concept: ${word}`}>
        <div className="ta-panel__header">
          <span className="ta-panel__word">{word}</span>
          <button type="button" className="ta-panel__close" onClick={closePanel} aria-label="Close">
            ×
          </button>
        </div>
        <div className="ta-panel__body">
          {concept && (
            <>
              <section className="ta-panel__section">
                <div className="ta-panel__section-title">Definition</div>
                <div className="ta-panel__definition">{concept.definition}</div>
              </section>
              <section className="ta-panel__section">
                <div className="ta-panel__section-title">In context</div>
                <div className="ta-panel__context">{concept.contextual_explanation}</div>
              </section>
              {concept.detailed_explanation && (
                <section className="ta-panel__section">
                  <div className="ta-panel__section-title">Detailed</div>
                  <div className="ta-panel__detailed">{concept.detailed_explanation}</div>
                </section>
              )}
              {concept.example && (
                <section className="ta-panel__section">
                  <div className="ta-panel__section-title">Example</div>
                  <div className="ta-panel__example">{concept.example}</div>
                </section>
              )}
              {concept.related_concepts && concept.related_concepts.length > 0 && (
                <section className="ta-panel__section">
                  <div className="ta-panel__section-title">Related</div>
                  <ul className="ta-panel__related">
                    {concept.related_concepts.map((term, i) => (
                      <li key={i}>{term}</li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
        <div className="ta-panel__actions">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ta-panel__btn"
            aria-label="Language"
          >
            {languages.map((code) => (
              <option key={code} value={code}>{languageLabels[code] ?? code}</option>
            ))}
          </select>
          <button
            type="button"
            className="ta-panel__btn"
            onClick={() => {
              if (saved) unsaveConcept(conceptId)
              else if (concept) saveConcept(conceptId, { word, ...concept })
            }}
          >
            {saved ? 'Unsave' : 'Save'}
          </button>
          <button type="button" className="ta-panel__btn" disabled aria-label="Audio (coming soon)">
            Audio
          </button>
        </div>
      </aside>
    </>
  )

  return createPortal(content, document.body)
}
