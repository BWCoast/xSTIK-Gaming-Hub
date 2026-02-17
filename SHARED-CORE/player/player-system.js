/**
 * xSTIK PLAYER SYSTEM — Username & Identity Management
 * ======================================================
 * PROTECTED FILE — DO NOT MODIFY
 *
 * Handles:
 *   - First-visit username creation modal
 *   - Username validation (3-16 chars, alphanumeric + underscore)
 *   - Player profile in localStorage
 *   - Integration with credit system welcome bonus
 *
 * localStorage key: "xstik_player"
 */

const XstikPlayer = (function () {
  'use strict';

  const STORAGE_KEY = 'xstik_player';
  const MIN_LENGTH = 3;
  const MAX_LENGTH = 16;
  const VALID_PATTERN = /^[a-zA-Z0-9_]+$/;

  function _getPlayer() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function _savePlayer(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function exists() {
    return !!_getPlayer();
  }

  function getUsername() {
    const p = _getPlayer();
    return p ? p.username : null;
  }

  function getProfile() {
    return _getPlayer();
  }

  function validate(name) {
    if (!name || typeof name !== 'string') return { valid: false, error: 'Name required' };
    const trimmed = name.trim();
    if (trimmed.length < MIN_LENGTH) return { valid: false, error: `Minimum ${MIN_LENGTH} characters` };
    if (trimmed.length > MAX_LENGTH) return { valid: false, error: `Maximum ${MAX_LENGTH} characters` };
    if (!VALID_PATTERN.test(trimmed)) return { valid: false, error: 'Letters, numbers, and underscores only' };
    return { valid: true, error: null };
  }

  function createPlayer(username, firstGame) {
    const check = validate(username);
    if (!check.valid) return check;

    _savePlayer({
      username: username.trim(),
      createdAt: new Date().toISOString(),
      firstGame: firstGame || 'game-hub',
      gamesPlayed: {}
    });
    return { valid: true, error: null };
  }

  function changeUsername(newName) {
    const check = validate(newName);
    if (!check.valid) return check;

    const player = _getPlayer();
    if (!player) return { valid: false, error: 'No player found' };

    player.username = newName.trim();
    _savePlayer(player);
    return { valid: true, error: null };
  }

  /**
   * Show the welcome modal for first-time players.
   * Resolves with the chosen username when submitted.
   * gameName: the current game (stored as firstGame).
   */
  function showWelcomeModal(gameName) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.id = 'xstik-welcome-overlay';
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.9);
        display:flex;align-items:center;justify-content:center;padding:1.5rem;
      `;

      overlay.innerHTML = `
        <style>
          #xstik-welcome-box{background:#1F1F1F;border:1px solid rgba(245,197,24,0.3);border-radius:0.75rem;padding:2rem;max-width:22rem;width:100%;text-align:center;box-shadow:0 0 40px rgba(245,197,24,0.15);}
          #xstik-welcome-box img{width:3.5rem;height:3.5rem;border-radius:50%;border:2px solid rgba(245,197,24,0.4);box-shadow:0 0 15px rgba(245,197,24,0.3);margin-bottom:1rem;}
          #xstik-welcome-box h2{font-family:'Orbitron',sans-serif;font-weight:700;font-size:1.25rem;color:#F5C518;margin-bottom:0.25rem;}
          #xstik-welcome-box p{font-family:'Rajdhani',sans-serif;color:#B3B3B3;font-size:0.95rem;margin-bottom:1.25rem;line-height:1.4;}
          #xstik-welcome-box input{width:100%;padding:0.65rem 0.75rem;background:#141414;border:1px solid #333;border-radius:0.5rem;color:#FAFAFA;font-family:'Rajdhani',sans-serif;font-size:1rem;outline:none;transition:border 0.2s;}
          #xstik-welcome-box input:focus{border-color:#F5C518;}
          #xstik-welcome-error{font-family:'Rajdhani',sans-serif;font-size:0.85rem;color:#ef4444;min-height:1.25rem;margin:0.5rem 0;}
          #xstik-welcome-btn{width:100%;padding:0.7rem;background:#F5C518;color:#0D0D0D;font-family:'Rajdhani',sans-serif;font-weight:600;font-size:1rem;text-transform:uppercase;letter-spacing:1px;border:none;border-radius:0.5rem;cursor:pointer;box-shadow:0 0 20px rgba(245,197,24,0.3);transition:all 0.2s;}
          #xstik-welcome-btn:hover{background:#E8A902;box-shadow:0 0 30px rgba(232,169,2,0.5);}
          #xstik-welcome-btn:disabled{opacity:0.4;cursor:not-allowed;}
          .xstik-bonus-tag{display:inline-block;background:rgba(245,197,24,0.15);color:#F5C518;font-family:'Rajdhani',sans-serif;font-weight:600;padding:0.2rem 0.6rem;border-radius:1rem;font-size:0.85rem;margin-top:0.75rem;}
        </style>
        <div id="xstik-welcome-box">
          <img src="SHARED-CORE/branding/assets/logo.jpg" alt="xSTIK" />
          <h2>WELCOME TO xSTIK</h2>
          <p>Choose your player name to start playing and climb the leaderboards.</p>
          <input id="xstik-welcome-input" type="text" placeholder="Enter player name..." maxlength="${MAX_LENGTH}" autocomplete="off" spellcheck="false" />
          <div id="xstik-welcome-error"></div>
          <button id="xstik-welcome-btn">START PLAYING</button>
          <div class="xstik-bonus-tag">🪙 +1,000 Welcome Credits</div>
        </div>
      `;

      document.body.appendChild(overlay);

      const input = overlay.querySelector('#xstik-welcome-input');
      const errorEl = overlay.querySelector('#xstik-welcome-error');
      const btn = overlay.querySelector('#xstik-welcome-btn');

      input.focus();

      function submit() {
        const val = input.value;
        const check = validate(val);
        if (!check.valid) {
          errorEl.textContent = check.error;
          input.style.borderColor = '#ef4444';
          return;
        }
        createPlayer(val, gameName);
        overlay.remove();
        resolve(val.trim());
      }

      btn.addEventListener('click', submit);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submit();
      });
      input.addEventListener('input', () => {
        errorEl.textContent = '';
        input.style.borderColor = '#333';
      });
    });
  }

  return {
    exists,
    getUsername,
    getProfile,
    validate,
    createPlayer,
    changeUsername,
    showWelcomeModal
  };
})();
