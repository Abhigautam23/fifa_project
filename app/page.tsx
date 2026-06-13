export const dynamic = 'force-dynamic'

import { createSupabaseClient } from '@/lib/supabase'
import type { Match } from '@/lib/types'
import StatCard from '@/components/StatCard'
import PnLChart from '@/components/PnLChart'
import MatchTable from '@/components/MatchTable'
import SoccerBall from '@/components/SoccerBall'

export default async function Page() {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('match_number', { ascending: true })

  if (error) {
    console.error('Supabase error:', error.message)
  }

  const matches = (data ?? []) as Match[]

  const bets = matches.filter((m) => m.decision === 'bet')
  const settledBets = bets.filter((m) => m.result !== 'pending')
  const wins = settledBets.filter((m) => m.result === 'won')
  const losses = settledBets.filter((m) => m.result === 'lost')
  const noBets = matches.filter((m) => m.decision === 'no_bet')

  const totalPnl = matches.reduce((sum, m) => sum + (m.pnl ?? 0), 0)
  const totalStaked = settledBets.reduce((sum, m) => sum + m.stake, 0)
  const winRate = settledBets.length > 0 ? (wins.length / settledBets.length) * 100 : 0
  const roi = totalStaked > 0 ? (totalPnl / totalStaked) * 100 : 0

  const pnlStr = `${totalPnl >= 0 ? '+' : ''}£${totalPnl.toFixed(2)}`
  const roiStr = `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 sm:px-10 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-14">
        <div className="flex items-center gap-3 mb-4">
          <SoccerBall size={44} className="text-zinc-300 shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Data vs Bet365: World Cup 2026
          </h1>
        </div>
        <p className="text-base sm:text-lg font-semibold text-zinc-100 leading-snug">
          Every match. Every call. £1 on the line.
        </p>
        <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed max-w-2xl">
          Elo-derived model vs Bet365 closing odds — all predictions posted on{' '}
          <a
            href="https://x.com/gautamabhi629"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            X/@gautamabhi629
          </a>{' '}
          before kickoff. No deleted posts, no hindsight.
        </p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Running P&L"
          value={pnlStr}
          valueClass={totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}
          valueSize="text-4xl"
        />
        <StatCard
          label="Record"
          value={`${wins.length}W — ${losses.length}L — ${noBets.length}NB`}
        />
        <StatCard
          label="Win Rate"
          value={settledBets.length > 0 ? `${winRate.toFixed(0)}%` : '—'}
        />
        <StatCard
          label="ROI"
          value={totalStaked > 0 ? roiStr : '—'}
          valueClass={roi >= 0 ? 'text-green-400' : 'text-red-400'}
        />
      </div>

      {/* P&L chart */}
      {matches.length > 0 && (
        <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-6">
          <h2 className="text-xs uppercase tracking-wider text-zinc-400 mb-4">
            Cumulative P&amp;L
          </h2>
          <PnLChart matches={matches} />
        </section>
      )}

      {/* Match log */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h2 className="text-xs uppercase tracking-wider text-zinc-400 mb-4">
          Match Log
        </h2>
        {matches.length === 0 ? (
          <p className="text-zinc-500 text-sm">No matches yet.</p>
        ) : (
          <MatchTable matches={matches} />
        )}
      </section>

      <footer className="mt-8 text-center text-zinc-600 text-xs">
        Last updated on render · Data entered manually after each match
      </footer>
    </main>
  )
}
