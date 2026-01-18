
import React from 'react';
import { CoachFeedback, CoachStatus } from '../types';

interface FeedbackDisplayProps {
  feedback: CoachFeedback | null;
  isAnalyzing: boolean;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, isAnalyzing }) => {
  if (!isAnalyzing) {
    return (
      <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center group border-dashed">
        <div className="w-16 h-16 rounded-full border-2 border-slate-700 flex items-center justify-center mb-4 transition-all group-hover:border-green-500 group-hover:bg-green-500/10">
           <svg className="w-8 h-8 text-slate-700 transition-colors group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </div>
        <h3 className="font-orbitron text-slate-400 uppercase text-xs mb-2 tracking-widest">Bio-Link Offline</h3>
        <p className="text-slate-600 text-[10px] leading-relaxed">System ready for kinematic ingestion. Stand in frame and initiate session.</p>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 border-2 border-slate-800 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin" />
        </div>
        <p className="text-blue-500 text-[10px] font-orbitron uppercase tracking-widest">Acquiring Joints...</p>
      </div>
    );
  }

  const isSafetyAlert = feedback.status === CoachStatus.SAFETY_ALERT;
  const isPerfect = feedback.status === CoachStatus.PERFECT_FORM;
  const isCorrection = feedback.status === CoachStatus.CORRECTION_NEEDED;

  let borderColor = 'border-blue-500/30';
  let glowColor = '';
  let accentColor = 'text-blue-400';
  
  if (isSafetyAlert) {
    borderColor = 'border-red-500/50';
    glowColor = 'neon-glow-red';
    accentColor = 'text-red-500';
  } else if (isPerfect) {
    borderColor = 'border-green-500/50';
    glowColor = 'neon-glow-green';
    accentColor = 'text-green-500';
  } else if (isCorrection) {
    borderColor = 'border-amber-500/50 shadow-lg shadow-amber-500/10';
    accentColor = 'text-amber-500';
  }

  return (
    <div className={`p-6 rounded-2xl glass-panel relative overflow-hidden transition-all duration-300 ${borderColor} ${glowColor}`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${isSafetyAlert ? 'bg-red-500' : isPerfect ? 'bg-green-500' : isCorrection ? 'bg-amber-500' : 'bg-blue-500'}`} />

      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className={`text-[10px] font-orbitron uppercase tracking-widest mb-1 ${accentColor}`}>
            {feedback.status.replace('_', ' ')}
          </h4>
          <h2 className={`text-2xl font-bold font-orbitron leading-tight ${isSafetyAlert ? 'text-red-500' : 'text-white'}`}>
            {feedback.cue}
          </h2>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSafetyAlert ? 'bg-red-500' : isPerfect ? 'bg-green-500' : 'bg-slate-800'}`}>
          {isSafetyAlert && <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          {isPerfect && <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>}
          {!isSafetyAlert && !isPerfect && <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <p className="text-[9px] text-slate-500 uppercase font-orbitron mb-1 tracking-tighter">Analysis Grounding</p>
          <p className="text-slate-300 text-sm leading-snug italic">"{feedback.reasoning}"</p>
        </div>

        <div>
          <p className="text-[9px] text-slate-500 uppercase font-orbitron mb-2 tracking-tighter">Joint Priority</p>
          <div className="flex flex-wrap gap-1.5">
            {feedback.joint_focus.map(joint => (
              <span key={joint} className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                isSafetyAlert ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-800/50 border-white/10 text-slate-400'
              }`}>
                {joint}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDisplay;
