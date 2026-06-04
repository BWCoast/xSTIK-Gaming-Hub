/**
 * xSTIK CREDIT SYSTEM — Unified Cross-Game Wallet
 * ==================================================
 * PROTECTED FILE — DO NOT MODIFY
 * 
 * Rules:
 *   - First visit:       +1,000 credits
 *   - Daily visit:       +200 credits (once per 24hrs)
 *   - Monthly bonus:     +500 credits (1st of each month)
 *   - Bankruptcy recovery: +750 credits (xButtMcAssFace popup)
 *   - Minimum bet:       10 credits (all games)
 * 
 * localStorage key: "xstik_credits"
 */

const XstikCredits = (function () {
  'use strict';

  const STORAGE_KEY = 'xstik_credits';
  const WELCOME_BONUS = 1000;
  const DAILY_BONUS = 200;
  const MONTHLY_BONUS = 500;
  const BANKRUPTCY_RECOVERY = 750;
  const MIN_BET = 10;
  const MAX_HISTORY = 100;
  const BANKRUPTCY_IMAGE = 'SHARED-CORE/assets/bankruptcy/xButtMcAssFace.png';

  // ---- Internal State ----

  function _getStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('[xSTIK Credits] Corrupt data, resetting.');
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function _saveStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function _createStore() {
    return {
      balance: 0,
      totalWon: 0,
      totalLost: 0,
      totalGamesPlayed: 0,
      lastDailyBonus: null,
      lastMonthlyBonus: null,
      history: []
    };
  }

  function _addHistory(store, game, amount, type) {
    store.history.unshift({
      game: game,
      amount: amount,
      type: type,
      timestamp: new Date().toISOString()
    });
    if (store.history.length > MAX_HISTORY) {
      store.history = store.history.slice(0, MAX_HISTORY);
    }
  }

  function _todayStr() {
    return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  }

  function _monthStr() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); // "YYYY-MM"
  }

  // ---- Initialization ----

  /**
   * Initialize credits for a new or returning player.
   * Call this once when any game loads.
   * Returns an object: { balance, bonusAwarded: string|null }
   */
  function initialize() {
    let store = _getStore();
    let bonusAwarded = null;

    // Brand new player
    if (!store) {
      store = _createStore();
      store.balance = WELCOME_BONUS;
      store.lastDailyBonus = _todayStr();
      store.lastMonthlyBonus = _monthStr();
      _addHistory(store, 'system', WELCOME_BONUS, 'welcome_bonus');
      _saveStore(store);
      return { balance: store.balance, bonusAwarded: 'welcome' };
    }

    // Check monthly bonus first (bigger, rarer)
    const currentMonth = _monthStr();
    if (store.lastMonthlyBonus !== currentMonth) {
      store.balance += MONTHLY_BONUS;
      store.lastMonthlyBonus = currentMonth;
      _addHistory(store, 'system', MONTHLY_BONUS, 'monthly_bonus');
      bonusAwarded = 'monthly';
    }

    // Check daily bonus
    const today = _todayStr();
    if (store.lastDailyBonus !== today) {
      store.balance += DAILY_BONUS;
      store.lastDailyBonus = today;
      _addHistory(store, 'system', DAILY_BONUS, 'daily_bonus');
      bonusAwarded = bonusAwarded || 'daily';
    }

    _saveStore(store);
    return { balance: store.balance, bonusAwarded };
  }

  // ---- Core API ----

  function getBalance() {
    const store = _getStore();
    return store ? store.balance : 0;
  }

  function getMinBet() {
    return MIN_BET;
  }

  /**
   * Place a bet. Returns true if successful, false if insufficient funds.
   */
  function placeBet(amount, gameName) {
    if (amount < MIN_BET) { console.warn('[xSTIK Credits] Below minimum bet.'); return false; }
    const store = _getStore();
    if (!store || store.balance < amount) return false;

    store.balance -= amount;
    store.totalLost += amount;
    store.totalGamesPlayed++;
    _addHistory(store, gameName, -amount, 'bet');
    _saveStore(store);
    _notifyListeners();
    return true;
  }

  /**
   * Award winnings after a game win.
   */
  function awardWinnings(amount, gameName) {
    if (amount <= 0) return;
    const store = _getStore();
    if (!store) return;

    store.balance += amount;
    store.totalWon += amount;
    _addHistory(store, gameName, amount, 'win');
    _saveStore(store);
    _notifyListeners();
  }

  /**
   * Deduct an entry fee (e.g., Solitaire costs 50 to play).
   * Returns true if successful.
   */
  function payEntryFee(amount, gameName) {
    const store = _getStore();
    if (!store || store.balance < amount) return false;

    store.balance -= amount;
    store.totalLost += amount;
    store.totalGamesPlayed++;
    _addHistory(store, gameName, -amount, 'entry_fee');
    _saveStore(store);
    _notifyListeners();
    return true;
  }

  function getStats() {
    const store = _getStore();
    if (!store) return { totalWon: 0, totalLost: 0, totalGamesPlayed: 0, netProfit: 0 };
    return {
      totalWon: store.totalWon,
      totalLost: store.totalLost,
      totalGamesPlayed: store.totalGamesPlayed,
      netProfit: store.totalWon - store.totalLost
    };
  }

  function getHistory(limit) {
    const store = _getStore();
    if (!store) return [];
    return store.history.slice(0, limit || 20);
  }

  // ---- Bankruptcy ----

  function isBankrupt() {
    return getBalance() < MIN_BET;
  }

  /**
   * Trigger bankruptcy recovery.
   * Shows xButtMcAssFace popup for 5 seconds, then awards 750 credits.
   * onComplete is called after the 5-second shame timer.
   */
  function triggerBankruptcy(onComplete) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'xstik-bankruptcy-overlay';
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:10000;
      background:rgba(0,0,0,0.92); display:flex;
      flex-direction:column; align-items:center;
      justify-content:center; padding:1.5rem;
      animation: fadeIn 0.3s ease;
    `;

    overlay.innerHTML = `
      <style>
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes shakeIt { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-3deg)} 75%{transform:rotate(3deg)} }
        #bankruptcy-img { animation: shakeIt 0.5s ease infinite; max-width:min(20rem,70vw); border-radius:1rem; border:3px solid var(--primary,#F5C518); box-shadow:0 0 40px rgba(245,197,24,0.5); }
        #bankruptcy-timer { font-family:'Orbitron',sans-serif; font-size:3rem; color:#ef4444; margin-top:1rem; }
        #bankruptcy-msg { font-family:'Rajdhani',sans-serif; font-size:1.3rem; color:#FAFAFA; text-align:center; margin-top:0.75rem; max-width:24rem; }
        #bankruptcy-sub { font-family:'Rajdhani',sans-serif; font-size:1rem; color:#F5C518; margin-top:0.5rem; }
        #bankruptcy-btn { display:none; margin-top:1.5rem; background:#F5C518; color:#0D0D0D; font-family:'Rajdhani',sans-serif; font-weight:600; font-size:1.1rem; text-transform:uppercase; letter-spacing:1px; padding:0.75rem 2rem; border:none; border-radius:0.5rem; cursor:pointer; box-shadow:0 0 20px rgba(245,197,24,0.4); }
      </style>
      <img id="bankruptcy-img" src="${BANKRUPTCY_IMAGE}" alt="xButtMcAssFace" />
      <div id="bankruptcy-timer">5</div>
      <div id="bankruptcy-msg">You've been xButtMcAssFaced! 💀</div>
      <div id="bankruptcy-sub">+${BANKRUPTCY_RECOVERY} credits incoming...</div>
      <button id="bankruptcy-btn">CONTINUE</button>
    `;

    document.body.appendChild(overlay);

    // Countdown timer
    let seconds = 5;
    const timerEl = overlay.querySelector('#bankruptcy-timer');
    const btnEl = overlay.querySelector('#bankruptcy-btn');

    const interval = setInterval(() => {
      seconds--;
      timerEl.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(interval);
        timerEl.textContent = '✓';
        timerEl.style.color = '#22c55e';
        btnEl.style.display = 'block';
      }
    }, 1000);

    btnEl.addEventListener('click', () => {
      // Award recovery credits
      const store = _getStore();
      if (store) {
        store.balance += BANKRUPTCY_RECOVERY;
        _addHistory(store, 'system', BANKRUPTCY_RECOVERY, 'bankruptcy_recovery');
        _saveStore(store);
        _notifyListeners();
      }
      overlay.remove();
      if (onComplete) onComplete(BANKRUPTCY_RECOVERY);
    });
  }

  // ---- Balance Change Listeners ----

  const _listeners = [];

  function onBalanceChange(callback) {
    _listeners.push(callback);
  }

  function _notifyListeners() {
    const balance = getBalance();
    _listeners.forEach(fn => fn(balance));
  }

  // ---- UI Helper: Credit Display ----

  /**
   * Mount a credit display into a container element.
   * Shows coin icon + animated balance number.
   * Auto-updates on balance changes.
   */
  function mountDisplay(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.4rem;font-family:'Rajdhani',sans-serif;">
        <span style="font-size:1.2rem;">🪙</span>
        <span id="xstik-credit-value" style="font-weight:700;font-size:1rem;color:var(--primary,#F5C518);min-width:3rem;text-align:right;">${getBalance()}</span>
      </div>
    `;

    const valueEl = container.querySelector('#xstik-credit-value');
    let displayedBalance = getBalance();

    onBalanceChange((newBalance) => {
      // Animate counting
      const diff = newBalance - displayedBalance;
      const color = diff >= 0 ? '#22c55e' : '#ef4444';
      valueEl.style.color = color;

      const steps = 15;
      const stepAmount = diff / steps;
      let step = 0;

      const animate = setInterval(() => {
        step++;
        displayedBalance += stepAmount;
        valueEl.textContent = Math.round(displayedBalance);
        if (step >= steps) {
          clearInterval(animate);
          displayedBalance = newBalance;
          valueEl.textContent = newBalance;
          setTimeout(() => { valueEl.style.color = 'var(--primary, #F5C518)'; }, 400);
        }
      }, 30);
    });
  }

  // Public API
  return {
    initialize,
    getBalance,
    getMinBet,
    placeBet,
    awardWinnings,
    payEntryFee,
    getStats,
    getHistory,
    isBankrupt,
    triggerBankruptcy,
    onBalanceChange,
    mountDisplay,
    BANKRUPTCY_IMAGE,
    MIN_BET
  };
})();
