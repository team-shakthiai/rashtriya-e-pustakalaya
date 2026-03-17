/**
 * Returns a full URL for a public asset so it works with Vite's base path
 * (e.g. /rashtriya-e-pustakalaya-dictionary/) in dev and on GitHub Pages.
 */
export function assetUrl(path) {
  const base = import.meta.env.BASE_URL
  const p = path.startsWith('/') ? path.slice(1) : path
  return base + p
}
