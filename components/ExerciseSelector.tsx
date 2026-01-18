
import React from 'react';
import { EXERCISES, Exercise } from '../types';

interface ExerciseSelectorProps {
  current: Exercise;
  onSelect: (ex: Exercise) => void;
  disabled: boolean;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ current, onSelect, disabled }) => {
  return (
    <div className="relative group">
      <select 
        value={current.id}
        disabled={disabled}
        onChange={(e) => {
          const ex = EXERCISES.find(x => x.id === e.target.value);
          if (ex) onSelect(ex);
        }}
        className={`bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-sm font-bold font-orbitron tracking-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-white/30'
        }`}
      >
        {EXERCISES.map(ex => (
          <option key={ex.id} value={ex.id}>{ex.name.toUpperCase()}</option>
        ))}
      </select>
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75 group-hover:block hidden" />
    </div>
  );
};

export default ExerciseSelector;
