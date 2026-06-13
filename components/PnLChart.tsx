'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { Match } from '@/lib/types'

type ChartPoint = {
  match_number: number
  match_name: string
  individual_pnl: number
  cumulative: number
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ChartPoint }>
}) {
  if (!active || !payload?.length) return null
  const pt = payload[0].payload
  const pnlColor = pt.individual_pnl > 0 ? '#22c55e' : pt.individual_pnl < 0 ? '#ef4444' : '#71717a'
  const cumColor = pt.cumulative >= 0 ? '#22c55e' : '#ef4444'
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm">
      <div className="text-zinc-200 mb-1 font-medium">{pt.match_name}</div>
      <div className="font-mono" style={{ color: pnlColor }}>
        Match: {pt.individual_pnl >= 0 ? '+' : ''}£{pt.individual_pnl.toFixed(2)}
      </div>
      <div className="font-mono" style={{ color: cumColor }}>
        Running: {pt.cumulative >= 0 ? '+' : ''}£{pt.cumulative.toFixed(2)}
      </div>
    </div>
  )
}

export default function PnLChart({ matches }: { matches: Match[] }) {
  const sorted = [...matches].sort((a, b) => a.match_number - b.match_number)
  let running = 0
  const data: ChartPoint[] = sorted.map((m) => {
    running = parseFloat((running + (m.pnl ?? 0)).toFixed(2))
    return {
      match_number: m.match_number,
      match_name: m.match_name,
      individual_pnl: m.pnl ?? 0,
      cumulative: running,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="match_number"
          tick={{ fill: '#71717a', fontFamily: 'monospace', fontSize: 11 }}
          label={{ value: 'Match #', position: 'insideBottom', offset: -4, fill: '#71717a', fontSize: 11 }}
        />
        <YAxis
          tickFormatter={(v: number) => `£${v.toFixed(2)}`}
          tick={{ fill: '#71717a', fontFamily: 'monospace', fontSize: 11 }}
          width={72}
        />
        <ReferenceLine y={0} stroke="#3f3f46" strokeDasharray="4 4" />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="cumulative"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#60a5fa' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
