
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Sparkles, BookOpen, Brain, Play, Lock, CheckCircle, Map, Zap, HelpCircle, ChevronDown, ChevronRight, MessageSquare, Send, AlertCircle, Lightbulb } from 'lucide-react';
import { Subject, StudyGuide, Sector, MicroSkill, UserStats } from '../types';
import { generateStudyGuide, generateSubjectRoadmap, resolveDoubt } from '../services/geminiService';

interface StudySessionPageProps {
  selectedSubject: Subject | null;
  isJoined: boolean;
  onJoin: () => void;
  onBack: () => void;
  onTakeQuiz: (topic: string, context?: string, roadmapId?: string) => void;
  completedTopicIds: string[]; // List of completed MicroSkill IDs
  userStats: UserStats;
}

export const StudySessionPage: React.FC<StudySessionPageProps> = ({ selectedSubject, isJoined, onJoin, onBack, onTakeQuiz, completedTopicIds, userStats }) => {
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [studyGuide, setStudyGuide] = useState<StudyGuide | null>(null);
  
  // New Hierarchical State
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<MicroSkill | null>(null);
  const [expandedSectors, setExpandedSectors] = useState<string[]>([]);
  
  // Interactive Quiz State
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial fetch of roadmap when subject changes
  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!selectedSubject) return;
      setLoadingRoadmap(true);
      try {
        // Pass userStats to enable personalization
        const data = await generateSubjectRoadmap(selectedSubject.name, userStats);
        setSectors(data);
        
        // Default Expand First Sector
        if (data.length > 0) {
            setExpandedSectors([data[0].id]);
        }

        // Auto-select first active or next uncompleted skill
        let found = false;
        for (const sec of data) {
            for (const lvl of sec.levels) {
                for (const skill of lvl.skills) {
                    // Check logic based on completion
                    const isCompleted = completedTopicIds.includes(skill.id);
                    if (!isCompleted && !found) {
                        setSelectedSkill(skill);
                        // Also ensure its sector is expanded
                        setExpandedSectors(prev => prev.includes(sec.id) ? prev : [...prev, sec.id]);
                        found = true;
                        if (isJoined) handleSkillSelect(skill);
                        break;
                    }
                }
                if (found) break;
            }
            if (found) break;
        }
      } catch (e) {
        console.error("Failed to load roadmap");
      } finally {
        setLoadingRoadmap(false);
      }
    };
    
    fetchRoadmap();
  }, [selectedSubject, isJoined]);

  const toggleSector = (sectorId: string) => {
      setExpandedSectors(prev => 
        prev.includes(sectorId) ? prev.filter(id => id !== sectorId) : [...prev, sectorId]
      );
  };

  const handleSkillSelect = async (skill: MicroSkill) => {
    // Check if locked
    const allSkills: MicroSkill[] = sectors.flatMap(s => s.levels.flatMap(l => l.skills));
    const idx = allSkills.findIndex(s => s.id === skill.id);
    const isLocked = idx > 0 && !completedTopicIds.includes(allSkills[idx - 1].id);

    if (isLocked) return;
    
    setSelectedSkill(skill);
    setChatHistory([]); // Reset chat for new topic

    if (!isJoined) return; 

    setLoadingContent(true);
    setStudyGuide(null);
    setSelectedQuizOption(null); 
    setShowQuizResult(false);
    
    try {
      if (selectedSubject) {
        // Use user's learning style, default to 'Practical' if not set
        const style = userStats.learningStyle || 'Practical';
        const guide = await generateStudyGuide(selectedSubject.name, skill.title, style);
        setStudyGuide(guide);
      }
    } catch (error) {
      alert("Could not generate content.");
    } finally {
      setLoadingContent(false);
    }
  };

  const handleOptionClick = (idx: number) => {
    if (showQuizResult) return;
    setSelectedQuizOption(idx);
    setShowQuizResult(true);
  };

  const handleSendChat = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!chatInput.trim() || !selectedSubject || !selectedSkill || !studyGuide) return;
     
     const userMsg = chatInput;
     setChatInput('');
     setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
     setChatLoading(true);
     
     // Scroll to bottom
     setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

     try {
         const aiResponse = await resolveDoubt(
             selectedSubject.name, 
             selectedSkill.title, 
             JSON.stringify(studyGuide), 
             userMsg
         );
         setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
     } catch (err) {
         setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble thinking right now." }]);
     } finally {
         setChatLoading(false);
         setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
     }
  };

  if (!selectedSubject) return null;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          &larr;
        </button>
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
             <span className="text-3xl">{selectedSubject.icon}</span> {selectedSubject.name}
           </h1>
           <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <span>Adaptive Path ({userStats.subjectKnowledge[selectedSubject.id] || 'Beginner'})</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                 <Sparkles size={12} /> {userStats.learningStyle || 'Practical'} Learner
              </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Left Panel: Hierarchical Roadmap */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-150px)] sticky top-6">
               <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 shrink-0">
                  <Map size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-slate-800 dark:text-white">Mission Map</h3>
               </div>
               
               {loadingRoadmap ? (
                  <div className="p-8 flex justify-center text-slate-400">
                     <Loader2 className="animate-spin" />
                  </div>
               ) : (
                 <div className="overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {sectors.map((sector) => {
                        const isExpanded = expandedSectors.includes(sector.id);
                        return (
                            <div key={sector.id} className="border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                                <button 
                                    onClick={() => toggleSector(sector.id)}
                                    className="w-full flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-700/20 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                                >
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{sector.title}</h4>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{sector.description}</p>
                                    </div>
                                    {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                </button>
                                
                                {isExpanded && (
                                    <div className="p-2 space-y-4 bg-white dark:bg-slate-800">
                                        {sector.levels.map((level) => (
                                            <div key={level.id}>
                                                <h5 className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{level.title}</h5>
                                                <div className="space-y-1 relative pl-3 border-l-2 border-slate-100 dark:border-slate-700 ml-1">
                                                    {level.skills.map((skill) => {
                                                        const allSkills = sectors.flatMap(s => s.levels.flatMap(l => l.skills));
                                                        const idx = allSkills.findIndex(s => s.id === skill.id);
                                                        const isLocked = idx > 0 && !completedTopicIds.includes(allSkills[idx - 1].id);
                                                        const isCompleted = completedTopicIds.includes(skill.id);
                                                        const isActive = selectedSkill?.id === skill.id;

                                                        return (
                                                            <button 
                                                                key={skill.id}
                                                                disabled={isLocked}
                                                                onClick={() => handleSkillSelect(skill)}
                                                                className={`w-full text-left p-2 rounded-lg text-sm flex items-start gap-2 transition-all
                                                                    ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400'}
                                                                    ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                                                                `}
                                                            >
                                                                <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 border 
                                                                    ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 
                                                                      isActive ? 'border-indigo-500 dark:border-indigo-400 bg-white dark:bg-slate-800' : 'border-slate-300 dark:border-slate-600'}
                                                                `}>
                                                                    {isCompleted && <CheckCircle size={10} />}
                                                                    {isLocked && <Lock size={10} className="text-slate-400" />}
                                                                    {!isCompleted && !isLocked && isActive && <div className="w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full" />}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="leading-tight">{skill.title}</div>
                                                                    {isActive && <div className="text-[10px] text-indigo-500/80 dark:text-indigo-400/80 mt-1">{skill.description}</div>}
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                 </div>
               )}
            </div>
         </div>

         {/* Right Panel: Content */}
         <div className="lg:col-span-8 space-y-6">
            {!isJoined ? (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                 <div className="relative z-10 max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                       <Lock size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Class Content Locked</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Join this class to access the AI study guides, quizzes, and track your progress on the leaderboard.</p>
                    <button 
                      onClick={onJoin}
                      className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
                    >
                      Join Class to Unlock
                    </button>
                 </div>
              </div>
            ) : loadingContent ? (
               <div className="h-96 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 mb-4" size={40} />
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Asking your AI Teacher...</h3>
                  <p className="text-slate-400 text-sm">Preparing custom content for "{selectedSkill?.title}"</p>
               </div>
            ) : studyGuide && selectedSkill ? (
              <>
                 {/* CONTENT CARD */}
                 <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200 dark:shadow-slate-900/20 border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in duration-500">
                    <div className="bg-gradient-to-r from-indigo-50 to-white dark:from-slate-800 dark:to-slate-750 p-8 border-b border-indigo-50 dark:border-slate-700">
                        <div className="flex justify-between items-start">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-300 shadow-sm mb-4">
                                <Sparkles size={12} /> AI Teacher
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{studyGuide.topic}</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Let's break this down simply.</p>
                        </div>
                        </div>
                    </div>
                    
                    <div className="p-8 space-y-8">
                        <section>
                            <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-3 flex items-center gap-2">
                                <BookOpen size={20} className="text-indigo-500 dark:text-indigo-400" /> The Big Picture
                            </h3>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-lg">
                                {studyGuide.overview}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
                                <Brain size={20} className="text-indigo-500 dark:text-indigo-400" /> Core Concepts
                            </h3>
                            <div className="grid gap-4">
                                {studyGuide.keyConcepts.map((concept, idx) => (
                                <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-indigo-200 dark:hover:border-indigo-500 transition-colors bg-white dark:bg-slate-750 shadow-sm">
                                    <h4 className="font-bold text-slate-800 dark:text-white mb-2 text-lg">{concept.title}</h4>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{concept.content}</p>
                                </div>
                                ))}
                            </div>
                        </section>

                        {/* Common Misconceptions Section (NEW) */}
                        {studyGuide.commonMisconceptions && studyGuide.commonMisconceptions.length > 0 && (
                            <section>
                                <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200 mb-3 flex items-center gap-2">
                                    <AlertCircle size={20} className="text-rose-500 dark:text-rose-400" /> Common Misconceptions
                                </h3>
                                <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800 rounded-2xl p-6">
                                    <ul className="space-y-3">
                                        {studyGuide.commonMisconceptions.map((mis, idx) => (
                                            <li key={idx} className="flex gap-3 items-start text-rose-800 dark:text-rose-200">
                                                <span className="font-bold shrink-0 text-rose-400">×</span>
                                                {mis}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        )}

                        {/* Practical Application Section (NEW) */}
                        {studyGuide.practicalApplication && (
                            <section>
                                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mb-3 flex items-center gap-2">
                                    <Lightbulb size={20} className="text-emerald-500 dark:text-emerald-400" /> Why This Matters
                                </h3>
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 text-emerald-800 dark:text-emerald-200 leading-relaxed">
                                    {studyGuide.practicalApplication}
                                </div>
                            </section>
                        )}
                        
                        {/* Interactive Element: Mini-Quiz */}
                        {studyGuide.interactiveElement && studyGuide.interactiveElement.type === 'quiz' && (
                        <section className="bg-indigo-900 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Zap className="text-yellow-400" /> Check Your Understanding
                                </h3>
                                <p className="text-indigo-200 mb-6 text-lg font-medium">
                                {studyGuide.interactiveElement.question}
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {studyGuide.interactiveElement.options.map((option, idx) => {
                                    let btnClass = "text-left p-4 rounded-xl border-2 transition-all font-semibold ";
                                    if (showQuizResult) {
                                        if (idx === studyGuide.interactiveElement!.correctAnswer) {
                                            btnClass += "bg-emerald-500 border-emerald-400 text-white";
                                        } else if (idx === selectedQuizOption) {
                                            btnClass += "bg-rose-500 border-rose-400 text-white";
                                        } else {
                                            btnClass += "bg-indigo-800/50 border-indigo-700 text-indigo-300";
                                        }
                                    } else {
                                        btnClass += "bg-indigo-800/50 border-indigo-700 hover:bg-indigo-800 hover:border-indigo-500 text-indigo-100";
                                    }

                                    return (
                                        <button 
                                        key={idx}
                                        onClick={() => handleOptionClick(idx)}
                                        disabled={showQuizResult}
                                        className={btnClass}
                                        >
                                        {option}
                                        </button>
                                    );
                                })}
                                </div>
                                
                                {showQuizResult && (
                                <div className="mt-6 bg-indigo-800/80 p-4 rounded-xl border border-indigo-700 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex gap-2 items-start">
                                        <HelpCircle className="text-indigo-300 mt-1 shrink-0" size={20} />
                                        <div>
                                            <p className="font-bold text-white mb-1">
                                            {selectedQuizOption === studyGuide.interactiveElement.correctAnswer ? "Correct!" : "Not quite."}
                                            </p>
                                            <p className="text-indigo-200 text-sm leading-relaxed">
                                            {studyGuide.interactiveElement.explanation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                        </section>
                        )}

                        <div className="pt-6 flex justify-end border-t border-slate-100 dark:border-slate-700">
                            <button 
                                onClick={() => {
                                    // Extract context
                                    const context = `
                                    Topic: ${studyGuide.topic}
                                    Overview: ${studyGuide.overview}
                                    Key Concepts: ${studyGuide.keyConcepts.map(c => c.title + ": " + c.content).join('\n')}
                                    Summary: ${studyGuide.summary}`;
                                    onTakeQuiz(studyGuide.topic, context, selectedSkill?.id);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2 transform hover:scale-105"
                            >
                                <Play size={20} fill="currentColor" /> Take Skill Quiz
                            </button>
                        </div>
                    </div>
                 </div>

                 {/* CHAT INTERFACE (NEW) */}
                 <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mt-6">
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                        <MessageSquare size={18} className="text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-bold text-slate-800 dark:text-white">Ask the AI Tutor</h3>
                        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium ml-auto">Beta</span>
                    </div>
                    
                    <div className="p-6">
                        {chatHistory.length === 0 && (
                            <div className="text-center text-slate-400 text-sm mb-6">
                                <p>Still have doubts? Ask me anything about this lesson!</p>
                            </div>
                        )}
                        
                        <div className="space-y-4 max-h-64 overflow-y-auto mb-4 custom-scrollbar px-2">
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                             {chatLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 p-3 rounded-2xl rounded-tl-sm text-sm flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </div>
                             )}
                             <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleSendChat} className="relative">
                            <input 
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Type your doubt here..."
                                className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                            <button 
                                type="submit"
                                disabled={chatLoading || !chatInput.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                 </div>
              </>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-800/50">
                 <div className="bg-white dark:bg-slate-700 p-4 rounded-full shadow-sm mb-4">
                    <Map size={32} className="text-slate-300 dark:text-slate-500" />
                 </div>
                 <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Start Your Mission</h3>
                 <p className="text-slate-500 dark:text-slate-400 max-w-sm">Select a MicroSkill from the mission map on the left to begin your lesson.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};
