
import React, { useState } from 'react';
import { Sparkles, GraduationCap, Target, ArrowRight, BookOpen, Brain, Eye, Book, Wrench } from 'lucide-react';
import { UserStats, LearningStyle } from '../types';

interface OnboardingPageProps {
  user: UserStats;
  onComplete: (details: { level: string; major: string; goal: string, learningStyle: LearningStyle }) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState('');
  const [major, setMajor] = useState('');
  const [goal, setGoal] = useState('');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('Practical');

  const ACADEMIC_LEVELS = [
    { id: 'High School', label: 'High School', icon: <BookOpen size={20} /> },
    { id: 'Undergraduate', label: 'Undergraduate', icon: <GraduationCap size={20} /> },
    { id: 'Graduate', label: 'Graduate / PhD', icon: <Sparkles size={20} /> },
    { id: 'Self-Learner', label: 'Self Learner / Pro', icon: <Brain size={20} /> }
  ];

  const GOALS = [
    { id: 'Exam Prep', label: 'Ace my Exams', desc: 'Strict, curriculum-focused learning' },
    { id: 'Skill Mastery', label: 'Master a Skill', desc: 'Deep dive into specific topics' },
    { id: 'Career Growth', label: 'Career Growth', desc: 'Practical, job-ready knowledge' },
    { id: 'Curiosity', label: 'Just Curious', desc: 'Fun, exploration-based learning' }
  ];

  const STYLES = [
      { id: 'Visual', label: 'Visual', icon: <Eye size={20} />, desc: 'I learn best with diagrams, charts, and mental imagery.' },
      { id: 'Practical', label: 'Practical', icon: <Wrench size={20} />, desc: 'I learn by doing, coding, and seeing real-world examples.' },
      { id: 'Theoretical', label: 'Theoretical', icon: <Book size={20} />, desc: 'I prefer deep reading, history, and understanding "why".' },
  ];

  const handleNext = () => {
    if (step === 4) {
      onComplete({ level, major, goal, learningStyle });
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-8 flex justify-center gap-2">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= step ? 'w-12 bg-indigo-600' : 'w-4 bg-slate-200'}`} />
            ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100 p-8 md:p-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">
                    {step === 1 && "What is your academic level?"}
                    {step === 2 && "What are you studying?"}
                    {step === 3 && "What is your main goal?"}
                    {step === 4 && "How do you learn best?"}
                </h1>
                <p className="text-slate-500 text-lg">
                    {step === 1 && "This helps us adjust the difficulty of your quizzes."}
                    {step === 2 && "We'll tailor examples to your field of interest."}
                    {step === 3 && "We'll structure your roadmaps to help you succeed."}
                    {step === 4 && "Our AI will adapt explanations to match your style."}
                </p>
            </div>

            {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ACADEMIC_LEVELS.map((opt) => (
                        <button 
                            key={opt.id}
                            onClick={() => setLevel(opt.id)}
                            className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-105 ${
                                level === opt.id 
                                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 ring-offset-2' 
                                : 'border-slate-100 bg-white hover:border-indigo-200'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${level === opt.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {opt.icon}
                            </div>
                            <h3 className={`font-bold text-lg ${level === opt.id ? 'text-indigo-900' : 'text-slate-800'}`}>{opt.label}</h3>
                        </button>
                    ))}
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Major or Field of Study</label>
                        <input 
                            type="text" 
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            placeholder="e.g. Computer Science, Psychology, Marketing..."
                            className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 text-lg focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400"
                            autoFocus
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['Computer Science', 'Business', 'Engineering', 'Arts', 'Medicine', 'Law'].map(m => (
                            <button 
                                key={m}
                                onClick={() => setMajor(m)}
                                className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${major === m ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="grid grid-cols-1 gap-4">
                    {GOALS.map((opt) => (
                        <button 
                            key={opt.id}
                            onClick={() => setGoal(opt.id)}
                            className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                                goal === opt.id 
                                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' 
                                : 'border-slate-100 bg-white hover:border-indigo-200'
                            }`}
                        >
                            <div className={`p-3 rounded-xl shrink-0 ${goal === opt.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <Target size={24} />
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg ${goal === opt.id ? 'text-indigo-900' : 'text-slate-800'}`}>{opt.label}</h3>
                                <p className="text-slate-500">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {step === 4 && (
                <div className="grid grid-cols-1 gap-4">
                    {STYLES.map((opt) => (
                        <button 
                            key={opt.id}
                            onClick={() => setLearningStyle(opt.id as LearningStyle)}
                            className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                                learningStyle === opt.id 
                                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' 
                                : 'border-slate-100 bg-white hover:border-indigo-200'
                            }`}
                        >
                            <div className={`p-3 rounded-xl shrink-0 ${learningStyle === opt.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {opt.icon}
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg ${learningStyle === opt.id ? 'text-indigo-900' : 'text-slate-800'}`}>{opt.label}</h3>
                                <p className="text-slate-500">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            <div className="mt-10 flex justify-between items-center">
                {step > 1 && (
                    <button 
                        onClick={() => setStep(step - 1)}
                        className="text-slate-400 hover:text-slate-600 font-bold px-4 py-2"
                    >
                        Back
                    </button>
                )}
                <button 
                    onClick={handleNext}
                    disabled={(step === 1 && !level) || (step === 2 && !major) || (step === 3 && !goal)}
                    className="ml-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                >
                    {step === 4 ? "Complete Setup" : "Next Step"} <ArrowRight size={20} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
