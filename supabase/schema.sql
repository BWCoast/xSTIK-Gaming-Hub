-- xSTIK Game Hub — Supabase Schema
-- Run this SQL in the Supabase SQL Editor to create the required tables.
-- Dashboard: https://app.supabase.com → your project → SQL Editor

-- Leaderboard: one row per score submission
CREATE TABLE IF NOT EXISTS leaderboard (
  id          bigserial PRIMARY KEY,
  player_name text        NOT NULL,
  game        text        NOT NULL,
  score       integer     NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- Index for fast leaderboard queries by game, sorted by score
CREATE INDEX IF NOT EXISTS leaderboard_game_score
  ON leaderboard (game, score DESC);

-- Players: one row per unique username (upserted on first login)
CREATE TABLE IF NOT EXISTS players (
  username    text PRIMARY KEY,
  first_game  text,
  created_at  timestamptz DEFAULT now(),
  last_seen   timestamptz DEFAULT now()
);
