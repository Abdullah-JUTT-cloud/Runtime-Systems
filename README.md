# Runtime Systems Flagship Website

The editable source for the Runtime Systems flagship website. The experience is built around the idea that software is a runtime: connected products, AI, data, services, infrastructure, and people.

## Stack

- React 18 + TypeScript
- Vite 7
- Three.js + React Three Fiber + Drei
- Motion for route transitions
- CSS design system and responsive layouts
- Lucide icons
- Local `@fontsource` packages; no remote font dependency

## Local development

Requires Node.js 22 or newer.

```bash
npm install
npm run dev -- --port 3000
```

## Production

```bash
npm run typecheck
npm test
npm run build
npm run preview -- --port 3000
```

The production artifact is written to `dist/`. The build also emits real `index.html` files for every public route so deployment does not depend on a single-page-app fallback.

## Deployment

Upload the complete `dist/` directory to any static host. Configure the production hostname as `https://runtimesystems.tech`. `VITE_SITE_URL` can override the site URL used by the application when needed.

No backend is included. The contact brief intentionally ends in a frontend demo state; connect the submit handler in `src/pages/Contact.tsx` to a secure server endpoint or form provider before accepting submissions.

## Content editing

- Projects and complete case-study fields: `src/data/projects.ts`
- Services and service-detail content: `src/data/services.ts`
- Team profiles: `src/data/team.ts`
- Insight summaries and categories: `src/data/insights.ts`
- Navigation, social links, email, location, and site settings: `src/data/site.ts`
- Route map: `src/App.tsx`
- Static route generation: `scripts/generate-routes.mjs`

Demo projects, articles, metrics, and empty team data are intentionally labelled. Replace these with verified information before launch.

## Replacing imagery

Project visuals currently use lightweight branded interface compositions. To introduce real images:

1. Place optimized AVIF/WebP files in `public/projects/<slug>/`.
2. Add the paths to the relevant project object in `src/data/projects.ts`.
3. Render them through `src/components/ProjectShowcase.tsx` or the gallery in `src/pages/ProjectDetail.tsx`.
4. Always define dimensions and descriptive alt text to avoid layout shift.

## Motion and 3D

- Runtime Core scene: `src/components/runtime/RuntimeCore.tsx`
- Lightweight fallback: `src/components/runtime/RuntimeFallback.tsx`
- Route transitions: `src/App.tsx`
- Scroll reveals: `src/hooks/useReveal.ts`
- Interaction and responsive rules: `src/styles.css` and `src/pages.css`

The 3D scene lazy-loads, limits device pixel ratio, and automatically falls back for reduced motion, touch pointers, screens below 720px, or unavailable WebGL.

## SEO and brand assets

- Base metadata and organization schema: `index.html`
- Runtime title and description updates: `src/components/SEO.tsx`
- Sitemap: `public/sitemap.xml`
- Crawler rules: `public/robots.txt`
- Manifest: `public/site.webmanifest`
- Favicon and social preview: `public/favicon.svg`, `public/social-preview.svg`

Update the static route list and sitemap when adding a new route.
