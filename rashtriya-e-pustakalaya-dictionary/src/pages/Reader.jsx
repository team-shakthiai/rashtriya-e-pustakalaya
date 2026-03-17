import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import { TooltipAgentProvider, TooltipController } from 'tooltip-agent'
import PdfPage from '../components/PdfPage'
import knowledgeData from '../data/tooltip-knowledge.json'
import './Reader.css'

const DEFAULT_PDF = 'Commission Indian Pharmacopoeia.pdf'

const VIEW_MODES = {
  normal: 'normal',
  book: 'book',
}

const normalizePageForMode = (page, mode, totalPages) => {
  const clamped = Math.max(1, Math.min(totalPages || 1, page))
  if (mode !== VIEW_MODES.book) return clamped
  return clamped % 2 === 0 ? clamped - 1 : clamped
}

export default function Reader() {
  const [pdfDoc, setPdfDoc] = useState(null)
  const [numPages, setNumPages] = useState(0)
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [zoom, setZoom] = useState(1.5)
  const [isAutoFit, setIsAutoFit] = useState(true)
  const [viewMode, setViewMode] = useState(VIEW_MODES.normal)
  const [pageInput, setPageInput] = useState('1')
  const [fileName, setFileName] = useState(DEFAULT_PDF)
  const [reloadKey, setReloadKey] = useState(0)
  const [isMaximized, setIsMaximized] = useState(false)
  const [pageTransitionDir, setPageTransitionDir] = useState('next')
  const [loadError, setLoadError] = useState(null)
  const mainAreaRef = useRef(null)
  const readerPageRef = useRef(null)
  const viewportRef = useRef(null)
  const previousPageRef = useRef(1)
  const loadGenerationRef = useRef(0)
  const loadingForRef = useRef({ pdfUrl: null, reloadKey: null })

  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '') || ''
  const pdfPath = `${base ? base + '/' : ''}assets/${encodeURIComponent(fileName)}`
  const pdfUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${pdfPath.replace(/^\/+/, '')}`
    : `/${pdfPath.replace(/^\/+/, '')}`

  useEffect(() => {
    setPageInput(String(currentPageNumber))
  }, [currentPageNumber])

  const handlePageChange = (page, mode = viewMode) => {
    setCurrentPageNumber(normalizePageForMode(page, mode, numPages))
  }

  const handlePageSubmit = (e) => {
    if (e.key !== 'Enter' && e.type !== 'blur') return
    const n = parseInt(pageInput, 10)
    if (Number.isNaN(n)) {
      setPageInput(String(currentPageNumber))
      return
    }
    handlePageChange(n)
  }

  const handleSliderChange = (e) => handlePageChange(parseInt(e.target.value, 10))

  useEffect(() => {
    const gen = loadGenerationRef.current + 1
    loadGenerationRef.current = gen
    const isNew = loadingForRef.current.pdfUrl !== pdfUrl || loadingForRef.current.reloadKey !== reloadKey
    loadingForRef.current = { pdfUrl, reloadKey }
    if (isNew) {
      setLoading(true)
      setLoadError(null)
      setPdfDoc(null)
    }
    pdfjsLib.getDocument({
      url: pdfUrl,
      disableRange: true,
      disableStream: true,
    })
      .promise
      .then((pdf) => {
        if (loadGenerationRef.current !== gen) return
        setPdfDoc(pdf)
        setNumPages(pdf.numPages)
        setCurrentPageNumber(normalizePageForMode(1, viewMode, pdf.numPages))
        setLoadError(null)
        setLoading(false)
      })
      .catch((err) => {
        if (loadGenerationRef.current !== gen) return
        console.error('Error loading PDF:', err)
        const message = err?.message || String(err) || 'Unknown error'
        setLoadError(message)
        setLoading(false)
      })
  }, [pdfUrl, reloadKey])

  const [searchParams] = useSearchParams()
  useEffect(() => {
    const q = searchParams.get('pdf')
    if (q) setFileName(decodeURIComponent(q))
  }, [searchParams])

  const goPrev = () => handlePageChange(currentPageNumber - (viewMode === VIEW_MODES.book ? 2 : 1))
  const goNext = () => handlePageChange(currentPageNumber + (viewMode === VIEW_MODES.book ? 2 : 1))

  const zoomOut = () => {
    setZoom((z) => Math.max(0.5, z - 0.2))
    setIsAutoFit(false)
  }
  const zoomIn = () => {
    setZoom((z) => Math.min(3, z + 0.2))
    setIsAutoFit(false)
  }

  const toggleFullscreen = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    const isFs = document.fullscreenElement ?? document.webkitFullscreenElement
    if (isFs) {
      const exit = document.exitFullscreen ?? document.webkitExitFullscreen
      exit ? exit.call(document).catch(() => setIsMaximized(false)) : setIsMaximized(false)
    } else {
      const el = readerPageRef.current || viewportRef.current
      if (!el) return
      const req = el.requestFullscreen ?? el.webkitRequestFullscreen
      if (req) req.call(el).catch(() => setIsMaximized((m) => !m))
      else setIsMaximized((m) => !m)
    }
  }

  useEffect(() => {
    const onFsChange = () => {
      setIsMaximized(!!(document.fullscreenElement ?? document.webkitFullscreenElement))
    }
    document.addEventListener('fullscreenchange', onFsChange)
    document.addEventListener('webkitfullscreenchange', onFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      document.removeEventListener('webkitfullscreenchange', onFsChange)
    }
  }, [])

  const handleReload = () => {
    setIsMaximized(false)
    setReloadKey((k) => k + 1)
  }

  useEffect(() => {
    setCurrentPageNumber((page) => normalizePageForMode(page, viewMode, numPages))
  }, [viewMode, numPages])

  useEffect(() => {
    const prev = previousPageRef.current
    setPageTransitionDir(currentPageNumber >= prev ? 'next' : 'prev')
    previousPageRef.current = currentPageNumber
  }, [currentPageNumber])

  const bookSpread = useMemo(() => {
    const leftPage = normalizePageForMode(currentPageNumber, VIEW_MODES.book, numPages)
    const rightPage = leftPage + 1 <= numPages ? leftPage + 1 : null
    return { leftPage, rightPage }
  }, [currentPageNumber, numPages])

  // Keyboard navigation per reference
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName?.toLowerCase() === 'input') return
      if (e.key === 'ArrowRight') {
        handlePageChange(currentPageNumber + (viewMode === VIEW_MODES.book ? 2 : 1))
      } else if (e.key === 'ArrowLeft') {
        handlePageChange(currentPageNumber - (viewMode === VIEW_MODES.book ? 2 : 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewMode, numPages, currentPageNumber])

  return (
    <div ref={readerPageRef} id="main-content" className="reader-page">
      <TooltipAgentProvider
        knowledgeSource={knowledgeData}
        containerRef={mainAreaRef}
      >
        <TooltipController />
      <header className="reader-toolbar">
        <div className="reader-toolbar-inner">
          <Link to="/" className="btn-back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </Link>
          <div className="reader-toolbar-actions">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="toolbar-btn"
              aria-label={isMaximized ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isMaximized ? 'Exit fullscreen (Esc)' : 'Enter fullscreen'}
            >
              {isMaximized ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              )}
            </button>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="toolbar-btn" aria-label="Open in new tab" title="Open in new tab">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <a href={pdfUrl} download className="toolbar-btn" aria-label="Download" title="Download">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <div ref={viewportRef} className="reader-viewport" data-maximized={isMaximized}>
        <div className="reader-content-wrap">
          <main ref={mainAreaRef} className="reader-main">
            {pdfDoc ? (
              <>
                {viewMode === VIEW_MODES.normal && (
                  <div className="reader-mode-normal">
                    <div className={`reader-single-page reader-page-transition reader-page-transition--${pageTransitionDir}`} data-page={currentPageNumber}>
                      <PdfPage
                        pdfDoc={pdfDoc}
                        pageNumber={currentPageNumber}
                        scale={zoom}
                        isAutoFit={isAutoFit}
                        keywordKeys={Object.keys(knowledgeData)}
                      />
                    </div>
                  </div>
                )}

                {viewMode === VIEW_MODES.book && (
                  <div className="reader-mode-book">
                    <div className={`reader-book-spread reader-page-transition reader-page-transition--${pageTransitionDir}`} data-left={bookSpread.leftPage} data-right={bookSpread.rightPage}>
                      <div className="reader-book-page">
                        <PdfPage
                          pdfDoc={pdfDoc}
                          pageNumber={bookSpread.leftPage}
                          scale={zoom}
                          isAutoFit={isAutoFit}
                          minLoadHeight={320}
                          keywordKeys={Object.keys(knowledgeData)}
                        />
                      </div>
                      <div className="reader-book-page">
                        {bookSpread.rightPage ? (
                          <PdfPage
                            pdfDoc={pdfDoc}
                            pageNumber={bookSpread.rightPage}
                            scale={zoom}
                            isAutoFit={isAutoFit}
                            minLoadHeight={320}
                            keywordKeys={Object.keys(knowledgeData)}
                          />
                        ) : (
                          <div className="reader-book-page-empty" aria-hidden />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="reader-placeholder">
                {loading ? (
                  'Loading PDF…'
                ) : (
                  <>
                    <strong>No document loaded.</strong>
                    {loadError && (
                      <span className="reader-placeholder-error">
                        Error: {loadError}
                        <br />
                        Tried: <code className="reader-placeholder-url">{pdfUrl}</code>
                      </span>
                    )}
                    {!loadError && (
                      <span>Place a PDF in <code>public/assets/</code> so the filename matches the default, then reload. Or use <code>?pdf=YourFile.pdf</code> in the URL.</span>
                    )}
                  </>
                )}
              </div>
            )}
          </main>

          {pdfDoc && numPages > 0 && (
            <div className="reader-slider-wrap">
              <input
                type="range"
                min={1}
                max={numPages}
                step={viewMode === VIEW_MODES.book ? 2 : 1}
                value={viewMode === VIEW_MODES.book ? bookSpread.leftPage : currentPageNumber}
                onChange={handleSliderChange}
                className="reader-slider"
                aria-label="Page slider"
              />
              <span className="reader-slider-label">{currentPageNumber} / {numPages}</span>
            </div>
          )}

          <div className="reader-controls">
            <div className="reader-controls-group">
              <button type="button" onClick={goPrev} disabled={currentPageNumber <= 1} className="reader-control-btn" aria-label="Previous page">‹</button>
              <button type="button" onClick={goNext} disabled={viewMode === VIEW_MODES.book ? (bookSpread.leftPage + 1 >= numPages) : (currentPageNumber >= numPages)} className="reader-control-btn" aria-label="Next page">›</button>
            </div>
            <div className="reader-controls-group">
              <label className="reader-go-wrap">
                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={handlePageSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handlePageSubmit(e)}
                  className="reader-go-input"
                  aria-label="Page number"
                />
                <span className="reader-go-label">GO</span>
              </label>
              <button type="button" onClick={zoomOut} className="reader-control-btn" aria-label="Zoom out" title="Zoom out">−</button>
              <button type="button" onClick={zoomIn} className="reader-control-btn" aria-label="Zoom in" title="Zoom in">+</button>
            </div>
            <div className="reader-controls-group">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="reader-control-btn"
                aria-label={isMaximized ? 'Minimize reader' : 'Maximize reader'}
                title={isMaximized ? 'Minimize reader' : 'Maximize reader'}
              >
                {isMaximized ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                )}
              </button>
              <button type="button" onClick={handleReload} className="reader-control-btn" aria-label="Reload" title="Reload">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
              </button>
            </div>
            <div className="reader-controls-group">
              <button
                type="button"
                onClick={() => setViewMode(VIEW_MODES.normal)}
                className={`reader-control-btn ${viewMode === VIEW_MODES.normal ? 'reader-control-btn--active' : ''}`}
                title="Normal (one page)"
                aria-label="Normal reading mode"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode(VIEW_MODES.book)}
                className={`reader-control-btn ${viewMode === VIEW_MODES.book ? 'reader-control-btn--active' : ''}`}
                title="Book (two-page)"
                aria-label="Book / two-page mode"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <path d="M12 6v6" />
                </svg>
              </button>
            </div>
            <div className="reader-controls-group">
              <button
                type="button"
                onClick={() => setIsAutoFit(!isAutoFit)}
                className={`reader-control-btn reader-control-btn--text ${isAutoFit ? 'reader-control-btn--active' : ''}`}
                title="Fit width"
              >
                Fit width
              </button>
            </div>
          </div>
        </div>
      </div>
      </TooltipAgentProvider>
    </div>
  )
}
