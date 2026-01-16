
import { UserStats, UserRole, LeaderboardEntry, Assignment, DailyQuest, Classroom, Submission } from '../types';

interface DBUser extends UserStats {
  email: string;
  password: string; // In a real app, this would be hashed!
  id: string;
  isVerified: boolean;
}

const DB_KEY = 'mindquest_users';
const CURRENT_USER_KEY = 'mindquest_current_session';
const ASSIGNMENTS_KEY = 'mindquest_assignments';
const QUESTS_KEY = 'mindquest_daily_quests';
const CLASSROOMS_KEY = 'mindquest_classrooms';

const INITIAL_USERS: DBUser[] = [
  {
    id: 'u1',
    email: 'student@test.com',
    password: 'password',
    name: 'Demo Student',
    role: 'student',
    level: 12,
    currentXp: 12500,
    totalXp: 12500,
    quizzesTaken: 45,
    perfectScores: 12,
    streakDays: 5,
    badges: ['b1', 'b2', 'b3', 'b4'],
    isVerified: true,
    joinedClasses: ['py', 'math'],
    enrolledClassroomIds: ['c-1'], 
    completedTopicIds: {
      'py': ['rm-0', 'rm-1'],
      'math': ['rm-0']
    },
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
    onboardingCompleted: true,
    academicDetails: {
      level: 'Undergraduate',
      major: 'Computer Science',
      goal: 'Skill Mastery'
    },
    subjectKnowledge: {
      'py': 'Intermediate',
      'math': 'Beginner'
    },
    subjectGoals: {
      'py': 'Automate daily tasks',
      'math': 'Pass Calculus 1'
    },
    learningStyle: 'Practical'
  },
  {
    id: 'u2',
    email: 'teacher@test.com',
    password: 'password',
    name: 'Prof. Albus',
    role: 'teacher',
    level: 50,
    currentXp: 50000,
    totalXp: 50000,
    quizzesTaken: 0,
    perfectScores: 0,
    streakDays: 0,
    badges: [],
    isVerified: true,
    joinedClasses: [],
    enrolledClassroomIds: [],
    completedTopicIds: {},
    onboardingCompleted: true,
    subjectKnowledge: {},
    subjectGoals: {},
    learningStyle: 'Theoretical'
  },
  {
    id: 'u3',
    email: 'sarah.teacher@google.com',
    password: 'google-login-secret',
    name: 'Sarah Teacher',
    role: 'teacher',
    level: 25,
    currentXp: 25000,
    totalXp: 25000,
    quizzesTaken: 0,
    perfectScores: 0,
    streakDays: 0,
    badges: [],
    isVerified: true,
    joinedClasses: [],
    enrolledClassroomIds: [],
    completedTopicIds: {},
    onboardingCompleted: true,
    subjectKnowledge: {},
    subjectGoals: {},
    learningStyle: 'Visual',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah'
  }
];

const INITIAL_CLASSROOMS: Classroom[] = [
    {
        id: 'c-1',
        name: 'Physics 101',
        description: 'Introduction to Mechanics',
        code: 'PHY101',
        teacherId: 'u2', // Prof. Albus
        studentIds: ['u1'],
        createdDate: new Date().toISOString(),
        theme: 'indigo'
    },
    {
        id: 'c-2',
        name: 'Advanced Mathematics',
        description: 'Calculus and Linear Algebra for Engineering Students.',
        code: 'MATH99',
        teacherId: 'u3', // Sarah Teacher
        studentIds: [],
        createdDate: new Date().toISOString(),
        theme: 'emerald'
    }
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
    {
        id: 'a-1',
        topic: 'Newton\'s Laws',
        difficulty: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        classroomId: 'c-1',
        className: 'Physics 101',
        teacherId: 'u2',
        createdAt: new Date().toISOString(),
        status: 'pending',
        submissions: []
    },
    {
        id: 'a-2',
        topic: 'Derivatives & Integrals',
        difficulty: 'Hard',
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        classroomId: 'c-2',
        className: 'Advanced Mathematics',
        teacherId: 'u3',
        createdAt: new Date().toISOString(),
        status: 'pending',
        submissions: []
    }
];

const DAILY_QUESTS_MOCK: DailyQuest[] = [
  { id: 'q1', title: 'Daily Warmup', description: 'Complete 1 Quiz', xpReward: 50, completed: false, progress: 0, target: 1, icon: 'zap' },
  { id: 'q2', title: 'Brain Power', description: 'Get 5 correct answers', xpReward: 100, completed: false, progress: 0, target: 5, icon: 'brain' },
  { id: 'q3', title: 'Perfectionist', description: 'Get 1 Perfect Score', xpReward: 200, completed: false, progress: 0, target: 1, icon: 'target' },
];

