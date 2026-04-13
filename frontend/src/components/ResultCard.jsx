import { useEffect, useState } from 'react';
import SeverityBadge from './SeverityBadge';

export default function ResultCard({ result }) {
  const [showConfidence, setShowConfidence] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfidence(true), 300);
    return () => clearTimeout(timer);
  }, [result]);

  if (!result) return null;

  const confidencePct = Math.round((result.confidence || 0) * 100);

  const severityBorderMap = {
    MILD: 'border-emerald-500/20',
    MODERATE: 'border-amber-500/20',
    SEVERE: 'border-orange-500/20',
    CRITICAL: 'border-red-500/30',
  };
  const borderColor = severityBorderMap[result.severity?.toUpperCase()] || 'border-slate-700/60';

  return (
    <div className={`glass-card rounded-2xl p-6 border ${borderColor} animate-slide-up space-y-5`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Diagnosis</p>
          <h2 className="font-display text-2xl text-slate-100 leading-tight">{result.disease}</h2>
          {result.patientName && (
            <p className="text-slate-500 text-sm mt-1">Patient: <span className="text-slate-300">{result.patientName}</span></p>
          )}
        </div>
        <SeverityBadge severity={result.severity} size="lg" />
      </div>

      {/* Meta info */}
      {(result.age || result.duration) && (
        <div className="flex gap-4 text-sm">
          {result.age && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-slate-600 font-mono text-xs">AGE</span>
              <span className="text-slate-300 font-medium">{result.age} yrs</span>
            </div>
          )}
          {result.duration && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-slate-600 font-mono text-xs">DURATION</span>
              <span className="text-slate-300 font-medium">{result.duration}</span>
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-slate-800/60" />

      {/* Confidence */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">AI Confidence</span>
          <span className="text-sm font-mono font-medium text-cyan-400">{confidencePct}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full confidence-fill shadow-lg shadow-cyan-500/30"
            style={{ width: showConfidence ? `${confidencePct}%` : '0%' }}
          />
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/60">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Recommendation</p>
        <p className="text-slate-300 text-sm leading-relaxed">{result.recommendation}</p>
      </div>

      {/* Timestamp */}
      {result.createdAt && (
        <p className="text-xs font-mono text-slate-600 text-right">
          Analyzed: {result.createdAt}
        </p>
      )}
    </div>
  );
}