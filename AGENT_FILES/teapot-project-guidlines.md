# TEAPOT.EXE Project Guidelines — DEV April Fools 2026

## Project Goal
Build **TEAPOT.EXE** (or BrewOps), a satirical "production-grade" enterprise SaaS dashboard for managing teapots that strictly refuse to brew coffee via HTTP 418 I'm a Teapot.

Target category: **Best Ode to Larry Masinter** (strong HTCPCP / RFC 2324 vibes).

## Core Theme & Tone
- Look and feel: Premium B2B SaaS (think Linear, Vercel, Stripe) but completely useless and hilarious.
- Tone: Over-the-top corporate satire mixed with dev meme humor.
- Tagline ideas: "Zero Coffee Delivered. 100% Compliance." • "I'm a Teapot as a Service (TaaS)"

## Must-Have Features
1. Hero landing with big "BREW COFFEE" button → triggers real 418 response
2. Live HTCPCP Terminal / Console that accepts BREW commands and always replies with 418 + funny headers
3. Main Dashboard with fake metrics ("Coffee Requests Refused: 420,069", "Teapot Rage Level: CRITICAL")
4. Brew Request Form with ridiculous fields that still fails with 418
5. Enterprise elements: Pricing tiers, fake testimonials (including Larry Masinter), compliance badges (ISO 418, SOC 2, Teapot Certified), scrolling ticker
6. Animated teapot (CSS/SVG or Three.js) with steam, shaking, spilling effects
7. Random sassy refusal messages and visual chaos when users try to "brew"

## Technical Requirements (SvelteKit)
- SvelteKit + TypeScript + Tailwind CSS
- Real API route (`+server.ts`) that returns HTTP status **418** with proper headers:
  - `X-Teapot-Type: short-and-stout`
  - `X-Refusal-Reason: I am a teapot`
  - Humorous HTCPCP-style responses
- Responsive design, dark mode by default, smooth animations
- Deployable on Vercel

## Success Criteria for Winning
- Extremely polished and shareable
- Real 418 visible in Network tab
- Strong humor + "why did they build this?" factor
- Clear tie to HTCPCP / 418 / Larry Masinter
- Fun submission post with screenshots, GIFs, and live demo

Keep everything delightful, over-engineered in appearance, and gloriously pointless.