/**
 * xSTIK GAME INITIALIZER — Universal Bootstrap
 * ===============================================
 * Include this AFTER all SHARED-CORE scripts.
 * Runs the 7-step initialization sequence automatically.
 *
 * Load order:
 *   1. xstik-brand.css
 *   2. card-deck.js
 *   3. image-loader.js
 *   4. credit-system.js
 *   5. player-system.js
 *   6. leaderboard.js
 *   7. game-init.js  ← THIS FILE
 *   8. (game-specific logic)
 */

const XstikGameInit = (function () {
  'use strict';

  /**
   * Run full init sequence.
   * gameName: identifier like "solitaire", "blackjack"
   * options: { onReady: fn, preloadCards: bool }
   */
  async function boot(gameName, options) {
    const opts = Object.assign({ onReady: null, preloadCards: true }, options || {});

    // STEP 1: Check player — show welcome modal if first visit
    if (!XstikPlayer.exists()) {
      await XstikPlayer.showWelcomeModal(gameName);
    }

    // STEP 2: Initialize credits (welcome bonus if new, or daily/monthly check)
    const creditResult = XstikCredits.initialize();

    // STEP 3: Show bonus toast if earned
    if (creditResult.bonusAwarded) {
      _showToast(creditResult.bonusAwarded, creditResult.balance);
    }

    // STEP 4: Mount credit display (if #credit-display exists)
    XstikCredits.mountDisplay('#credit-display');

    // STEP 5: Check leaderboard monthly reset (happens inside leaderboard calls)
    // No explicit action needed — _checkMonthReset runs on first access.

    // STEP 6: Preload card deck (if card game)
    if (opts.preloadCards) {
      XstikImageLoader.preloadDeck(
        () => {
          // STEP 7: Game ready
          if (opts.onReady) opts.onReady();
        },
        (loaded, total) => {
          _updateLoadingBar(loaded, total);
        }
      );
    } else {
      if (opts.onReady) opts.onReady();
    }

    // Display username in header if .player-name element exists
    const nameEl = document.querySelector('.player-name');
    if (nameEl) nameEl.textContent = XstikPlayer.getUsername() || '';
  }

  function _showToast(type, balance) {
    const messages = {
      welcome: `🎉 Welcome! +1,000 credits`,
      daily: `☀️ Daily bonus: +200 credits`,
      monthly: `🌟 Monthly bonus: +500 credits`
    };
    const msg = messages[type] || '';
    if (!msg) return;

    const toast = document.createElement('div');
    toast.className = 'xstik-toast';
    toast.innerHTML = `<strong>${msg}</strong><br><span style="font-size:0.8rem;color:var(--muted-text)">Balance: ${balance}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function _updateLoadingBar(loaded, total) {
    let bar = document.getElementById('xstik-load-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'xstik-load-bar';
      bar.style.cssText = 'position:fixed;top:3.5rem;left:0;height:3px;background:var(--primary,#F5C518);z-index:999;transition:width 0.15s;';
      document.body.appendChild(bar);
    }
    const pct = Math.round((loaded / total) * 100);
    bar.style.width = pct + '%';
    if (loaded === total) {
      setTimeout(() => bar.remove(), 500);
    }
  }

  /**
   * Show the entertainment disclaimer modal (first visit only).
   * Stored in localStorage "xstik_disclaimer_accepted".
   */
  function showDisclaimer() {
    if (localStorage.getItem('xstik_disclaimer_accepted')) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;padding:1.5rem;';
    overlay.innerHTML = `
      <div style="background:var(--card-bg,#1F1F1F);border:1px solid rgba(245,197,24,0.2);border-radius:0.75rem;padding:2rem;max-width:30rem;width:100%;max-height:80vh;overflow-y:auto;">
        <h2 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:1.1rem;color:var(--primary,#F5C518);text-align:center;margin-bottom:1rem;">xSTIK Game Hub — Entertainment Disclaimer</h2>
        <div style="font-family:'Rajdhani',sans-serif;color:var(--muted-text,#B3B3B3);font-size:0.9rem;line-height:1.6;">
          <p style="margin-bottom:0.75rem;">All games use <strong style="color:var(--foreground,#FAFAFA)">virtual credits for entertainment only</strong>. No real money, cryptocurrency, or monetary tokens are wagered, won, or lost.</p>
          <p style="margin-bottom:0.75rem;">xSTIK does not promote, endorse, or facilitate gambling. Credits exist solely to enhance gaming and promote the xSTIK NFT project.</p>
          <p style="margin-bottom:0.75rem;">xSTIK may reward top-ranking players during special events. Rewards are discretionary, promotional, and not guaranteed.</p>
          <p style="margin-bottom:0.75rem;">Player data handled per Privacy & Disclaimer at <a href="https://xstik.art" style="color:var(--primary,#F5C518)">xSTIK.art</a>. By playing, you accept these terms.</p>
        </div>
        <button id="xstik-disclaimer-accept" style="display:block;width:100%;margin-top:1.25rem;padding:0.7rem;background:var(--primary,#F5C518);color:#0D0D0D;font-family:'Rajdhani',sans-serif;font-weight:600;font-size:1rem;text-transform:uppercase;letter-spacing:1px;border:none;border-radius:0.5rem;cursor:pointer;box-shadow:0 0 20px rgba(245,197,24,0.3);">I UNDERSTAND</button>
        <p style="font-family:'Rajdhani',sans-serif;font-size:0.75rem;color:var(--muted-text,#B3B3B3);text-align:center;margin-top:0.75rem;">© 2026 xSTIK — #1 OG NFT Project on XRPL</p>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#xstik-disclaimer-accept').addEventListener('click', () => {
      localStorage.setItem('xstik_disclaimer_accepted', 'true');
      overlay.remove();
    });
  }

  return { boot, showDisclaimer };
})();
