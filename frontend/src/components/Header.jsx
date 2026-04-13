export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 opacity-20 blur-sm" />
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="font-display text-lg text-slate-100 leading-none">ClinicalAI</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">Diagnostic Engine v1.0</p>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/60 rounded-xl p-1 border border-slate-800/60">
          {[
            { id: 'analyze', label: 'Analyze' },
            { id: 'history', label: 'History' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Online</span>
        </div>
      </div>
    </header>
  );
}