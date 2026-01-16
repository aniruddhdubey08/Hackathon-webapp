import React from 'react';
import { Badge } from '../types';
import { Award, Lock } from 'lucide-react';

interface BadgeDisplayProps {
  badges: Badge[];
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {badges.map((badge) => (
        <div 
          key={badge.id} 
          className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-300 ${
            badge.unlocked 
              ? 'bg-amber-50 border-amber-200 shadow-sm transform hover:scale-105' 
              : 'bg-slate-100 border-slate-200 opacity-60 grayscale'
          }`}
        >
          <div className={`p-3 rounded-full mb-2 ${badge.unlocked ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
            {badge.unlocked ? <Award size={24} /> : <Lock size={24} />}
          </div>
          <span className="text-xs font-bold text-center text-slate-800">{badge.name}</span>
          <span className="text-[10px] text-center text-slate-500 mt-1 leading-tight">{badge.description}</span>
        </div>
      ))}
    </div>
  );
};
