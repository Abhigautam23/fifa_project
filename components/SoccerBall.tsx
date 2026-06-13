export default function SoccerBall({
  size = 48,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      {/* Central pentagon */}
      <polygon points="12,7 16.76,10.45 14.94,16.05 9.06,16.05 7.24,10.45" />
      {/* Seam lines from each pentagon vertex to the outer circle */}
      <line x1="12" y1="7" x2="12" y2="2" />
      <line x1="16.76" y1="10.45" x2="21.51" y2="8.91" />
      <line x1="14.94" y1="16.05" x2="17.88" y2="20.09" />
      <line x1="9.06" y1="16.05" x2="6.12" y2="20.09" />
      <line x1="7.24" y1="10.45" x2="2.49" y2="8.91" />
    </svg>
  )
}
