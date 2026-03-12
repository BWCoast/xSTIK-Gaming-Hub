/**
 * xSTIK GAME WRAPPER — Universal Header/Footer/Leaderboard Injector
 * ==================================================================
 * Extracts the Solitaire-standard UI chrome and enforces it across
 * all 9 minigames. Every game inherits identical:
 *   - Header: logo (left) + game name H1/H2 + player name (right) + nav buttons
 *   - Footer: xSTIK.art link, Game Hub link, legal disclaimer
 *   - Leaderboard modal: same z-index, centering, overlay opacity, touch handling
 *   - Bankruptcy intercept: checks balance on boot, shows xButtMcAssFace if needed
 *
 * Usage in each game's <script>:
 *   XstikWrapper.mount('BLACKJACK');
 *
 * This should be loaded AFTER game-layout.css and BEFORE game-init.js.
 * It does NOT touch game logic — only UI chrome.
 */

const XstikWrapper = (function () {
  'use strict';

  // ---- Solitaire-Standard Header HTML ----
  function _buildHeader(gameName) {
    return `
    <header class="game-header">
      <a href="https://xstik.art" target="_blank" rel="noopener noreferrer" class="logo-wrap">
        <img src="/SHARED-CORE/branding/assets/logo.jpg" alt="xSTIK" class="logo-coin"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2248%22 fill=%22%23F5C518%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-family=%22Orbitron%22 font-size=%2240%22 font-weight=%22900%22 fill=%22%23000%22 text-anchor=%22middle%22%3EX%3C/text%3E%3C/svg%3E'">
        <div>
          <div class="logo-text">xSTIK</div>
          <div class="logo-sub">${_escapeHTML(gameName)}</div>
        </div>
      </a>
      <div class="header-actions">
        <a href="/" class="btn-back-link">\u2190 Hub</a>
        <span class="player-name" style="font-family:'Rajdhani',sans-serif;font-weight:600;font-size:0.8rem;color:var(--primary);max-width:8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>
        <div id="credit-display"></div>
        <button class="btn-sm" id="btn-rules">RULES</button>
        <button class="btn-sm" id="btn-leaderboard">\uD83C\uDFC6</button>
      </div>
    </header>`;
  }

  // ---- Solitaire-Standard Footer HTML ----
  function _buildFooter() {
    return `
    <footer class="game-footer-bar">
      <div><a href="https://xstik.art">xSTIK.art</a> \u00B7 <a href="/">Game Hub</a></div>
      <div class="footer-legal">Virtual credits \u2014 entertainment only. \u00A9 2026 xSTIK</div>
    </footer>`;
  }

  // ---- Standard Leaderboard Modal HTML ----
  function _buildLeaderboardModal() {
    return `
    <div class="lb-overlay" id="lb-overlay">
      <div class="lb-backdrop" id="lb-backdrop"></div>
      <div class="lb-panel">
        <div class="lb-handle-bar"></div>
        <div class="lb-handle">
          <span class="lb-title">\uD83C\uDFC6 LEADERBOARD</span>
          <button class="lb-close" id="btn-lb-close">CLOSE</button>
        </div>
        <div class="lb-content" id="leaderboard-area"></div>
      </div>
    </div>`;
  }

  // ---- Standard Rules Modal HTML ----
  function _buildRulesModal() {
    return `
    <div class="rules-overlay" id="rules-overlay">
      <div class="rules-box" id="rules-box">
        <h2 class="rules-title">HOW TO PLAY</h2>
        <div id="rules-content"><!-- game fills this --></div>
        <button class="rules-close" id="rules-close-btn">GOT IT</button>
      </div>
    </div>`;
  }

  // ---- Mount ----
  /**
   * Mount the universal wrapper around the existing game shell.
   * gameName: display name (e.g., "BLACKJACK", "TEXAS HOLD'EM")
   * options:
   *   - replaceHeader: bool (default true) — replace existing <header>
   *   - replaceFooter: bool (default true) — replace existing <footer>
   *   - replaceLeaderboard: bool (default true) — inject standard LB modal
   *   - replaceRules: bool (default true) — inject standard rules modal
   */
  function mount(gameName, options) {
    var opts = Object.assign({
      replaceHeader: true,
      replaceFooter: true,
      replaceLeaderboard: true,
      replaceRules: true
    }, options || {});

    var shell = document.querySelector('.game-shell');
    if (!shell) return;

    // Replace header
    if (opts.replaceHeader) {
      var oldHeader = shell.querySelector('.game-header');
      if (oldHeader) {
        var temp = document.createElement('div');
        temp.innerHTML = _buildHeader(gameName);
        var newHeader = temp.firstElementChild;
        oldHeader.replaceWith(newHeader);
      }
    }

    // Replace footer
    if (opts.replaceFooter) {
      var oldFooter = shell.querySelector('.game-footer-bar');
      if (oldFooter) {
        var tempF = document.createElement('div');
        tempF.innerHTML = _buildFooter();
        oldFooter.replaceWith(tempF.firstElementChild);
      }
    }

    // Inject leaderboard modal (replace if exists — search whole document since
    // some games have modals outside .game-shell)
    if (opts.replaceLeaderboard) {
      var oldLb = document.getElementById('lb-overlay');
      if (oldLb) oldLb.remove();
      shell.insertAdjacentHTML('beforeend', _buildLeaderboardModal());
    }

    // Inject rules modal (replace if exists, but preserve content)
    if (opts.replaceRules) {
      var oldRules = document.getElementById('rules-overlay');
      var savedRulesHTML = '';
      if (oldRules) {
        // Preserve the existing rules content (game-specific rules)
        var oldBox = oldRules.querySelector('.rules-box');
        if (oldBox) savedRulesHTML = oldBox.innerHTML;
        oldRules.remove();
      }
      shell.insertAdjacentHTML('beforeend', _buildRulesModal());
      // Restore preserved rules content
      if (savedRulesHTML) {
        var newBox = document.getElementById('rules-box');
        if (newBox) newBox.innerHTML = savedRulesHTML;
      }
    }

    // Wire universal event handlers
    _wireEvents(gameName);
  }

  // ---- Wire Events ----
  function _wireEvents(gameName) {
    // Leaderboard open/close
    var lbBtn = document.getElementById('btn-leaderboard');
    var lbOverlay = document.getElementById('lb-overlay');
    var lbClose = document.getElementById('btn-lb-close');
    var lbBackdrop = document.getElementById('lb-backdrop');

    if (lbBtn && lbOverlay) {
      var openLb = function () {
        lbOverlay.classList.add('open');
        _renderLeaderboard(gameName);
      };
      lbBtn.addEventListener('click', openLb);
      lbBtn.addEventListener('touchend', function (e) { e.preventDefault(); openLb(); });
    }

    if (lbClose && lbOverlay) {
      var closeLb = function () { lbOverlay.classList.remove('open'); };
      lbClose.addEventListener('click', closeLb);
      lbClose.addEventListener('touchend', function (e) { e.preventDefault(); closeLb(); });
    }

    if (lbBackdrop && lbOverlay) {
      lbBackdrop.addEventListener('click', function () { lbOverlay.classList.remove('open'); });
      lbBackdrop.addEventListener('touchend', function (e) {
        e.preventDefault();
        lbOverlay.classList.remove('open');
      });
    }

    // Rules open/close
    var rulesBtn = document.getElementById('btn-rules');
    var rulesOverlay = document.getElementById('rules-overlay');
    var rulesClose = document.getElementById('rules-close-btn');

    if (rulesBtn && rulesOverlay) {
      var openRules = function () { rulesOverlay.classList.add('open'); };
      rulesBtn.addEventListener('click', openRules);
      rulesBtn.addEventListener('touchend', function (e) { e.preventDefault(); openRules(); });
    }

    if (rulesClose && rulesOverlay) {
      var closeRules = function () { rulesOverlay.classList.remove('open'); };
      rulesClose.addEventListener('click', closeRules);
      rulesClose.addEventListener('touchend', function (e) { e.preventDefault(); closeRules(); });
    }

    // Close rules by clicking outside the box
    if (rulesOverlay) {
      rulesOverlay.addEventListener('click', function (e) {
        if (e.target === rulesOverlay) rulesOverlay.classList.remove('open');
      });
    }
  }

  // ---- Leaderboard Render (with Supabase merge + DebugUser filter) ----
  function _renderLeaderboard(gameName) {
    var container = document.getElementById('leaderboard-area');
    if (!container) return;

    // Compute the GAME_SLUG from the display name
    var slug = _gameSlug(gameName);

    // Show loading state
    container.innerHTML = '<p style="text-align:center;color:var(--muted-text);padding:2rem;font-family:Rajdhani,sans-serif;">Loading scores\u2026</p>';

    // Try to fetch from Supabase first for cross-device scores
    _fetchSupabaseScores(slug).then(function (remoteScores) {
      // Merge remote scores into localStorage leaderboard
      if (remoteScores && remoteScores.length > 0) {
        _mergeRemoteScores(slug, remoteScores);
      }
      // Now render from localStorage (which now has merged data)
      if (typeof XstikLeaderboard !== 'undefined') {
        XstikLeaderboard.renderLeaderboard('#leaderboard-area', 'game', slug);
      }
    }).catch(function () {
      // Fallback: render from localStorage only
      if (typeof XstikLeaderboard !== 'undefined') {
        XstikLeaderboard.renderLeaderboard('#leaderboard-area', 'game', slug);
      }
    });
  }

  // ---- Supabase Score Fetching ----
  function _fetchSupabaseScores(gameSlug) {
    return fetch('/.netlify/functions/leaderboard?game=' + encodeURIComponent(gameSlug) + '&limit=50')
      .then(function (res) {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(function (data) {
        // Filter out DebugUser
        return (data || []).filter(function (entry) {
          return entry.player_name !== 'DebugUser';
        });
      });
  }

  // ---- Merge Remote Scores into LocalStorage ----
  function _mergeRemoteScores(gameSlug, remoteScores) {
    if (typeof XstikLeaderboard === 'undefined') return;

    var PREFIX = 'xstik_leaderboard_';
    var key = PREFIX + gameSlug;
    var board;

    try {
      var raw = localStorage.getItem(key);
      board = raw ? JSON.parse(raw) : null;
    } catch (e) {
      board = null;
    }

    if (!board) {
      var now = new Date();
      board = {
        currentMonth: now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0'),
        scores: [],
        previousMonth: null
      };
    }

    // Merge each remote score (only if better than existing)
    remoteScores.forEach(function (remote) {
      if (remote.player_name === 'DebugUser') return;

      var existingIdx = board.scores.findIndex(function (s) {
        return s.playerName === remote.player_name;
      });

      if (existingIdx >= 0) {
        if (remote.score > board.scores[existingIdx].score) {
          board.scores[existingIdx].score = remote.score;
          board.scores[existingIdx].timestamp = remote.created_at || new Date().toISOString();
        }
      } else {
        board.scores.push({
          playerName: remote.player_name,
          score: remote.score,
          details: {},
          timestamp: remote.created_at || new Date().toISOString()
        });
      }
    });

    // Sort and save
    board.scores.sort(function (a, b) { return b.score - a.score; });
    board.scores = board.scores.slice(0, 50);
    localStorage.setItem(key, JSON.stringify(board));
  }

  // ---- Game Slug from Display Name ----
  function _gameSlug(displayName) {
    var map = {
      'SOLITAIRE': 'solitaire',
      'BLACKJACK': 'blackjack',
      'TEXAS HOLD\'EM': 'texas-holdem',
      'SPADES': 'spades',
      'VIDEO POKER': 'video-poker',
      'THREE CARD BRAG': 'three-card-brag',
      'BACCARAT': 'baccarat',
      'CASINO WAR': 'casino-war',
      'PYRAMID': 'pyramid'
    };
    return map[displayName.toUpperCase()] || displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  // ---- Bankruptcy Check ----
  /**
   * Call after boot to check if player is bankrupt.
   * If balance <= 0, shows the xButtMcAssFace popup.
   * Returns a promise that resolves when player can play.
   */
  function checkBankruptcy() {
    return new Promise(function (resolve) {
      if (typeof XstikCredits === 'undefined') { resolve(); return; }
      if (!XstikCredits.isBankrupt()) { resolve(); return; }

      XstikCredits.triggerBankruptcy(function () {
        resolve();
      });
    });
  }

  // ---- Set Rules Content ----
  /**
   * Set the rules content for the current game.
   * html: innerHTML string for the rules-content div.
   */
  function setRulesContent(html) {
    var el = document.getElementById('rules-content');
    if (el) el.innerHTML = html;
  }

  // ---- Helper ----
  function _escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    mount: mount,
    checkBankruptcy: checkBankruptcy,
    setRulesContent: setRulesContent
  };
})();
