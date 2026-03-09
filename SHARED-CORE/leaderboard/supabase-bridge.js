/**
 * xSTIK SUPABASE LEADERBOARD BRIDGE
 * ===================================
 * Patches XstikLeaderboard.submitScore to also POST scores to
 * the Netlify function → Supabase, enabling the Game Hub GMI
 * (which reads from Supabase, not localStorage).
 *
 * Include AFTER leaderboard.js. Non-destructive: if the POST fails,
 * the localStorage write still succeeds.
 *
 * POST /.netlify/functions/submit-score { player_name, game, score }
 */
(function() {
  'use strict';

  if (typeof XstikLeaderboard === 'undefined') return;

  var SUBMIT_URL = '/.netlify/functions/submit-score';

  // Save reference to original submitScore
  var _origSubmit = XstikLeaderboard.submitScore;

  // Override with version that also POSTs to Supabase
  XstikLeaderboard.submitScore = function(playerName, gameName, details) {
    // 1. Run the original localStorage-based submission
    var result = _origSubmit.call(XstikLeaderboard, playerName, gameName, details);

    // 2. POST to Supabase via Netlify function (fire-and-forget)
    if (result && result.score > 0) {
      try {
        fetch(SUBMIT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            player_name: playerName,
            game: gameName,
            score: result.score
          })
        }).catch(function() { /* silent — Supabase sync is best-effort */ });
      } catch(e) {
        // Silent fail — never interrupt game logic
      }
    }

    return result;
  };
})();
