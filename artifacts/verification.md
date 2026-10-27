# Verification — 25 October 2026

## Upright full-height fairy and flower sparkle — 27 October 2026

The character now uses 92% of viewport height and remains upright with no banking or image rotation. The right-to-left path has reduced vertical excursion to accommodate the tall figure. Flowers include glowing sparkle details, and a short flourish precedes the circular portfolio reveal. Lint, production build and all five focused browser tests passed. Browser assertions check the actual rendered height, lack of rotation, cross-screen travel, transparent asset, phase timings and accessibility. Updated desktop/mobile screenshots and the full recorded transition were reviewed.

## Full-viewport right-to-left transition correction — 27 October 2026

Replaced the centred circle with an off-screen-right to off-screen-left, viewport-wide looping motion path. The portfolio itself opens through a circular mask after the fairy crosses the screen. Lint, production build and all five focused browser tests passed. Tests sample actual animation positions to verify that the fairy begins right of the viewport, exits left of it, and makes substantial vertical loops. Desktop and mobile accessibility, transparency, Skip/Escape, reduced motion and phase timing are covered. Recorded `artifacts/fairy-cross-screen.webm` and visually reviewed the crossing and circular reveal. This supersedes the fixed central orbit described below.

## Transparent circling fairy correction — 27 October 2026

Removed the photographic backdrop. Added a genuinely transparent reference-inspired fairy asset and two circular flights with counter-rotation, followed by flowers and the website reveal. The PNG has an alpha channel spanning 0–255. Lint, production build and all five focused browser tests passed. Browser coverage checks the transparent corner pixel, absence of the forest layer, circular CSS animation, phase progression, Skip/Escape, focus restoration, reduced-motion bypass and desktop/mobile accessibility. Desktop and mobile screenshots were visually reviewed. Earlier full-screen photograph notes below are superseded by this correction.

## Full-screen fairy update — 27 October 2026

Replaced the small illustrated fairy with the exact supplied forest-fairy photograph in a full-viewport composition. Flowers now fall across the viewport from the entry phase and continue over the website reveal. Lint and production build passed. Five focused browser tests passed for entry/flower/reveal sequencing, Skip/Escape, focus restoration, reduced-motion bypass, and mobile/desktop axe checks with no serious or critical violations. A further assertion checks that the fairy image occupies the entire viewport layout. Latest visual captures: `artifacts/fairy-flowers-desktop.png`, `artifacts/fairy-flowers-mobile.png` and `docs/fairy-welcome.png`. Earlier Lighthouse measurements below are historical and do not measure this introductory scene.

## Theme update — 26 October 2026

Applied the latest user-supplied burgundy textile background and gold/ivory/lotus-rose palette. `npm run lint` passed. Production build passed. All four responsive layout/accessibility checks passed again at 360, 768, 1280 and 1920 pixels with no serious/critical axe violations, horizontal overflow, broken images or invalid internal links. Reviewed desktop and mobile screenshots. The earlier full suite and Lighthouse scores below are historical; Lighthouse was not rerun for this visual update.

Latest screenshots: `artifacts/heritage-desktop.png`, `artifacts/heritage-mobile.png`, `artifacts/heritage-projects.png`; `docs/preview.png` contains the updated preview.

Verified against the final dark editorial theme requested in chat. Source is a standalone React 18 + TypeScript Vite application; no DevTrack application files are included.

| Command/check | Result |
|---|---|
| `npm install` | Successful; lockfile included |
| `npm run lint` | Passed, zero errors and warnings |
| `npx tsc --noEmit` | Passed; also executed by the production build |
| `npm run test` | 16 tests passed across 2 files |
| `npm run build` | Passed; largest JavaScript chunk approximately 301 KB, below 500 KB |
| `npx playwright install chromium` | Successful |
| `npm run test:e2e` / `npx playwright test` | 16 browser tests passed |
| `npm audit` | Zero vulnerabilities after updating test/image dependencies and overriding the affected CSS parser |
| `npm audit --omit=dev` | Zero vulnerabilities |
| External link checks | 13 unique external links returned HTTP 200, including 7 repositories and 4 demos |
| Live GitHub browser smoke check | Loaded real repository data; no uncaught browser errors |

## Browser coverage

- Screenshots and axe scans at 360×800, 768×1024, 1280×800 and 1920×1080.
- No horizontal page overflow, no broken image elements and exactly one h1.
- No serious or critical axe violations at all four sizes, including reduced-motion rendering.
- Internal anchors resolve. External links that open new tabs include both `noopener` and `noreferrer`.
- Desktop section navigation and active states, mobile menu focus containment, Escape dismissal, link dismissal and focus restoration passed.
- GitHub loading, success, empty, offline, 403 and 404 paths passed with mocks; all seven supplied repositories are represented and the duplicate resume-builder link is excluded.
- The sixth-to-seventh project expansion and academic project fallback links passed.
- Contact validation, loading, successful mocked delivery and failed delivery passed in a separate configured browser session. Unit/component tests additionally cover the honeypot and clearing/preserving fields. No real contact messages were sent.
- The default unconfigured contact state, disabled missing certificates and missing resume state passed.

## Screenshots and reports

The generated files are local and excluded from source control, except `docs/preview.png`:

- `artifacts/portfolio-360.png`
- `artifacts/portfolio-768.png`
- `artifacts/portfolio-1280.png`
- `artifacts/portfolio-1920.png`
- `artifacts/desktop-hero.png`
- `artifacts/projects-desktop.png`
- `artifacts/live-desktop-full.png`
- `artifacts/lighthouse.html` and `artifacts/lighthouse.json`
- `artifacts/links.json`

Final Lighthouse mobile measurements on the local production preview:

| Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|
| 77 | 100 | 96 | 100 |

The requested mobile performance target of 90 is **not met** in this local run. Largest Contentful Paint was 2.6 seconds and Total Blocking Time was 700 ms. Removing the first-screen wipe/transforms and repeated watermark scroll measurements reduced the JavaScript entry chunk and improved the prior dark-theme run (56). The final Best Practices deduction was a temporary `ERR_NAME_NOT_RESOLVED` response from `api.github.com`; fallback cards still rendered. An earlier successful-network run scored 100 for Best Practices. Results are reported as measured, not replaced with earlier higher scores. Recheck on the eventual hosting URL and investigate remaining startup/style work before claiming the requested performance target.

## Remaining inputs and limits

- No resume PDF, certificates or portrait were attached. The site does not invent these files or publish broken links. Add assets following README instructions and rebuild.
- SIH 2026 status remains unverified and is excluded from participation totals. Optional social URLs and phone remain unset.
- Contact delivery requires the owner's Formspree endpoint. Default production behavior is direct email.
- Screenshots of real projects remain optional; the cards explicitly identify their current visuals as artwork.
- The profile and educational facts come from the user-provided brief; no resume/certificate verification was possible.
- Open Graph image and favicon are included. Canonical and absolute social preview URLs need a real hosting domain.
- GitHub source publication does not itself deploy the website. Vercel and Netlify configuration files and setup instructions are included.

Architectural and design deviations are documented in `DECISIONS.md`, including the user's later dark-theme request, consolidated data modules, missing PDF verification guard, and Formspree-only provider implementation.
