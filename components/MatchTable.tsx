import type { Match } from '@/lib/types'

function rowStyle(match: Match): string {
  if (match.result === 'won') return 'border-l-2 border-green-500 bg-green-950/20'
  if (match.result === 'lost') return 'border-l-2 border-red-500 bg-red-950/20'
  if (match.result === 'pending') return 'border-l-2 border-yellow-500 bg-yellow-950/10 animate-pulse'
  return 'border-l-2 border-zinc-800 opacity-50'
}

function formatKickoff(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  })
}

function ResultBadge({ result }: { result: string }) {
  const styles: Record<string, string> = {
    won: 'text-green-400 font-bold',
    lost: 'text-red-400 font-bold',
    pending: 'text-yellow-400',
    no_bet: 'text-zinc-500',
  }
  return (
    <span className={styles[result] ?? 'text-zinc-400'}>
      {result.replace('_', ' ').toUpperCase()}
    </span>
  )
}

export default function MatchTable({ matches }: { matches: Match[] }) {
  const sorted = [...matches].sort((a, b) => b.match_number - a.match_number)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-zinc-800 text-left text-xs text-zinc-400 uppercase tracking-wider">
            <th className="py-3 pr-4 font-medium">Match</th>
            <th className="py-3 pr-4 font-medium text-right">My Est (W/D/L)</th>
            <th className="py-3 pr-4 font-medium text-right">Odds</th>
            <th className="py-3 pr-4 font-medium text-right">Implied%</th>
            <th className="py-3 pr-4 font-medium text-right">Edge</th>
            <th className="py-3 pr-4 font-medium">Decision</th>
            <th className="py-3 pr-4 font-medium">Result</th>
            <th className="py-3 font-medium text-right">P&amp;L</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((match) => {
            const impliedProb =
              match.bookmaker_odds ? (1 / match.bookmaker_odds) * 100 : null

            const selProb =
              match.bet_selection === 'home'
                ? match.my_prob_home
                : match.bet_selection === 'draw'
                ? match.my_prob_draw
                : match.bet_selection === 'away'
                ? match.my_prob_away
                : null

            const edge =
              selProb !== null && impliedProb !== null
                ? selProb - impliedProb
                : null

            return (
              <tr
                key={match.id}
                className={`${rowStyle(match)} border-b border-zinc-800/40`}
              >
                <td className="py-3 pr-4">
                  <div className="text-zinc-100 font-medium">{match.match_name}</div>
                  <div className="text-zinc-500 text-xs font-mono mt-0.5">
                    {formatKickoff(match.kickoff_at)}
                  </div>
                  {match.notes && (
                    <div className="text-zinc-500 text-xs mt-0.5 italic">{match.notes}</div>
                  )}
                </td>

                <td className="py-3 pr-4 text-right font-mono text-zinc-300 whitespace-nowrap">
                  <span className={match.bet_selection === 'home' ? 'text-blue-400 font-bold' : ''}>
                    {match.my_prob_home}%
                  </span>
                  <span className="text-zinc-600"> / </span>
                  <span className={match.bet_selection === 'draw' ? 'text-blue-400 font-bold' : ''}>
                    {match.my_prob_draw}%
                  </span>
                  <span className="text-zinc-600"> / </span>
                  <span className={match.bet_selection === 'away' ? 'text-blue-400 font-bold' : ''}>
                    {match.my_prob_away}%
                  </span>
                </td>

                <td className="py-3 pr-4 text-right font-mono text-zinc-300">
                  {match.bookmaker_odds != null ? match.bookmaker_odds.toFixed(2) : '—'}
                </td>

                <td className="py-3 pr-4 text-right font-mono text-zinc-300">
                  {impliedProb != null ? `${impliedProb.toFixed(1)}%` : '—'}
                </td>

                <td className="py-3 pr-4 text-right font-mono">
                  {match.decision === 'bet' && edge != null ? (
                    <span className={edge >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {edge >= 0 ? '+' : ''}
                      {edge.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>

                <td className="py-3 pr-4">
                  {match.decision === 'bet' ? (
                    <span className="text-blue-400">
                      BET{' '}
                      <span className="text-zinc-400 text-xs">
                        ({match.bet_selection?.toUpperCase()})
                      </span>
                    </span>
                  ) : (
                    <span className="text-zinc-500">NO BET</span>
                  )}
                </td>

                <td className="py-3 pr-4">
                  <ResultBadge result={match.result} />
                </td>

                <td className="py-3 text-right font-mono">
                  {match.pnl != null ? (
                    <span
                      className={
                        match.pnl > 0
                          ? 'text-green-400'
                          : match.pnl < 0
                          ? 'text-red-400'
                          : 'text-zinc-500'
                      }
                    >
                      {match.pnl >= 0 ? '+' : ''}£{match.pnl.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
