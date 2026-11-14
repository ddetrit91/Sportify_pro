# Tech Stack: SPORTIFY Digital Ecosystem

## Core Framework
- **Framework:** Next.js 16+ (v16.4.6, React 19, Turbopack)
- **Architecture:** App Router with Server Components & Client leaf interactive components
- **Language:** TypeScript 5+

## Design System & Styling
- **Aesthetic:** Premium Urban Athletic & High-Performance Digital Product (Inspired by Nike, Strava, Awwwards Site of the Day)
- **Palette:**
  - Void Black (`#08090b`), Graphite Surface (`#111418`), Slate Cards (`#15191f`)
  - Accent: High-Voltage Electric Volt / Neon Lime (`#d4ff00` / `#ccff00`)
  - Dual Theme: Dark Mode (Default) + Light Gallery White Mode (`#f6f8fa`)
- **Typography:** Architectural condensed sans-serif headings with tight tracking (`tracking-tight`), paired with monospace telemetry chips (`font-mono tracking-widest text-[10px] uppercase`)
- **Icons:** Lucide React
- **Animations & Micro-interactions:** `framer-motion` (spring physics, bento staggered reveals, hover sheen, marquee ticker) + `canvas-confetti`

## Backend & Integrations
- **Persistence:** Local JSON data engine (`data/leads.json`, `data/clubs.json`, `data/sports.json`), prepared for serverless Postgres (Neon)
- **Telegram Bot API:** Instant webhook notification dispatch with HTML formatted telemetry cards
- **AI Engine:** Google Gemini API (`gemini-2.5-flash` / `gemini-2.5-flash-lite`) with intelligent fallback rule engine
