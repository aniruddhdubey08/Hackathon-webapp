
import React, { useState, useEffect } from 'react';
import { Brain, LayoutDashboard, GraduationCap, Trophy, Settings, Loader2, Play, BookOpen, LogOut, Sparkles, Zap, Skull, Clock, CheckCircle, Swords, AlertTriangle, Lock, ArrowRight, RotateCcw, Menu, X } from 'lucide-react';

// Components
import { Leaderboard } from './components/Leaderboard';
import { Quiz } from './components/Quiz';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Dashboard } from './pages/Dashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { LearnPage } from './pages/LearnPage';
import { StudySessionPage } from './pages/StudySessionPage';
import { SettingsPage } from './pages/SettingsPage';
import { OnboardingPage } from './pages/OnboardingPage';

// Services & Types
import { generateQuizQuestions, getLearningRecommendation } from './services/geminiService';
import { Question, UserStats, Badge, Subject, UserRole, GameMode, KnowledgeLevel, Assignment, LearningStyle } from './types';
import { db } from './services/db';

// Constants
const BADGES_DEFINITIONS: Badge[] = [
  { id: 'b1', name: 'First Steps', description: 'Complete your first quiz', icon: 'star', condition: (s) => s.quizzesTaken >= 1, unlocked: false },
  { id: 'b2', name: 'High Flyer', description: 'Get a perfect score', icon: 'award', condition: (s) => s.perfectScores >= 1, unlocked: false },
  { id: 'b3', name: 'Quiz Addict', description: 'Complete 5 quizzes', icon: 'zap', condition: (s) => s.quizzesTaken >= 5, unlocked: false },
  { id: 'b4', name: 'Knowledge Seeker', description: 'Reach Level 5', icon: 'book', condition: (s) => s.level >= 5, unlocked: false },
  { id: 'b5', name: 'Streak Master', description: '3 Day Streak', icon: 'flame', condition: (s) => s.streakDays >= 3, unlocked: false },
  { id: 'b6', name: 'Expert Mind', description: 'Reach 5000 XP', icon: 'crown', condition: (s) => s.totalXp >= 5000, unlocked: false },
];

const SUBJECTS_DATA: Subject[] = [
  // Tech & Engineering
  { id: 'py', name: 'Python Programming', description: 'Data structures, syntax, and automation', icon: '🐍', color: 'bg-emerald-600', memberCount: 2400, progress: 0, masteryLevel: 'Novice' },
  { id: 'react', name: 'React Development', description: 'Components, hooks, and state management', icon: '⚛️', color: 'bg-sky-500', memberCount: 1800, progress: 0, masteryLevel: 'Novice' },
  { id: 'web', name: 'Web Fundamentals', description: 'HTML, CSS, and Modern JavaScript', icon: '🌐', color: 'bg-orange-500', memberCount: 3100, progress: 0, masteryLevel: 'Novice' },
  { id: 'cs', name: 'Computer Science', description: 'Algorithms, Architecture, and Logic', icon: '💻', color: 'bg-slate-800', memberCount: 1500, progress: 0, masteryLevel: 'Novice' },
  { id: 'ds', name: 'Data Science', description: 'Analysis, visualization, and ML basics', icon: '📊', color: 'bg-indigo-600', memberCount: 1500, progress: 0, masteryLevel: 'Novice' },
  
  // Science & Math
  { id: 'math', name: 'Mathematics', description: 'Algebra, Calculus, and Geometry', icon: '📐', color: 'bg-blue-500', memberCount: 1240, progress: 0, masteryLevel: 'Novice' },
  { id: 'phys', name: 'Physics', description: 'Mechanics, Thermodynamics, and Energy', icon: '⚡', color: 'bg-violet-500', memberCount: 850, progress: 0, masteryLevel: 'Novice' },
  
  // Medicine & Biology (NEW)
  { id: 'bio', name: 'Biology', description: 'Life, cells, and ecosystems', icon: '🧬', color: 'bg-emerald-500', memberCount: 1800, progress: 0, masteryLevel: 'Novice' },
  { id: 'chem', name: 'Chemistry', description: 'Matter, reactions, and periodic table', icon: '🧪', color: 'bg-purple-500', memberCount: 1400, progress: 0, masteryLevel: 'Novice' },
  { id: 'anat', name: 'Human Anatomy', description: 'Body systems and physiology', icon: '🫀', color: 'bg-rose-500', memberCount: 900, progress: 0, masteryLevel: 'Novice' },
  { id: 'psych', name: 'Psychology', description: 'Mind, behavior, and cognition', icon: '🧠', color: 'bg-pink-500', memberCount: 2100, progress: 0, masteryLevel: 'Novice' },

  // Humanities
  { id: 'hist', name: 'History', description: 'World Civilizations and Modern Era', icon: '🏛️', color: 'bg-amber-500', memberCount: 930, progress: 0, masteryLevel: 'Novice' },
];

