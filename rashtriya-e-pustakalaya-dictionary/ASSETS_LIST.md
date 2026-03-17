# Assets list & naming conventions

Place all assets in the **`public/`** folder. The app will reference them by root path (e.g. `/logo-ndl.svg`).

**Naming rules:**
- Use lowercase.
- Use hyphens for multi-word names (e.g. `hero-banner.png`).
- Prefer SVG for logos and icons; use PNG/JPG for photos and illustrations.
- No spaces in file names.

---

## 1. Logos & branding

| Asset | File name | Where used | Suggested size | Format |
|-------|-----------|------------|----------------|--------|
| Government of India emblem (Ashoka Chakra) | `emblem-gov-india.svg` | Header (top strip / main header) | 48×48 px | SVG or PNG |
| NDL / Rashtriya e-Pustakalaya logo (open book + “e”) | `logo-ndl.svg` | Header centre, footer | 40×40 px (icon), or full logo width ~200 px | SVG or PNG |
| National Book Trust, India logo | `logo-nbt.svg` | Footer “Implementing Agency” | Height ~40 px | SVG or PNG |
| Favicon (browser tab icon) | `favicon.svg` or `favicon.ico` | Browser tab | 32×32 px | SVG or ICO |

---

## 2. Hero / homepage

| Asset | File name | Where used | Suggested size | Format |
|-------|-----------|------------|----------------|--------|
| Hero banner illustration (classroom, teachers, students) | `hero-banner.png` or `hero-banner.jpg` | Home page hero section | ~800×400 px or 1200×500 px | PNG or JPG |
| Hero circular logo (small logo on banner) | `hero-logo.png` or `hero-logo.svg` | Overlay on hero (bottom-right) | 56×56 px (circle) | PNG or SVG |

---

## 3. Social & app download

| Asset | File name | Where used | Suggested size | Format |
|-------|-----------|------------|----------------|--------|
| Facebook icon | `icon-facebook.svg` | Footer “Stay Connected” | 24×24 or 36×36 px | SVG (white on transparent) |
| X (Twitter) icon | `icon-x.svg` | Footer “Stay Connected” | 24×24 or 36×36 px | SVG (white on transparent) |
| YouTube icon | `icon-youtube.svg` | Footer “Stay Connected” | 24×24 or 36×36 px | SVG (white on transparent) |
| Instagram icon | `icon-instagram.svg` | Footer “Stay Connected” | 24×24 or 36×36 px | SVG (white on transparent) |
| LinkedIn icon (optional) | `icon-linkedin.svg` | Footer (if needed) | 24×24 or 36×36 px | SVG (white on transparent) |
| Google Play badge | `badge-google-play.png` or `.svg` | Footer “Download our App” | Height ~40 px | PNG or SVG |
| App Store badge | `badge-app-store.png` or `.svg` | Footer “Download our App” | Height ~40 px | PNG or SVG |

---

## 4. Homepage sections (optional placeholders)

| Asset | File name | Where used | Suggested size | Format |
|-------|-----------|------------|----------------|--------|
| Publisher logos (e.g. NCERT, Pratham) | `publisher-{name}.png` e.g. `publisher-ncert.png` | “Top 10 Read Publishers” carousel | 64×64 px (circle) | PNG |
| Author photos | Usually from API or CMS; or use `author-placeholder.png` | “Widely Read Authors” carousel | 72×72 px (circle) | PNG or JPG |
| Testimonial chart/visual | `testimonial-chart.png` | Testimonials section left panel | ~280×200 px | PNG or JPG |
| Testimonial profile photo | Usually per testimonial; or `testimonial-avatar-placeholder.png` | Testimonials section | 48×48 px (circle) | PNG or JPG |

---

## 5. Book covers

Book covers are **not** a fixed list. They are loaded per book (e.g. from API or from a `cover` URL on each book object). Use any image URL; no specific file names required.

- **Aspect ratio:** 3∶4 (portrait) recommended.
- **Format:** JPG or PNG.
- If you have sample covers for demo, you can name them e.g. `books/sample-1.jpg`, `books/sample-2.jpg` and reference them in the demo data.

---

## 6. Optional / future

| Asset | File name | Where used | Notes |
|-------|-----------|------------|--------|
| Dotted background pattern | `pattern-dots.png` or `.svg` | Reader page background | Small tile, repeatable. |
| Default user avatar | `avatar-default.svg` or `.png` | Header profile icon when not logged in | ~40×40 px. |

---

## Quick reference – required for full branding

Minimum set to replace all placeholders:

```
public/
├── emblem-gov-india.svg
├── logo-ndl.svg
├── logo-nbt.svg
├── favicon.svg
├── hero-banner.png
├── hero-logo.png
├── icon-facebook.svg
├── icon-x.svg
├── icon-youtube.svg
├── icon-instagram.svg
├── badge-google-play.png
└── badge-app-store.png
```

After you add these files, tell me and I can wire each path into the app (Header, Footer, Hero, etc.).
