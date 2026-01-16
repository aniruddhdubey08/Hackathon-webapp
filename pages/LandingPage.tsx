
import React from 'react';
import { Brain, Sparkles, ArrowRight, GraduationCap, Trophy, LineChart, Sun, Moon } from 'lucide-react';
import { UserRole } from '../types';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: (role: UserRole) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup, darkMode, onToggleTheme }) => (
  <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
    {/* Navbar - Clean background to avoid transparency lines */}
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto w-full px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 cursor-pointer">
           <div className="bg-indigo-600 p-2 rounded-lg">
              <Brain className="text-white" size={24} />
           </div>
           <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">MindQuest</span>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={onToggleTheme}
             className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
           >
             {darkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
           <button 
             onClick={onLogin} 
             className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
           >
             Log In
           </button>
           <button 
             onClick={() => onSignup('student')}
             className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg transition-all shadow-md shadow-indigo-200 dark:shadow-none"
           >
             Get Started
           </button>
        </div>
      </div>
    </nav>

    {/* Hero - Pure white background to match features */}
    <div className="flex-1 flex flex-col justify-center items-center text-center px-6 py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
       {/* Decorative Background Elements - Floating Orbs */}
       <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-50/50 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10 animate-float"></div>
       <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-50/50 dark:bg-violet-900/20 rounded-full blur-3xl -z-10 animate-float-delayed"></div>
       
       <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full font-medium text-sm mb-6 border border-indigo-100 dark:border-indigo-800 animate-enter">
          <Sparkles size={16} className="text-amber-500 animate-pulse" /> AI-Powered Learning Platform
       </div>
       <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight max-w-4xl animate-enter delay-100">
         Turn studying into <br/>
         <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">an adventure.</span>
       </h1>
       <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed animate-enter delay-200">
         Master any subject with gamified quizzes, AI-generated study guides, and competitive leaderboards. Join classes and track your mastery.
       </p>
       <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center animate-enter delay-300">
          <button 
            onClick={() => onSignup('student')}
            className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-slate-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            I'm a Student <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => onSignup('teacher')}
            className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            I'm a Teacher <GraduationCap size={20} />
          </button>
       </div>
    </div>

    {/* Features Grid - Clean separation */}
    <div className="bg-slate-50/50 dark:bg-slate-800/50 py-24 px-6 border-t border-slate-100 dark:border-slate-800">
       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8">
             <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <Brain size={28} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Generated Quizzes</h3>
             <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Instantly generate quizzes on any topic with adjustable difficulty levels using Gemini AI. Never run out of practice material.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 delay-100 animate-in fade-in slide-in-from-bottom-8">
             <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                <Trophy size={28} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Gamified Progress</h3>
             <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Earn XP, unlock exclusive badges, and climb the global leaderboards to stay motivated and competitive while you learn.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 delay-200 animate-in fade-in slide-in-from-bottom-8">
             <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <LineChart size={28} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Detailed Analytics</h3>
             <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Track your mastery level in every subject. Our AI identifies your weak spots and suggests personalized study paths.</p>
          </div>
       </div>
    </div>
  </div>
);
