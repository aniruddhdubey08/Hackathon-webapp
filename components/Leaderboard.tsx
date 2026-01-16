import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Users } from 'lucide-react';
import { db } from '../services/db';

export const Leaderboard: React.FC = () => {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = db.getCurrentUser();
    setCurrentUser(user);
    // Fixed to Class rankings
    const entries = db.getLeaderboard('Class');
    setData(entries);
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-indigo-600 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <h2 className="text-2xl font-bold text-white flex items-center gap-3">
             <Trophy className="text-amber-300" size={32} />
             Class Leaderboard
           </h2>
           <span className="bg-indigo-500/50 text-indigo-100 px-4 py-1.5 rounded-full text-sm font-medium border border-indigo-400/30 flex items-center gap-2">
             <Users size={16} /> Weekly Rankings
           </span>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        <div className="p-4 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider flex border-b border-slate-100">
           <div className="w-16 text-center">Rank</div>
           <div className="flex-1 px-4">Student</div>
           <div className="w-24 text-right">XP Earned</div>
        </div>
        {data.map((entry) => {
          const isMe = currentUser && entry.username === currentUser.name;
          return (
            <div key={entry.username} className={`flex items-center p-4 hover:bg-slate-50 transition-colors ${isMe ? 'bg-amber-50 hover:bg-amber-100 border-l-4 border-amber-400' : ''}`}>
              <div className="w-16 font-bold text-slate-400 text-center flex justify-center items-center">
                {entry.rank === 1 ? <Medal className="text-yellow-500 drop-shadow-sm" size={28} /> :
                 entry.rank === 2 ? <Medal className="text-slate-400 drop-shadow-sm" size={28} /> :
                 entry.rank === 3 ? <Medal className="text-amber-700 drop-shadow-sm" size={28} /> :
                 <span className="text-xl text-slate-500">{entry.rank}</span>}
              </div>
              <div className="flex-1 flex items-center gap-4 px-4">
                 <img src={entry.avatar} alt={entry.username} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                 <div>
                    <h4 className={`font-bold text-base ${isMe ? 'text-amber-900' : 'text-slate-800'}`}>
                      {entry.username} {isMe && '(You)'}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">Level {Math.floor(entry.xp / 1000) + 1}</p>
                 </div>
              </div>
              <div className="w-24 text-right font-mono font-bold text-indigo-600 text-lg">
                 {entry.xp.toLocaleString()}
              </div>
            </div>
          );
        })}
        {data.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No active players in this category yet.
          </div>
        )}
      </div>
      
      <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
         <p className="text-sm text-slate-500 font-medium">Rankings reset every Sunday at midnight.</p>
      </div>
    </div>
  );
};