const INITIAL_STATS: UserStats = {
  id: 'guest',
  name: 'Guest',
  role: 'student',
  level: 1,
  currentXp: 0,
  totalXp: 0,
  quizzesTaken: 0,
  perfectScores: 0,
  streakDays: 1,
  badges: [],
  joinedClasses: [],
  enrolledClassroomIds: [],
  completedTopicIds: {},
  onboardingCompleted: false,
  subjectKnowledge: {},
  subjectGoals: {},
  learningStyle: 'Practical'
};

// Types for Charts
interface ChartData {
  name: string;
  value: number;
}

enum View {
  LANDING,
  LOGIN,
  SIGNUP,
  ONBOARDING,
  DASHBOARD,
  QUIZ_SETUP,
  QUIZ_ACTIVE,
  QUIZ_RESULT,
  TEACHER_DASHBOARD,
  LEARN,
  STUDY_SESSION,
  LEADERBOARD,
  SETTINGS
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

function App() {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_STATS);
  const [badges, setBadges] = useState<Badge[]>(BADGES_DEFINITIONS);
  const [authRole, setAuthRole] = useState<UserRole>('student');
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState('');
  
  // UI State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Quiz State
  const [loading, setLoading] = useState(false);
  const [quizTopic, setQuizTopic] = useState('');
  const [quizContext, setQuizContext] = useState('');
  const [currentRoadmapId, setCurrentRoadmapId] = useState<string | null>(null); // To track which chapter we are quizzing on
  const [quizDifficulty, setQuizDifficulty] = useState('Medium');
  const [gameMode, setGameMode] = useState<GameMode>('Classic');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [lastScore, setLastScore] = useState<{score: number, total: number} | null>(null);
  const [quizResultStatus, setQuizResultStatus] = useState<'pass' | 'fail' | 'neutral'>('neutral');
  const [recommendation, setRecommendation] = useState<string>("");

  // Learn State
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>(SUBJECTS_DATA);

  // Check for existing session
  useEffect(() => {
    let session = db.getCurrentUser();

    if (session) {
      setUserStats(session);
      // Update local subject progress based on loaded user data
      updateSubjectsProgress(session);
      
      if (session.role === 'teacher') {
        setCurrentView(View.TEACHER_DASHBOARD);
      } else if (!session.onboardingCompleted) {
        setCurrentView(View.ONBOARDING);
      } else {
        setCurrentView(View.DASHBOARD);
      }
    }
  }, []);

