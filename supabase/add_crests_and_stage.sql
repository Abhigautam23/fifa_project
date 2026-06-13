-- Run this in Supabase SQL Editor (one-time migration)
-- Adds team crest URLs and group/stage label to existing rows

alter table matches add column if not exists home_crest text;
alter table matches add column if not exists away_crest text;
alter table matches add column if not exists stage text;

-- Match 1: Mexico vs South Africa (Group A)
update matches set
  home_crest = 'https://crests.football-data.org/769.svg',
  away_crest = 'https://crests.football-data.org/9396.svg',
  stage      = 'Group A'
where match_number = 1;

-- Match 2: Korea Republic vs Czechia (Group A)
update matches set
  home_crest = 'https://crests.football-data.org/772.png',
  away_crest = 'https://crests.football-data.org/798.svg',
  stage      = 'Group A'
where match_number = 2;

-- Match 3: Canada vs Bosnia-Herzegovina (Group B)
update matches set
  home_crest = 'https://crests.football-data.org/canada.svg',
  away_crest = 'https://crests.football-data.org/bosnia.svg',
  stage      = 'Group B'
where match_number = 3;

-- Match 4: USA vs Paraguay (Group D)
update matches set
  home_crest = 'https://crests.football-data.org/usa.svg',
  away_crest = 'https://crests.football-data.org/761.svg',
  stage      = 'Group D'
where match_number = 4;
