import { createContext, useContext, useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { loadKnowledge, getConcept, findConceptPhraseInSentence } from '../modules/knowledgeRetrieval.js'
import { createHoverDetection } from '../modules/inputDetection.js'
import { createSaveManager } from '../modules/saveManager.js'
import { createFeedbackManager } from '../modules/feedbackManager.js'
import { createLanguageSelection } from '../modules/languageSelection.js'
import { LANGUAGE_CODES, LANGUAGE_LABELS, DEFAULT_LANGUAGE, HOVER_DELAY_MS } from '../constants.js'

const TooltipAgentContext = createContext(null)

export function useTooltipAgent() {
  const ctx = useContext(TooltipAgentContext)
  if (!ctx) throw new Error('TooltipAgentProvider is required')
  return ctx
}

export function TooltipAgentProvider({
  children,
  knowledgeSource,
  containerRef,
  hoverDelayMs = HOVER_DELAY_MS,
  storagePrefix = 'tooltip-agent',
}) {
  const [open, setOpen] = useState(false)
  const [panelExpanded, setPanelExpanded] = useState(false)
  const [word, setWord] = useState(null)
  const [sentence, setSentence] = useState(null)
  const [concept, setConcept] = useState(null)
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [knowledgeReady, setKnowledgeReady] = useState(false)

  const saveManager = useMemo(() => createSaveManager(`${storagePrefix}-saved`), [storagePrefix])
  const feedbackManager = useMemo(() => createFeedbackManager(`${storagePrefix}-feedback`), [storagePrefix])
  const langSelection = useMemo(() => createLanguageSelection(`${storagePrefix}-language`), [storagePrefix])
  const [language, setLanguageState] = useState(() => langSelection.getLanguage())
  const [feedbackVersion, setFeedbackVersion] = useState(0)
  const [saveVersion, setSaveVersion] = useState(0)

  const setLanguage = useCallback(
    (code) => {
      if (!LANGUAGE_CODES.includes(code)) return
      setLanguageState(code)
      langSelection.setLanguage(code)
      if (word && concept) {
        const next = getConcept(word, code)
        setConcept(next)
      }
    },
    [word, concept, langSelection]
  )

  const lookup = useCallback((w, lang = language) => {
    const entry = getConcept(w, lang)
    return entry
  }, [language])

  const openTooltip = useCallback(
    (input) => {
      if (!input || !input.word) {
        setOpen(false)
        setWord(null)
        setSentence(null)
        setConcept(null)
        setPosition(null)
        setError(null)
        return
      }
      if (panelExpanded) return
      if (!knowledgeReady) return
      let entry = getConcept(input.word, language)
      let displayWord = input.word
      if (!entry && input.sentence) {
        const phraseMatch = findConceptPhraseInSentence(input.sentence, language)
        if (phraseMatch) {
          entry = phraseMatch.entry
          displayWord = phraseMatch.phrase
        }
      }
      if (!entry) return // only show tooltip for words/phrases present in knowledge
      setWord(displayWord)
      setSentence(input.sentence || null)
      setPosition(input.clientRect || null)
      setError(null)
      setConcept(entry)
      setLoading(false)
      setOpen(true)
    },
    [language, knowledgeReady, panelExpanded]
  )

  const closeTooltip = useCallback(() => {
    setOpen(false)
    setPanelExpanded(false)
    setWord(null)
    setSentence(null)
    setConcept(null)
    setPosition(null)
    setError(null)
  }, [])

  const pendingCloseRef = useRef(null)
  const tooltipLeaveCloseRef = useRef(null)
  const isPointerOverTooltipRef = useRef(false)

  const doCloseIfNotOverTooltip = useCallback(() => {
    if (isPointerOverTooltipRef.current) return
    closeTooltip()
  }, [closeTooltip])

  const dismissWithDelay = useCallback(() => {
    if (pendingCloseRef.current) clearTimeout(pendingCloseRef.current)
    pendingCloseRef.current = setTimeout(() => {
      pendingCloseRef.current = null
      doCloseIfNotOverTooltip()
    }, 500)
  }, [doCloseIfNotOverTooltip])
  const cancelPendingClose = useCallback(() => {
    if (pendingCloseRef.current) {
      clearTimeout(pendingCloseRef.current)
      pendingCloseRef.current = null
    }
    if (tooltipLeaveCloseRef.current) {
      clearTimeout(tooltipLeaveCloseRef.current)
      tooltipLeaveCloseRef.current = null
    }
  }, [])
  const scheduleTooltipClose = useCallback(() => {
    if (tooltipLeaveCloseRef.current) clearTimeout(tooltipLeaveCloseRef.current)
    tooltipLeaveCloseRef.current = setTimeout(() => {
      tooltipLeaveCloseRef.current = null
      doCloseIfNotOverTooltip()
    }, 200)
  }, [doCloseIfNotOverTooltip])

  const setTooltipHovered = useCallback((hovered) => {
    isPointerOverTooltipRef.current = hovered
  }, [])

  const openLearnMore = useCallback(() => {
    setPanelExpanded(true)
    setOpen(false)
  }, [])

  const closePanel = useCallback(() => {
    setPanelExpanded(false)
  }, [])

  const saveConcept = useCallback(
    async (conceptId, payload) => {
      await saveManager.save(conceptId, payload)
      setSaveVersion((v) => v + 1)
    },
    [saveManager]
  )

  const unsaveConcept = useCallback(
    async (conceptId) => {
      await saveManager.unsave(conceptId)
      setSaveVersion((v) => v + 1)
    },
    [saveManager]
  )

  const submitFeedback = useCallback(
    async (conceptId, helpful) => {
      await feedbackManager.submit(conceptId, helpful)
      setFeedbackVersion((v) => v + 1)
    },
    [feedbackManager]
  )

  const removeFeedback = useCallback(
    async (conceptId) => {
      await feedbackManager.removeFeedback(conceptId)
      setFeedbackVersion((v) => v + 1)
    },
    [feedbackManager]
  )

  useEffect(() => {
    if (!knowledgeSource) return
    loadKnowledge(knowledgeSource).then(() => setKnowledgeReady(true)).catch(() => setKnowledgeReady(false))
  }, [knowledgeSource])

  useEffect(() => {
    if (!knowledgeReady || !word || !open) return
    setLoading(true)
    const entry = getConcept(word, language)
    setConcept(entry)
    setLoading(false)
  }, [knowledgeReady, language, word, open])

  const unsubscribeRef = useRef(null)
  useEffect(() => {
    if (!containerRef?.current || !knowledgeReady) return
    unsubscribeRef.current = createHoverDetection(containerRef.current, {
      hoverDelayMs,
      onWord: openTooltip,
      onDismiss: dismissWithDelay,
    })
    return () => {
      if (pendingCloseRef.current) clearTimeout(pendingCloseRef.current)
      if (tooltipLeaveCloseRef.current) clearTimeout(tooltipLeaveCloseRef.current)
      if (unsubscribeRef.current) unsubscribeRef.current()
    }
  }, [containerRef, knowledgeReady, hoverDelayMs, openTooltip, dismissWithDelay])

  const value = useMemo(
    () => ({
      open,
      panelExpanded,
      word,
      sentence,
      concept,
      position,
      loading,
      error,
      language,
      setLanguage,
      languages: LANGUAGE_CODES,
      languageLabels: LANGUAGE_LABELS,
      openTooltip,
      closeTooltip,
      cancelPendingClose,
      scheduleTooltipClose,
      setTooltipHovered,
      openLearnMore,
      closePanel,
      lookup,
      saveConcept,
      unsaveConcept,
      isSaved: saveManager.isSaved.bind(saveManager),
      submitFeedback,
      removeFeedback,
      hasVoted: feedbackManager.hasVoted.bind(feedbackManager),
      getFeedbackForConcept: (id) => feedbackManager.getFeedback()[id],
    }),
    [
      open,
      feedbackVersion,
      saveVersion,
      panelExpanded,
      word,
      sentence,
      concept,
      position,
      loading,
      error,
      language,
      setLanguage,
      openTooltip,
      closeTooltip,
      cancelPendingClose,
      scheduleTooltipClose,
      setTooltipHovered,
      openLearnMore,
      closePanel,
      lookup,
      submitFeedback,
      removeFeedback,
      saveConcept,
      unsaveConcept,
      saveManager,
      feedbackManager,
    ]
  )

  return (
    <TooltipAgentContext.Provider value={value}>
      {children}
    </TooltipAgentContext.Provider>
  )
}