  const updateSubjectsProgress = (user: UserStats) => {
    // 1. Calculate Progress
    let updatedSubjects = SUBJECTS_DATA.map(sub => {
      const completedTopics = user.completedTopicIds[sub.id] || [];
      const progress = Math.min(100, Math.round((completedTopics.length / 12) * 100));
      return {
        ...sub,
        progress: progress,
        masteryLevel: progress > 80 ? 'Master' : progress > 40 ? 'Apprentice' : 'Novice'
      };
    });

    // 2. Reorder based on Major (Personalization)
    const major = user.academicDetails?.major?.toLowerCase() || '';
    
    if (major) {
       const priorityMap: Record<string, string[]> = {
           'computer science': ['cs', 'py', 'react', 'web', 'ds', 'math'],
           'engineering': ['math', 'phys', 'cs', 'py'],
           'business': ['ds', 'math', 'web'],
           'arts': ['hist', 'web'],
           'medicine': ['anat', 'bio', 'chem', 'psych', 'ds'], // Updated for Medicine
           'law': ['hist', 'psych']
       };

       // Find matching key
       const key = Object.keys(priorityMap).find(k => major.includes(k));
       if (key) {
           const priorities = priorityMap[key];
           updatedSubjects.sort((a, b) => {
               const aIdx = priorities.indexOf(a.id);
               const bIdx = priorities.indexOf(b.id);
               
               // If both are in priority list
               if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
               // If only a is in priority
               if (aIdx !== -1) return -1;
               // If only b is in priority
               if (bIdx !== -1) return 1;
               
               return 0;
           });
       }
    }

    setSubjects(updatedSubjects);
  };

  // Update badges based on stats
  useEffect(() => {
    setBadges(prevBadges => prevBadges.map(badge => ({
      ...badge,
      unlocked: badge.condition(userStats) || (userStats.badges && userStats.badges.includes(badge.id))
    })));
  }, [userStats]);

  // Auth Handlers
  const handleLoginSuccess = (user: any) => {
    setUserStats(user);
    updateSubjectsProgress(user);
    if (user.role === 'teacher') {
      setCurrentView(View.TEACHER_DASHBOARD);
    } else if (!user.onboardingCompleted) {
      setCurrentView(View.ONBOARDING);
    } else {
      setCurrentView(View.DASHBOARD);
    }
  };

  const handleSignupSuccess = (user: any) => {
    // When verification is complete, route to appropriate view
    setUserStats(user);
    updateSubjectsProgress(user);
    
    if (user.role === 'teacher') {
      setCurrentView(View.TEACHER_DASHBOARD);
    } else if (!user.onboardingCompleted) {
      setCurrentView(View.ONBOARDING);
    } else {
      setCurrentView(View.DASHBOARD);
    }
  };
  
