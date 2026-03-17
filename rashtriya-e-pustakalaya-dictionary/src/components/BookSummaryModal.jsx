import { Link } from 'react-router-dom'
import './BookSummaryModal.css'

const SAMPLE_SUMMARY = `गांधी एक अध्ययन सुरजीत कौर जोली द्वारा लिखित एक विश्लेषणात्मक कृति है जो महात्मा गांधी के जीवन, विचार और सामाजिक-राजनीतिक योगदान पर प्रकाश डालती है। इसमें उनके सत्य, अहिंसा, स्वराज और सर्वधर्म समभाव जैसे सिद्धांतों की चर्चा है। साथ ही असहयोग आंदोलन, नमक सत्याग्रह जैसे आंदोलनात्मक कार्यों और भारतीय स्वतंत्रता संग्राम में उनकी भूमिका का विवरण शामिल है।`

export default function BookSummaryModal({ book, onClose }) {
  const title = book?.title || 'गांधी एक अध्ययन'
  const downloadCount = book?.downloadCount ?? 183
  const language = 'Hindi'

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="summary-title">
      <div className="modal book-summary-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close dark" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="summary-top">
          <div className="summary-cover-thumb">
            {book?.cover ? (
              <img src={book.cover} alt="" />
            ) : (
              <div className="summary-cover-placeholder">
                <span className="hindi devanagari">{title.slice(0, 2)}</span>
              </div>
            )}
          </div>
          <div className="summary-meta-row">
            <span className="summary-meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Count: {downloadCount}
            </span>
            <span className="summary-meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Language: {language}
            </span>
            <Link to="/reader" className="btn-start-reading" onClick={onClose}>
              Start Reading →
            </Link>
          </div>
        </div>

        <div className="summary-content">
          <h2 id="summary-title" className="summary-heading">Book Summary</h2>
          <div className="summary-text hindi devanagari">
            {SAMPLE_SUMMARY}
          </div>
        </div>
      </div>
    </div>
  )
}
