import { useState, useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

const RENDER_SCALE = 1.5 // Lower than 2.0 for faster paint; still crisp enough for reading

/** Normalize word for matching knowledge keys (must match tooltip-agent normalizeKey) */
function normalizeKey(word) {
  if (typeof word !== 'string') return ''
  return word.trim().toLowerCase().replace(/[^\w\s-]/g, '')
}

/**
 * Renders a single PDF page via PDF.js (canvas) with an invisible text layer
 * for selection and tooltip hover. Optional keywordKeys highlights known terms.
 */
export default function PdfPage({ pdfDoc, pageNumber, scale = 1.5, isAutoFit = true, minLoadHeight = 200, keywordKeys = [] }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const textLayerRef = useRef(null)
  const textLayerInstanceRef = useRef(null)
  const [page, setPage] = useState(null)
  const [baseViewport, setBaseViewport] = useState(null)
  const [autoFitScale, setAutoFitScale] = useState(1)

  // Auto-fit: scale to container width
  useEffect(() => {
    if (!isAutoFit || !baseViewport || !containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 0 && baseViewport.width > 0) setAutoFitScale(w / baseViewport.width)
      }
    })
    const parent = containerRef.current.parentElement
    if (parent) observer.observe(parent)
    return () => observer.disconnect()
  }, [isAutoFit, baseViewport])

  // Load page
  useEffect(() => {
    if (!pdfDoc || !containerRef.current) return
    let mounted = true
    pdfDoc.getPage(pageNumber).then((p) => {
      if (!mounted) return
      setPage(p)
      const vp = p.getViewport({ scale: RENDER_SCALE })
      setBaseViewport(vp)
    }).catch((err) => {
      console.error('PdfPage getPage error:', err)
    })
    return () => { mounted = false }
  }, [pdfDoc, pageNumber])

  // Render to canvas (offscreen first to avoid black flicker when resizing)
  useEffect(() => {
    if (!page || !baseViewport || !canvasRef.current) return
    let cancelled = false
    const viewport = page.getViewport({ scale: RENDER_SCALE })
    const offscreen = document.createElement('canvas')
    offscreen.width = viewport.width
    offscreen.height = viewport.height
    const offCtx = offscreen.getContext('2d', { alpha: false })
    const task = page.render({ canvasContext: offCtx, viewport })
    task.promise
      .then(() => {
        if (cancelled) return
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d', { alpha: false })
        ctx.drawImage(offscreen, 0, 0)
        canvas.style.width = ''
        canvas.style.height = ''
      })
      .catch((err) => {
        if (err?.name !== 'RenderingCancelledException') console.error('PDF render error:', err)
      })
    return () => {
      cancelled = true
      task.cancel()
    }
  }, [page, baseViewport])

  // Text layer: use same viewport as canvas. Size container to match canvas exactly (no extra transform).
  // PDF.js positions spans as % of container; container must be viewport.width x viewport.height.
  useEffect(() => {
    if (!page || !baseViewport || !textLayerRef.current) return
    const viewport = page.getViewport({ scale: RENDER_SCALE })
    const w = viewport.width
    const h = viewport.height
    let cancelled = false
    page.getTextContent().then((textContent) => {
      if (cancelled) return
      if (textLayerInstanceRef.current) {
        textLayerInstanceRef.current.cancel()
        textLayerInstanceRef.current = null
      }
      const container = textLayerRef.current
      if (!container) return
      container.replaceChildren()
      container.style.setProperty('--total-scale-factor', String(viewport.scale))
      container.style.width = `${w}px`
      container.style.height = `${h}px`
      container.style.transform = ''
      container.style.transformOrigin = ''
      const textLayer = new pdfjsLib.TextLayer({
        textContentSource: textContent,
        container,
        viewport,
      })
      textLayerInstanceRef.current = textLayer
      const keywordSet = keywordKeys.length ? (() => {
        const set = new Set()
        keywordKeys.forEach((k) => {
          const n = normalizeKey(k)
          if (n) set.add(n)
          const alt = n.replace(/\s+/g, '_')
          if (alt) set.add(alt)
          const alt2 = n.replace(/_/g, ' ')
          if (alt2) set.add(alt2)
        })
        return set
      })() : null
      textLayer.render().then(() => {
        if (cancelled) return
        container.style.width = `${w}px`
        container.style.height = `${h}px`
        if (keywordSet && container) {
          container.querySelectorAll('span').forEach((span) => {
            const key = normalizeKey(span.textContent || '')
            if (!key) return
            if (keywordSet.has(key) || keywordSet.has(key.replace(/\s+/g, '_'))) span.classList.add('pdf-page__keyword')
          })
        }
      }).catch((err) => {
        if (err?.name !== 'RenderingCancelledException') console.error('TextLayer render error:', err)
      })
    }).catch((err) => {
      console.error('getTextContent error:', err)
    })
    return () => {
      cancelled = true
      if (textLayerInstanceRef.current) {
        textLayerInstanceRef.current.cancel()
        textLayerInstanceRef.current = null
      }
      const container = textLayerRef.current
      if (container) container.replaceChildren()
    }
  }, [page, baseViewport])

  if (!baseViewport) {
    return (
      <div ref={containerRef} className="pdf-page pdf-page--loading" style={{ minHeight: minLoadHeight }}>
        <span className="pdf-page__loading-text">Loading page…</span>
      </div>
    )
  }

  let currentScale = scale / RENDER_SCALE
  if (isAutoFit) currentScale = autoFitScale
  const width = baseViewport.width * currentScale
  const height = baseViewport.height * currentScale

  return (
    <div
      ref={containerRef}
      className="pdf-page"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        flexShrink: 0,
      }}
    >
      <div
        className="pdf-page__inner"
        style={{
          transform: `scale(${currentScale})`,
          transformOrigin: 'top left',
          width: `${baseViewport.width}px`,
          height: `${baseViewport.height}px`,
        }}
      >
        <canvas
          ref={canvasRef}
          className="pdf-page__canvas"
          style={{ display: 'block', background: 'var(--color-card-bg)' }}
          aria-label={`Page ${pageNumber}`}
        />
        <div
          ref={textLayerRef}
          className="pdf-page__text-layer textLayer"
          style={{
            ['--total-scale-factor']: RENDER_SCALE,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
