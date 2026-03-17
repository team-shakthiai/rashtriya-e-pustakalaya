import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assetUrl } from '../utils/assetUrl'
import './Header.css'

const isSavedPath = (path) => path === '/saved' || path.startsWith('/saved/')

const THEME_KEY = 'rashtriya-theme'

export default function Header() {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [fontSize, setFontSize] = useState('normal')
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const isHome = location.pathname === '/'
  const isSaved = isSavedPath(location.pathname)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const setBodyFontSize = (size) => {
    document.body.classList.remove('font-size-large', 'font-size-small')
    if (size === 'large') document.body.classList.add('font-size-large')
    if (size === 'small') document.body.classList.add('font-size-small')
    setFontSize(size)
  }

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return (
    <header className="site-header">
      {/* 1. Top utility bar - dark blue-gray, right-aligned only */}
      <div className="header-utility">
        <div className="header-utility-inner">
          <a href="#" className="skip-link" onClick={(e) => e.preventDefault()} aria-disabled="true">Skip to main content</a>
          <span className="header-sep" aria-hidden="true">|</span>
          <a href="#" className="utility-link" onClick={(e) => e.preventDefault()}>Contact Us</a>
        </div>
      </div>

      {/* 2. Main header - white: emblem + govt text | logo + name + search | Download App | Settings | A+ A A- */}
      <div className="header-main">
        <div className="header-main-inner">
          <div className="header-left">
            <div className="emblem">
              <img src={assetUrl('assets/emblem.jpg')} alt="Government of India emblem" width="40" height="40" />
            </div>
            <div className="gov-text">
              <p className="hindi devanagari">स्कूल शिक्षा एवं साक्षरता विभाग</p>
              <p className="hindi devanagari">शिक्षा मंत्रालय, भारत सरकार</p>
              <p className="english">Department of School Education & Literacy</p>
              <p className="english">Ministry of Education, Government of India</p>
            </div>
          </div>

          <span className="header-sep header-sep-v" aria-hidden="true" />

          <div className="header-center">
            <span className="logo-wrap" role="img" aria-label="Rashtriya e-Pustakalya">
              <img src={assetUrl('assets/logo.png')} alt="Rashtriya e-Pustakalya" className="logo-icon" width="38" height="38" />
              <span className="logo-text">
                <span className="hindi devanagari">राष्ट्रीय e-पुस्तकालय</span>
                <span className="english">Rashtriya e-Pustakalaya</span>
              </span>
            </span>
            <div className="header-search">
              <input
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <span className="header-sep header-sep-v" aria-hidden="true" />

          <div className="header-right">
            <a href="#" className="action-download" onClick={(e) => e.preventDefault()}>
              <span className="action-download-text">Download Mobile App</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18v-4"/></svg>
            </a>
            <span className="header-sep header-sep-v" aria-hidden="true" />
            <button
              type="button"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              className={`header-icon-btn theme-toggle ${theme === 'dark' ? 'active' : ''}`}
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              )}
            </button>
            <span className="header-sep header-sep-v" aria-hidden="true" />
            <div className="font-size-btns">
              <button type="button" aria-label="Increase font size" className={`header-icon-btn ${fontSize === 'large' ? 'active' : ''}`} onClick={() => setBodyFontSize('large')}>A+</button>
              <button type="button" aria-label="Normal font size" className={`header-icon-btn ${fontSize === 'normal' ? 'active' : ''}`} onClick={() => setBodyFontSize('normal')}>A</button>
              <button type="button" aria-label="Decrease font size" className={`header-icon-btn ${fontSize === 'small' ? 'active' : ''}`} onClick={() => setBodyFontSize('small')}>A-</button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main navigation bar - teal #036280: Home icon + links | Hi, User */}
      <nav className="header-nav" aria-label="Main">
        <div className="header-nav-inner">
          <div className="nav-links">
            <Link to="/" className={`nav-link nav-home${isHome ? ' active' : ''}`} aria-current={isHome ? 'page' : undefined}>
              <svg className="nav-home-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
              Home
            </Link>
            <Link to="/saved" className={`nav-link${isSaved ? ' active' : ''}`} aria-current={isSaved ? 'page' : undefined}>
              Saved &amp; Feedback
            </Link>
            <span className="nav-link nav-link--disabled" aria-disabled="true">About Us</span>
            <span className="nav-link nav-link--disabled" aria-disabled="true">Categories</span>
            <span className="nav-link nav-link--disabled" aria-disabled="true">Partner</span>
            <span className="nav-link nav-link--disabled" aria-disabled="true">Learn a New Languages</span>
            <span className="nav-link nav-link--disabled" aria-disabled="true">Wish a Book</span>
            <span className="nav-link nav-link--disabled" aria-disabled="true">Events</span>
            <span className="nav-link nav-link--disabled" aria-disabled="true">Digital Resources</span>
          </div>
          <span className="nav-user">Login / Register</span>
        </div>
      </nav>
    </header>
  )
}
