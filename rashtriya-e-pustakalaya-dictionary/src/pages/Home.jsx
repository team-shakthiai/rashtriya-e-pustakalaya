import { useState, useRef } from 'react'
import BookCard from '../components/BookCard'
import BookDetailsModal from '../components/BookDetailsModal'
import { assetUrl } from '../utils/assetUrl'
import './Home.css'

const DEMO_BOOKS = [
  {
    id: 1,
    title: 'Homoeopathic Pharmacopoeia of India – Volume I',
    author: 'Homoeopathic Pharmacopoeia Laboratory (HPL), Ministry of AYUSH, Government of India',
    publisher: 'Ministry of AYUSH, Government of India',
    year: '2010 (Revised editions available)',
    pages: '400+',
    category: 'Pharmacology / Medical Reference',
    downloadCount: 183,
    rating: 4,
    cover: '/assets/Homoeopathic Pharmacopoeia of India – Volume I.jpg',
    summary: `Homoeopathic Pharmacopoeia of India – Volume I is an official reference work that provides standardized guidelines for the preparation, identification, and quality control of homoeopathic medicines. Published by the Ministry of AYUSH, the book serves as a regulatory and scientific framework for maintaining consistency and safety in the manufacture of homoeopathic drugs in India.

The volume contains detailed monographs of various homoeopathic substances, including their sources, preparation methods, potency standards, and pharmacopoeial specifications. It also includes general notices, definitions, laboratory methods, and pharmaceutical terminology used in homoeopathic drug preparation.

This pharmacopoeia acts as an authoritative guide for pharmacists, researchers, practitioners of homoeopathy, and regulatory authorities, ensuring that homoeopathic medicines are produced according to standardized scientific procedures and quality benchmarks.`,
  },
  { id: 2, title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', cover: null },
  { id: 3, title: 'Harry Potter and the Half-Blood Prince', author: 'J.K. Rowling', cover: null },
  { id: 4, title: 'Phantom', author: 'Unknown', cover: null },
  { id: 5, title: 'Piya Rang Diya', author: 'Unknown', cover: null },
  { id: 6, title: 'गांधी एक अध्ययन', author: 'सुरजीत कौर जोली', cover: null },
  { id: 7, title: 'Sana', author: 'Ramendra Kumar', cover: null },
  { id: 8, title: 'चंद्रयानः चंद्रमा की ओर यात्रा', author: 'NCERT', cover: null },
  { id: 9, title: 'मेरे कपड़े', author: 'SCERT Delhi', cover: null },
  { id: 10, title: 'Economic Empowerment...', author: 'NCERT', cover: null },
  { id: 11, title: 'To Hell with Failure!', author: 'Sanjiv Shah', cover: null },
  { id: 12, title: 'Our Political System', author: 'Subhash C Kashyap', cover: null },
  { id: 13, title: 'Stories from the Panchatantra', author: 'Vishnu Sharma', cover: null },
  { id: 14, title: 'Discovery of India', author: 'Jawaharlal Nehru', cover: null },
]

const LANGUAGES = ['English', 'Hindi', 'Bangla', 'Urdu', 'Kannada', 'Bhojpuri', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Punjabi', 'Odia', 'Malayalam', 'Assamese', 'Sanskrit', 'Sindhi']
const AGE_GROUPS = [
  { label: '3 to 8', lines: ['3 to 8'] },
  { label: '8 to 11', lines: ['8 to 11'] },
  { label: '11 to 14+', lines: ['11 to 14+'] },
  { label: 'Young Adults', lines: ['Young', 'Adults'] },
]
const GENRES = ['Fiction and Stories', 'Poetry', 'History', 'Science', 'Biography', "Children's Books", 'Religious Texts', 'Philosophy', 'Self-Help', 'Travel']
const PUBLISHERS = ['NCERT', 'Pratham Books', 'CBSE', 'SCERT', 'State Boards', 'Sahitya Akademi', 'NBT India', 'DK India', 'Amar Chitra Katha', 'Children\'s Book Trust']

/* Banner images: place in public/assets/ */
const HERO_BANNERS = [
  { src: '/assets/book_suggestion_banner.jpg', alt: 'Book suggestion' },
  { src: '/assets/bannerprimer.jpg', alt: 'Banner' },
  { src: '/assets/banner2.jpg', alt: 'Banner' },
  { src: '/assets/banner1.jpg', alt: 'Banner' },
  { src: '/assets/banner_2.gif', alt: 'Banner' },
]

export default function Home() {
  const [selectedBook, setSelectedBook] = useState(null)
  const [heroIndex, setHeroIndex] = useState(0)
  const languageScrollRef = useRef(null)
  const authorScrollRef = useRef(null)

  const scrollLanguage = (direction) => {
    if (!languageScrollRef.current) return
    const step = 120
    languageScrollRef.current.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  const scrollAuthors = (direction) => {
    if (!authorScrollRef.current) return
    const step = 120
    authorScrollRef.current.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  const openBook = (book) => setSelectedBook(book)
  const closeBook = () => setSelectedBook(null)

  return (
    <div id="main-content" className="home-page">
      {/* Hero / Banner - full-width image only */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-visual">
            <div className="hero-banner-frame">
              {HERO_BANNERS.map((banner, i) => (
                <img
                  key={banner.src}
                  src={assetUrl(banner.src)}
                  alt={banner.alt}
                  className={`hero-banner-img ${i === heroIndex ? 'active' : ''}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
            <button type="button" aria-label="Previous slide" onClick={() => setHeroIndex((i) => (i - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)} className="hero-arrow hero-arrow-left">←</button>
            <button type="button" aria-label="Next slide" onClick={() => setHeroIndex((i) => (i + 1) % HERO_BANNERS.length)} className="hero-arrow hero-arrow-right">→</button>
            <div className="hero-dots">
              {HERO_BANNERS.map((_, i) => (
                <button key={i} type="button" aria-label={`Slide ${i + 1}`} className={heroIndex === i ? 'active' : ''} onClick={() => setHeroIndex(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event ticker + Quote - between banner and Popular Books */}
      <section className="ticker-quote-section" aria-label="Upcoming events and quote of the day">
        <div className="event-ticker-bar">
          <span className="event-ticker-label">Upcoming Events</span>
          <div className="event-ticker-wrap" aria-hidden="true">
            <div className="event-ticker-track">
              <span className="event-ticker-text">Doon Book Festival (4 April - 12 April 2026) Venue: Parade Ground, Dehradun</span>
              <span className="event-ticker-sep" aria-hidden="true">|</span>
              <span className="event-ticker-text">Doon Book Festival (4 April - 12 April 2026) Venue: Parade Ground, Dehradun</span>
            </div>
          </div>
        </div>
        <div className="quote-block">
          <span className="quote-mark quote-open" aria-hidden="true">&ldquo;</span>
          <div className="quote-content">
            <h3 className="quote-title">The Way of the Bow</h3>
            <p className="quote-text">Continue in the way of the bow, for it is a whole life&apos;s journey, but remember that a good, accurate shot is very different from one made with peace in your soul.</p>
            <p className="quote-author">By - Paulo Coelho</p>
          </div>
        </div>
      </section>

      {/* Popular Books - standalone section: dark teal bg, white card per book, 12 books in 2 rows of 6 */}
      <section className="section section-popular-books" aria-labelledby="popular-books-heading">
        <div className="section-inner">
          <div className="section-head">
            <h2 id="popular-books-heading" className="section-title section-title-popular">Popular Books</h2>
            <button type="button" className="view-all view-all-light">View All →</button>
          </div>
          <div className="book-grid book-grid-popular">
            {DEMO_BOOKS.slice(0, 14).map((b) => (
              <BookCard key={b.id} book={b} onDetails={() => openBook(b)} onSummary={() => openBook(b)} variant="teal" />
            ))}
          </div>
        </div>
      </section>

      {/* Books by Language - separate section, same style as Top 10 Read Publishers */}
      <section className="section section-books-by-language" aria-labelledby="books-by-language-heading">
        <div className="section-inner">
          <h2 id="books-by-language-heading" className="section-title section-title-books-lang center">Books by Language</h2>
          <div className="language-scroll">
            <button type="button" className="scroll-arrow language-arrow" aria-label="Scroll left" onClick={() => scrollLanguage(-1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="language-scroll-box">
              <div ref={languageScrollRef} className="language-pills-inner language-pills-scroll" role="region" aria-label="Languages">
                {LANGUAGES.map((l) => (
                  <button key={l} type="button" className="lang-circle">{l}</button>
                ))}
              </div>
            </div>
            <button type="button" className="scroll-arrow language-arrow" aria-label="Scroll right" onClick={() => scrollLanguage(1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <div className="language-section-footer">
            <button type="button" className="language-view-all">View All</button>
          </div>
        </div>
      </section>

      {/* Newly Added Books */}
      <section className="section section-white">
        <div className="section-inner">
          <div className="section-head">
            <h2 className="section-title">Newly Added Books</h2>
            <button type="button" className="view-all">View All</button>
          </div>
          <div className="book-grid">
            {DEMO_BOOKS.slice(0, 14).map((b) => (
              <BookCard key={`new-${b.id}`} book={b} onDetails={() => openBook(b)} onSummary={() => openBook(b)} />
            ))}
          </div>
        </div>
      </section>

      {/* Top 10 Read Publishers - light brown/gray */}
      <section className="section section-publishers">
        <div className="section-inner">
          <h2 className="section-title section-title-dark center">Top 10 Read Publishers</h2>
          <div className="publisher-scroll">
            <button type="button" className="scroll-arrow strip-arrow dark" aria-label="Previous">←</button>
            {PUBLISHERS.map((p) => (
              <button key={p} type="button" className="publisher-card" title={`Books by ${p}`}>
                <span className="publisher-avatar" aria-hidden />
                <span className="publisher-name">{p}</span>
              </button>
            ))}
            <button type="button" className="scroll-arrow strip-arrow dark" aria-label="Next">→</button>
          </div>
        </div>
      </section>

      {/* लेखको / Authors */}
      <section className="section section-white">
        <div className="section-inner">
          <div className="section-head">
            <h2 className="section-title hindi devanagari">लेखको</h2>
            <button type="button" className="view-all">View All</button>
          </div>
          <div className="book-grid">
            {DEMO_BOOKS.slice(0, 14).map((b) => (
              <BookCard key={`auth-${b.id}`} book={b} onDetails={() => openBook(b)} onSummary={() => openBook(b)} />
            ))}
          </div>
        </div>
      </section>

      {/* Widely Read Authors - primary teal */}
      <section className="section section-teal">
        <div className="section-inner">
          <h2 className="section-title center">Widely Read Authors</h2>
          <div className="author-scroll">
            <button type="button" className="scroll-arrow" aria-label="Scroll left" onClick={() => scrollAuthors(-1)}>←</button>
            <div ref={authorScrollRef} className="author-cards author-cards-scroll" role="region" aria-label="Widely read authors">
              {['Rabindranath Tagore', 'Munshi Premchand', 'A.P.J. Abdul Kalam', 'Mahatma Gandhi', 'R.K. Narayan', 'Ruskin Bond', 'Chetan Bhagat', 'Jhumpa Lahiri', 'Vikram Seth', 'Amitav Ghosh', 'Arundhati Roy', 'Salman Rushdie', 'Anita Desai'].map((name) => (
                <div key={name} className="author-card">
                  <div className="author-avatar" title="Author photo placeholder" />
                  <span className="author-name">{name}</span>
                </div>
              ))}
            </div>
            <button type="button" className="scroll-arrow" aria-label="Scroll right" onClick={() => scrollAuthors(1)}>→</button>
          </div>
        </div>
      </section>

      {/* More Books - Recommended for your age */}
      <section className="section section-white">
        <div className="section-inner">
          <div className="section-head">
            <h2 className="section-title">More Books - Recommended for your age</h2>
            <button type="button" className="view-all">View All</button>
          </div>
          <div className="book-grid">
            {DEMO_BOOKS.slice(0, 14).map((b) => (
              <BookCard key={`age-${b.id}`} book={b} onDetails={() => openBook(b)} onSummary={() => openBook(b)} />
            ))}
          </div>
        </div>
      </section>

      {/* Books by Age Groups - teal, dashed container, white circles with dashed border */}
      <section className="section section-teal section-age-groups">
        <div className="section-inner">
          <div className="age-groups-box">
            <h2 className="age-groups-title">Books by Age Groups</h2>
            <div className="age-groups-separator" aria-hidden="true" />
            <div className="age-groups-circles">
              {AGE_GROUPS.map((age) => (
                <button key={age.label} type="button" className="age-group-circle">
                  {age.lines.map((line) => (
                    <span key={line} className="age-group-line">{line}</span>
                  ))}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category - light gray, dark blue buttons white text */}
      <section className="section section-strip">
        <div className="section-inner">
          <h2 className="section-title section-title-dark">Browse by Category</h2>
          <div className="category-grid">
            {['Arts and Culture', 'Science and Technology', 'History', 'Biography', 'Fiction and Stories', 'Poetry', "Children's Books", 'Philosophy', 'Self-Help', 'Travel'].map((c) => (
              <button key={c} type="button" className="category-btn">{c}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - light gray */}
      <section className="section section-strip">
        <div className="section-inner">
          <h2 className="section-title section-title-dark center">Testimonials</h2>
          <div className="testimonial-slide">
            <button type="button" className="scroll-arrow strip-arrow dark" aria-label="Previous">←</button>
            <div className="testimonial-content">
              <div className="testimonial-media" title="Chart / visual placeholder" />
              <div className="testimonial-text">
                <p>Description of the National Digital Library of India...</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" title="Profile photo placeholder" />
                  <div>
                    <strong>Dr. K. S. Raghuraman</strong>
                    <span>IIT Madras</span>
                  </div>
                </div>
              </div>
            </div>
            <button type="button" className="scroll-arrow strip-arrow dark" aria-label="Next">→</button>
          </div>
        </div>
      </section>

      {selectedBook && (
        <BookDetailsModal book={selectedBook} onClose={closeBook} />
      )}
    </div>
  )
}
