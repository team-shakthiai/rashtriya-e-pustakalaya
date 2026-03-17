import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTooltipAgent } from '../context/TooltipAgentContext.jsx'

const FALLBACK_TOP_OFFSET = 8

function positionTooltip(rect, el, viewport) {
  if (!el || !rect) return
  const pad = 8
  let top = rect.bottom + pad
  let left = rect.left + (rect.width / 2) - (el.offsetWidth / 2)
  if (top + el.offsetHeight > viewport.height - pad) top = rect.top - el.offsetHeight - pad
  if (top < pad) top = pad
  if (left < pad) left = pad
  if (left + el.offsetWidth > viewport.width - pad) left = viewport.width - el.offsetWidth - pad
  el.style.top = `${top}px`
  el.style.left = `${left}px`
}

export function TooltipRenderer() {
  const {
    open,
    word,
    concept,
    position,
    loading,
    language,
    languageLabels,
    setLanguage,
    openLearnMore,
    closeTooltip,
    cancelPendingClose,
    scheduleTooltipClose,
    setTooltipHovered,
    saveConcept,
    unsaveConcept,
    isSaved,
    submitFeedback,
    removeFeedback,
    getFeedbackForConcept,
    lookup,
    languages,
  } = useTooltipAgent()
  const boxRef = useRef(null)

  // Derive displayed concept from current language so the default tooltip updates when language changes
  const displayConcept = useMemo(
    () => (word && language ? lookup(word, language) : concept) ?? concept,
    [word, language, lookup, concept]
  )

  useEffect(() => {
    if (!open || !boxRef.current || !position) return
    const rect = position instanceof DOMRect ? position : { top: 0, left: 0, width: 0, height: 0, bottom: 0 }
    positionTooltip(rect, boxRef.current, { width: window.innerWidth, height: window.innerHeight })
  }, [open, position])

  if (!open) return null

  const conceptId = word ? word.trim().toLowerCase() : ''
  const saved = conceptId && isSaved(conceptId)
  const feedbackEntry = conceptId ? getFeedbackForConcept(conceptId) : null
  const votedHelpful = feedbackEntry?.helpful === true
  const votedNotHelpful = feedbackEntry?.helpful === false

  const content = (
    <div
      ref={boxRef}
      className={`ta-tooltip ${loading ? 'ta-tooltip--loading' : ''} ${!displayConcept && !loading ? 'ta-tooltip--error' : ''}`}
      role="tooltip"
      aria-live="polite"
      onMouseEnter={() => {
        setTooltipHovered(true)
        cancelPendingClose()
      }}
      onMouseLeave={() => {
        setTooltipHovered(false)
        scheduleTooltipClose()
      }}
    >
      {word && <div className="ta-tooltip__word">{word}</div>}
      {loading && <div className="ta-tooltip__definition">Loading…</div>}
      {!loading && displayConcept && (
        <>
          <div className="ta-tooltip__definition">{displayConcept.definition}</div>
          <div className="ta-tooltip__context">{displayConcept.contextual_explanation}</div>
        </>
      )}
      {!loading && !displayConcept && word && (
        <div className="ta-tooltip__definition">No definition found.</div>
      )}
      <div className="ta-tooltip__actions">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="ta-tooltip__btn"
          aria-label="Language"
        >
          {languages.map((code) => (
            <option key={code} value={code}>{languageLabels[code] ?? code}</option>
          ))}
        </select>
        <button
          type="button"
          className="ta-tooltip__btn"
          onClick={() => {
            if (saved) unsaveConcept(conceptId)
            else if (displayConcept) saveConcept(conceptId, { word, ...displayConcept })
          }}
        >
          {saved ? 'Unsave' : 'Save'}
        </button>
        <button
          type="button"
          className="ta-tooltip__btn ta-tooltip__btn--primary"
          onClick={openLearnMore}
        >
          Learn More
        </button>
      </div>
      <div className="ta-tooltip__feedback ta-tooltip__feedback--thumbs">
        <button
          type="button"
          className={`ta-tooltip__thumb ${votedHelpful ? 'ta-tooltip__thumb--active ta-tooltip__thumb--helpful' : ''}`}
          aria-label={votedHelpful ? 'Undo: was helpful' : 'Helpful'}
          onClick={() => {
            if (!conceptId) return
            if (votedHelpful) removeFeedback(conceptId)
            else submitFeedback(conceptId, true)
          }}
        >
          👍
        </button>
        <button
          type="button"
          className={`ta-tooltip__thumb ${votedNotHelpful ? 'ta-tooltip__thumb--active ta-tooltip__thumb--not-helpful' : ''}`}
          aria-label={votedNotHelpful ? 'Undo: was not helpful' : 'Not helpful'}
          onClick={() => {
            if (!conceptId) return
            if (votedNotHelpful) removeFeedback(conceptId)
            else submitFeedback(conceptId, false)
          }}
        >
          👎
        </button>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
