
import { UserStats, UserRole, LeaderboardEntry, Assignment, DailyQuest, Classroom, Submission, Sector, StudyGuide, MicroSkill, Question } from '../types';

interface DBUser extends UserStats {
  email: string;
  password: string; // In a real app, this would be hashed!
  id: string;
  isVerified: boolean;
}

interface CachedQuiz {
    topic: string;
    questions: Question[];
    createdAt: number;
}

const DB_KEY = 'mindquest_users';
const CURRENT_USER_KEY = 'mindquest_current_session';
const ASSIGNMENTS_KEY = 'mindquest_assignments';
const QUESTS_KEY = 'mindquest_daily_quests';
const CLASSROOMS_KEY = 'mindquest_classrooms';
const QUIZZES_KEY = 'mindquest_cached_quizzes';

// --- MOCK DATA GENERATORS ---

const createMockSkill = (id: string, title: string, desc: string, status: 'locked' | 'active' | 'completed' = 'locked'): MicroSkill => ({
    id, title, description: desc, status
});

const generateMockRoadmap = (subject: string): Sector[] => {
    const s = subject.toLowerCase().replace(/\s/g, '');
    return [
        {
            id: `${s}-sec1`,
            title: "Foundations",
            description: `Core concepts of ${subject}`,
            levels: [
                {
                    id: `${s}-l1`,
                    title: "Basics 101",
                    skills: [
                        createMockSkill(`${s}-s1`, `Intro to ${subject}`, "The absolute basics.", 'active'),
                        createMockSkill(`${s}-s2`, "Key Terminology", "Speaking the language."),
                        createMockSkill(`${s}-s3`, "First Steps", "Getting started practically.")
                    ]
                },
                {
                    id: `${s}-l2`,
                    title: "Building Blocks",
                    skills: [
                        createMockSkill(`${s}-s4`, "Core Principles", "The rules of the game."),
                        createMockSkill(`${s}-s5`, "Common Patterns", "Things you'll see often."),
                        createMockSkill(`${s}-s6`, "Tools of the Trade", "What pros use.")
                    ]
                }
            ]
        },
        {
            id: `${s}-sec2`,
            title: "Intermediate Mastery",
            description: "Moving beyond the basics",
            levels: [
                {
                    id: `${s}-l3`,
                    title: "Advanced Logic",
                    skills: [
                        createMockSkill(`${s}-s7`, "Complex Structures", "Handling bigger problems."),
                        createMockSkill(`${s}-s8`, "Efficiency", "Doing it faster."),
                        createMockSkill(`${s}-s9`, "Best Practices", "Writing clean solutions.")
                    ]
                }
            ]
        }
    ];
};

// Richer data for key demos
const PYTHON_ROADMAP = generateMockRoadmap("Python Programming");
PYTHON_ROADMAP[0].levels[0].skills[0].title = "Variables & Data Types";
PYTHON_ROADMAP[0].levels[0].skills[0].description = "Storing and manipulating data.";
PYTHON_ROADMAP[0].levels[0].skills[1].title = "Control Flow";
PYTHON_ROADMAP[0].levels[0].skills[1].description = "If statements and loops.";

// Base Quizzes
const PYTHON_QUESTIONS: Question[] = [
    { id: 'py-1', questionText: 'Which is a mutable data type in Python?', options: ['Tuple', 'String', 'List', 'Integer'], correctAnswerIndex: 2, explanation: 'Lists can be changed after creation, while tuples, strings, and integers are immutable.', difficulty: 'Easy' },
    { id: 'py-2', questionText: 'What is the correct file extension for Python files?', options: ['.python', '.pl', '.py', '.p'], correctAnswerIndex: 2, explanation: 'Python source files use the .py extension.', difficulty: 'Easy' },
    { id: 'py-3', questionText: 'Which keyword is used to define a function?', options: ['func', 'def', 'function', 'void'], correctAnswerIndex: 1, explanation: 'The "def" keyword marks the start of the function header.', difficulty: 'Medium' },
    { id: 'py-4', questionText: 'What does the ** operator do?', options: ['Multiplication', 'Exponentiation', 'XOR', 'Floor Division'], correctAnswerIndex: 1, explanation: 'It raises the left operand to the power of the right operand.', difficulty: 'Easy' },
    { id: 'py-5', questionText: 'How do you start a while loop?', options: ['while x > y:', 'while (x > y)', 'loop while x > y', 'x > y while'], correctAnswerIndex: 0, explanation: 'Python uses "while condition:" syntax.', difficulty: 'Medium' }
];

