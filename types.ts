
export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isFallback?: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  xpEarned: number;
  topic: string;
  date: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
  unlocked: boolean;
}

export type UserRole = 'student' | 'teacher';
export type GameMode = 'Classic' | 'Time Attack' | 'Sudden Death' | '1v1 Battle';
export type KnowledgeLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type LearningStyle = 'Visual' | 'Theoretical' | 'Practical';

export interface Classroom {
  id: string;
  name: string;
  description: string;
  code: string; // The 6-digit code (e.g., "XY92KA")
  teacherId: string;
  studentIds: string[];
  createdDate: string;
  theme: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky';
}

export interface UserStats {
  id: string;
  name: string;
  email?: string; 
  role: UserRole;
  level: number;
  currentXp: number;
  totalXp: number;
  quizzesTaken: number;
  perfectScores: number;
  streakDays: number;
  badges: string[]; 
  avatar?: string; 
  joinedClasses: string[]; // IDs of Global Subjects (e.g. 'py', 'math')
  enrolledClassroomIds: string[]; // IDs of Custom Teacher Classrooms (e.g. 'c-123')
  completedTopicIds: Record<string, string[]>; 
  // New Onboarding Fields
  onboardingCompleted: boolean;
  academicDetails?: {
    level: string; // e.g. High School, Undergraduate
    major: string; // e.g. Computer Science
    goal: string; // e.g. Exam Prep
  };
  subjectKnowledge: Record<string, KnowledgeLevel>;
  subjectGoals: Record<string, string>; 
  learningStyle: LearningStyle;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  xp: number;
  avatar: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string; 
  color: string;
  memberCount: number;
  progress?: number; 
  masteryLevel?: string; 
}

export type InteractiveElementType = 'quiz' | 'fill-in-the-blank';

export interface StudyGuide {
  topic: string;
  overview: string;
  keyConcepts: { title: string; content: string }[];
  example: string;
  practicalApplication: string;
  commonMisconceptions: string[];
  summary: string;
  // Visual Learner Field
  visualImagePrompt?: string;
  cachedImageUrl?: string; // Base64 or static URL for offline mode 
  interactiveElement?: {
    type: InteractiveElementType;
    question: string;
    // For Quiz
    options?: string[];
    correctAnswer?: number; // Index
    // For Fill in the Blank
    correctAnswerText?: string; // String match
    explanation: string;
  };
  isFallback?: boolean;
}

export interface Submission {
  studentId: string;
  studentName: string;
  fileUrl: string; // Base64
  fileName: string;
  submittedAt: string;
}

export interface Assignment {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dueDate: string;
  classroomId: string; // Link to specific classroom
  className: string; // Denormalized name for display
  teacherId: string;
  createdAt: string;
  status?: 'pending' | 'completed' | 'submitted'; // For student view
  
  // PDF Feature
  attachmentUrl?: string; // Teacher's uploaded file (Base64)
  attachmentName?: string;
  submissions: Submission[];
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  progress: number;
  target: number;
  icon: 'swords' | 'zap' | 'brain' | 'target';
}

export interface MicroSkill {
  id: string;
  title: string; 
  description: string; 
  status: 'locked' | 'active' | 'completed';
}

export interface Level {
  id: string;
  title: string; 
  skills: MicroSkill[];
}

export interface Sector {
  id: string;
  title: string; 
  description: string;
  levels: Level[];
}
