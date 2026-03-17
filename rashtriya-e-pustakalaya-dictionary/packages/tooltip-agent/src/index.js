/**
 * Tooltip Agent - Modular tooltip knowledge engine for digital readers.
 * @see docs/TOOLTIP_AGENT_SPEC.md
 */

import './styles/tooltip.css'
import './styles/expandedPanel.css'

export { TooltipAgentProvider, useTooltipAgent } from './context/TooltipAgentContext.jsx'
export { TooltipController } from './components/TooltipController.jsx'
export { TooltipRenderer } from './components/TooltipRenderer.jsx'
export { ExpandedPanelRenderer } from './components/ExpandedPanelRenderer.jsx'

export { loadKnowledge, getConcept, normalizeKey } from './modules/knowledgeRetrieval.js'
export { createHoverDetection, getSelectionWord } from './modules/inputDetection.js'
export { createSaveManager } from './modules/saveManager.js'
export { createFeedbackManager } from './modules/feedbackManager.js'
export { createLanguageSelection } from './modules/languageSelection.js'

export { LANGUAGE_CODES, LANGUAGE_LABELS, DEFAULT_LANGUAGE, HOVER_DELAY_MS } from './constants.js'