  // Completed onboarding
  const handleOnboardingComplete = (details: { level: string; major: string; goal: string, learningStyle: LearningStyle }) => {
    const updatedUser = {
        ...userStats,
        onboardingCompleted: true,
        academicDetails: {
            level: details.level,
            major: details.major,
            goal: details.goal
        },
        learningStyle: details.learningStyle
    } as any;
    
    db.saveUser(updatedUser);
    setUserStats(updatedUser);
    updateSubjectsProgress(updatedUser); // Update subjects immediately after onboarding
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = () => {
    db.logout();
    setUserStats(INITIAL_STATS);
    setSubjects(SUBJECTS_DATA); // Reset subjects display
    setCurrentView(View.LANDING);
    setMobileMenuOpen(false);
  };

  const handleUpdateProfile = (name: string, avatar: string, learningStyle: LearningStyle) => {
    const updatedUser = {
      ...userStats,
      name,
      avatar,
      learningStyle
    } as any;
    
    setUserStats(updatedUser);
    db.saveUser(updatedUser);
  };
  
  const handleVerifyRequest = (email: string) => {
    setPendingVerifyEmail(email);
    setCurrentView(View.SIGNUP);
  };

  // Navigation Handler (Closes mobile menu)
  const navigateTo = (view: View) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  // App Logic Handlers
  const handleStartQuiz = async () => {
    if (!quizTopic.trim()) return;
    setLoading(true);
    try {
      // Fetch more questions for Time Attack mode
      const count = gameMode === 'Time Attack' ? 10 : 5;
      const generatedQuestions = await generateQuizQuestions(quizTopic, quizDifficulty, count, quizContext);
      setQuestions(generatedQuestions);
      setCurrentView(View.QUIZ_ACTIVE);
    } catch (error) {
      alert("Failed to generate quiz. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  // Specific handler for classroom assignments
  const handleAssignmentStart = async (assignment: Assignment) => {
      setLoading(true);
      setQuizTopic(assignment.topic);
      setQuizDifficulty(assignment.difficulty);
      setQuizContext(''); 
      setGameMode('Classic'); 
      setCurrentRoadmapId(null);

      try {
          const generatedQuestions = await generateQuizQuestions(assignment.topic, assignment.difficulty, 5);
          setQuestions(generatedQuestions);
          setCurrentView(View.QUIZ_ACTIVE);
      } catch (error) {
          alert("Failed to start assignment. Please try again.");
      } finally {
          setLoading(false);
      }
  };

  const handleQuizComplete = async (score: number, total: number) => {
    // PASSING CRITERIA: 70%
    const accuracy = score / total;
    const passed = accuracy >= 0.7;
    
    // Determine context (Free quiz or Roadmap quiz)
    const isRoadmapQuiz = !!currentRoadmapId && !!selectedSubject;
    
    setQuizResultStatus(isRoadmapQuiz ? (passed ? 'pass' : 'fail') : 'neutral');

    // Calculate XP
    let baseXp = score * 100;
    // Apply Multipliers based on Game Mode
    if (gameMode === 'Sudden Death') baseXp *= 1.5;
    if (gameMode === 'Time Attack') baseXp *= 1.2;
    if (gameMode === '1v1 Battle') baseXp *= 1.3;

    const bonusXp = score === total ? 200 : 0;
    const totalEarnedXp = Math.floor(baseXp + bonusXp);

    // Get Recommendation
    setLoading(true);
    const recText = await getLearningRecommendation(quizTopic, score, total);
    setRecommendation(recText);
    setLoading(false);

    // Update Stats locally and in DB
    const newTotalXp = userStats.totalXp + totalEarnedXp;
    const newLevel = Math.floor(newTotalXp / 1000) + 1;
    
    let updatedCompletedTopics = { ...userStats.completedTopicIds };

    // Logic for unlocking next chapter
    if (isRoadmapQuiz && passed && selectedSubject && currentRoadmapId) {
       const subjectId = selectedSubject.id;
       const currentList = updatedCompletedTopics[subjectId] || [];
       if (!currentList.includes(currentRoadmapId)) {
          updatedCompletedTopics[subjectId] = [...currentList, currentRoadmapId];
       }
    }

    const updatedUser = {
      ...userStats,
      totalXp: newTotalXp,
      currentXp: userStats.currentXp + totalEarnedXp,
      level: newLevel,
      quizzesTaken: userStats.quizzesTaken + 1,
      perfectScores: score === total ? userStats.perfectScores + 1 : userStats.perfectScores,
      completedTopicIds: updatedCompletedTopics
    } as any; 

    db.saveUser(updatedUser);
    setUserStats(updatedUser);
    updateSubjectsProgress(updatedUser);

    // Update Daily Quests Mock
    const quests = db.getDailyQuests();
    const updatedQuests = quests.map(q => {
       if (q.id === 'q1' && !q.completed) return { ...q, progress: q.progress + 1, completed: q.progress + 1 >= q.target };
       if (q.id === 'q2' && !q.completed) return { ...q, progress: q.progress + score, completed: q.progress + score >= q.target };
       if (q.id === 'q3' && !q.completed && score === total) return { ...q, progress: 1, completed: true };
       return q;
    });
    db.updateDailyQuests(updatedQuests);

    setLastScore({ score, total });
    setCurrentView(View.QUIZ_RESULT);
  };

  const handleJoinClassWithAssessment = (subjectId: string, level: KnowledgeLevel, goal: string) => {
      // 1. Update joined classes
      const isJoined = userStats.joinedClasses.includes(subjectId);
      const newJoinedClasses = isJoined ? userStats.joinedClasses : [...userStats.joinedClasses, subjectId];
      
      // 2. Save Knowledge Level AND Goal
      const newKnowledgeMap = {
          ...userStats.subjectKnowledge,
          [subjectId]: level
      };
      
      const newGoalMap = {
          ...userStats.subjectGoals,
          [subjectId]: goal
      }

      const updatedUser = {
        ...userStats,
        joinedClasses: newJoinedClasses,
        subjectKnowledge: newKnowledgeMap,
        subjectGoals: newGoalMap
      } as any;
      
      db.saveUser(updatedUser);
      setUserStats(updatedUser);
      
      // 3. Navigate to Study Session
      const subject = subjects.find(s => s.id === subjectId);
      if (subject) {
          setSelectedSubject(subject);
          setCurrentView(View.STUDY_SESSION);
      }
  };

  const toggleClassJoin = (subjectId: string) => {
    // Used for simple unjoin logic mainly
    const isJoined = userStats.joinedClasses.includes(subjectId);
    let newJoinedClasses: string[];
    
    if (isJoined) {
      newJoinedClasses = userStats.joinedClasses.filter(id => id !== subjectId);
    } else {
      newJoinedClasses = [...userStats.joinedClasses, subjectId];
    }
    
    const updatedUser = {
      ...userStats,
      joinedClasses: newJoinedClasses
    } as any;
    
    setUserStats(updatedUser);
    if (updatedUser.email) {
      db.saveUser(updatedUser);
    }
  };

  // Mock Data for Dashboard Charts
  const subjectPerformanceData = subjects.map(s => ({
    name: s.name.split(' ')[0],
    value: s.progress || 0
  })).slice(0, 5);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  // Return logic for non-authenticated states
  if (currentView === View.LANDING) {
    return <LandingPage onLogin={() => setCurrentView(View.LOGIN)} onSignup={(role) => { setAuthRole(role); setCurrentView(View.SIGNUP); }} />;
  }
  
  if (currentView === View.LOGIN) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        onSignupClick={() => setCurrentView(View.SIGNUP)}
        onBack={() => setCurrentView(View.LANDING)}
        onVerifyClick={handleVerifyRequest}
      />
    );
  }

  if (currentView === View.SIGNUP) {
    return (
      <SignupPage 
        initialRole={authRole}
        initialView={pendingVerifyEmail ? 'verify' : 'signup'}
        initialEmail={pendingVerifyEmail}
        onSignupSuccess={handleSignupSuccess}
        onLoginClick={() => {
            setPendingVerifyEmail('');
            setCurrentView(View.LOGIN);
        }}
        onBack={() => {
            setPendingVerifyEmail('');
            setCurrentView(View.LANDING);
        }}
      />
    );
  }
  
  if (currentView === View.ONBOARDING) {
      return (
          <OnboardingPage 
            user={userStats}
            onComplete={handleOnboardingComplete}
          />
      );
  }
  
  // Logic to determine if it was a chapter quiz for rendering buttons
  const isRoadmapQuiz = !!currentRoadmapId && !!selectedSubject;

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Brain className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">MindQuest</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="space-y-2 flex-1">
            {userStats.role === 'teacher' ? (
              // Teacher Nav
              <>
                 <SidebarItem 
                    icon={LayoutDashboard} 
                    label="Overview" 
                    active={currentView === View.TEACHER_DASHBOARD} 
                    onClick={() => navigateTo(View.TEACHER_DASHBOARD)} 
                  />
                  <SidebarItem 
                    icon={BookOpen} 
                    label="Curriculum" 
                    active={currentView === View.LEARN} 
                    onClick={() => navigateTo(View.LEARN)} 
                  />
                  <SidebarItem 
                    icon={Trophy} 
                    label="Class Rankings" 
                    active={currentView === View.LEADERBOARD} 
                    onClick={() => navigateTo(View.LEADERBOARD)} 
                  />
              </>
            ) : (
              // Student Nav
              <>
                <SidebarItem 
                  icon={LayoutDashboard} 
                  label="Student Dashboard" 
                  active={currentView === View.DASHBOARD || currentView === View.QUIZ_SETUP || currentView === View.QUIZ_ACTIVE || currentView === View.QUIZ_RESULT} 
                  onClick={() => navigateTo(View.DASHBOARD)} 
                />
                <SidebarItem
                  icon={BookOpen}
                  label="Learn"
                  active={currentView === View.LEARN || currentView === View.STUDY_SESSION}
                  onClick={() => navigateTo(View.LEARN)}
                />
                <SidebarItem 
                  icon={Trophy} 
                  label="Leaderboard" 
                  active={currentView === View.LEADERBOARD} 
                  onClick={() => navigateTo(View.LEADERBOARD)} 
                />
              </>
            )}
            
            <SidebarItem 
              icon={Settings} 
              label="Settings" 
              active={currentView === View.SETTINGS} 
              onClick={() => navigateTo(View.SETTINGS)} 
            />
          </nav>

          <div className="pt-6 border-t border-slate-100 mt-auto">
             <div className="flex items-center gap-3 mb-4">
               {userStats.avatar ? (
                  <img 
                    src={userStats.avatar} 
                    alt={userStats.name} 
                    className="w-10 h-10 rounded-full border border-slate-200 object-cover bg-slate-50"
                  />
               ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-slate-200">
                    {userStats.name.charAt(0).toUpperCase()}
                  </div>
               )}
               <div className="overflow-hidden">
                 <p className="text-sm font-bold text-slate-700 truncate w-32">{userStats.name}</p>
                 <p className="text-xs text-slate-500 capitalize">{userStats.role}</p>
               </div>
             </div>
             <button 
               onClick={handleLogout}
               className="w-full flex items-center gap-2 text-slate-500 hover:text-rose-600 text-sm font-medium transition-colors"
             >
                <LogOut size={16} /> Sign Out
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg -ml-2"
             >
                <Menu size={24} />
             </button>
             <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                   <Brain className="text-white" size={18} />
                </div>
                <span className="text-lg font-bold text-slate-800">MindQuest</span>
             </div>
          </div>
          <button 
            onClick={() => navigateTo(View.SETTINGS)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Settings size={24} />
          </button>
        </div>

        {/* View Routing */}
        {currentView === View.DASHBOARD && (
          <Dashboard 
            userStats={userStats} 
            subjectPerformanceData={subjectPerformanceData} 
            badges={badges} 
            onStartQuiz={() => setCurrentView(View.QUIZ_SETUP)}
            onGoToClasses={() => setCurrentView(View.LEARN)}
            onTakeAssignment={handleAssignmentStart}
            COLORS={COLORS}
          />
        )}
        
        {currentView === View.TEACHER_DASHBOARD && (
          <TeacherDashboard userStats={userStats} />
        )}
        
        {currentView === View.LEARN && (
          <LearnPage 
            subjects={subjects}
            userStats={userStats}
            onStartLearning={(subject) => {
              setSelectedSubject(subject);
              setCurrentView(View.STUDY_SESSION);
            }}
            onJoinClassWithAssessment={handleJoinClassWithAssessment}
            onUserUpdate={() => {
               const freshUser = db.getCurrentUser();
               if (freshUser) setUserStats(freshUser);
            }}
            onTakeAssignment={handleAssignmentStart}
          />
        )}
        
        {currentView === View.STUDY_SESSION && selectedSubject && (
          <StudySessionPage 
            selectedSubject={selectedSubject}
            isJoined={userStats.joinedClasses.includes(selectedSubject.id)}
            completedTopicIds={userStats.completedTopicIds[selectedSubject.id] || []}
            userStats={userStats} // Pass userStats to use knowledge level
            onJoin={() => handleJoinClassWithAssessment(selectedSubject.id, 'Beginner', 'Master Basics')} // Fallback simple join
            onTakeQuiz={(topic, context, roadmapId) => {
               setQuizTopic(topic);
               setQuizContext(context || '');
               setCurrentRoadmapId(roadmapId || null);
               setCurrentView(View.QUIZ_SETUP);
            }}
            onBack={() => setCurrentView(View.LEARN)}
          />
        )}
        
        {currentView === View.LEADERBOARD && (
           <div className="animate-in fade-in duration-500 pt-8">
               <Leaderboard />
           </div>
        )}

        {currentView === View.SETTINGS && (
           <SettingsPage 
             userStats={userStats}
             onSave={handleUpdateProfile}
             onBack={() => setCurrentView(View.DASHBOARD)}
           />
        )}

        {currentView === View.QUIZ_SETUP && (
          <div className="max-w-xl mx-auto mt-10 animate-in fade-in duration-500">
            <button 
              onClick={() => setCurrentView(View.DASHBOARD)}
              className="mb-6 text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium text-sm transition-colors"
            >
              &larr; Back to Dashboard
            </button>
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Create Challenge</h2>
                <p className="text-slate-500 mt-2">Customize your learning experience.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Topic / Subject</label>
                  <input 
                    type="text" 
                    value={quizTopic}
                    onChange={(e) => {
                      setQuizTopic(e.target.value);
                      setQuizContext(''); // Clear context if manually editing
                      setCurrentRoadmapId(null);
                    }}
                    placeholder="e.g. Ancient Rome, Calculus, Javascript"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none placeholder:text-slate-400"
                  />
                  {quizContext && (
                     <div className="mt-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                       <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle size={14} /> Official Chapter Quiz
                       </p>
                       <p className="text-xs text-emerald-600/80 mt-1">Passing this quiz with &gt;70% accuracy will unlock the next chapter.</p>
                     </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Easy', 'Medium', 'Hard'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setQuizDifficulty(diff)}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          quizDifficulty === diff 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">Game Mode</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setGameMode('Classic')}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                           gameMode === 'Classic' 
                           ? 'border-indigo-500 bg-indigo-50' 
                           : 'border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                         <div className="text-indigo-600 mb-1"><Play size={20} /></div>
                         <div className="font-bold text-sm text-slate-800">Classic</div>
                         <div className="text-xs text-slate-500">Standard 5 questions</div>
                      </button>

                      <button
                        onClick={() => setGameMode('Time Attack')}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                           gameMode === 'Time Attack' 
                           ? 'border-amber-500 bg-amber-50' 
                           : 'border-slate-200 hover:border-amber-300'
                        }`}
                      >
                         <div className="text-amber-600 mb-1"><Clock size={20} /></div>
                         <div className="font-bold text-sm text-slate-800">Time Attack</div>
                         <div className="text-xs text-slate-500">60s Speed Run</div>
                      </button>

                      <button
                        onClick={() => setGameMode('Sudden Death')}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                           gameMode === 'Sudden Death' 
                           ? 'border-rose-500 bg-rose-50' 
                           : 'border-slate-200 hover:border-rose-300'
                        }`}
                      >
                         <div className="text-rose-600 mb-1"><Skull size={20} /></div>
                         <div className="font-bold text-sm text-slate-800">Sudden Death</div>
                         <div className="text-xs text-slate-500">One mistake & out</div>
                      </button>

                      <button
                        onClick={() => setGameMode('1v1 Battle')}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                           gameMode === '1v1 Battle' 
                           ? 'border-violet-500 bg-violet-50' 
                           : 'border-slate-200 hover:border-violet-300'
                        }`}
                      >
                         <div className="text-violet-600 mb-1"><Swords size={20} /></div>
                         <div className="font-bold text-sm text-slate-800">1v1 Battle</div>
                         <div className="text-xs text-slate-500">Beat the rival!</div>
                      </button>
                   </div>
                </div>

                <button 
                  onClick={handleStartQuiz}
                  disabled={loading || !quizTopic}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      Start Challenge <Play size={20} fill="currentColor" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === View.QUIZ_ACTIVE && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <Quiz 
              questions={questions}
              topic={quizTopic}
              gameMode={gameMode}
              onComplete={handleQuizComplete}
              onCancel={() => setCurrentView(View.DASHBOARD)}
            />
          </div>
        )}

        {currentView === View.QUIZ_RESULT && lastScore && (
          <div className="max-w-2xl mx-auto mt-10 animate-in zoom-in duration-300">
             <div className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100 border border-slate-100">
               <div className="bg-slate-900 text-white p-10 text-center relative overflow-hidden">
                 <div className="relative z-10">
                   {quizResultStatus === 'fail' ? (
                     <>
                        <div className="flex justify-center mb-4">
                           <div className="bg-rose-500/20 p-4 rounded-full border border-rose-500/50 text-rose-400">
                              <AlertTriangle size={48} />
                           </div>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Chapter Locked</h2>
                        <p className="text-rose-200 max-w-md mx-auto">
                           You need at least <strong>70% accuracy</strong> to advance to the next chapter. 
                           Review the material and try again!
                        </p>
                     </>
                   ) : quizResultStatus === 'pass' ? (
                     <>
                        <div className="flex justify-center mb-4">
                           <div className="bg-emerald-500/20 p-4 rounded-full border border-emerald-500/50 text-emerald-400">
                              <CheckCircle size={48} />
                           </div>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Chapter Complete!</h2>
                        <p className="text-emerald-200">Excellent work! You've unlocked the next topic.</p>
                     </>
                   ) : (
                     <>
                        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                        <p className="text-slate-400">Here is how you performed on "{quizTopic}"</p>
                     </>
                   )}
                   
                   <div className="mt-8 flex justify-center items-center gap-6">
                     <div className="text-center">
                       <div className={`text-5xl font-black mb-1 ${quizResultStatus === 'fail' ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {Math.round((lastScore.score / lastScore.total) * 100)}%
                       </div>
                       <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Accuracy</div>
                     </div>
                     <div className="w-px h-16 bg-slate-700"></div>
                     <div className="text-center">
                        <div className="text-5xl font-black text-amber-400 mb-1">
                          +{Math.floor((lastScore.score * 100) * (
                            gameMode === 'Sudden Death' ? 1.5 : 
                            gameMode === 'Time Attack' ? 1.2 : 
                            gameMode === '1v1 Battle' ? 1.3 : 1
                          ))}
                        </div>
                        <div className="text-xs uppercase tracking-widest font-bold text-slate-500">XP Earned</div>
                     </div>
                   </div>
                 </div>
                 {/* Decorative circles */}
                 <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
                 <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
               </div>

               <div className="p-8">
                 {/* Recommendation Card */}
                 <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8 flex gap-4 items-start">
                    <div className="bg-white p-2 rounded-full shadow-sm text-indigo-600 shrink-0">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-indigo-900 mb-1">AI Tutor Feedback</h3>
                      {loading ? (
                        <div className="flex items-center gap-2 text-indigo-600/70 text-sm">
                          <Loader2 size={14} className="animate-spin" /> Analyzing performance...
                        </div>
                      ) : (
                        <p className="text-indigo-800 leading-relaxed text-sm">
                          {recommendation}
                        </p>
                      )}
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setCurrentView(View.DASHBOARD)}
                      className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors"
                    >
                      Back to Home
                    </button>

                    {quizResultStatus === 'fail' ? (
                       <button 
                         onClick={handleStartQuiz}
                         disabled={loading}
                         className="py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-rose-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                       >
                         {loading ? <Loader2 className="animate-spin" size={20} /> : <RotateCcw size={20} />}
                         {loading ? 'Generating...' : 'Retry Quiz'}
                       </button>
                    ) : isRoadmapQuiz ? (
                        <button 
                          onClick={() => setCurrentView(View.STUDY_SESSION)}
                          className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200 flex justify-center items-center gap-2"
                        >
                           Next Topic <ArrowRight size={20} />
                        </button>
                    ) : (
                       <button 
                         onClick={() => setCurrentView(View.QUIZ_SETUP)}
                         className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200"
                       >
                         New Quiz
                       </button>
                    )}
                 </div>
                 
                 {/* Practice Again for Passed Users */}
                 {(quizResultStatus === 'pass' || quizResultStatus === 'neutral') && (
                    <div className="mt-4">
                       <button 
                         onClick={handleStartQuiz}
                         disabled={loading}
                         className="w-full py-3 bg-white border-2 border-indigo-100 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex justify-center items-center gap-2"
                       >
                          {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                          Practice This Topic Again
                       </button>
                    </div>
                 )}
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
