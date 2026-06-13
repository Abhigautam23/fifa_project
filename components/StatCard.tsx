export default function StatCard({
  label,
  value,
  valueClass,
  valueSize = 'text-2xl',
}: {
  label: string
  value: string
  valueClass?: string
  valueSize?: string
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 transition-colors duration-150 hover:border-zinc-600 cursor-default">
      <div className="text-zinc-400 text-xs uppercase tracking-wider mb-2">{label}</div>
      <div className={`${valueSize} font-mono font-bold ${valueClass ?? 'text-zinc-100'}`}>
        {value}
      </div>
    </div>
  )
}
