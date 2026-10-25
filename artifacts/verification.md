# Verification — 25 October 2026

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
