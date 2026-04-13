const SEVERITY_CONFIG = {
  MILD: {
    bg: 'bg-emerald-500/15 border border-emerald-500/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    label: 'Mild',
    glow: 'shadow-emerald-500/20',
  },
  MODERATE: {
    bg: 'bg-amber-500/15 border border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    label: 'Moderate',
    glow: 'shadow-amber-500/20',
  },
  SEVERE: {
    bg: 'bg-orange-500/15 border border-orange-500/30',
    text: 'text-orange-400',
    dot: 'bg-orange-400',
    label: 'Severe',
    glow: 'shadow-orange-500/20',
  },
  CRITICAL: {
    bg: 'bg-red-500/15 border border-red-500/30',
    text: 'text-red-400',
    dot: 'bg-red-400',
    label: 'Critical',
    glow: 'shadow-red-500/20',
  },
};

export default function SeverityBadge({ severity, size = 'md' }) {
  const cfg = SEVERITY_CONFIG[severity?.toUpperCase()] || SEVERITY_CONFIG.MODERATE;
  const sizeClass = size === 'lg'
    ? 'px-4 py-1.5 text-sm'
    : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium tracking-wider uppercase shadow-lg ${cfg.bg} ${cfg.text} ${cfg.glow} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {cfg.label}
    </span>
  );
}