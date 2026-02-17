# ⚡ xSTIK Gaming Hub

**The #1 OG NFT Project on XRPL — Gaming Ecosystem**

A cross-game platform where every card you play is a real xSTIK NFT from the XRPL blockchain.

## 🎮 Games

| Game | Status | Entry Fee | Win Range |
|------|--------|-----------|-----------|
| Solitaire (Klondike) | ✅ Built | 50 credits | 100–200 credits |
| Blackjack | 🔜 Planned | 10+ credits | Per-hand |
| Poker | 🔜 Planned | 10+ credits | Per-hand |
| Slots | 🔜 Planned | 10+ credits | Per-spin |

## 🏗️ Architecture

```
xSTIK-Gaming-Hub/
├── SHARED-CORE/           ← Protected foundation (DO NOT MODIFY)
│   ├── nft-loader/        ← 52 NFT poker cards + 3-level image fallback
│   ├── credit-system/     ← Cross-game wallet + bankruptcy recovery
│   ├── player/            ← Username system + welcome flow
│   ├── leaderboard/       ← Per-game + unified scoring
│   ├── branding/          ← CSS variables + logo + standard components
│   ├── assets/            ← Card back, fallback images, xButtMcAssFace
│   └── game-init.js       ← Universal 7-step bootstrap
├── solitaire/             ← Klondike Solitaire (reference implementation)
└── docs/                  ← Development guides
```

## 🃏 NFT Integration

All 52 playing cards are real xSTIK NFTs minted on XRPL. The image loader resolves cards through a 3-level fallback:

1. **Google Storage CDN** — Fast, online (~94% coverage)
2. **Local PNG fallback** — Offline-capable backup
3. **Generated SVG** — Emergency placeholder with rank + suit

## 💰 Credit System

- **New player:** 1,000 welcome credits
- **Daily bonus:** +200 credits (24hr cooldown)
- **Monthly bonus:** +500 credits (1st of month)
- **Bankruptcy:** xButtMcAssFace popup → +750 recovery credits
- **Minimum bet:** 10 credits across all games

## 🏆 Leaderboards

- Per-game scoring with game-specific formulas
- Unified hub leaderboard aggregating all games
- Monthly reset with previous month archive
- Credits ≠ Points (wallet economy separate from skill ranking)

## 🛠️ Tech Stack

- **Vanilla JS** — No frameworks, no build step
- **localStorage** — MVP data layer (API migration path built in)
- **Single-file games** — Each game is one HTML file
- **Netlify-ready** — Drop and deploy

## 📋 Brand

- **Colors:** Golden Yellow (#F5C518) + Amber (#E8A902) on dark (#141414)
- **Fonts:** Orbitron (headings) + Rajdhani (body)
- **Style:** Cyberpunk graffiti with neon glows + glass morphism

## ⚠️ Disclaimer

All games use virtual credits for entertainment only. No real money, cryptocurrency, or monetary tokens are wagered, won, or lost.

---

**© 2026 xSTIK — #1 OG NFT Project on XRPL**
