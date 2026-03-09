# xSTIK Game Build Specification

## CRITICAL RULES
1. **DO NOT MODIFY** any file in SHARED-CORE/ — these are protected
2. **DO NOT CHANGE** xSTIK branding (colors, fonts, logo usage)
3. **DO NOT CHANGE** leaderboard logic (XstikLeaderboard system works)
4. **DO NOT CHANGE** disclaimer (XstikGameInit.showDisclaimer)
5. **No scrolling** — entire game must fit in viewport without scroll
6. **No fade-in effects** — unless cards are being newly dealt
7. **NFT art IS the card face** — no need for SVG placeholders

## HTML Template Structure

Every game MUST use this exact shell structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>xSTIK [Game Name]</title>
  <meta property="og:title" content="xSTIK [Game Name]">
  <meta property="og:description" content="[Description]">
  <meta property="og:image" content="https://games.xstik.art/og-preview.png">
  <meta property="og:url" content="https://games.xstik.art/[game-slug]">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/logo.jpg" type="image/jpeg">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/SHARED-CORE/branding/xstik-brand.css">
  <link rel="stylesheet" href="/SHARED-CORE/game-layout.css">
  <style>
    /* Game-specific CSS ONLY — minimal overrides */
  </style>
</head>
<body>
  <div class="game-shell">

    <!-- HEADER -->
    <header class="game-header">
      <a href="https://xstik.art" target="_blank" rel="noopener noreferrer" class="logo-wrap">
        <img src="/SHARED-CORE/branding/assets/logo.jpg" alt="xSTIK" class="logo-coin">
        <div>
          <div class="logo-text">xSTIK</div>
          <div class="logo-sub">[GAME NAME]</div>
        </div>
      </a>
      <div class="header-actions">
        <a href="/" class="btn-back-link">← Hub</a>
        <div id="credit-display"></div>
        <button class="btn-sm" id="btn-rules">RULES</button>
        <button class="btn-sm" id="btn-leaderboard">🏆</button>
      </div>
    </header>

    <!-- GAME AREA -->
    <main class="game-area">
      <!-- Game-specific content here -->
    </main>

    <!-- FOOTER -->
    <footer class="game-footer-bar">
      <div><a href="https://xstik.art">xSTIK.art</a> · <a href="/">Game Hub</a></div>
      <div class="footer-legal">Virtual credits — entertainment only. © 2026 xSTIK</div>
    </footer>

  </div>

  <!-- Rules overlay -->
  <div class="rules-overlay" id="rules-overlay">
    <div class="rules-box">
      <!-- Game rules content -->
      <button class="rules-close" id="btn-rules-close">GOT IT</button>
    </div>
  </div>

  <!-- Leaderboard panel -->
  <div class="lb-overlay" id="lb-overlay">
    <div class="lb-backdrop" id="lb-backdrop"></div>
    <div class="lb-panel">
      <div class="lb-handle-bar"></div>
      <div class="lb-handle">
        <span class="lb-title">🏆 [GAME] LEADERBOARD</span>
        <button class="lb-close" id="btn-lb-close">CLOSE</button>
      </div>
      <div class="lb-content" id="leaderboard-area"></div>
    </div>
  </div>

  <!-- Win screen -->
  <div class="win-screen" id="win-screen">
    <!-- Win content -->
  </div>

  <!-- Drag ghost (for drag-drop games) -->
  <div id="drag-ghost"></div>

  <!-- SHARED-CORE Scripts — EXACT ORDER -->
  <script src="/SHARED-CORE/nft-loader/card-deck.js"></script>
  <script src="/SHARED-CORE/nft-loader/image-loader.js"></script>
  <script src="/SHARED-CORE/credit-system/credit-system.js"></script>
  <script src="/SHARED-CORE/player/player-system.js"></script>
  <script src="/SHARED-CORE/leaderboard/leaderboard.js"></script>
  <script src="/SHARED-CORE/game-init.js"></script>

  <script>
  (function () {
    'use strict';
    // Game logic here...

    // BOOT — always end with this pattern:
    XstikGameInit.showDisclaimer();
    XstikGameInit.boot('[game-slug]', {
      preloadCards: true,
      onReady: function () {
        wireEvents();
        // Show start overlay or begin game
      }
    });
  })();
  </script>
