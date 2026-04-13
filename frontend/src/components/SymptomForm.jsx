import { useState } from 'react';

const DURATION_OPTIONS = ['Less than 24 hours', '1-3 days', '3-7 days', '1-2 weeks', 'More than 2 weeks'];

const SYMPTOM_PRESETS = [
  'Fever, headache, body aches',
  'Chest pain, shortness of breath',
  'Nausea, vomiting, stomach pain',
  'Sore throat, runny nose, cough',
  'Dizziness, fatigue, weakness',
];

export default function SymptomForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    symptoms: '',
    age: '',
    duration: '',
    patientName: '',
  });

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.symptoms.trim()) return;
    onSubmit({
      symptoms: form.symptoms.trim(),
      age: form.age ? parseInt(form.age) : null,
      duration: form.duration || null,
      patientName: form.patientName.trim() || null,
    });
  };

  const handlePreset = (preset) => {
    setForm(f => ({ ...f, symptoms: preset }));
  };

  const charCount = form.symptoms.length;
  const charMax = 2000;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Name */}
      <div>
        <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
          Patient Name <span className="text-slate-600">(optional)</span>
        </label>
        <input
          type="text"
          name="patientName"
          value={form.patientName}
          onChange={handleChange}
          placeholder="Enter patient name..."
          className="input-field"
          maxLength={100}
        />
      </div>

      {/* Age & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
            Age <span className="text-slate-600">(optional)</span>
          </label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Years..."
            min="0"
            max="120"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
            Duration <span className="text-slate-600">(optional)</span>
          </label>
          <select
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="input-field appearance-none cursor-pointer"
          >
            <option value="">Select duration...</option>
            {DURATION_OPTIONS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Symptoms textarea */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest">
            Symptoms <span className="text-red-400">*</span>
          </label>
          <span className={`text-xs font-mono ${charCount > charMax * 0.9 ? 'text-amber-400' : 'text-slate-600'}`}>
            {charCount}/{charMax}
          </span>
        </div>
        <textarea
          name="symptoms"
          value={form.symptoms}
          onChange={handleChange}
          placeholder="Describe symptoms in detail... (e.g., sharp chest pain that worsens with breathing, started 2 hours ago, accompanied by shortness of breath)"
          rows={5}
          maxLength={charMax}
          required
          className="input-field resize-none leading-relaxed"
        />
      </div>

      {/* Presets */}
      <div>
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Quick Fill</p>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_PRESETS.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all duration-200 font-body"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !form.symptoms.trim()}
        className="btn-primary w-full flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Analyzing with AI...</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span>Analyze Symptoms</span>
          </>
        )}
      </button>

      {/* Disclaimer */}
      <p className="text-xs text-slate-600 text-center leading-relaxed">
        ⚠️ AI-powered analysis only. Not a substitute for professional medical diagnosis.
      </p>
    </form>
  );
}