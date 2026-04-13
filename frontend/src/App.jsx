import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import SymptomForm from './components/SymptomForm';
import ResultCard from './components/ResultCard';
import HistoryPanel from './components/HistoryPanel';
import LoadingSpinner from './components/LoadingSpinner';
import { analyzeSymptoms } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (formData) => {
    try {
      setLoading(true);
      setResult(null);
      const data = await analyzeSymptoms(formData);
      if (!data.success) {
        toast.error(data.errorMessage || 'Analysis failed');
        return;
      }
      setResult(data);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.message || 'Failed to analyze symptoms');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid font-body">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="relative max-w-6xl mx-auto px-6 py-10">
        {activeTab === 'analyze' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div>
              <div className="mb-6">
                <h2 className="font-display text-3xl text-slate-100">Symptom Analysis</h2>
                <p className="text-slate-500 mt-1.5 text-sm">Describe your symptoms for AI-powered diagnostic assessment</p>
              </div>
              <div className="glass-card rounded-2xl p-6 border border-slate-800/60">
                <SymptomForm onSubmit={handleAnalyze} loading={loading} />
              </div>
            </div>

            {/* Right: Result */}
            <div>
              <div className="mb-6">
                <h2 className="font-display text-3xl text-slate-100">Diagnostic Result</h2>
                <p className="text-slate-500 mt-1.5 text-sm">AI-generated assessment will appear here</p>
              </div>

              {loading ? (
                <div className="glass-card rounded-2xl border border-slate-800/60">
                  <LoadingSpinner />
                </div>
              ) : result ? (
                <ResultCard result={result} />
              ) : (
                <div className="glass-card rounded-2xl border border-slate-800/60 p-8 flex flex-col items-center justify-center min-h-64 text-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-slate-600">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Awaiting analysis</p>
                    <p className="text-slate-600 text-sm mt-1">Enter symptoms and click Analyze</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="font-display text-3xl text-slate-100">Diagnosis History</h2>
              <p className="text-slate-500 mt-1.5 text-sm">All previous diagnostic analyses stored in database</p>
            </div>
            <HistoryPanel />
          </div>
        )}
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#e2e8f0',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#0f172a' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#0f172a' } },
        }}
      />
    </div>
  );
}