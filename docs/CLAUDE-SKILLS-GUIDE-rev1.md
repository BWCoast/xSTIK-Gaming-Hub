# 🤖 Claude Skills Guide for xSTIK Development — Rev 1

**Purpose:** Maximize efficiency and quality using Claude's specialized Skills  
**Scope:** All xSTIK platforms (xstik.art, games.xstik.art, dashboard.xstik.art)  
**Updated:** 2026-02-16 — Reflects current Game Hub architecture  
**Changes from v1.0:** Removed XRPL auth references from game init, updated shared systems, added Solitaire as reference implementation

---

## 🏗️ Current Ecosystem

```
xSTIK Ecosystem
├── xstik.art              [DEPLOYED — Main site & NFT showcase]
├── games.xstik.art        [IN DEVELOPMENT — Game Hub]
│   ├── /blackjack         [PLANNED]
│   ├── /solitaire         [BUILT — Reference implementation]
│   ├── /poker             [PLANNED]
│   └── /slots             [PLANNED]
├── dashboard.xstik.art    [PLANNED — Portfolio & analytics]
└── SHARED-CORE/           [BUILT — Foundation layer]
    ├── nft-loader/        (card-deck.js, image-loader.js)
    ├── credit-system/     (credit-system.js)
    ├── player/            (player-system.js)
    ├── leaderboard/       (leaderboard.js)
    ├── branding/          (xstik-brand.css, logo.jpg)
    └── game-init.js       (universal bootstrap)
```

---

## 🛡️ PROTECTED ZONES (NEVER MODIFY)

These files are the foundation. Games **import** them — they never change them.

| File | What It Does |
|------|-------------|
| `card-deck.js` | 52-card NFT definitions (IDs, URLs, suits, ranks) |
| `image-loader.js` | 3-level fallback: Google CDN → local PNG → SVG |
| `credit-system.js` | Cross-game wallet (balance, bets, bonuses, bankruptcy) |
| `player-system.js` | Username creation, validation, welcome modal |
| `leaderboard.js` | Per-game + unified scoring with monthly reset |
| `xstik-brand.css` | All CSS variables, header/footer, buttons, effects |
| `game-init.js` | 7-step bootstrap (player check → credits → deck → ready) |

---

## 🎮 Creating a New Card Game

### Step-by-step:

1. **Create folder:** `games.xstik.art/[game-name]/`
2. **Create `index.html`** using the Solitaire file as reference
3. **Include these scripts in order:**
   ```html
   <script src="../SHARED-CORE/nft-loader/card-deck.js"></script>
   <script src="../SHARED-CORE/nft-loader/image-loader.js"></script>
   <script src="../SHARED-CORE/credit-system/credit-system.js"></script>
   <script src="../SHARED-CORE/player/player-system.js"></script>
   <script src="../SHARED-CORE/leaderboard/leaderboard.js"></script>
   <script src="../SHARED-CORE/game-init.js"></script>
   ```
4. **Boot the game:**
   ```javascript
   XstikGameInit.showDisclaimer();
   XstikGameInit.boot('your-game-name', {
     preloadCards: true,
     onReady: function() {
       // Your game starts here
     }
   });
   ```

### What `boot()` handles automatically:
- First-visit username modal → creates player
- Credit initialization → welcome/daily/monthly bonuses
- Credit display mounted in header
- Card deck preloaded (all 52 images resolved)
- Loading progress bar shown during preload

### Credit System API (use in your game logic):
```javascript
XstikCredits.getBalance()              // Current credits
XstikCredits.placeBet(amount, 'game')  // Deduct bet (returns true/false)
XstikCredits.awardWinnings(amt, 'game')// Add winnings
XstikCredits.payEntryFee(amt, 'game')  // One-time fee (like Solitaire's 50)
XstikCredits.isBankrupt()              // Balance < minimum bet?
XstikCredits.triggerBankruptcy(cb)     // xButtMcAssFace popup → +750 credits
```

### Leaderboard API:
```javascript
// Submit after game win
XstikLeaderboard.submitScore('PlayerName', 'game-name', {
  // game-specific details object
});
XstikLeaderboard.rebuildUnified(); // Update hub leaderboard

// Display
XstikLeaderboard.renderLeaderboard('#container', 'game', 'game-name');
```

