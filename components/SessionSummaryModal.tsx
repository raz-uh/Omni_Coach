
import React from 'react';
import { SessionSummary } from '../types';

interface SessionSummaryModalProps {
  summary: SessionSummary;
  onClose: () => void;
  exerciseName: string;
}

const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({ summary, onClose, exerciseName }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border-white/10 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full border border-white/5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="flex items-center gap-4 mb-2">
             <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-orbitron rounded-md border border-green-500/30">FINAL REPORT</span>
             <span className="text-slate-600 text-[10px] font-orbitron uppercase tracking-widest">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          <h2 className="text-4xl font-bold font-orbitron text-white mb-1">KINESTHETIC ANALYSIS</h2>
          <p className="text-slate-500 font-orbitron text-xs uppercase tracking-[0.2em]">{exerciseName} • BIOMECHANICAL RESEARCH DEPT</p>
        </div>

        <div className="p-8 overflow-y-auto space-y-10 flex-1 custom-scrollbar">
          {/* Top Row: Scores and Takeaway */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-2 opacity-10"><svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></div>
               <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-green-500" 
                      strokeDasharray={276.5} strokeDashoffset={276.5 * (1 - summary.overallScore / 100)} 
                      strokeLinecap="round" />
                 </svg>
                 <span className="absolute text-2xl font-bold font-orbitron text-white">{summary.overallScore}</span>
               </div>
               <span className="text-[10px] text-slate-500 uppercase font-orbitron tracking-tighter">Overall Form Score</span>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10">
               <div className="text-5xl font-bold font-orbitron text-blue-400 mb-2">{summary.efficiencyScore}<span className="text-xl text-slate-600">/10</span></div>
               <span className="text-[10px] text-slate-500 uppercase font-orbitron tracking-tighter">Recruitment Efficiency</span>
               <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${summary.efficiencyScore * 10}%` }} />
               </div>
            </div>

            <div className="flex flex-col justify-center p-6 bg-white/5 rounded-2xl border border-white/10 md:col-span-1">
               <h3 className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest mb-2">Consistency</h3>
               <p className="text-xl font-bold font-orbitron text-slate-200">{summary.consistencyRating}</p>
               <p className="text-[10px] text-slate-600 mt-1">Based on intra-set variance metrics.</p>
            </div>
          </div>

          {/* Biomechanical Breakdown */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold font-orbitron text-slate-400 flex items-center gap-2">
                <div className="w-1 h-4 bg-green-500" /> BIOMECHANICAL BREAKDOWN
             </h3>
             <div className="bg-white/5 p-6 rounded-2xl border border-white/10 leading-relaxed text-slate-300">
                {summary.biomechanicalBreakdown}
             </div>
          </div>

          {/* Fatigue Timeline & Improvement Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-orbitron text-slate-400 flex items-center gap-2">
                <div className="w-1 h-4 bg-red-500" /> FATIGUE TIMELINE (FORM CREEP)
              </h3>
              <div className="space-y-3">
                {summary.fatigueDetection.map((f, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="text-[10px] font-mono text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20">{f.timestamp}</div>
                    <div className="flex-1 text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                      {f.description}
                    </div>
                  </div>
                ))}
                {summary.fatigueDetection.length === 0 && <div className="text-xs text-slate-600 italic">No significant form deterioration detected.</div>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold font-orbitron text-slate-400 flex items-center gap-2">
                <div className="w-1 h-4 bg-amber-500" /> GROWTH OPPORTUNITIES
              </h3>
              <div className="bg-amber-500/5 p-6 rounded-2xl border border-amber-500/10">
                <ul className="space-y-4">
                  {summary.improvementAreas.map((area, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</div>
                      <p className="text-sm text-slate-300 leading-snug">{area}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Internal & External Cues */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                <h4 className="text-[10px] font-orbitron text-green-500 uppercase mb-2 tracking-[0.2em]">Internal Cue (Feel)</h4>
                <p className="text-lg text-slate-200 font-medium leading-tight">"{summary.internalCue}"</p>
             </div>
             <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg></div>
                <h4 className="text-[10px] font-orbitron text-blue-500 uppercase mb-2 tracking-[0.2em]">External Cue (Do)</h4>
                <p className="text-lg text-slate-200 font-medium leading-tight">"{summary.externalCue}"</p>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[10px] font-orbitron text-slate-500 uppercase">
             <div className="flex items-center gap-2"><div className="w-1 h-1 bg-green-500 rounded-full" /> GROUNDED IN SPORTS MEDICINE</div>
             <div className="flex items-center gap-2"><div className="w-1 h-1 bg-green-500 rounded-full" /> GEMINI 3 PRO ANALYTICS</div>
          </div>
          <button 
            onClick={onClose}
            className="w-full md:w-auto px-10 py-4 bg-green-500 hover:bg-green-400 text-black font-bold font-orbitron rounded-xl transition-all shadow-lg shadow-green-500/20 active:scale-95"
          >
            DISMISS REPORT
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionSummaryModal;
