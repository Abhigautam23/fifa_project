-- ============================================================
-- matches table — run this in your Supabase SQL editor
-- ============================================================

create table if not exists matches (
  id               uuid primary key default gen_random_uuid(),
  match_name       text        not null,
  match_number     int         not null,
  kickoff_at       timestamptz not null,
  my_prob_home     numeric     not null,
  my_prob_draw     numeric,
  my_prob_away     numeric,
  bookmaker_odds   numeric,
  implied_prob     numeric,
  bet_selection    text        check (bet_selection in ('home', 'draw', 'away')),
  decision         text        not null check (decision in ('bet', 'no_bet')),
  stake            numeric     not null default 1.00,
  result           text        not null check (result in ('pending', 'won', 'lost', 'no_bet')),
  pnl              numeric,
  notes            text,
  created_at       timestamptz not null default now()
);

-- Allow public read access (no auth needed for dashboard)
alter table matches enable row level security;

create policy "public read" on matches
  for select using (true);

-- Grant table-level SELECT so the anon role can reach the table
-- (RLS policies only control which rows are visible once the table is accessible)
grant select on matches to anon;


-- ============================================================
-- Seed data
-- ACTUAL SCORES (from football-data.org):
--   1. Mexico 2-0 South Africa
--   2. Korea Republic 2-1 Czechia
--   3. Canada 1-1 Bosnia-Herzegovina
--   4. USA 4-1 Paraguay
--
-- REPLACE placeholders marked ??? with real values from your X posts:
--   my_prob_home / my_prob_draw / my_prob_away  — your Elo estimates
--   bookmaker_odds / implied_prob               — Bet365 odds at time of bet
--   bet_selection                               — which outcome you backed
--   decision                                    — 'bet' or 'no_bet'
--   result / pnl                                — derived from score + bet
-- ============================================================

insert into matches (
  match_name, match_number, kickoff_at,
  my_prob_home, my_prob_draw, my_prob_away,
  bookmaker_odds, implied_prob,
  bet_selection, decision, stake,
  result, pnl, notes
) values
  -- Match 1: Mexico 2-0 South Africa  →  BET home, WON (+£0.40)
  (
    'Mexico vs South Africa', 1, '2026-06-11T19:00:00Z',
    83, 12, 5,
    1.40, 71.43,
    'home', 'bet', 1.00,
    'won', 0.40,
    'FT: Mexico 2-0 South Africa'
  ),

  -- Match 2: Korea 2-1 Czechia  →  NO BET
  (
    'Korea Republic vs Czechia', 2, '2026-06-12T02:00:00Z',
    40, 29, 31,
    null, null,
    null, 'no_bet', 1.00,
    'no_bet', 0.00,
    'FT: Korea Republic 2-1 Czechia'
  ),

  -- Match 3: Canada 1-1 Bosnia  →  BET home, LOST (-£1.00)
  -- my_prob_draw/away null: original post only gave Canada win probability
  (
    'Canada vs Bosnia-Herzegovina', 3, '2026-06-12T19:00:00Z',
    78, null, null,
    1.80, 55.56,
    'home', 'bet', 1.00,
    'lost', -1.00,
    'FT: Canada 1-1 Bosnia-Herzegovina'
  ),

  -- Match 4: USA 4-1 Paraguay  →  BET away (Paraguay), LOST (-£1.00)
  (
    'USA vs Paraguay', 4, '2026-06-13T01:00:00Z',
    25, 25, 50,
    3.70, 27.03,
    'away', 'bet', 1.00,
    'lost', -1.00,
    'FT: USA 4-1 Paraguay'
  );
