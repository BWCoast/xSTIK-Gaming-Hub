# xSTIK Gaming Hub — Platform Audit

## Architecture Overview
- **Hub page** (`index.html`): Fully built landing page with game grid, leaderboards, NFT showcase
- **SHARED-CORE**: Well-structured shared modules (card-deck, image-loader, credit-system, player-system, leaderboard, game-init, brand CSS)
- **Games**: 9 game directories, only 2 have actual implementations (solitaire, spades)

## Status by Game

| Game | Status | Lines | Notes |
|------|--------|-------|-------|
| Solitaire | ✅ Functional | 1441 | Full implementation, needs polish |
| Spades | ✅ Functional | 726 | Full implementation, no CSS (style tag broken) |
| Blackjack | ❌ Stub | 24 | Only meta tags, broken `<style>` tag |
| Baccarat | ❌ Stub | 24 | Only meta tags, broken `<style>` tag |
| Casino War | ❌ Stub | 24 | Only meta tags, broken `<style>` tag |
| Pyramid | ❌ Stub | 24 | Only meta tags, broken `<style>` tag |
| Texas Hold'Em | ❌ Stub | 24 | Only meta tags, broken `<style>` tag |
| Three Card Brag | ❌ Stub | 24 | Only meta tags, broken `<style>` tag |
| Video Poker | ❌ Stub | 24 | Only meta tags, broken `<style>` tag |

## Critical Issues

### 1. Seven games are empty stubs
All stubs have broken HTML — `<style>` tag opens but `</head>` closes before content, `<body>` is empty.

### 2. No shared game CSS
Each game duplicates brand CSS inline. Solitaire has ~500 lines of copied CSS. Should use SHARED-CORE/branding/xstik-brand.css + a shared game CSS file.

### 3. Spades has no CSS
The style tag is truncated at line 21. The game HTML structure exists (lines 25-131) and game logic works (lines 150-722), but there's zero styling — everything renders as unstyled HTML.

### 4. NFT card images are the card faces
The NFT art shows xSTIK characters HOLDING playing cards with the rank/suit visible on the card they're holding. This means:
- Cards need to be large enough to read the rank/suit in the NFT art
- No need for rank/suit overlays — the art contains this info
- Card aspect ratio from the PNG: roughly 2:3 (standard playing card)

### 5. Fallback images
- 4 cards (1261, 1275, 1290, 1292) have no CDN URL — only local fallback PNGs in SHARED-CORE
- 48 cards have CDN URLs + fallback paths
- SVG placeholder is Level 3 emergency only
- Per user instruction: "NFTs with fallbacks - no need for SVG placeholders!"

## Solitaire Issues
- Duplicated CSS (~500 lines) instead of using shared CSS
- Footer is fixed at bottom (takes up game space)
- `FACE_DOWN_PX = 22` and `FACE_UP_PX = 55` — face-up overlap might hide too much of the NFT art
- Timer starts on game start, but no pause mechanism
- `submitGameScore()` duplicates leaderboard logic (mirror write already handled by SHARED-CORE)
- Header height is 5rem (too tall, should be 3.5rem per brand CSS)
- No condensed stack behavior per user request

## Spades Issues
- ZERO CSS — entire game is unstyled
- Missing Back to Game Hub link
- Missing HOW TO PLAY modal
- AI is overly simple (plays lowest legal card)
- Missing responsive design
- `submitGameScore()` function duplicates mirror write

## Design Requirements (from user)
1. No scrolling required for games
2. Cards must be equal size across all games
3. NFT art must fit inside containers and be readable
4. Condensed card stacks (solitaire: top + bottom card visible, rest condensed)
5. No fade-in effects unless new cards are dealt
6. Unified feel across all games
7. Proper card game mechanics
8. Professional animations for card dealing/moving
