export default function ConfidenceDot({ score }) {
  const color =
    score >= 0.9 ? 'bg-success text-success' :
    score >= 0.7 ? 'bg-warning text-warning' :
    'bg-danger text-danger'

  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span className={`w-2 h-2 rounded-full ${color.split(' ')[0]}`} />
      <span className={color.split(' ')[1]}>{Math.round(score * 100)}%</span>
    </span>
  )
}
