export default function StatCard({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <div className="text-zinc-400 text-xs uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-2xl font-mono font-bold ${valueClass ?? 'text-zinc-100'}`}>
        {value}
      </div>
    </div>
  )
}
