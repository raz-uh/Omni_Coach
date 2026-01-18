
import React from 'react';
import { CoachStatus } from '../types';

interface AnalysisStatusProps {
  status: string;
}

const AnalysisStatus: React.FC<AnalysisStatusProps> = ({ status }) => {
  let bgColor = 'bg-slate-800';
  let textColor = 'text-slate-400';
  let label = status.toUpperCase().replace('_', ' ');

  if (status === 'observing') {
    bgColor = 'bg-blue-500/20';
    textColor = 'text-blue-400';
  } else if (status === CoachStatus.SAFETY_ALERT) {
    bgColor = 'bg-red-500';
    textColor = 'text-white';
  } else if (status === CoachStatus.PERFECT_FORM) {
    bgColor = 'bg-green-500/20';
    textColor = 'text-green-400';
  } else if (status === CoachStatus.CORRECTION_NEEDED) {
    bgColor = 'bg-amber-500/20';
    textColor = 'text-amber-400';
  } else if (status === 'idle') {
    label = 'SYSTEM READY';
  }

  return (
    <div className={`px-3 py-1.5 rounded-md backdrop-blur-md flex items-center gap-2 border border-white/10 ${bgColor}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'idle' ? 'bg-slate-500' : 'bg-current animate-pulse'} ${textColor}`} />
      <span className={`text-[10px] font-bold font-orbitron tracking-widest ${textColor}`}>
        {label}
      </span>
    </div>
  );
};

export default AnalysisStatus;
