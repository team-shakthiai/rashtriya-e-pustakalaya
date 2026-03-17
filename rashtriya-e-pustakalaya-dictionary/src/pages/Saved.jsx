import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Saved.css'

const SAVED_KEY = 'tooltip-agent-saved'
const FEEDBACK_KEY = 'tooltip-agent-feedback'

function getSavedList() {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function getFeedbackMap() {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY)
    if (!raw) return {}
    const obj = JSON.parse(raw)
    return typeof obj === 'object' && obj !== null ? obj : {}
  } catch {
    return {}
  }
}

function removeFeedbackItem(conceptId) {
  const map = getFeedbackMap()
  delete map[conceptId]
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(map))
  } catch {}
}

function removeSavedItem(id) {
  const list = getSavedList().filter((item) => item.id !== id)
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(list))
  } catch {}
}

function formatDate(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' })
}

export default function Saved() {
  const [saved, setSaved] = useState([])
  const [feedback, setFeedback] = useState({})

  const refresh = () => {
    setSaved(getSavedList())
    setFeedback(getFeedbackMap())
  }

  useEffect(() => {
    refresh()
    const onStorage = (e) => {
      if (e.key === SAVED_KEY || e.key === FEEDBACK_KEY) refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const feedbackList = Object.entries(feedback).map(([conceptId, data]) => ({
    conceptId,
    helpful: data.helpful,
    at: data.at,
  })).sort((a, b) => (b.at || 0) - (a.at || 0))

  return (
    <div className="saved-page">
      <div className="saved-page__inner">
        <h1 className="saved-page__title">Saved &amp; Feedback</h1>
        <p className="saved-page__intro">
          Keywords you saved from the reader and feedback (👍 / 👎) on tooltips.
          You can unsave keywords and remove feedback here. Data is stored in this browser only.
        </p>

        <section className="saved-section">
          <h2 className="saved-section__title">Saved keywords</h2>
          {saved.length === 0 ? (
            <p className="saved-section__empty">No saved keywords yet. Save concepts from the reader to see them here.</p>
          ) : (
            <ul className="saved-list">
              {saved.map((item) => (
                <li key={item.id} className="saved-list__item">
                  <span className="saved-list__id">{item.id}</span>
                  {item.definition && (
                    <span className="saved-list__def">{item.definition}</span>
                  )}
                  <span className="saved-list__date">Saved {formatDate(item.savedAt)}</span>
                  <button
                    type="button"
                    className="saved-list__unsave"
                    onClick={() => {
                      removeSavedItem(item.id)
                      refresh()
                    }}
                    aria-label={`Unsave ${item.id}`}
                  >
                    Unsave
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="saved-section">
          <h2 className="saved-section__title">Feedback (tooltip helpful / not helpful)</h2>
          {feedbackList.length === 0 ? (
            <p className="saved-section__empty">No feedback yet. Use 👍 / 👎 in the reader tooltip (click again to undo).</p>
          ) : (
            <ul className="feedback-list">
              {feedbackList.map(({ conceptId, helpful, at }) => (
                <li key={conceptId} className="feedback-list__item">
                  <span className="feedback-list__id">{conceptId}</span>
                  <span className={`feedback-list__vote ${helpful ? 'helpful' : 'not-helpful'}`}>
                    {helpful ? '👍 Helpful' : '👎 Not helpful'}
                  </span>
                  <span className="feedback-list__date">{formatDate(at)}</span>
                  <button
                    type="button"
                    className="feedback-list__remove"
                    onClick={() => {
                      removeFeedbackItem(conceptId)
                      refresh()
                    }}
                    aria-label={`Remove feedback for ${conceptId}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="saved-page__back">
          <Link to="/reader">Open reader</Link> to save more or give feedback on tooltips.
        </p>
      </div>
    </div>
  )
}
