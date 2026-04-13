import { useState, useEffect } from 'react';
import { getHistory, deleteRecord } from '../services/api';
import SeverityBadge from './SeverityBadge';
import toast from 'react-hot-toast';

export default function HistoryPanel() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setRecords(data);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(id);
      await deleteRecord(id);
      setRecords(r => r.filter(rec => rec.id !== id));
      toast.success('Record deleted');
    } catch {
      toast.error('Failed to delete record');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm font-mono">Loading history...</p>
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-slate-600">
            <path d="M9 12h6M9 16h6M7 8h.01M12 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-slate-400 font-medium">No records yet</p>
          <p className="text-slate-600 text-sm mt-1">Analyze symptoms to see history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          {records.length} Record{records.length !== 1 ? 's' : ''}
        </p>
        <button onClick={fetchHistory} className="btn-secondary text-xs py-1.5 px-3">
          Refresh
        </button>
      </div>

      {records.map((rec) => (
        <div key={rec.id} className="glass-card rounded-xl border border-slate-800/60 overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-slate-800/30 transition-colors flex items-center justify-between gap-4"
            onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 font-medium text-sm truncate">{rec.disease}</p>
                <p className="text-slate-500 text-xs mt-0.5 truncate font-mono">{rec.createdAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <SeverityBadge severity={rec.severity} />
              <span className="text-slate-500 text-xs font-mono">
                {Math.round((rec.confidence || 0) * 100)}%
              </span>
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                className={`text-slate-600 transition-transform duration-200 ${expanded === rec.id ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {expanded === rec.id && (
            <div className="border-t border-slate-800/60 p-4 space-y-3 animate-fade-in">
              <div>
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Symptoms</p>
                <p className="text-slate-300 text-sm">{rec.symptoms}</p>
              </div>
              {rec.recommendation && (
                <div>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Recommendation</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{rec.recommendation}</p>
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                {rec.age && (
                  <span className="text-xs px-2 py-1 rounded-lg bg-slate-800 text-slate-400 font-mono">
                    Age: {rec.age}
                  </span>
                )}
                {rec.duration && (
                  <span className="text-xs px-2 py-1 rounded-lg bg-slate-800 text-slate-400 font-mono">
                    {rec.duration}
                  </span>
                )}
                {rec.patientName && (
                  <span className="text-xs px-2 py-1 rounded-lg bg-slate-800 text-slate-400 font-mono">
                    {rec.patientName}
                  </span>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete(rec.id)}
                  disabled={deleting === rec.id}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  {deleting === rec.id ? 'Deleting...' : 'Delete Record'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}