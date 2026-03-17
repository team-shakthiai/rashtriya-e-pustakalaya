import { TooltipRenderer } from './TooltipRenderer.jsx'
import { ExpandedPanelRenderer } from './ExpandedPanelRenderer.jsx'

/**
 * Renders both the standard tooltip and the expanded panel.
 * Mount this once inside TooltipAgentProvider (e.g. in the reader layout).
 */
export function TooltipController() {
  return (
    <>
      <TooltipRenderer />
      <ExpandedPanelRenderer />
    </>
  )
}
