# Assets needed for accurate replication

Place assets in `public/` so they can be referenced by path (e.g. `/logo.png`). Below is what the UI expects; you can provide these when ready.

## Logos and branding
- **Government of India emblem** (Ashoka Chakra) – used in header and optionally footer. Suggested size ~48×48px or SVG.
- **Rashtriya e-Pustakalaya logo** – open book icon + “e” (blue/orange). Used in header and footer. Suggested size ~48×48px or SVG.
- **National Book Trust, India logo** – for footer “Implementing Agency” block.

## Social icons (footer “Follow Us On”)
- X (Twitter), Instagram, Facebook, YouTube, LinkedIn. Prefer simple white-on-transparent or white-on-dark icons, ~24×24 or 36×36px.

## Hero / homepage
- **Hero illustration** – teachers and students / blackboard scene (light beige/teal style). Used in the main banner on the home page.

## Book covers
- Book cards and modals use **placeholder blocks** when no image is set. For demo, you can add a `cover` URL to any book object (e.g. in `Home.jsx` or from a future API). No specific asset list required; any cover image URL will work.

## Optional
- **Dotted background** – fine dotted pattern for the main content/reader area. Currently simulated with a solid light grey; if you have a small repeatable PNG/SVG, we can switch to it.
- **Publisher/author avatars** – “Top 10 Most Popular Publishers” and “Widely Read Authors” use grey circles as placeholders. You can replace with real logos/photos by adding image URLs in the code.

Once you have any of these, share the file names and folder (e.g. `public/emblem.png`, `public/logo.svg`) and the code can be updated to use them.