### Card Deck API:
```javascript
XstikImageLoader.getShuffledDeck()     // Shuffled copy of 52 cards
XstikImageLoader.getCardImage('name')  // Resolved URL for card
XstikImageLoader.getCardBack()         // Card back image path
XstikImageLoader.handleError(img, card)// Fallback on <img> error
```

---

## 📐 Brand Rules Quick Reference

**Always use CSS variables, never hardcoded hex.**

| Purpose | Variable | Value |
|---------|----------|-------|
| Primary gold | `var(--primary)` | #F5C518 |
| Accent amber | `var(--accent)` | #E8A902 |
| Background | `var(--background)` | #141414 |
| Text | `var(--foreground)` | #FAFAFA |
| Card/panel bg | `var(--card-bg)` | #1F1F1F |
| Muted text | `var(--muted-text)` | #B3B3B3 |
| Border | `var(--border)` | #1C1B19 |
| Glow | `var(--glow-primary)` | rgba(245,197,24,0.4) |

**Fonts:** Orbitron (headings, 400/700/900) + Rajdhani (body, 300-700)  
**Breakpoints:** 767px (mobile), 768-1023px (tablet), 1024px+ (desktop)  
**Max width:** 1400px  
**Min font:** 14px  
**Min touch target:** 44px  

---

## 📚 Available Skills & When to Use Them

| Skill | Use For | xSTIK Examples |
|-------|---------|----------------|
| **Frontend Design** | Game UIs, dashboards, responsive layouts | New card game, hub redesign |
| **DOCX** | Game rules, guides, documentation | Blackjack rules, NFT tier guide |
| **PPTX** | Presentations, pitch decks | Investor deck, community update |
| **XLSX** | Data analysis, tracking sheets | Leaderboard export, floor prices |
| **PDF** | Certificates, reports | Winner certificates, monthly stats |

### Prompt Template for Any Skill:

```
Following BRAND-RULES.md exactly, use [Skill Name] to create [output].

PROTECTED (do not modify):
- SHARED-CORE/* (all files)

BRAND:
- Colors: var(--primary), var(--accent), var(--background)
- Fonts: Orbitron (headings), Rajdhani (body)
- Style: Cyberpunk graffiti, neon glows, glass morphism

DELIVERABLES:
1. [specific file]
2. [specific file]

Test at: 375px, 768px, 1024px
```

---

## 🎯 Game-Specific Scoring Formulas

Add new formulas to `leaderboard.js` → `SCORING` object:

**Solitaire:** `500 + max(0, 300-seconds) - (moves×2) + speed_bonus`  
**Blackjack:** `(wins×100) + (profit×0.5) + (streaks×50)`  
**Default:** Pass-through `details.score`

---

## 💡 Key Architecture Decisions

1. **Single-file games:** Each game is one HTML file (easy Netlify deploy)
2. **No build step:** Pure vanilla JS, no bundler, no npm
3. **localStorage MVP:** All data local; API migration path built in
4. **Credits ≠ Points:** Wallet economy separate from skill ranking
5. **Monthly reset:** Leaderboards archive and clear on the 1st
6. **4 fallback cards:** NFT IDs 1261, 1275, 1290, 1292 have no CDN URL — they use local PNGs exclusively

---

## ⚠️ Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| Hardcoded hex colors | Use `var(--primary)` etc. |
| Missing font import | Include Google Fonts link in every HTML |
| Wrong script order | card-deck → image-loader → credits → player → leaderboard → init |
| Modifying SHARED-CORE files | Create game-specific files only |
| Forgetting entry fee | Call `payEntryFee()` or `placeBet()` before game starts |
| Not handling bankruptcy | Check `isBankrupt()` → `triggerBankruptcy()` |
| Pure black (#000) for backgrounds | Use `var(--background)` (#141414) |
| Card container bg wrong | Card back containers use `#000` (exception to the rule — for gap fill) |

---

**Version:** Rev 1  
**Maintained by:** Kriss (xSTIK Senior Game Developer)  
**Last Updated:** 2026-02-16  
**Reference Implementation:** `solitaire/index.html`
