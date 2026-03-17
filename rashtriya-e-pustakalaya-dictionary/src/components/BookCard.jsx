import { assetUrl } from '../utils/assetUrl'
import './BookCard.css'

export default function BookCard({ book, onDetails, onSummary, variant, showReadButton = true }) {
  const isTeal = variant === 'teal'
  const isCard = variant === 'card'
  return (
    <article className={`book-card ${isTeal ? 'book-card-teal' : ''} ${isCard ? 'book-card-card' : ''}`}>
      <button type="button" className="book-card-cover-wrap" onClick={onDetails} aria-label={`View details for ${book.title}`}>
        {book.cover ? (
          <img src={assetUrl(book.cover)} alt="" className="book-card-cover" />
        ) : (
          <div className="book-card-cover placeholder">
            <span className="book-initial">{book.title.charAt(0)}</span>
          </div>
        )}
      </button>
      <button type="button" className="book-card-title book-card-title-btn" onClick={() => onDetails(book)}>
        {book.title}
      </button>
      <p className="book-card-author">{isTeal ? book.author : `Author : ${book.author}`}</p>
      {showReadButton && (
        <button type="button" className="book-card-read" onClick={() => onSummary(book)}>Read</button>
      )}
    </article>
  )
}
