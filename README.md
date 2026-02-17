# 🎮 xSTIK Gaming Hub

The official game hub for the **xSTIK NFT ecosystem on XRPL** — classic card games powered by real NFT poker cards.

**🌐 Live:** [games.xstik.art](https://games.xstik.art)  
**🏠 Main Site:** [xstik.art](https://xstik.art)

---

## Architecture

The Game Hub uses a **hybrid architecture**:

| Layer | Tech | Purpose |
|-------|------|---------|
| **Landing Page** | React SPA (Vite + Tailwind) | Hub dashboard at `games.xstik.art` |
| **Card Games** | Vanilla JS (single-file HTML) | Standalone games at `games.xstik.art/{game}` |
| **SHARED-CORE** | Vanilla JS modules | Shared systems: credits, NFT cards, leaderboards |
| **NFT Data** | JSON + PNG fallbacks | 2,233 xSTIK NFTs across 11 tiers |

### Why Hybrid?

The React SPA handles the slick landing page, game browser, and credit display. Individual games are standalone HTML files that load SHARED-CORE modules via `<script>` tags — no build step, no bundler, instant deploy. Think of it as: React is the lobby, vanilla JS is each game room.

---

## Games

| Game | Status | Path |
|------|--------|------|
| **Klondike Solitaire** | ✅ Complete | `/solitaire` |
| Blackjack | 🔜 React (basic) | `/blackjack` |
| Texas Hold'em | 🔜 React (basic) | `/poker` |
| Hearts | 🔜 React (basic) | `/hearts` |

---

## NFT Integration

All 52 poker cards in-game are **real xSTIK NFTs on XRPL**. Three-level image fallback:

1. **Google Storage CDN** — fast, primary source
2. **Local PNG fallback** — offline-capable backup
3. **Generated SVG** — emergency placeholder with rank/suit/branding

---

## SHARED-CORE Systems

Protected modules shared across all vanilla JS games:

| Module | File | Purpose |
|--------|------|---------|
| Card Deck | `nft-loader/card-deck.js` | 52 NFT cards with CDN URLs + fallback paths |
| Image Loader | `nft-loader/image-loader.js` | 3-level fallback resolver + preloader |
| Credit System | `credit-system/credit-system.js` | Virtual wallet, bonuses, bankruptcy recovery |
| Player System | `player/player-system.js` | Username management + welcome flow |
| Leaderboard | `leaderboard/leaderboard.js` | Per-game + unified scoring, monthly reset |
| Brand CSS | `branding/xstik-brand.css` | CSS variables, components, responsive grid |
| Game Init | `game-init.js` | 7-step universal bootstrap sequence |

---

## Deployment

**Platform:** Netlify (static site, no build step)  
**Domain:** `games.xstik.art`  
**Routing:** `netlify.toml` handles SPA catch-all + standalone game paths

```
games.xstik.art/           → index.html (React SPA)
games.xstik.art/solitaire  → solitaire/index.html (standalone)
games.xstik.art/blackjack  → index.html (React route)
```

---

## File Structure

```
xSTIK-Gaming-Hub/
├── index.html                    ← React SPA entry point
├── netlify.toml                  ← Routing & headers
├── assets/                       ← React bundle (CSS + JS)
├── SHARED-CORE/                  ← Protected game engine
│   ├── nft-loader/
│   │   ├── card-deck.js          ← 52 NFT card definitions
│   │   └── image-loader.js       ← 3-level fallback system
│   ├── credit-system/
│   │   └── credit-system.js      ← Virtual wallet
│   ├── player/
│   │   └── player-system.js      ← Username system
│   ├── leaderboard/
│   │   └── leaderboard.js        ← Scoring + monthly reset
│   ├── branding/
│   │   ├── xstik-brand.css       ← CSS variables & components
│   │   └── assets/logo.jpg
│   ├── assets/
│   │   ├── cardback.jpg
│   │   ├── bankruptcy/xButtMcAssFace.png
│   │   └── fallback-images/poker-card/*.png
│   └── game-init.js              ← 7-step bootstrap
├── solitaire/
│   └── index.html                ← Complete Klondike game
├── data/
│   ├── nfts-complete.json        ← Full 2,233 NFT collection
│   └── royal-flush.json          ← Royal flush card set
├── fallback-images/              ← NFT tier fallback images (276)
│   ├── original/ (174)
│   ├── rare/ (54)
│   ├── epic/ (7)
│   ├── head/ (12)
│   ├── gen2-original/ (12)
│   ├── special-tier/ (5)
│   └── ... (6 more tiers)
├── docs/
│   └── CLAUDE-SKILLS-GUIDE-rev1.md
├── logo.jpg
├── cardback.jpg
├── favicon.ico
├── placeholder.svg
└── robots.txt
```

---

## Brand

| Element | Value |
|---------|-------|
| Primary | `#F5C518` (Golden Yellow) |
| Accent | `#E8A902` (Amber) |
| Background | `#141414` |
| Heading Font | Orbitron |
| Body Font | Rajdhani |
| Aesthetic | Cyberpunk / Graffiti |

---

## Credits System

All games use **virtual credits** for entertainment only. Not real currency.

| Event | Credits |
|-------|---------|
| Welcome bonus | 1,000 |
| Daily bonus | 200 (React: 500) |
| Monthly bonus | 500 |
| Bankruptcy recovery | 750 |
| Solitaire entry | -50 |
| Solitaire win (< 3 min) | +200 |

---

**© 2026 xSTIK. All rights reserved.**  
Built on the XRP Ledger. Part of the xSTIK ecosystem.
