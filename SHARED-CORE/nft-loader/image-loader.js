/**
 * xSTIK IMAGE LOADER — 3-Level Fallback System
 * ==============================================
 * PROTECTED FILE — DO NOT MODIFY
 * 
 * Resolution chain:
 *   Level 1: Google Storage CDN URL (fast, online)
 *   Level 2: Local fallback PNG (offline-capable)
 *   Level 3: Generated SVG placeholder (emergency)
 * 
 * Depends on: card-deck.js (XSTIK_POKER_DECK, CARD_BACK_PATH, SUIT_SYMBOLS, SUIT_COLORS)
 */

const XstikImageLoader = (function () {
  'use strict';

  // Resolved URLs cache: card name → working URL
  const _cache = {};
  let _deckReady = false;
  let _onReady = null;

  /**
   * Generate an SVG placeholder for a card (Level 3 emergency fallback)
   */
  function _generatePlaceholder(card) {
    const symbol = SUIT_SYMBOLS[card.suit] || '?';
    const color = SUIT_COLORS[card.suit] || '#F5C518';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
      <rect width="200" height="300" rx="12" fill="#1F1F1F" stroke="#F5C518" stroke-width="2"/>
      <text x="20" y="45" font-family="Orbitron,sans-serif" font-size="28" font-weight="700" fill="${color}">${card.rank}</text>
      <text x="20" y="75" font-size="24" fill="${color}">${symbol}</text>
      <text x="100" y="170" font-size="60" text-anchor="middle" fill="${color}">${symbol}</text>
      <text x="180" y="275" font-family="Orbitron,sans-serif" font-size="28" font-weight="700" fill="${color}" text-anchor="end">${card.rank}</text>
      <text x="180" y="245" font-size="24" fill="${color}" text-anchor="end">${symbol}</text>
      <text x="100" y="295" font-family="Rajdhani,sans-serif" font-size="10" fill="#F5C518" text-anchor="middle">xSTIK</text>
    </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  /**
   * Test if an image URL loads successfully
   * Returns a promise that resolves to the URL or rejects
   */
  function _testImage(url) {
    return new Promise((resolve, reject) => {
      if (!url || url.trim() === '') { reject('empty'); return; }
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject('failed');
      img.src = url;
    });
  }

  /**
   * Resolve the best available image URL for a card
   * Tries Level 1 → Level 2 → Level 3 in order
   */
  async function resolveCardImage(card) {
    // Return cached result if available
    if (_cache[card.name]) return _cache[card.name];

    // Level 1: Google Storage CDN
    try {
      const url = await _testImage(card.primaryUrl);
      _cache[card.name] = url;
      return url;
    } catch (e) { /* fall through */ }

    // Level 2: Local fallback PNG
    try {
      const url = await _testImage(card.fallbackPath);
      _cache[card.name] = url;
      return url;
    } catch (e) { /* fall through */ }

    // Level 3: SVG placeholder (always works)
    const svg = _generatePlaceholder(card);
    _cache[card.name] = svg;
    console.warn(`[xSTIK Loader] Using SVG placeholder for: ${card.name}`);
    return svg;
  }

  /**
   * Get the card back image URL
   */
  function getCardBack() {
    return CARD_BACK_PATH;
  }

  /**
   * Handle image error on an <img> element — swap to next fallback level
   * Usage: <img src="..." onerror="XstikImageLoader.handleError(this, cardObject)">
   */
  function handleError(imgElement, card) {
    const currentSrc = imgElement.src;

    // If currently on primary URL, try fallback
    if (currentSrc.includes('storage.googleapis.com') || currentSrc.includes('ipfs.io')) {
      imgElement.src = card.fallbackPath;
      return;
    }

    // If fallback also failed, use SVG placeholder
    imgElement.onerror = null; // prevent infinite loop
    imgElement.src = _generatePlaceholder(card);
  }

  /**
   * Preload all 52 card images in background
   * Calls onComplete when all cards have a resolved URL
   * Returns progress via onProgress(loaded, total)
   */
  function preloadDeck(onComplete, onProgress) {
    let loaded = 0;
    const total = XSTIK_POKER_DECK.length;

    XSTIK_POKER_DECK.forEach(card => {
      resolveCardImage(card).then(() => {
        loaded++;
        if (onProgress) onProgress(loaded, total);
        if (loaded === total) {
          _deckReady = true;
          if (onComplete) onComplete();
          if (_onReady) _onReady();
        }
      });
    });
  }

  /**
   * Check if all cards have been preloaded
   */
  function isDeckReady() {
    return _deckReady;
  }

  /**
   * Register a callback for when deck is ready
   */
  function onDeckReady(callback) {
    if (_deckReady) { callback(); return; }
    _onReady = callback;
  }

  /**
   * Get resolved image URL for a card by name (synchronous, from cache)
   * Only works after preloading. Returns placeholder if not cached.
   */
  function getCardImage(cardName) {
    if (_cache[cardName]) return _cache[cardName];
    const card = XSTIK_POKER_DECK.find(c => c.name === cardName);
    if (!card) return '';
    return card.primaryUrl || card.fallbackPath || _generatePlaceholder(card);
  }

  /**
   * Create a shuffled copy of the deck
   */
  function getShuffledDeck() {
    const deck = [...XSTIK_POKER_DECK];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  // Public API
  return {
    resolveCardImage,
    getCardBack,
    handleError,
    preloadDeck,
    isDeckReady,
    onDeckReady,
    getCardImage,
    getShuffledDeck
  };
})();
