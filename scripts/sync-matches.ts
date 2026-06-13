import { createClient } from '@supabase/supabase-js'

const FOOTBALL_DATA_API_KEY = process.env.FOOTBALL_DATA_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!FOOTBALL_DATA_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars: FOOTBALL_DATA_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function isoDate(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

type ApiMatch = {
  status: string
  homeTeam: { name: string }
  awayTeam: { name: string }
  score: { fullTime: { home: number | null; away: number | null } }
}

type DbRow = {
  id: string
  match_name: string
  bet_selection: 'home' | 'draw' | 'away' | null
  bookmaker_odds: number | null
  stake: number
  result: string
}

async function main() {
  const dateFrom = isoDate(-1)
  const dateTo = isoDate(1)
  const url = `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`

  console.log(`Fetching ${dateFrom} → ${dateTo}`)

  const res = await fetch(url, {
    headers: { 'X-Auth-Token': FOOTBALL_DATA_API_KEY! },
  })

  const remaining = res.headers.get('X-Requests-Available-Minute')
  console.log(`X-Requests-Available-Minute: ${remaining}`)

  if (!res.ok) {
    console.error(`API error ${res.status}: ${res.statusText}`)
    process.exit(1)
  }

  const { matches: apiMatches } = (await res.json()) as { matches: ApiMatch[] }
  const finished = apiMatches.filter((m) => m.status === 'FINISHED')
  console.log(`API: ${apiMatches.length} matches, ${finished.length} FINISHED`)

  const { data: pendingRows, error: fetchErr } = await supabase
    .from('matches')
    .select('id, match_name, bet_selection, bookmaker_odds, stake, result')
    .eq('result', 'pending')

  if (fetchErr) {
    console.error('Supabase fetch error:', fetchErr.message)
    process.exit(1)
  }

  console.log(`DB pending rows: ${(pendingRows as DbRow[]).length}`)

  let updated = 0
  let skipped = 0
  const errors: string[] = []

  for (const apiMatch of finished) {
    const apiName = `${apiMatch.homeTeam.name} vs ${apiMatch.awayTeam.name}`
    const row = (pendingRows as DbRow[]).find((r) => r.match_name === apiName)

    if (!row) {
      skipped++
      console.log(`  Skip (no pending match): ${apiName}`)
      continue
    }

    const { home, away } = apiMatch.score.fullTime
    if (home === null || away === null) {
      skipped++
      console.log(`  Skip (score null): ${apiName}`)
      continue
    }

    if (!row.bet_selection || !row.bookmaker_odds) {
      skipped++
      console.log(`  Skip (missing bet data): ${apiName}`)
      continue
    }

    let result: 'won' | 'lost'
    if (row.bet_selection === 'home') result = home > away ? 'won' : 'lost'
    else if (row.bet_selection === 'away') result = away > home ? 'won' : 'lost'
    else result = home === away ? 'won' : 'lost'

    const pnl =
      result === 'won'
        ? Math.round((row.bookmaker_odds - 1) * row.stake * 100) / 100
        : -row.stake

    const { error: updateErr } = await supabase
      .from('matches')
      .update({ result, pnl })
      .eq('id', row.id)

    if (updateErr) {
      errors.push(`${apiName}: ${updateErr.message}`)
      console.error(`  Error: ${apiName} —`, updateErr.message)
    } else {
      updated++
      const pnlStr = `${pnl >= 0 ? '+' : ''}£${pnl.toFixed(2)}`
      console.log(`  Updated: ${apiName} → ${result} (${pnlStr})`)
    }
  }

  console.log(`\nDone: ${updated} updated · ${skipped} skipped · ${errors.length} errors`)
  if (errors.length > 0) process.exit(1)
}

main()
