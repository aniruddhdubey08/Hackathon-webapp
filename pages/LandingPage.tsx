
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
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300 relative overflow-hidden">
    
    {/* Animated Background Elements */}
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-float pointer-events-none select-none" />
    <div className="absolute bottom-[10%] right-[-5%] w-80 h-80 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-float-delayed pointer-events-none select-none" />
    <div className="absolute top-[40%] left-[20%] w-64 h-64 bg-amber-300/20 dark:bg-amber-600/5 rounded-full blur-3xl animate-float pointer-events-none select-none" style={{ animationDuration: '8s' }} />

    <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full relative z-10">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Brain className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-slate-800 dark:text-white">MindQuest</span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleTheme}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button 
          onClick={onLogin} 
          className="text-slate-600 dark:text-slate-300 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Log In
        </button>
        <button 
          onClick={() => onSignup('student')}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          Get Started
        </button>
      </div>
    </nav>

    <div className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20 relative z-10">
      <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full text-sm font-medium text-indigo-700 dark:text-slate-300 mb-8 border border-transparent">
        <Sparkles size={16} className="text-amber-500" /> 
        <span>Powered by Gemini AI</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight max-w-4xl leading-tight">
        Gamify your <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Learning Journey</span>
      </h1>
      
      <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
        Turn study materials into interactive quests. Generate quizzes instantly, earn XP, and track your mastery with AI-powered insights.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button 
          onClick={() => onSignup('student')}
          className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none flex justify-center items-center gap-2 ring-0 border-0 outline-none"
        >
          Start Playing <ArrowRight size={20} />
        </button>
        <button 
          onClick={() => onSignup('teacher')}
          className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex justify-center items-center gap-2 ring-0 border-0 outline-none"
        >
          For Teachers <GraduationCap size={20} />
        </button>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full text-left">
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl transition-all border-0 shadow-none">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
            <Brain size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Quiz Generation</h3>
          <p className="text-slate-500 dark:text-slate-400">Instantly create quizzes from any topic or upload your own study materials.</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl transition-all border-0 shadow-none">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6">
            <Trophy size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Gamified Progress</h3>
          <p className="text-slate-500 dark:text-slate-400">Earn XP, unlock badges, and climb the leaderboard as you master new skills.</p>
        </div>

        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl transition-all border-0 shadow-none">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
            <LineChart size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Smart Analytics</h3>
          <p className="text-slate-500 dark:text-slate-400">Track your performance over time and identify areas that need improvement.</p>
        </div>
      </div>
    </div>
    
    <footer className="py-8 text-center text-slate-400 dark:text-slate-600 text-sm relative z-10">
      © 2026 MindQuest. Built with Gemini AI.
    </footer>
  </div>
);
