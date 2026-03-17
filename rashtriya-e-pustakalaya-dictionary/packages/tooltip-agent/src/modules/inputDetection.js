/**
 * Input Detection Module
 * Primary: hover over word (debounced). Optional: selection.
 * Emits word + sentence + clientRect for tooltip positioning.
 */

import { normalizeKey } from './knowledgeRetrieval.js'

const DEFAULT_DELAY_MS = 300
const WORD_BOUNDARY = /[^\w\u0900-\u0DFF\u0E00-\u0FFF'-]+/i
const SENTENCE_END = /[.!?]\s+/

/**
 * Get the word at a given point in the document (for hover)
 * @param {Document} doc
 * @param {number} x
 * @param {number} y
 * @returns {{ word: string, sentence: string, rect: DOMRect } | null}
 */
function getWordAtPoint(doc, x, y) {
  let range = null
  if (typeof doc.caretRangeFromPoint === 'function') {
    range = doc.caretRangeFromPoint(x, y)
  } else if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(x, y)
    if (!pos) return null
    range = doc.createRange()
    range.setStart(pos.offsetNode, pos.offset)
    range.collapse(true)
  }
  if (!range) return null
  return expandToWordAndSentence(range)
}

/**
 * Expand range to word boundaries by scanning text, then to sentence; get rect from word range
 */
function expandToWordAndSentence(range) {
  try {
    const container = range.startContainer
    let text = ''
    let offset = 0
    if (container.nodeType === Node.TEXT_NODE) {
      text = container.textContent || ''
      offset = range.startOffset
    } else {
      const textNode = range.startContainer.childNodes[range.startOffset] || range.startContainer.firstChild
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        text = textNode.textContent || ''
        offset = 0
      } else {
        text = (range.startContainer.textContent || '').slice(0, 500)
        offset = 0
      }
    }
    const { word, start: wordStart, end: wordEnd } = getWordAtOffset(text, offset)
    if (!word) return null
    const sentence = getSentenceAround(text, wordStart, wordEnd)
    const doc = range.startContainer.ownerDocument
    const wordRange = doc.createRange()
    wordRange.setStart(container, wordStart)
    wordRange.setEnd(container, wordEnd)
    const rect = wordRange.getBoundingClientRect()
    return { word, sentence: sentence || word, rect }
  } catch {
    return null
  }
}

function getWordAtOffset(text, offset) {
  let start = offset
  let end = offset
  while (start > 0 && !WORD_BOUNDARY.test(text[start - 1])) start--
  while (end < text.length && !WORD_BOUNDARY.test(text[end])) end++
  const word = text.slice(start, end).trim()
  return { word, start, end }
}

function getSentenceAround(text, wordStart, wordEnd) {
  let start = wordStart
  let end = wordEnd
  while (start > 0 && !SENTENCE_END.test(text.slice(Math.max(0, start - 2), start + 1))) start--
  while (end < text.length && !SENTENCE_END.test(text.slice(end - 1, end + 2))) end++
  return text.slice(start, end).trim() || text.slice(wordStart, wordEnd).trim()
}

/**
 * Create hover-based input detection for a container
 * @param {HTMLElement} container
 * @param {Object} options
 * @param {number} [options.hoverDelayMs]
 * @param {function({ word: string, sentence: string, clientRect: DOMRect }): void} options.onWord
 * @param {function(): void} [options.onDismiss]
 */
export function createHoverDetection(container, options) {
  const delayMs = options.hoverDelayMs ?? DEFAULT_DELAY_MS
  const onWord = options.onWord
  const onDismiss = options.onDismiss
  if (!container || typeof onWord !== 'function') return () => {}

  let timeoutId = null
  let lastKey = null

  function clearPending() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  function handleMouseMove(e) {
    clearPending()
    timeoutId = setTimeout(() => {
      timeoutId = null
      const doc = container.ownerDocument
      const result = getWordAtPoint(doc, e.clientX, e.clientY)
      if (!result) {
        if (onDismiss) onDismiss()
        lastKey = null
        return
      }
      const key = normalizeKey(result.word)
      if (key === lastKey) return
      lastKey = key
      onWord({
        word: result.word,
        sentence: result.sentence,
        clientRect: result.rect,
      })
    }, delayMs)
  }

  function handleMouseLeave() {
    clearPending()
    lastKey = null
    if (onDismiss) onDismiss()
  }

  container.addEventListener('mousemove', handleMouseMove, { passive: true })
  container.addEventListener('mouseleave', handleMouseLeave)

  return function unsubscribe() {
    clearPending()
    container.removeEventListener('mousemove', handleMouseMove)
    container.removeEventListener('mouseleave', handleMouseLeave)
  }
}

/**
 * Get current selection as word + sentence (optional trigger)
 * @param {Document} doc
 * @returns {{ word: string, sentence: string, clientRect: DOMRect } | null}
 */
export function getSelectionWord(doc = document) {
  const sel = doc.getSelection()
  if (!sel || sel.rangeCount === 0) return null
  const range = sel.getRangeAt(0)
  const word = sel.toString().trim()
  if (!word) return null
  const words = word.split(/\s+/)
  const firstWord = words[0] || word
  let sentence = word
  try {
    range.expand('sentence')
    sentence = range.toString().trim() || sentence
  } catch {}
  const rect = range.getBoundingClientRect()
  return { word: firstWord, sentence, clientRect: rect }
}