export const db = {
  getUsers: (): DBUser[] => {
    const users = localStorage.getItem(DB_KEY);
    if (!users) {
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(users);
  },

  getUsersByIds: (ids: string[]): UserStats[] => {
      const users = db.getUsers();
      return users.filter(u => ids.includes(u.id)).map(u => ({
          id: u.id,
          name: u.name,
          role: u.role,
          level: u.level,
          currentXp: u.currentXp,
          totalXp: u.totalXp,
          quizzesTaken: u.quizzesTaken,
          perfectScores: u.perfectScores,
          streakDays: u.streakDays,
          badges: u.badges,
          avatar: u.avatar,
          joinedClasses: u.joinedClasses,
          enrolledClassroomIds: u.enrolledClassroomIds,
          completedTopicIds: u.completedTopicIds,
          onboardingCompleted: u.onboardingCompleted,
          academicDetails: u.academicDetails,
          subjectKnowledge: u.subjectKnowledge,
          subjectGoals: u.subjectGoals,
          learningStyle: u.learningStyle || 'Practical'
      }));
  },

  saveUser: (user: DBUser) => {
    const users = db.getUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    
    // Update session if it matches the user being saved
    const sessionStore = sessionStorage.getItem(CURRENT_USER_KEY);
    if (sessionStore) {
        const currentUser = JSON.parse(sessionStore);
        if (currentUser.email === user.email) {
            sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        }
    }
    
    const localStore = localStorage.getItem(CURRENT_USER_KEY);
    if (localStore) {
        const currentUser = JSON.parse(localStore);
        if (currentUser.email === user.email) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        }
    }
  },

  login: (email: string, password: string, remember: boolean = false): DBUser => {
    const users = db.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) throw new Error("Invalid email or password");
    
    if (user.isVerified === false) {
      throw new Error("Please verify your email address before logging in.");
    }
    
    // Clear previous sessions to avoid conflicts
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);

    if (remember) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
    
    return user;
  },

  // Simulate Google Auth
  googleAuth: (email: string, name: string, avatar: string, role: UserRole): DBUser => {
    const users = db.getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        // Create new user (Signup flow)
        user = {
            id: `u-${Date.now()}`,
            email,
            password: 'google-login-secret', // Placeholder since it's OAuth
            name,
            role,
            level: 1,
            currentXp: 0,
            totalXp: 0,
            quizzesTaken: 0,
            perfectScores: 0,
            streakDays: 1,
            badges: [],
            isVerified: true, // Google accounts are implicitly verified
            joinedClasses: [],
            enrolledClassroomIds: [],
            completedTopicIds: {},
            onboardingCompleted: false,
            academicDetails: undefined,
            subjectKnowledge: {},
            subjectGoals: {},
            learningStyle: 'Practical',
            avatar: avatar
        };
        users.push(user);
        localStorage.setItem(DB_KEY, JSON.stringify(users));
    }
    
    // Login flow
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
    // Persist login
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    
    return user;
  },

  signup: (name: string, email: string, password: string, role: UserRole, remember: boolean = false): DBUser => {
    const users = db.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("User already exists with this email");
    }

    const newUser: DBUser = {
      id: `u-${Date.now()}`,
      email,
      password,
      name,
      role,
      level: 1,
      currentXp: 0,
      totalXp: 0,
      quizzesTaken: 0,
      perfectScores: 0,
      streakDays: 1,
      badges: [],
      isVerified: false, // Requires verification
      joinedClasses: [],
      enrolledClassroomIds: [],
      completedTopicIds: {},
      onboardingCompleted: false, // New users need to onboard
      academicDetails: undefined,
      subjectKnowledge: {},
      subjectGoals: {},
      learningStyle: 'Practical' // Default
    };

    // Save to user database
    users.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(users));

    return newUser;
  },

  // Simulates clicking an email link
  verifyUser: (email: string) => {
    const users = db.getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) throw new Error("User not found");
    
    users[userIndex].isVerified = true;
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  },

  // Simulates password reset
  resetPassword: (email: string, newPassword: string) => {
    const users = db.getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) throw new Error("User not found");

    users[userIndex].password = newPassword;
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): DBUser | null => {
    const sessionStored = sessionStorage.getItem(CURRENT_USER_KEY);
    if (sessionStored) return JSON.parse(sessionStored);

    const localStored = localStorage.getItem(CURRENT_USER_KEY);
    return localStored ? JSON.parse(localStored) : null;
  },

  getLeaderboard: (type: 'Global' | 'Country' | 'Class'): LeaderboardEntry[] => {
    const realUsers = db.getUsers().filter(u => u.role === 'student');
    const mappedRealUsers: LeaderboardEntry[] = realUsers.map(u => ({
      rank: 0,
      username: u.name,
      xp: u.totalXp,
      avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`
    }));

    const mockData: LeaderboardEntry[] = [
      { rank: 0, username: "SciFi_Girl", xp: 15000, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoey" },
      { rank: 0, username: "QuizMaster99", xp: 14200, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack" },
      { rank: 0, username: "HistoryBuff", xp: 13800, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo" },
    ];

    let combined = [...mappedRealUsers, ...mockData];
    combined.sort((a, b) => b.xp - a.xp);
    return combined.map((entry, index) => ({ ...entry, rank: index + 1 })).slice(0, 10);
  },

  // --- ASSIGNMENTS ---

  getAssignments: (teacherId?: string): Assignment[] => {
    const data = localStorage.getItem(ASSIGNMENTS_KEY);
    const allAssignments: Assignment[] = data ? JSON.parse(data) : INITIAL_ASSIGNMENTS;
    
    if (teacherId) {
        return allAssignments.filter(a => a.teacherId === teacherId);
    }
    return allAssignments;
  },

  getAssignmentsForStudent: (studentClassroomIds: string[]): Assignment[] => {
    const data = localStorage.getItem(ASSIGNMENTS_KEY);
    const allAssignments: Assignment[] = data ? JSON.parse(data) : INITIAL_ASSIGNMENTS;
    // Check if user has submitted
    const currentUser = db.getCurrentUser();
    
    return allAssignments.filter(a => studentClassroomIds.includes(a.classroomId)).map(a => {
        const isSubmitted = currentUser && a.submissions.some(s => s.studentId === currentUser.id);
        return {
            ...a,
            status: isSubmitted ? 'submitted' : a.status
        };
    });
  },

  createAssignment: (assignment: Assignment) => {
    const data = localStorage.getItem(ASSIGNMENTS_KEY);
    const allAssignments: Assignment[] = data ? JSON.parse(data) : INITIAL_ASSIGNMENTS;
    allAssignments.push(assignment);
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(allAssignments));
  },

  submitAssignment: (assignmentId: string, submission: Submission) => {
      const data = localStorage.getItem(ASSIGNMENTS_KEY);
      const allAssignments: Assignment[] = data ? JSON.parse(data) : INITIAL_ASSIGNMENTS;
      
      const assignmentIndex = allAssignments.findIndex(a => a.id === assignmentId);
      if (assignmentIndex !== -1) {
          // Check if already submitted, replace if so
          const existingSubIndex = allAssignments[assignmentIndex].submissions.findIndex(s => s.studentId === submission.studentId);
          if (existingSubIndex !== -1) {
              allAssignments[assignmentIndex].submissions[existingSubIndex] = submission;
          } else {
              allAssignments[assignmentIndex].submissions.push(submission);
          }
          
          localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(allAssignments));
      }
  },

  // --- CLASSROOMS ---

  getClassrooms: (): Classroom[] => {
      const data = localStorage.getItem(CLASSROOMS_KEY);
      if (!data) {
          localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(INITIAL_CLASSROOMS));
          return INITIAL_CLASSROOMS;
      }
      return JSON.parse(data);
  },

  getClassroomsByIds: (ids: string[]): Classroom[] => {
      const all = db.getClassrooms();
      return all.filter(c => ids.includes(c.id));
  },

  getClassroomsForTeacher: (teacherId: string): Classroom[] => {
      const all = db.getClassrooms();
      return all.filter(c => c.teacherId === teacherId);
  },

  createClassroom: (name: string, description: string, teacherId: string) => {
      const all = db.getClassrooms();
      
      // Generate unique 6-char code
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      let isUnique = false;
      
      while (!isUnique) {
          code = '';
          for (let i = 0; i < 6; i++) {
              code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          if (!all.find(c => c.code === code)) isUnique = true;
      }

      const newClass: Classroom = {
          id: `c-${Date.now()}`,
          name,
          description,
          code,
          teacherId,
          studentIds: [],
          createdDate: new Date().toISOString(),
          theme: ['indigo', 'emerald', 'amber', 'rose', 'sky'][Math.floor(Math.random() * 5)] as any
      };

      all.push(newClass);
      localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(all));
      return newClass;
  },

  joinClassroom: (studentId: string, code: string): Classroom => {
      const all = db.getClassrooms();
      const classroomIndex = all.findIndex(c => c.code === code);
      
      if (classroomIndex === -1) throw new Error("Invalid Class Code");
      
      const classroom = all[classroomIndex];
      if (classroom.studentIds.includes(studentId)) {
           throw new Error("You have already joined this class");
      }
      
      // Add student to classroom
      classroom.studentIds.push(studentId);
      all[classroomIndex] = classroom;
      localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(all));

      // Add classroom to student stats
      const users = db.getUsers();
      const userIndex = users.findIndex(u => u.id === studentId);
      if (userIndex !== -1) {
          const user = users[userIndex];
          if (!user.enrolledClassroomIds) user.enrolledClassroomIds = [];
          user.enrolledClassroomIds.push(classroom.id);
          
          localStorage.setItem(DB_KEY, JSON.stringify(users));
          
          // Update Session
          const session = db.getCurrentUser();
          if (session && session.id === studentId) {
             session.enrolledClassroomIds = user.enrolledClassroomIds;
             sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
          }
      }

      return classroom;
  },

  // --- QUESTS ---

  getDailyQuests: (): DailyQuest[] => {
    const stored = localStorage.getItem(QUESTS_KEY);
    if (!stored) {
      localStorage.setItem(QUESTS_KEY, JSON.stringify(DAILY_QUESTS_MOCK));
      return DAILY_QUESTS_MOCK;
    }
    return JSON.parse(stored);
  },

  updateDailyQuests: (quests: DailyQuest[]) => {
    localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
  }
};
