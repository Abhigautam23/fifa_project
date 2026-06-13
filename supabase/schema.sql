-- ============================================================
-- matches table — run this in your Supabase SQL editor
-- ============================================================

create table if not exists matches (
  id               uuid primary key default gen_random_uuid(),
  match_name       text        not null,
  match_number     int         not null,
  kickoff_at       timestamptz not null,
  my_prob_home     numeric     not null,
  my_prob_draw     numeric     not null,
  my_prob_away     numeric     not null,
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


-- ============================================================
-- Seed data — UPDATE these with real numbers from X posts
-- ============================================================

insert into matches (
  match_name, match_number, kickoff_at,
  my_prob_home, my_prob_draw, my_prob_away,
  bookmaker_odds, implied_prob,
  bet_selection, decision, stake,
  result, pnl, notes
) values
  -- Match 1: Mexico vs South Africa
  (
    'Mexico vs South Africa', 1, '2026-06-11 18:00:00+00',
    52, 25, 23,
    null, null,
    null, 'no_bet', 1.00,
    'no_bet', 0.00,
    'No edge found vs Bet365 line'
  ),

  -- Match 2: Korea vs Czechia
  (
    'Korea vs Czechia', 2, '2026-06-12 12:00:00+00',
    38, 30, 32,
    3.40, 29.41,
    'draw', 'bet', 1.00,
    'lost', -1.00,
    'Slight edge on draw, Korea won 2-0'
  ),

  -- Match 3: Canada vs Bosnia
  (
    'Canada vs Bosnia', 3, '2026-06-12 21:00:00+00',
    58, 22, 20,
    2.10, 47.62,
    'home', 'bet', 1.00,
    'won', 1.10,
    '+10% edge on hosts, Canada won 1-0'
  ),

  -- Match 4: USA vs Paraguay
  (
    'USA vs Paraguay', 4, '2026-06-13 18:00:00+00',
    62, 22, 16,
    null, null,
    null, 'no_bet', 1.00,
    'pending', null,
    null
  );
