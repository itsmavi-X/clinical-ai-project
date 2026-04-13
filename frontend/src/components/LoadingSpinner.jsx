export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      {/* Animated scanner rings */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
        <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-blue-500/20" />
        <div className="absolute inset-2 rounded-full border-b-2 border-blue-400 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-slate-300 font-medium text-sm">Analyzing symptoms...</p>
        <p className="text-slate-500 text-xs mt-1 font-mono">AI diagnostic engine processing</p>
      </div>
      {/* Progress bar */}
      <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  );
}