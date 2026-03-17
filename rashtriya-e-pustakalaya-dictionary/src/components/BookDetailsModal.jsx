import { Link } from 'react-router-dom'
import { assetUrl } from '../utils/assetUrl'
import './BookDetailsModal.css'

const DEFAULT_BOOK = {
  title: '',
  author: '',
  publisher: '—',
  pages: '—',
  year: '—',
  category: '—',
  downloadCount: 0,
  rating: 3,
}

const SAMPLE_SUMMARY = `गांधी एक अध्ययन सुरजीत कौर जोली द्वारा लिखित एक विश्लेषणात्मक कृति है जो महात्मा गांधी के जीवन, विचार और सामाजिक-राजनीतिक योगदान पर प्रकाश डालती है। इसमें उनके सत्य, अहिंसा, स्वराज और सर्वधर्म समभाव जैसे सिद्धांतों की चर्चा है। साथ ही असहयोग आंदोलन, नमक सत्याग्रह जैसे आंदोलनात्मक कार्यों और भारतीय स्वतंत्रता संग्राम में उनकी भूमिका का विवरण शामिल है।`

const SUMMARY_POLITICAL_SYSTEM = `David Easton's The Political System (1953) introduces a systems theory approach to political science, defining politics as the "authoritative allocation of values" for a society. He viewed the political system as a dynamic "black box" that converts societal demands and support (inputs) into policies and decisions (outputs).`

export default function BookDetailsModal({ book, onClose }) {
  const b = { ...DEFAULT_BOOK, ...book }
  const summary = b.summary ?? (b.title === 'The Political System' ? SUMMARY_POLITICAL_SYSTEM : SAMPLE_SUMMARY)
  const isSummaryHindi = !b.summary && b.title !== 'The Political System'

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal book-details-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="book-details-body">
          <div className="book-details-cover">
            {b.cover ? (
              <img src={assetUrl(b.cover)} alt="" />
            ) : (
              <div className="book-details-cover-placeholder">
                <span className="hindi devanagari">{b.title}</span>
                <span className="author">{b.author}</span>
              </div>
            )}
          </div>

          <div className="book-details-info">
            <h2 id="modal-title" className="book-details-title hindi devanagari">{b.title}</h2>
            <div className="book-details-rating">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`star ${i <= b.rating ? 'filled' : i <= b.rating + 0.5 ? 'half' : ''}`} aria-hidden="true">★</span>
              ))}
              <span className="rating-num">{b.rating.toFixed(1)}</span>
            </div>

            <ul className="book-details-meta">
              <li>
                <span className="meta-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <span className="meta-label">Authors</span>
                <span className="meta-value link">{b.author}</span>
              </li>
              <li>
                <span className="meta-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                </span>
                <span className="meta-label">Publisher</span>
                <span className="meta-value link">{b.publisher}</span>
              </li>
              <li>
                <span className="meta-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </span>
                <span className="meta-label">Total Number Of Pages</span>
                <span className="meta-value">{b.pages}</span>
              </li>
              <li>
                <span className="meta-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </span>
                <span className="meta-label">Book Year</span>
                <span className="meta-value">{b.year}</span>
              </li>
              <li>
                <span className="meta-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </span>
                <span className="meta-label">Book Category Name</span>
                <span className="meta-value">{b.category}</span>
              </li>
              <li>
                <span className="meta-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </span>
                <span className="meta-label">Download Count</span>
                <span className="meta-value">{b.downloadCount}</span>
              </li>
            </ul>

            <Link to="/reader" className="btn-start-reading" onClick={onClose}>
              Start Reading →
            </Link>
          </div>
        </div>

        <div className="book-details-summary">
          <h3 className="book-details-summary-heading">Book Summary</h3>
          <div className={`book-details-summary-text ${isSummaryHindi ? 'hindi devanagari' : ''}`}>
            {summary}
          </div>
        </div>
      </div>
    </div>
  )
}
