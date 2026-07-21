export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  return (
    <div className="max-w-md mx-auto mt-4 px-4 py-3 bg-danger/10 border border-danger/30 rounded-md flex items-center justify-between">
      <p className="text-sm text-danger">{message}</p>
      <button onClick={onDismiss} className="text-danger text-sm ml-3">✕</button>
    </div>
  )
}
