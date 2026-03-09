# xSTIK Game Build Context (for subagents)

## CRITICAL RULES
1. **DO NOT MODIFY** any file in SHARED-CORE/ — protected
2. **DO NOT CHANGE** xSTIK branding, disclaimer, or leaderboard logic
3. **No scrolling** — entire game must fit in viewport
4. **No fade-in effects** — unless cards are newly dealt
5. **NFT art IS the card face** — use image-loader, no SVG placeholders
6. Cards must be **equal size, large enough to read the embedded rank/suit** in the NFT art
7. Card badge (rank+suit) for readability at small sizes

## File Structure
Write ONLY `[game-folder]/index.html` as a single self-contained HTML file.

## SHARED-CORE APIs Available (loaded via script tags)

### Card Deck (XSTIK_POKER_DECK)
Array of 52 card objects:
```js
{ name:'Ace of Hearts', rank:'A', suit:'Hearts', value:11, ace:true, nftId:1276, primaryUrl:'...', fallbackPath:'...' }
```
- rank: 'A','2'-'10','J','Q','K'
- suit: 'Hearts','Diamonds','Clubs','Spades'
- value: numeric (Aces=11, face=10)
- ace: boolean for Ace handling
- CARD_BACK_PATH = '/SHARED-CORE/assets/cardback.jpg'

### Image Loader (XstikImageLoader)
- `getShuffledDeck()` → shuffled copy of full 52-card deck
- `getCardImage(cardName)` → resolved image URL (sync, from cache after preload)
- `getCardBack()` → card back image path
- `handleError(imgElement, card)` → onerror handler for fallback chain
- `preloadDeck(onComplete, onProgress)` → preload all cards

### Credit System (XstikCredits)
- `getBalance()` → current credits
- `getMinBet()` → 10
- `placeBet(amount, gameName)` → returns true/false, deducts from balance
- `awardWinnings(amount, gameName)` → adds to balance
- `payEntryFee(amount, gameName)` → deducts entry fee
- `isBankrupt()` → true if balance < MIN_BET
- `triggerBankruptcy(onComplete)` → shows recovery popup, awards 750
- `mountDisplay('#credit-display')` → auto-called by game-init
- `onBalanceChange(callback)` → listen for changes

### Player System (XstikPlayer)
- `getUsername()` → string or null
- `exists()` → boolean

### Leaderboard (XstikLeaderboard)
- `submitScore(playerName, gameName, details)` → { rank, score, isNewBest }
- `renderLeaderboard(selector, mode, gameName)` → renders into container
- `rebuildUnified()` → recalc global board

Score details vary by game — see GAME-SPEC.md for each game's scoring fields.

### Game Init (XstikGameInit)
```js
XstikGameInit.showDisclaimer();
XstikGameInit.boot('game-slug', {
  preloadCards: true,
  onReady: function() { wireEvents(); startGame(); }
});
```

## HTML Template (MANDATORY — use exactly this structure)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>xSTIK [Game Name]</title>
  <link rel="icon" href="/logo.jpg" type="image/jpeg">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/SHARED-CORE/branding/xstik-brand.css">
  <link rel="stylesheet" href="/SHARED-CORE/game-layout.css">
  <style>/* Game-specific CSS ONLY */</style>
</head>
<body>
  <div class="game-shell">
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
    <main class="game-area"><!-- game content --></main>
    <footer class="game-footer-bar">
      <div><a href="https://xstik.art">xSTIK.art</a> · <a href="/">Game Hub</a></div>
      <div class="footer-legal">Virtual credits — entertainment only. © 2026 xSTIK</div>
    </footer>
  </div>
  <!-- Rules overlay, Leaderboard panel, Win screen — see GAME-SPEC.md -->
  <div class="rules-overlay" id="rules-overlay"><div class="rules-box"><!-- rules --><button class="rules-close" id="btn-rules-close">GOT IT</button></div></div>
  <div class="lb-overlay" id="lb-overlay"><div class="lb-backdrop" id="lb-backdrop"></div><div class="lb-panel"><div class="lb-handle-bar"></div><div class="lb-handle"><span class="lb-title">🏆 LEADERBOARD</span><button class="lb-close" id="btn-lb-close">CLOSE</button></div><div class="lb-content" id="leaderboard-area"></div></div></div>
  <div class="win-screen" id="win-screen"></div>
  
  <script src="/SHARED-CORE/nft-loader/card-deck.js"></script>
  <script src="/SHARED-CORE/nft-loader/image-loader.js"></script>
  <script src="/SHARED-CORE/credit-system/credit-system.js"></script>
  <script src="/SHARED-CORE/player/player-system.js"></script>
  <script src="/SHARED-CORE/leaderboard/leaderboard.js"></script>
  <script src="/SHARED-CORE/game-init.js"></script>
  <script>
  (function () {
    'use strict';
    // ALL game logic here
    XstikGameInit.showDisclaimer();
    XstikGameInit.boot('game-slug', { preloadCards: true, onReady: function () { wireEvents(); } });
  })();
  </script>