</body>
</html>
```

## Card Rendering Pattern

```javascript
function createCardEl(card, faceUp) {
  const el = document.createElement('div');
  el.className = 'card ' + (faceUp ? 'face-up' : 'face-down');
  el.dataset.name = card.name;
  const img = document.createElement('img');
  if (faceUp) {
    img.src = XstikImageLoader.getCardImage(card.name) || card.fallbackPath;
    img.alt = card.name;
    img.onerror = function () { XstikImageLoader.handleError(this, card); };
  } else {
    img.src = CARD_BACK_PATH;
    img.alt = 'Card back';
  }
  el.appendChild(img);
  // Add rank badge for readability at small sizes
  if (faceUp) {
    const badge = document.createElement('span');
    badge.className = 'card-badge' + (['Hearts','Diamonds'].includes(card.suit) ? ' red' : '');
    badge.textContent = card.rank + ({Hearts:'♥',Diamonds:'♦',Clubs:'♣',Spades:'♠'}[card.suit] || '');
    el.appendChild(badge);
  }
  return el;
}
```

## Score Submission Pattern

```javascript
// After game ends:
const playerName = XstikPlayer.getUsername() || 'Anonymous';
const result = XstikLeaderboard.submitScore(playerName, 'game-slug', {
  handsPlayed: totalHands,
  wins: wins,
  creditsWon: totalCreditsWon,
  // Game-specific fields...
});
XstikLeaderboard.rebuildUnified();
```

## Event Wiring Pattern

```javascript
function wireEvents() {
  // Rules modal
  document.getElementById('btn-rules').addEventListener('click', () =>
    document.getElementById('rules-overlay').classList.add('open'));
  document.getElementById('btn-rules-close').addEventListener('click', () =>
    document.getElementById('rules-overlay').classList.remove('open'));
  document.getElementById('rules-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('rules-overlay'))
      document.getElementById('rules-overlay').classList.remove('open');
  });

  // Leaderboard
  function openLB() {
    XstikLeaderboard.renderLeaderboard('#leaderboard-area', 'game', 'game-slug');
    document.getElementById('lb-overlay').classList.add('open');
  }
  function closeLB() { document.getElementById('lb-overlay').classList.remove('open'); }
  document.getElementById('btn-leaderboard').addEventListener('click', openLB);
  document.getElementById('btn-lb-close').addEventListener('click', closeLB);
  document.getElementById('lb-backdrop').addEventListener('click', closeLB);
}
```

## Credit System Usage

```javascript
const ENTRY_FEE = 50; // or appropriate amount

// Check balance before starting
if (XstikCredits.getBalance() < ENTRY_FEE) {
  if (XstikCredits.isBankrupt()) {
    XstikCredits.triggerBankruptcy(() => startGame());
  }
  return;
}

// For betting games (blackjack, baccarat, etc.):
XstikCredits.placeBet(betAmount, 'game-slug');

// For entry fee games (solitaire, pyramid):
XstikCredits.payEntryFee(ENTRY_FEE, 'game-slug');

// Award winnings:
XstikCredits.awardWinnings(amount, 'game-slug');
```

## Card Game Rules Reference

### Blackjack
- Standard 21 rules, dealer stands on 17
- Ace = 1 or 11, face cards = 10
- Blackjack pays 3:2
- Actions: Hit, Stand, Double Down (double bet, one more card)
- Split not needed (simplified version)

### Baccarat
- Bet on Player, Banker, or Tie
- Natural 8 or 9 wins immediately
- Player draws on 0-5, stands on 6-7
- Banker drawing rules based on own total and player's third card
- Player pays 1:1, Banker pays 0.95:1 (5% commission), Tie pays 8:1

### Casino War
- Player and dealer each get one card
- Higher card wins (Aces high)
- On tie: player can "Go to War" (double bet, deal again) or surrender (lose half bet)
- Win at war pays 1:1 on raised bet

### Video Poker (Jacks or Better)
- 5 cards dealt, choose which to hold
- Redraw non-held cards once
- Payouts based on poker hand ranking
- Minimum winning hand: pair of Jacks or better

### Pyramid
- 28 cards in pyramid (7 rows), rest in stock
- Remove pairs that add to 13 (A=1, J=11, Q=12, K=13 alone)
- Only exposed cards (no card covering them) can be removed
- Win by clearing entire pyramid

### Three Card Brag
- 3 cards each to player and dealer
- Player ante, then see cards
- Play (equal ante) or fold (lose ante)
- Hand rankings: Prial > Running Flush > Run > Flush > Pair > High Card
- Dealer qualifies with Q-high or better

### Texas Hold'Em (simplified, vs AI)
- 2 hole cards each, 5 community cards (flop/turn/river)
- Betting rounds: pre-flop, flop, turn, river
- Standard poker hand rankings
- Actions: Check, Bet, Call, Raise, Fold
- AI opponents with basic strategy
