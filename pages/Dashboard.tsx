
import React, { useEffect, useState } from 'react';
import { Brain, LineChart, Trophy, Star, Play, BookOpen, CheckCircle, Zap, Swords, Target, Calendar, School, ArrowRight, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { UserStats, Badge, DailyQuest, Assignment } from '../types';
import { BadgeDisplay } from '../components/BadgeDisplay';
import { db } from '../services/db';

interface DashboardProps {
  userStats: UserStats;
  subjectPerformanceData: any[];
  badges: Badge[];
  onStartQuiz: () => void;
  onGoToClasses: () => void;
  onTakeAssignment: (assignment: Assignment) => void;
  COLORS: string[];
}

export const Dashboard: React.FC<DashboardProps> = ({ userStats, subjectPerformanceData, badges, onStartQuiz, onGoToClasses, onTakeAssignment, COLORS }) => {
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    setDailyQuests(db.getDailyQuests());
    
    // Fetch assignments for enrolled classrooms
    if (userStats.enrolledClassroomIds && userStats.enrolledClassroomIds.length > 0) {
        const pending = db.getAssignmentsForStudent(userStats.enrolledClassroomIds);
        setAssignments(pending.filter(a => a.status !== 'completed').slice(0, 3)); // Show top 3 pending
    }
  }, [userStats]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userStats.name.split(' ')[0]}!</h1>
          <p className="text-indigo-100 mb-6 max-w-lg">You're on a roll! Keep up the momentum to reach Level {userStats.level + 1}.</p>
          
          <div className="flex gap-3">
             <button 
                onClick={onStartQuiz}
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 active:scale-95"
              >
                <Play size={20} fill="currentColor" />
                Start Quiz
              </button>
              <button 
                onClick={onGoToClasses}
                className="bg-indigo-500/30 border border-white/30 hover:bg-indigo-500/50 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <BookOpen size={20} />
                Go to Classes
              </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 group-hover:scale-110 transition-transform duration-700 ease-in-out">
          <Brain size={400} />
        </div>
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Level</div>
              <div className="text-3xl font-bold text-slate-800 dark:text-white">{userStats.level}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total XP</div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{userStats.totalXp.toLocaleString()}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Quizzes</div>
              <div className="text-3xl font-bold text-slate-800 dark:text-white">{userStats.quizzesTaken}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Streak</div>
              <div className="flex items-center gap-1 text-3xl font-bold text-amber-500">
                {userStats.streakDays} <Star fill="currentColor" size={20} className="animate-pulse-slow" />
              </div>
            </div>
          </div>
  
          {/* Performance Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <LineChart size={20} className="text-indigo-500" />
              Subject Performance
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(99, 102, 241, 0.1)'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff'}}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1500}>
                    {subjectPerformanceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          {/* Badges Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              Achievements
            </h3>
            <BadgeDisplay badges={badges} />
          </div>
        </div>
  
        {/* Sidebar Column */}
        <div className="space-y-8">

           {/* Assignments Widget (New) */}
           {assignments.length > 0 && (
             <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-indigo-500" /> Due Assignments
                </h3>
                <div className="space-y-3">
                   {assignments.map(assign => (
                      <div 
                        key={assign.id} 
                        onClick={() => onTakeAssignment(assign)}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:-translate-x-[-4px] transition-all cursor-pointer group hover:shadow-sm"
                      >
                          <div className="flex justify-between items-start mb-1">
                              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <School size={10} /> {assign.className}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${assign.difficulty === 'Easy' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                                  {assign.difficulty}
                              </span>
                          </div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{assign.topic}</h4>
                          
                          {/* Attachment Link */}
                          {assign.attachmentUrl && (
                              <div className="mb-2">
                                  <a 
                                    href={assign.attachmentUrl}
                                    download={assign.attachmentName || 'assignment.pdf'}
                                    onClick={(e) => e.stopPropagation()} 
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                                  >
                                     <FileText size={12} /> {assign.attachmentName || 'Download PDF'}
                                  </a>
                              </div>
                          )}

                          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                             <span>Due {new Date(assign.dueDate).toLocaleDateString()}</span>
                             <div className="flex items-center gap-1 text-indigo-500 dark:text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                Start <ArrowRight size={12} />
                             </div>
                          </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           {/* Daily Quests Widget */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Swords size={20} className="text-rose-500" /> Daily Quests
              </h3>
              <div className="space-y-4">
                 {dailyQuests.map(quest => (
                   <div key={quest.id} className="border border-slate-100 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex gap-3">
                            <div className={`p-2 rounded-lg ${quest.completed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-slate-700 shadow-sm text-slate-500 dark:text-slate-400'}`}>
                               {quest.icon === 'zap' && <Zap size={16} />}
                               {quest.icon === 'brain' && <Brain size={16} />}
                               {quest.icon === 'target' && <Target size={16} />}
                            </div>
                            <div>
                               <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{quest.title}</h4>
                               <p className="text-xs text-slate-500 dark:text-slate-400">{quest.description}</p>
                            </div>
                         </div>
                         <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                           +{quest.xpReward} XP
                         </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
                         <div 
                           className={`h-full rounded-full transition-all duration-1000 ease-out ${quest.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                           style={{width: `${Math.min(100, (quest.progress / quest.target) * 100)}%`}}
                         ></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
                         <span>{quest.progress}/{quest.target}</span>
                         {quest.completed && <span className="text-emerald-500 flex items-center gap-1 animate-in zoom-in"><CheckCircle size={10} /> Completed</span>}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800 hover:border-indigo-200 transition-colors">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">Did you know?</h3>
            <p className="text-indigo-700 dark:text-indigo-200 text-sm leading-relaxed mb-4">
              Consistent practice is key! Taking just one quiz a day can improve retention by 40%.
            </p>
            <button 
              onClick={onStartQuiz}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg active:scale-95"
            >
              Practice Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
