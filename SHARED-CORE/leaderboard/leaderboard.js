/**
 * xSTIK LEADERBOARD SYSTEM — Per-Game + Unified Scoring
 * =======================================================
 * PROTECTED FILE — DO NOT MODIFY
 *
 * Architecture:
 *   Tier 1: Per-game leaderboards (game-specific scoring)
 *   Tier 2: Unified Game Hub leaderboard (normalized, aggregated)
 *
 * Credits ≠ Points:
 *   Credits = wallet economy (win/lose real balance)
 *   Points  = skill measurement (accumulate, for ranking)
 *
 * Monthly reset: 1st of each month, current→previousMonth, fresh start.
 * localStorage keys: "xstik_leaderboard_{gameName}", "xstik_leaderboard_unified"
 *
 * v1.1 — Added scoring formulas for all 9 games, skill weights,
 *         and weighted normalized unified leaderboard.
 */

const XstikLeaderboard = (function () {
  'use strict';

  const PREFIX = 'xstik_leaderboard_';
  const UNIFIED_KEY = 'xstik_leaderboard_unified';
  const MAX_ENTRIES = 50;

  // ---- Helpers ----

  function _monthStr() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  function _getBoard(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      localStorage.removeItem(key);
      return null;
    }
  }

  function _saveBoard(key, board) {
    localStorage.setItem(key, JSON.stringify(board));
  }

  function _createBoard() {
    return {
      currentMonth: _monthStr(),
      scores: [],
      previousMonth: null
    };
  }

  /**
   * Check if the board needs a monthly reset. If so, archive and clear.
   */
  function _checkMonthReset(key) {
    let board = _getBoard(key);
    if (!board) return _createBoard();

    const now = _monthStr();
    if (board.currentMonth !== now) {
      board.previousMonth = {
        month: board.currentMonth,
        scores: board.scores.slice(0, 20)
      };
      board.scores = [];
      board.currentMonth = now;
      _saveBoard(key, board);
    }
    return board;
  }

  // ---- Scoring Formulas ----
  //
  // Categories:
  //   Luck/House  — Casino War, Baccarat (reward streaks over grinding)
  //   Skill/PvP   — Texas Hold'Em, Three Card Brag (big wins > small pots)
  //   Skill/Luck  — Video Poker, Blackjack (optimal decisions matter)
  //   Puzzle/Solo — Solitaire, Pyramid (speed + efficiency)
  //   Strategy    — Spades (bidding accuracy + consistency)

  const SCORING = {
    /**
     * Solitaire: Time + efficiency bonus
     * score = 500 + max(0, 300 - seconds) - (moves × 2) + speed bonus
     */
    solitaire: function (details) {
      const timeBonus = Math.max(0, 300 - (details.completionTime || 999));
      const movesPenalty = (details.moves || 0) * 2;
      const speedBonus = (details.completionTime || 999) < 180 ? 100 : 0;
      return Math.max(0, 500 + timeBonus - movesPenalty + speedBonus);
    },

    /**
     * Blackjack: Wins + profit + streaks
     * score = (wins × 100) + (profitCredits × 0.5) + (consecutiveWins × 50)
     */
    blackjack: function (details) {
      const wins = (details.wins || 0) * 100;
      const profit = (details.profitCredits || 0) * 0.5;
      const streak = (details.consecutiveWins || 0) * 50;
      return Math.max(0, Math.round(wins + profit + streak));
    },

    /**
     * Casino War: Pure luck — reward hot streaks
     * score = (wins × 30) + (winRate × 200) + min(creditsWon × 0.3, 300)
     * Cap: 1000
     */
    'casino-war': function (details) {
      var wins = details.wins || 0;
      var hands = Math.max(details.handsPlayed || 1, 1);
      var winRate = wins / hands;
      var creditBonus = Math.min((details.creditsWon || 0) * 0.3, 300);
      return Math.min(1000, Math.max(0, Math.round((wins * 30) + (winRate * 200) + creditBonus)));
    },

    /**
     * Baccarat: Near-pure luck — same structure as Casino War
     * score = (wins × 30) + (winRate × 200) + min(creditsWon × 0.3, 300)
     * Cap: 1000
     */
    baccarat: function (details) {
      var wins = details.wins || 0;
      var hands = Math.max(details.handsPlayed || 1, 1);
      var winRate = wins / hands;
      var creditBonus = Math.min((details.creditsWon || 0) * 0.3, 300);
      return Math.min(1000, Math.max(0, Math.round((wins * 30) + (winRate * 200) + creditBonus)));
    },

    /**
     * Texas Hold'Em: High skill — big wins worth more
     * score = (wins × 80) + (winRate × 300) + min(creditsWon × 0.5, 500)
     * Cap: 2000
     */
    'texas-holdem': function (details) {
      var wins = details.wins || 0;
      var hands = Math.max(details.handsPlayed || 1, 1);
      var winRate = wins / hands;
      var creditBonus = Math.min((details.creditsWon || 0) * 0.5, 500);
      return Math.min(2000, Math.max(0, Math.round((wins * 80) + (winRate * 300) + creditBonus)));
    },

    /**
     * Three Card Brag: Medium skill — reads + betting strategy
     * score = (wins × 60) + (winRate × 250) + min(creditsWon × 0.4, 400)
     * Cap: 1500
     */
    'three-card-brag': function (details) {
      var wins = details.wins || 0;
      var hands = Math.max(details.handsPlayed || 1, 1);
      var winRate = wins / hands;
      var creditBonus = Math.min((details.creditsWon || 0) * 0.4, 400);
      return Math.min(1500, Math.max(0, Math.round((wins * 60) + (winRate * 250) + creditBonus)));
    },

    /**
     * Video Poker: Skill/Luck hybrid — optimal hold decisions matter
     * score = (wins × 50) + (winRate × 250) + min(creditsWon × 0.4, 400)
     * Cap: 1500
     */
    'video-poker': function (details) {
      var wins = details.wins || 0;
      var hands = Math.max(details.handsPlayed || 1, 1);
      var winRate = wins / hands;
      var creditBonus = Math.min((details.creditsWon || 0) * 0.4, 400);
      return Math.min(1500, Math.max(0, Math.round((wins * 50) + (winRate * 250) + creditBonus)));
    },

    /**
     * Pyramid: Puzzle — wins are rare, each worth a lot
     * score = (wins × 150) + (winRate × 300) + min(creditsWon × 0.3, 300)
     * Cap: 1500
     */
    pyramid: function (details) {
      var wins = details.wins || 0;
      var hands = Math.max(details.handsPlayed || 1, 1);
      var winRate = wins / hands;
      var creditBonus = Math.min((details.creditsWon || 0) * 0.3, 300);
      return Math.min(1500, Math.max(0, Math.round((wins * 150) + (winRate * 300) + creditBonus)));
    },

    /**
     * Spades: Strategy — highest winRate bonus reflects bidding accuracy
     * score = (wins × 100) + (winRate × 400) + min(creditsWon × 0.4, 400)
     * Cap: 2000
     */
    spades: function (details) {
      var wins = details.wins || 0;
      var hands = Math.max(details.handsPlayed || 1, 1);
      var winRate = wins / hands;
      var creditBonus = Math.min((details.creditsWon || 0) * 0.4, 400);
      return Math.min(2000, Math.max(0, Math.round((wins * 100) + (winRate * 400) + creditBonus)));
    },

    /**
     * Default: Simple score pass-through (for future games)
     */
    _default: function (details) {
      return details.score || 0;
    }
  };

  function _calcScore(gameName, details) {
    const fn = SCORING[gameName] || SCORING._default;
    return fn(details);
  }

  // ---- Skill Weights (for unified leaderboard) ----
  //
  // Higher weight = more contribution to global ranking.
  // A top Spades player (0.95 × 1.5 = 1.425) contributes ~3×
  // more than a top Casino War player (0.95 × 0.5 = 0.475).

  const SKILL_WEIGHTS = {
    spades:            1.5,
    'texas-holdem':    1.4,
    'three-card-brag': 1.2,
    'video-poker':     1.1,
    blackjack:         1.0,
    solitaire:         0.9,
    pyramid:           0.9,
    baccarat:          0.6,
    'casino-war':      0.5
  };

  // ---- Per-Game Leaderboard API ----

  /**
   * Submit a score to a game's leaderboard.
   * playerName: username string
   * gameName: e.g., "solitaire", "blackjack"
   * details: game-specific stats object
   *
   * Returns: { rank: number, score: number, isNewBest: boolean }
   */
  function submitScore(playerName, gameName, details) {
    const key = PREFIX + gameName;
    let board = _checkMonthReset(key);

    const score = _calcScore(gameName, details);

    // Check if player has existing entry
    const existing = board.scores.findIndex(s => s.playerName === playerName);
    let isNewBest = false;

    if (existing >= 0) {
      // Update only if better
      if (score > board.scores[existing].score) {
        board.scores[existing].score = score;
        board.scores[existing].details = details;
        board.scores[existing].timestamp = new Date().toISOString();
        isNewBest = true;
      }
    } else {
      // New entry
      board.scores.push({
        playerName: playerName,
        score: score,
        details: details,
        timestamp: new Date().toISOString()
      });
      isNewBest = true;
    }

    // Sort descending, trim
    board.scores.sort((a, b) => b.score - a.score);
    board.scores = board.scores.slice(0, MAX_ENTRIES);
    _saveBoard(key, board);

    // Find rank (1-indexed)
    const rank = board.scores.findIndex(s => s.playerName === playerName) + 1;

    return { rank, score, isNewBest };
  }

  /**
   * Get top scores for a game.
   * Returns: { currentMonth: string, scores: array, previousMonth: object|null }
   */
  function getGameLeaderboard(gameName, limit) {
    const key = PREFIX + gameName;
    const board = _checkMonthReset(key);
    return {
      currentMonth: board.currentMonth,
      scores: board.scores.slice(0, limit || 10),
      previousMonth: board.previousMonth
    };
  }

  /**
   * Get a player's rank + score for a specific game.
   */
  function getPlayerRank(playerName, gameName) {
    const key = PREFIX + gameName;
    const board = _getBoard(key);
    if (!board) return { rank: null, score: 0 };

    const idx = board.scores.findIndex(s => s.playerName === playerName);
    if (idx < 0) return { rank: null, score: 0 };
    return { rank: idx + 1, score: board.scores[idx].score };
  }

  // ---- Unified Leaderboard ----

  /**
   * Recalculate the unified leaderboard using weighted normalized scoring.
   *
   * Algorithm:
   *   1. For each game, collect all player scores (already sorted descending)
   *   2. Calculate each player's percentile within that game (0.0–1.0)
   *   3. Multiply percentile by SKILL_WEIGHT for that game
   *   4. Sum weighted percentiles across all games played
   *   5. Add log10(totalCreditsWon + 1) as tiebreaker
   *   6. Sort descending
   *
   * Formula: Global Score = Σ(gamePercentile × skillWeight) + log10(totalCredits + 1)
   *
   * Call after any game score submission.
   */
  function rebuildUnified() {
    var gameBoards = {};

    // Step 1: Collect all per-game boards
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key.startsWith(PREFIX) && key !== UNIFIED_KEY) {
        var board = _getBoard(key);
        if (!board || !board.scores || board.scores.length === 0) continue;
        var gameName = key.replace(PREFIX, '');
        gameBoards[gameName] = board.scores;
      }
    }

    // Step 2: For each game, calculate percentile per player
    var playerData = {};

    Object.keys(gameBoards).forEach(function (gameName) {
      var scores = gameBoards[gameName];
      var total = scores.length;
      var weight = SKILL_WEIGHTS[gameName] || 1.0;

      scores.forEach(function (entry, rank) {
        var name = entry.playerName;
        if (!playerData[name]) {
          playerData[name] = { playerName: name, totalScore: 0, games: {}, totalCredits: 0 };
        }

        // Percentile: top player (rank 0) ≈ 1.0, bottom player ≈ 0.0
        // Single-player edge case: percentile = 1.0
        var percentile = total <= 1 ? 1.0 : 1 - (rank / (total - 1));

        // Weighted contribution
        var weightedScore = percentile * weight;
        playerData[name].games[gameName] = entry.score;
        playerData[name].totalScore += weightedScore;

        // Accumulate credits for log tiebreaker
        if (entry.details && entry.details.creditsWon) {
          playerData[name].totalCredits += (entry.details.creditsWon || 0);
        }
      });
    });

    // Step 3: Add log10 credit tiebreaker and round
    Object.keys(playerData).forEach(function (name) {
      var p = playerData[name];
      var logBonus = Math.log10(Math.max(p.totalCredits, 0) + 1);
      p.totalScore = Math.round((p.totalScore + logBonus) * 100) / 100;
    });

    // Step 4: Sort descending, trim
    var sorted = Object.values(playerData)
      .sort(function (a, b) { return b.totalScore - a.totalScore; })
      .slice(0, MAX_ENTRIES);

    var board = {
      currentMonth: _monthStr(),
      scores: sorted,
      lastUpdated: new Date().toISOString()
    };

    _saveBoard(UNIFIED_KEY, board);
    return sorted;
  }

  /**
   * Get unified leaderboard.
   */
  function getUnifiedLeaderboard(limit) {
    const board = _getBoard(UNIFIED_KEY);
    if (!board) return [];
    return board.scores.slice(0, limit || 10);
  }

  // ---- Leaderboard UI Widget ----

  /**
   * Render a simple leaderboard table into a container.
   * mode: "game" (per-game) or "unified"
   * gameName: required if mode is "game"
   */
  function renderLeaderboard(containerSelector, mode, gameName) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    let scores, title;
    if (mode === 'unified') {
      const data = getUnifiedLeaderboard(10);
      scores = data.map(s => ({ name: s.playerName, score: s.totalScore }));
      title = 'GAME HUB LEADERBOARD';
    } else {
      const data = getGameLeaderboard(gameName, 10);
      scores = data.scores.map(s => ({ name: s.playerName, score: s.score }));
      title = (gameName || 'GAME').toUpperCase() + ' LEADERBOARD';
    }

    const medals = ['🥇', '🥈', '🥉'];
    const rows = scores.map((s, i) => `
      <tr style="border-bottom:1px solid rgba(245,197,24,0.1);">
        <td style="padding:0.5rem;text-align:center;font-weight:600;${i < 3 ? 'font-size:1.2rem' : 'color:var(--muted-text,#B3B3B3)'}">${i < 3 ? medals[i] : i + 1}</td>
        <td style="padding:0.5rem;font-weight:500;">${s.name}</td>
        <td style="padding:0.5rem;text-align:right;color:var(--primary,#F5C518);font-weight:700;">${s.score.toLocaleString()}</td>
      </tr>
    `).join('');

    const empty = scores.length === 0 ? '<p style="text-align:center;color:var(--muted-text,#B3B3B3);padding:2rem;font-family:Rajdhani,sans-serif;">No scores yet — be the first!</p>' : '';

    container.innerHTML = `
      <div style="background:rgba(31,31,31,0.6);backdrop-filter:blur(24px);border:1px solid rgba(245,197,24,0.2);border-radius:0.5rem;padding:1rem;max-width:28rem;margin:0 auto;">
        <h3 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:0.95rem;color:var(--primary,#F5C518);text-align:center;margin-bottom:0.75rem;letter-spacing:1px;">${title}</h3>
        ${empty}
        <table style="width:100%;border-collapse:collapse;font-family:'Rajdhani',sans-serif;font-size:0.95rem;color:var(--foreground,#FAFAFA);">
          ${rows}
        </table>
      </div>
    `;
  }

  return {
    submitScore,
    getGameLeaderboard,
    getPlayerRank,
    rebuildUnified,
    getUnifiedLeaderboard,
    renderLeaderboard,
    SCORING
  };
})();
