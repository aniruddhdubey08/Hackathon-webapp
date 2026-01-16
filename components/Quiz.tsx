
import React, { useState, useEffect } from 'react';
import { Question, GameMode } from '../types';
import { CheckCircle, XCircle, ArrowRight, HelpCircle, Loader2, Timer, AlertTriangle, Heart, Swords, User, Crown } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  topic: string;
  gameMode: GameMode;
  onComplete: (score: number, total: number) => void;
  onCancel: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, topic, gameMode, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Game Mode State
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for Time Attack
  const [lives, setLives] = useState(1); // 1 life for Sudden Death
  
  // Battle Mode State
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentName] = useState("Rival_Student");
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  // Timer Effect for Time Attack
  useEffect(() => {
    if (gameMode === 'Time Attack' && !isAnswered && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onComplete(score, questions.length); // End quiz when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameMode, isAnswered, timeLeft, score, questions.length, onComplete]);

  // Simulated Opponent Logic for Battle Mode
  useEffect(() => {
    if (gameMode !== '1v1 Battle' || isAnswered) return;

    // Random time between 3s and 10s for opponent to answer
    const reactionTime = Math.floor(Math.random() * 7000) + 3000;
    
    const timer = setTimeout(() => {
      // Opponent logic: 70% chance to be correct
      const isCorrect = Math.random() > 0.3;
      
      if (isCorrect) {
        setOpponentScore(prev => prev + 1);
        setBattleLog(prev => [...prev, `${opponentName} answered correctly!`]);
      } else {
        setBattleLog(prev => [...prev, `${opponentName} missed the question.`]);
      }
    }, reactionTime);

    return () => clearTimeout(timer);
  }, [gameMode, currentIndex, isAnswered]);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    setShowExplanation(true);
    
    if (index === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
      if (gameMode === '1v1 Battle') {
        setBattleLog(prev => [...prev, "You answered correctly!"]);
      }
    } else {
      if (gameMode === 'Sudden Death') {
         setLives(0);
      }
    }
  };

  const handleNext = () => {
    // If Sudden Death and lost life, end immediately
    if (gameMode === 'Sudden Death' && lives === 0) {
      onComplete(score, questions.length);
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      // Determine winner for battle mode bonus (handled in App.tsx typically, but visuals here)
      onComplete(score, questions.length);
    }
  };

  if (!currentQuestion) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600 dark:text-indigo-400" /></div>;

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{topic}</h2>
             <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider
                ${gameMode === 'Time Attack' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 
                  gameMode === 'Sudden Death' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' : 
                  gameMode === '1v1 Battle' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' : 
                  'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'}`}>
                {gameMode}
             </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        
        <div className="flex items-center gap-4">
           {gameMode === 'Time Attack' && (
             <div className={`flex items-center gap-2 text-xl font-mono font-bold ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-slate-700 dark:text-slate-200'}`}>
                <Timer /> {timeLeft}s
             </div>
           )}
           {gameMode === 'Sudden Death' && (
              <div className="flex items-center gap-1 text-rose-500 font-bold">
                 <Heart fill="currentColor" /> {lives}
              </div>
           )}
           <button 
             onClick={onCancel}
             className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-medium"
           >
             Exit
           </button>
        </div>
      </div>

      {/* Battle Mode Scoreboard */}
      {gameMode === '1v1 Battle' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-3 rounded-xl flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><User size={16} /></div>
                <span className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">You</span>
             </div>
             <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{score}</span>
          </div>
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-3 rounded-xl flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="bg-rose-500 p-1.5 rounded-lg text-white"><Swords size={16} /></div>
                <span className="font-bold text-rose-900 dark:text-rose-200 text-sm">{opponentName}</span>
             </div>
             <span className="text-xl font-black text-rose-600 dark:text-rose-400">{opponentScore}</span>
          </div>
          
          {/* Battle Log */}
          <div className="col-span-2 text-center h-6">
             {battleLog.length > 0 && (
               <span className="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse">
                 {battleLog[battleLog.length - 1]}
               </span>
             )}
          </div>
        </div>
      )}

      {/* Progress Bar (Hidden in Battle Mode to save space or styled differently) */}
      {gameMode !== '1v1 Battle' && (
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full mb-8 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out rounded-full ${gameMode === 'Sudden Death' ? 'bg-rose-500' : 'bg-indigo-600'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Question Card */}
      <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border overflow-hidden mb-6 transition-colors duration-300
         ${gameMode === 'Sudden Death' && lives === 0 ? 'border-rose-300 dark:border-rose-700 shadow-rose-100 dark:shadow-none' : 'border-slate-200 dark:border-slate-700'}
      `}>
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 leading-relaxed">
            {currentQuestion.questionText}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group relative overflow-hidden ";
              
              if (isAnswered) {
                if (idx === currentQuestion.correctAnswerIndex) {
                  btnClass += "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-300";
                } else if (idx === selectedOption) {
                  btnClass += "bg-rose-50 dark:bg-rose-900/30 border-rose-500 text-rose-800 dark:text-rose-300";
                } else {
                  btnClass += "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 opacity-70";
                }
              } else {
                btnClass += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-200 hover:shadow-md";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <span className="font-medium z-10 relative">{option}</span>
                  {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                    <CheckCircle className="text-emerald-500 z-10" size={20} />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                    <XCircle className="text-rose-500 z-10" size={20} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Explanation Footer */}
        {showExplanation && (
          <div className="bg-slate-50 dark:bg-slate-700/30 p-6 border-t border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {gameMode === 'Sudden Death' && lives === 0 && (
               <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold mb-4 bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg border border-rose-100 dark:border-rose-800">
                  <AlertTriangle size={20} /> Game Over! You missed a question.
               </div>
            )}

            <div className="flex items-start gap-3 mb-4">
              <HelpCircle className="text-indigo-500 dark:text-indigo-400 mt-1 shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm uppercase tracking-wide mb-1">Explanation</h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                {gameMode === 'Sudden Death' && lives === 0 ? 'See Results' : 
                 currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