</body>
</html>
```

## Card Rendering Pattern (use this exactly)
```js
function createCardEl(card, faceUp) {
  var el = document.createElement('div');
  el.className = 'card ' + (faceUp ? 'face-up' : 'face-down');
  el.dataset.name = card.name;
  var img = document.createElement('img');
  if (faceUp) {
    img.src = XstikImageLoader.getCardImage(card.name) || card.fallbackPath;
    img.alt = card.name;
    img.onerror = function () { XstikImageLoader.handleError(this, card); };
  } else {
    img.src = CARD_BACK_PATH;
    img.alt = 'Card back';
  }
  el.appendChild(img);
  if (faceUp) {
    var badge = document.createElement('span');
    badge.className = 'card-badge' + (['Hearts','Diamonds'].includes(card.suit) ? ' red' : '');
    badge.textContent = card.rank + ({Hearts:'♥',Diamonds:'♦',Clubs:'♣',Spades:'♠'}[card.suit] || '');
    el.appendChild(badge);
  }
  return el;
}
```

## Shared CSS Classes Available (from game-layout.css)
- `.game-shell` — flexbox column, 100vh
- `.game-header` — compact 3rem header
- `.game-area` — flex:1, no overflow
- `.game-footer-bar` — 2rem footer
- `.card` — card-w × card-h, border-radius, overflow hidden
- `.card img` — 100% cover
- `.card.face-up`, `.card.face-down` — cursor states
- `.card.selected` — gold glow
- `.card-badge`, `.card-badge.red` — rank/suit overlay
- `.card-slot`, `.card-slot.has-cards` — empty pile placeholder
- `.deal-in` — deal animation
- `.card-flip` — flip animation
- `.btn-sm` — small button (outlined)
- `.btn-game` — primary action button (filled gold)
- `.center-overlay` / `.center-overlay.show` — centered overlay (for start, result screens)
- `.overlay-title` — gradient gold text
- `.overlay-text` — muted description
- `.result-text.win/.lose/.push` — result display
- `.table-felt` — flex column centered game area
- `.hand-area` — horizontal card layout
- `.hand-label` — "DEALER" / "PLAYER" label
- `.hand-value` — hand total display
- `.bet-controls` — bet row
- `.bet-display` — bet amount
- `.action-buttons` — action button row
- `.fan-hand` — poker fan layout (hover up on cards)
- `.rules-overlay/.open` — rules modal
- `.lb-overlay/.open` — leaderboard slide-up
- `.win-screen/.show` — fullscreen win overlay

## Event Wiring Pattern (use this exactly)
```js
function wireEvents() {
  document.getElementById('btn-rules').addEventListener('click', function() {
    document.getElementById('rules-overlay').classList.add('open');
  });
  document.getElementById('btn-rules-close').addEventListener('click', function() {
    document.getElementById('rules-overlay').classList.remove('open');
  });
  document.getElementById('rules-overlay').addEventListener('click', function(e) {
    if (e.target === document.getElementById('rules-overlay'))
      document.getElementById('rules-overlay').classList.remove('open');
  });
  function openLB() {
    XstikLeaderboard.renderLeaderboard('#leaderboard-area', 'game', GAME_SLUG);
    document.getElementById('lb-overlay').classList.add('open');
  }
  function closeLB() { document.getElementById('lb-overlay').classList.remove('open'); }
  document.getElementById('btn-leaderboard').addEventListener('click', openLB);
  document.getElementById('btn-lb-close').addEventListener('click', closeLB);
  document.getElementById('lb-backdrop').addEventListener('click', closeLB);
}
```

## Score Submission Pattern
```js
var playerName = XstikPlayer.getUsername() || 'Anonymous';
XstikLeaderboard.submitScore(playerName, GAME_SLUG, {
  handsPlayed: totalHands,
  wins: wins,
  creditsWon: totalCreditsWon
  // + game-specific fields
});
XstikLeaderboard.rebuildUnified();
```