const REACT_QUESTIONS: Question[] = [
    { id: 'r-1', questionText: 'What is the Virtual DOM?', options: ['A direct copy of the HTML', 'A lightweight JavaScript representation of the DOM', 'A browser plugin', 'A server-side database'], correctAnswerIndex: 1, explanation: 'It allows React to update only changed parts of the UI efficiently.', difficulty: 'Medium' },
    { id: 'r-2', questionText: 'Which hook handles side effects?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correctAnswerIndex: 1, explanation: 'useEffect is designed for side effects like data fetching or subscriptions.', difficulty: 'Medium' },
    { id: 'r-3', questionText: 'How is data passed to child components?', options: ['State', 'Props', 'Context', 'Redux'], correctAnswerIndex: 1, explanation: 'Props (properties) are read-only inputs passed down the tree.', difficulty: 'Easy' },
    { id: 'r-4', questionText: 'What does JSX stand for?', options: ['JavaScript XML', 'Java Syntax', 'JSON X', 'JS Extension'], correctAnswerIndex: 0, explanation: 'It is a syntax extension for JavaScript that looks like XML.', difficulty: 'Easy' },
    { id: 'r-5', questionText: 'Which method returns elements to render?', options: ['render()', 'return()', 'display()', 'show()'], correctAnswerIndex: 0, explanation: 'In class components it is render(), in functional components it is the return statement.', difficulty: 'Medium' }
];

const MATH_QUESTIONS: Question[] = [
    { id: 'm-1', questionText: 'What is the derivative of x²?', options: ['x', '2x', '2', 'x²'], correctAnswerIndex: 1, explanation: 'Using the power rule: nx^(n-1), so 2x^(2-1) = 2x.', difficulty: 'Medium' },
    { id: 'm-2', questionText: 'Value of Pi (approx)?', options: ['3.12', '3.14', '3.16', '3.18'], correctAnswerIndex: 1, explanation: 'Pi is approximately 3.14159...', difficulty: 'Easy' },
    { id: 'm-3', questionText: 'Solve for x: 2x + 4 = 14', options: ['2', '5', '8', '10'], correctAnswerIndex: 1, explanation: '2x = 10, so x = 5.', difficulty: 'Easy' },
    { id: 'm-4', questionText: 'Square root of 81?', options: ['6', '7', '8', '9'], correctAnswerIndex: 3, explanation: '9 * 9 = 81.', difficulty: 'Easy' },
    { id: 'm-5', questionText: 'A prime number has how many factors?', options: ['0', '1', '2', 'Infinite'], correctAnswerIndex: 2, explanation: 'Exactly two distinct factors: 1 and itself.', difficulty: 'Medium' }
];

// --- INITIAL CACHED QUIZZES (Offline Data Store) ---
// Map specific roadmap topics to these question sets for offline availability
const INITIAL_CACHED_QUIZZES: Record<string, Question[]> = {
  // Python mappings
  'python': PYTHON_QUESTIONS,
  'python programming': PYTHON_QUESTIONS,
  'variables & data types': PYTHON_QUESTIONS,
  'control flow': PYTHON_QUESTIONS,
  'intro to python programming': PYTHON_QUESTIONS,
  
  // React mappings
  'react': REACT_QUESTIONS,
  'react development': REACT_QUESTIONS,
  'intro to react': REACT_QUESTIONS,
  'components': REACT_QUESTIONS,
  
  // Math mappings
  'math': MATH_QUESTIONS,
  'mathematics': MATH_QUESTIONS,
  'basics 101': MATH_QUESTIONS
};


// Mock Study Guide Store
const MOCK_GUIDES: Record<string, StudyGuide> = {};

// Helper to add rich content
const addRichMockGuide = (subject: string, topic: string, content: Partial<StudyGuide>) => {
    // Normalize key
    MOCK_GUIDES[`${subject}-${topic}`] = { 
        topic,
        overview: "Content not available offline.",
        keyConcepts: [],
        practicalApplication: "",
        commonMisconceptions: [],
        example: "",
        summary: "",
        isFallback: true,
        ...content 
    };
};

// Python - Variables (Visual)
addRichMockGuide('Python Programming', 'Variables & Data Types', {
    overview: "Think of a variable as a labeled box where you can store data. The label is the variable name, and the contents are the value.",
    visualImagePrompt: "A warehouse with labeled cardboard boxes containing different items like numbers and words, isometric vector art",
    cachedImageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    keyConcepts: [
        { title: "Declaration", content: "Creating a variable by giving it a name." },
        { title: "Assignment", content: "Putting a value inside the variable using '='." },
        { title: "Data Types", content: "Integers, Floats, Strings, and Booleans are the basics." }
    ],
    practicalApplication: "Variables allow code to be dynamic. Instead of hardcoding '5', you use 'user_count', so it can change.",
    commonMisconceptions: ["Variables are math equations (x = x + 1 is valid in code!)", "You need to declare type explicitly in Python (you don't)."],
    example: "score = 10\nplayer_name = 'Alex'",
    summary: "Variables are containers for storing data values.",
    interactiveElement: {
        type: 'fill-in-the-blank',
        question: "In Python, we use the ___ operator to assign a value to a variable.",
        correctAnswerText: "=",
        explanation: "The equals sign (=) is the assignment operator."
    }
});

// React - Intro
addRichMockGuide('React Development', 'Intro to React', {
    overview: "React is all about Components. Imagine LEGO blocks. You build small blocks (components) and snap them together to build a castle (app).",
    visualImagePrompt: "Colorful interlocking plastic building blocks forming a website structure, 3d render",
    cachedImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    keyConcepts: [
        { title: "Components", content: "Reusable building blocks of UI." },
        { title: "JSX", content: "HTML-like syntax inside JavaScript." },
        { title: "Virtual DOM", content: "Fast updates to the web page." }
    ],
    practicalApplication: "Used by Facebook, Instagram, and Netflix to build fast, interactive web apps.",
    commonMisconceptions: ["React is a full framework (it's a library)", "JSX is HTML (it's JS extension)"],
    example: "function Welcome() { return <h1>Hello</h1>; }",
    summary: "React helps build user interfaces using component-based architecture.",
    interactiveElement: {
        type: 'quiz',
        question: "What is a Component?",
        options: ["A database", "A reusable UI piece", "A server", "A browser"],
        correctAnswer: 1,
        explanation: "Components are independent and reusable bits of code."
    }
});

// --- INITIAL DB DATA ---

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
  // ... (Existing Auth methods remain unchanged)
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

  googleAuth: (email: string, name: string, avatar: string, role: UserRole): DBUser => {
    const users = db.getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        user = {
            id: `u-${Date.now()}`,
            email,
            password: 'google-login-secret',
            name,
            role,
            level: 1,
            currentXp: 0,
            totalXp: 0,
            quizzesTaken: 0,
            perfectScores: 0,
            streakDays: 1,
            badges: [],
            isVerified: true,
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
    
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
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
      isVerified: false, 
      joinedClasses: [],
      enrolledClassroomIds: [],
      completedTopicIds: {},
      onboardingCompleted: false, 
      academicDetails: undefined,
      subjectKnowledge: {},
      subjectGoals: {},
      learningStyle: 'Practical' 
    };

    users.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(users));

    return newUser;
  },

  verifyUser: (email: string) => {
    const users = db.getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) throw new Error("User not found");
    
    users[userIndex].isVerified = true;
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  },

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
          const existingSubIndex = allAssignments[assignmentIndex].submissions.findIndex(s => s.studentId === submission.studentId);
          if (existingSubIndex !== -1) {
              allAssignments[assignmentIndex].submissions[existingSubIndex] = submission;
          } else {
              allAssignments[assignmentIndex].submissions.push(submission);
          }
          localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(allAssignments));
      }
  },

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
      
      classroom.studentIds.push(studentId);
      all[classroomIndex] = classroom;
      localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(all));

      const users = db.getUsers();
      const userIndex = users.findIndex(u => u.id === studentId);
      if (userIndex !== -1) {
          const user = users[userIndex];
          if (!user.enrolledClassroomIds) user.enrolledClassroomIds = [];
          user.enrolledClassroomIds.push(classroom.id);
          
          localStorage.setItem(DB_KEY, JSON.stringify(users));
          
          const session = db.getCurrentUser();
          if (session && session.id === studentId) {
             session.enrolledClassroomIds = user.enrolledClassroomIds;
             sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
          }
      }

      return classroom;
  },

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
  },

  // --- OFFLINE DATA RETRIEVAL ---
  getMockRoadmap: (subject: string): Sector[] => {
      if (subject === 'Python Programming') return PYTHON_ROADMAP;
      return generateMockRoadmap(subject);
  },

  getMockStudyGuide: (subject: string, topic: string, learningStyle: string): StudyGuide => {
      const key = `${subject}-${topic}`;
      const baseGuide = MOCK_GUIDES[key];
      
      if (baseGuide) return baseGuide;

      // Dynamic fallback instead of generic placeholder
      return {
          topic: topic,
          overview: `(Offline Mode) This is a cached study guide for "${topic}" in ${subject}.`,
          keyConcepts: [
              { title: "Core Definition", content: `${topic} is a key concept essential for mastering ${subject}.` },
              { title: "Usage", content: `Understanding ${topic} allows for more advanced problem solving.` },
              { title: "Key Takeaway", content: "Focus on the practical application of this concept." }
          ],
          practicalApplication: "Used frequently in real-world scenarios for this subject.",
          commonMisconceptions: ["It's harder than it looks (it's actually logical once you get it)."],
          example: `Example of ${topic} would go here.`,
          summary: `Mastering ${topic} is crucial for your progress in ${subject}.`,
          isFallback: true,
          interactiveElement: {
              type: 'fill-in-the-blank',
              question: `Complete the sentence: ${topic} is fundamental to _____.`,
              correctAnswerText: "success",
              explanation: "This is a placeholder question for offline mode."
          }
      };
  },

  // --- QUIZ CACHING ---
  saveCachedQuiz: (topic: string, questions: Question[]) => {
      const data = localStorage.getItem(QUIZZES_KEY);
      const cache: Record<string, CachedQuiz> = data ? JSON.parse(data) : {};
      
      // Normalize key
      const key = topic.toLowerCase().trim();
      
      cache[key] = {
          topic,
          questions,
          createdAt: Date.now()
      };
      
      localStorage.setItem(QUIZZES_KEY, JSON.stringify(cache));
  },

  getCachedQuiz: (topic: string): Question[] | null => {
      // 1. Check Local Storage
      const data = localStorage.getItem(QUIZZES_KEY);
      const cache: Record<string, CachedQuiz> = data ? JSON.parse(data) : {};
      const key = topic.toLowerCase().trim();
      
      if (cache[key]) return cache[key].questions;

      // 2. Check Initial Mock Data (Fuzzy match)
      // Check if any key in INITIAL_CACHED_QUIZZES is contained within 'key' OR 'key' contains it
      const mockKey = Object.keys(INITIAL_CACHED_QUIZZES).find(k => key.includes(k) || k.includes(key));
      if (mockKey) return INITIAL_CACHED_QUIZZES[mockKey];

      return null;
  }
};
