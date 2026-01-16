
import React, { useState, useEffect } from 'react';
import { Search, Check, UserPlus, ArrowRight, BookOpen, Info, Brain, X, Target, Rocket, Hash, School, Users, GraduationCap, Calendar, FileText, Play, Download, Upload, CheckCircle } from 'lucide-react';
import { Subject, KnowledgeLevel, Classroom, UserStats, Assignment } from '../types';
import { db } from '../services/db';

interface LearnPageProps {
  subjects: Subject[];
  userStats: UserStats;
  onStartLearning: (subject: Subject) => void;
  onJoinClassWithAssessment: (subjectId: string, level: KnowledgeLevel, goal: string) => void;
  onUserUpdate: () => void;
  onTakeAssignment: (assignment: Assignment) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ subjects, userStats, onStartLearning, onJoinClassWithAssessment, onUserUpdate, onTakeAssignment }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-classes'>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom Classrooms
  const [enrolledClassrooms, setEnrolledClassrooms] = useState<Classroom[]>([]);

  // Join Code State
  const [showJoinCodeModal, setShowJoinCodeModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');

  // Assessment Modal State
  const [selectedSubjectForJoin, setSelectedSubjectForJoin] = useState<Subject | null>(null);
  const [step, setStep] = useState(1);
  const [assessmentLevel, setAssessmentLevel] = useState<KnowledgeLevel>('Beginner');
  const [subjectGoal, setSubjectGoal] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  // Assignments Modal State
  const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);
  const [selectedClassroomForAssignments, setSelectedClassroomForAssignments] = useState<Classroom | null>(null);
  const [classAssignments, setClassAssignments] = useState<Assignment[]>([]);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
      // Load enrolled custom classrooms
      if (userStats.enrolledClassroomIds && userStats.enrolledClassroomIds.length > 0) {
          const classrooms = db.getClassroomsByIds(userStats.enrolledClassroomIds);
          setEnrolledClassrooms(classrooms);
      } else {
          setEnrolledClassrooms([]);
      }
  }, [userStats]);

  const handleJoinClick = (subject: Subject) => {
    setSelectedSubjectForJoin(subject);
    setStep(1);
    setAssessmentLevel('Beginner'); 
    setSubjectGoal('');
    setCustomGoal('');
  };

  const confirmJoin = () => {
    if (selectedSubjectForJoin) {
      const finalGoal = subjectGoal === 'Custom' ? customGoal : subjectGoal;
      onJoinClassWithAssessment(selectedSubjectForJoin.id, assessmentLevel, finalGoal || `Learn ${selectedSubjectForJoin.name}`);
      setSelectedSubjectForJoin(null);
    }
  };

  const handleJoinByCode = () => {
      setJoinError('');
      setJoinSuccess('');
      if (!joinCode || joinCode.length < 6) {
          setJoinError("Please enter a valid 6-character code.");
          return;
      }

      try {
          const user = db.getCurrentUser();
          if (user) {
              const classroom = db.joinClassroom(user.id, joinCode.toUpperCase());
              setJoinSuccess(`Successfully joined ${classroom.name}!`);
              setTimeout(() => {
                  setShowJoinCodeModal(false);
                  setJoinCode('');
                  setJoinSuccess('');
                  // Auto-switch to my classes to see it
                  setActiveTab('my-classes');
                  
                  // Notify parent to refresh user stats so state is synced
                  onUserUpdate();
              }, 1000);
          }
      } catch (err: any) {
          setJoinError(err.message);
      }
  };

  const handleViewAssignments = (classroom: Classroom) => {
      setSelectedClassroomForAssignments(classroom);
      // Fetch assignments for this specific classroom
      // getAssignmentsForStudent takes an array of class IDs and returns all matching assignments
      const assignments = db.getAssignmentsForStudent([classroom.id]);
      setClassAssignments(assignments);
      setShowAssignmentsModal(true);
  };

  const handleFileUpload = async (assignmentId: string, file: File) => {
      // FILE SIZE CHECK: 500KB
      if (file.size > 500 * 1024) {
          alert("File too large. For this demo, please upload files smaller than 500KB.");
          return;
      }

      setSubmittingId(assignmentId);
      const user = db.getCurrentUser();
      
      if (!user) return;

      try {
          // Convert to Base64
          const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
          });

          db.submitAssignment(assignmentId, {
              studentId: user.id,
              studentName: user.name,
              fileUrl: base64,
              fileName: file.name,
              submittedAt: new Date().toISOString()
          });

          // Refresh the list to show status change
          const updated = db.getAssignmentsForStudent([selectedClassroomForAssignments!.id]);
          setClassAssignments(updated);
          setSubmissionFile(null); // Reset input logic if needed
      } catch (e) {
          console.error("Upload failed", e);
          alert("Upload failed. File might be too large for this demo.");
      } finally {
          setSubmittingId(null);
      }
  };

  // Preset goals based on common subjects
  const getGoalPresets = (subjectName: string) => {
      const name = subjectName.toLowerCase();
      const base = [
          "Pass my upcoming exam",
          "Just curious / Hobby",
      ];
      
      if (name.includes("python")) return ["Automate boring tasks", "Data Analysis Career", "Backend Web Dev", "Build a portfolio project", ...base];
      if (name.includes("react")) return ["Build a SaaS App", "Get a Frontend Job", "Create a Personal Website", "Build a portfolio project", ...base];
      if (name.includes("web")) return ["Become a Full Stack Dev", "Freelancing", "Build Interactive Sites", ...base];
      if (name.includes("data")) return ["Analyze Business Trends", "Train ML Models", "Visualize Complex Data", ...base];
      
      if (name.includes("math")) return ["Improve Logic Skills", "Prepare for Engineering", "Master Calculus", "Research prerequisites", ...base];
      if (name.includes("phys")) return ["Understand How the Universe Works", "Engineering Prerequisites", "Ace Mechanics", ...base];
      if (name.includes("hist")) return ["Understand Modern Geopolitics", "Research & Writing Skills", "Cultural Literacy", ...base];
      if (name.includes("computer")) return ["Ace Coding Interviews", "Understand Low-level Systems", "Software Engineering Career", ...base];
      
      // Medicine & Science
      if (name.includes("bio")) return ["Prepare for Med School", "Understand Genetics", "Conservation Science", ...base];
      if (name.includes("chem")) return ["Master Organic Chemistry", "Lab Research Skills", "Pharmacy Prerequisites", ...base];
      if (name.includes("anat")) return ["Medical School Prep", "Nursing Prerequisites", "Sports Medicine", ...base];
      if (name.includes("psych")) return ["Understand Human Behavior", "Therapy/Counseling Career", "Cognitive Science", ...base];

      return ["Build a portfolio project", ...base];
  };

  const joinedGlobalSubjects = subjects.filter(s => userStats.joinedClasses.includes(s.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Classroom</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Join global subjects or enter a code from your teacher.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
             <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 flex items-center shadow-sm">
                <button 
                    onClick={() => setActiveTab('browse')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'browse' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    Browse All
                </button>
                <button 
                    onClick={() => setActiveTab('my-classes')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'my-classes' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    My Classes
                </button>
             </div>
            <button 
                onClick={() => setShowJoinCodeModal(true)}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-md hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2 whitespace-nowrap active:scale-95"
            >
                <Hash size={16} /> Join by Code
            </button>
        </div>
      </div>

      {/* --- BROWSE TAB --- */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center gap-2 max-w-md shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900 transition-all">
                <Search size={20} className="text-slate-400 ml-2" />
                <input 
                    placeholder="Search available subjects..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-sm bg-transparent" 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {subjects.filter((s: Subject) => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((subject: Subject) => {
                const isJoined = userStats.joinedClasses.includes(subject.id);
                return (
                    <div key={subject.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col">
                    <div className={`h-24 ${subject.color} relative overflow-hidden shrink-0`}>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute -bottom-6 -right-6 text-[100px] opacity-20 select-none transform rotate-12 group-hover:scale-110 transition-transform duration-500">{subject.icon}</div>
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                        <span className="text-3xl">{subject.icon}</span>
                        </div>
                    </div>
                    <div className="p-6 pt-8 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{subject.name}</h3>
                            {isJoined && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 animate-in zoom-in"><Check size={12} /> Joined</span>}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 min-h-[40px]">{subject.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 font-medium mb-6 mt-auto">
                            <span className="flex items-center gap-1"><UserPlus size={14} /> {subject.memberCount.toLocaleString()} Students</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button
                            onClick={() => onStartLearning(subject)}
                            className="bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-600/80 transition-colors flex justify-center items-center gap-2"
                        >
                            See Details <Info size={16} />
                        </button>

                        {isJoined ? (
                            <button 
                            onClick={() => onStartLearning(subject)}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex justify-center items-center gap-2 hover:shadow-lg"
                            >
                            Enter Class <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button 
                            onClick={() => handleJoinClick(subject)}
                            className="border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors hover:shadow-md"
                            >
                            Join Class
                            </button>
                        )}
                        </div>
                    </div>
                    </div>
                );
                })}
            </div>
        </div>
      )}

      {/* --- MY CLASSES TAB --- */}
      {activeTab === 'my-classes' && (
          <div className="space-y-10">
              {/* Enrolled Custom Classrooms Section */}
              <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <School className="text-indigo-600 dark:text-indigo-400" /> Teacher Classrooms
                  </h3>
                  {enrolledClassrooms.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
                          <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't joined any teacher classrooms yet.</p>
                          <button 
                            onClick={() => setShowJoinCodeModal(true)}
                            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                          >
                              Enter a class code
                          </button>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {enrolledClassrooms.map(room => (
                              <div key={room.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                  <div className={`h-20 bg-gradient-to-r p-6 flex items-center
                                      ${room.theme === 'indigo' ? 'from-indigo-500 to-indigo-600' : 
                                      room.theme === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                                      room.theme === 'rose' ? 'from-rose-500 to-rose-600' :
                                      room.theme === 'amber' ? 'from-amber-500 to-amber-600' :
                                      'from-sky-500 to-sky-600'
                                      }
                                  `}>
                                      <h3 className="text-xl font-bold text-white truncate">{room.name}</h3>
                                  </div>
                                  <div className="p-6 flex-1 flex flex-col">
                                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 min-h-[40px]">{room.description || "No description."}</p>
                                      
                                      <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 font-medium mb-6 mt-auto">
                                          <span className="flex items-center gap-1"><GraduationCap size={14} /> Teacher Class</span>
                                          <span className="flex items-center gap-1"><Users size={14} /> {room.studentIds.length} Students</span>
                                      </div>

                                      <button 
                                        onClick={() => handleViewAssignments(room)}
                                        className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 font-bold py-3 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white hover:border-indigo-600 transition-colors flex justify-center items-center gap-2"
                                      >
                                          View Assignments <ArrowRight size={16} />
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>

              {/* Global Subjects Section */}
              <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Brain className="text-indigo-600 dark:text-indigo-400" /> Global Subjects
                  </h3>
                  {joinedGlobalSubjects.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
                          <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't started any learning paths yet.</p>
                          <button 
                            onClick={() => setActiveTab('browse')}
                            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                          >
                              Browse Subjects
                          </button>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {joinedGlobalSubjects.map(subject => (
                              <div key={subject.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                                  <div className={`h-20 ${subject.color} relative overflow-hidden shrink-0 flex items-center px-6`}>
                                      <div className="absolute inset-0 bg-black/10"></div>
                                      <div className="relative z-10 flex items-center gap-3 text-white">
                                          <span className="text-2xl group-hover:scale-110 transition-transform">{subject.icon}</span>
                                          <h3 className="text-xl font-bold">{subject.name}</h3>
                                      </div>
                                  </div>
                                  <div className="p-6 flex-1 flex flex-col">
                                      <div className="mb-6 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                          <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                                              <span>Progress</span>
                                              <span className={subject.masteryLevel === 'Master' ? 'text-amber-500' : 'text-slate-700 dark:text-slate-200'}>{subject.progress}%</span>
                                          </div>
                                          <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                              <div 
                                              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                                  (subject.progress || 0) > 80 ? 'bg-emerald-500' : 
                                                  (subject.progress || 0) > 50 ? 'bg-indigo-500' : 'bg-amber-400'
                                              }`}
                                              style={{ width: `${subject.progress || 0}%` }}
                                              ></div>
                                          </div>
                                      </div>

                                      <button 
                                          onClick={() => onStartLearning(subject)}
                                          className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex justify-center items-center gap-2 mt-auto"
                                      >
                                          Continue Learning <ArrowRight size={16} />
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Join Code Modal */}
      {showJoinCodeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm shadow-2xl p-6 animate-in zoom-in-95 duration-200">
               <div className="text-center mb-6">
                   <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                       <School size={32} />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Join a Class</h2>
                   <p className="text-slate-500 dark:text-slate-400 text-sm">Enter the code shared by your teacher.</p>
               </div>

               <div className="mb-6">
                   <input 
                       type="text" 
                       value={joinCode}
                       onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                       maxLength={6}
                       placeholder="e.g. XY92KA"
                       className="w-full text-center text-3xl font-mono font-bold tracking-widest p-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none uppercase text-slate-800 dark:text-white"
                   />
                   {joinError && <p className="text-rose-500 text-sm font-bold text-center mt-2">{joinError}</p>}
                   {joinSuccess && <p className="text-emerald-500 text-sm font-bold text-center mt-2">{joinSuccess}</p>}
               </div>

               <div className="flex gap-3">
                   <button 
                       onClick={() => setShowJoinCodeModal(false)}
                       className="flex-1 py-3 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                   >
                       Cancel
                   </button>
                   <button 
                       onClick={handleJoinByCode}
                       className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
                   >
                       Join
                   </button>
               </div>
           </div>
        </div>
      )}

      {/* Assignments Modal */}
      {showAssignmentsModal && selectedClassroomForAssignments && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {selectedClassroomForAssignments.name}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Pending Assignments</p>
                 </div>
                 <button onClick={() => setShowAssignmentsModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                   <X size={24} />
                 </button>
               </div>
               
               <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                   {classAssignments.length === 0 ? (
                       <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                           <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                               <FileText size={24} />
                           </div>
                           <p className="text-slate-500 dark:text-slate-400 font-medium">No assignments yet!</p>
                           <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Check back later for new tasks.</p>
                       </div>
                   ) : (
                       <div className="space-y-4">
                           {classAssignments.map(assign => (
                               <div key={assign.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 bg-white dark:bg-slate-700/50 shadow-sm transition-all group">
                                   <div className="flex justify-between items-start mb-2">
                                       <div className="flex items-center gap-2">
                                           <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
                                               ${assign.difficulty === 'Easy' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 
                                                 assign.difficulty === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 
                                                 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'}
                                           `}>
                                               {assign.difficulty}
                                           </span>
                                           <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                               <Calendar size={10} /> Due: {new Date(assign.dueDate).toLocaleDateString()}
                                           </span>
                                       </div>
                                       {assign.status === 'submitted' && (
                                           <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                                               <CheckCircle size={12} /> Submitted
                                           </span>
                                       )}
                                   </div>
                                   
                                   <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-4 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                                       {assign.topic}
                                   </h4>
                                   
                                   <div className="space-y-3">
                                       {/* Teacher Attachment */}
                                       {assign.attachmentUrl && (
                                           <a 
                                             href={assign.attachmentUrl}
                                             download={assign.attachmentName || 'assignment.pdf'}
                                             className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors group/file"
                                           >
                                               <div className="flex items-center gap-2 overflow-hidden">
                                                   <div className="p-1.5 bg-white dark:bg-slate-800 rounded-md text-indigo-600 dark:text-indigo-400 shadow-sm">
                                                       <FileText size={16} />
                                                   </div>
                                                   <span className="text-sm font-medium text-indigo-900 dark:text-indigo-200 truncate">
                                                       {assign.attachmentName || "Teacher Worksheet"}
                                                   </span>
                                               </div>
                                               <Download size={16} className="text-indigo-400 group-hover/file:text-indigo-600" />
                                           </a>
                                       )}

                                       <div className="flex gap-2">
                                            {/* Quiz Button */}
                                            <button 
                                                onClick={() => {
                                                    setShowAssignmentsModal(false);
                                                    onTakeAssignment(assign);
                                                }}
                                                className="flex-1 py-2.5 bg-slate-800 dark:bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-900 dark:hover:bg-black shadow-md transition-all flex items-center justify-center gap-2"
                                            >
                                                {assign.status === 'submitted' ? 'Retake Quiz' : 'Start Quiz'} <Play size={14} fill="currentColor" />
                                            </button>

                                            {/* Upload Submission */}
                                            <label className={`flex-1 py-2.5 border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 rounded-lg font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer ${submittingId === assign.id ? 'opacity-50' : ''}`}>
                                                <input 
                                                    type="file" 
                                                    accept=".pdf"
                                                    className="hidden" 
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            handleFileUpload(assign.id, e.target.files[0]);
                                                        }
                                                    }}
                                                    disabled={submittingId === assign.id}
                                                />
                                                {submittingId === assign.id ? 'Uploading...' : (
                                                    <>
                                                        <Upload size={14} /> {assign.status === 'submitted' ? 'Resubmit PDF' : 'Upload PDF'}
                                                    </>
                                                )}
                                            </label>
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}
               </div>
           </div>
        </div>
      )}

      {/* Join Assessment Modal */}
      {selectedSubjectForJoin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        Join {selectedSubjectForJoin.name}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Step {step} of 2</p>
                 </div>
                 <button onClick={() => setSelectedSubjectForJoin(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                   <X size={24} />
                 </button>
               </div>
               
               {step === 1 && (
                   <div className="animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 mb-6 flex gap-4">
                            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg text-indigo-600 dark:text-indigo-300 h-fit">
                                <Brain size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">Current Knowledge</h4>
                                <p className="text-indigo-700 dark:text-indigo-300 text-sm">Help us tailor the starting point.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                <button 
                                    key={level}
                                    onClick={() => setAssessmentLevel(level as KnowledgeLevel)}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${assessmentLevel === level ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-slate-800 dark:text-white">{level}</span>
                                        {assessmentLevel === level && <Check size={20} className="text-indigo-600 dark:text-indigo-400" />}
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                                        {level === 'Beginner' && "I have little to no prior knowledge."}
                                        {level === 'Intermediate' && "I know the basics but want to learn more."}
                                        {level === 'Advanced' && "I'm confident and want to tackle complex topics."}
                                    </p>
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => setStep(2)}
                            className="w-full mt-6 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                        >
                            Next Step <ArrowRight size={20} />
                        </button>
                   </div>
               )}

               {step === 2 && (
                   <div className="animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800 mb-6 flex gap-4">
                            <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg text-amber-600 dark:text-amber-300 h-fit">
                                <Target size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">Set Your Mission</h4>
                                <p className="text-amber-800/80 dark:text-amber-300/80 text-sm">We'll build a custom roadmap to reach this specific goal.</p>
                            </div>
                        </div>

                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">What do you want to achieve?</label>
                        <div className="space-y-3">
                            {getGoalPresets(selectedSubjectForJoin.name).map((goal) => (
                                <button 
                                    key={goal}
                                    onClick={() => {
                                        setSubjectGoal(goal);
                                        if(goal !== 'Custom') setCustomGoal('');
                                    }}
                                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${subjectGoal === goal ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'}`}
                                >
                                    <span className="font-medium text-slate-800 dark:text-white text-sm">{goal}</span>
                                </button>
                            ))}
                            <button 
                                onClick={() => setSubjectGoal('Custom')}
                                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${subjectGoal === 'Custom' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'}`}
                            >
                                <span className="font-medium text-slate-800 dark:text-white text-sm">Something else...</span>
                            </button>
                        </div>

                        {subjectGoal === 'Custom' && (
                            <div className="mt-3">
                                <input 
                                    type="text" 
                                    value={customGoal}
                                    onChange={(e) => setCustomGoal(e.target.value)}
                                    placeholder="e.g. Build a chess bot"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-200 outline-none"
                                    autoFocus
                                />
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => setStep(1)}
                                className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                Back
                            </button>
                            <button 
                                onClick={confirmJoin}
                                disabled={!subjectGoal || (subjectGoal === 'Custom' && !customGoal)}
                                className="flex-1 py-4 bg-indigo-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                            >
                                Generate Mission Map <Rocket size={20} />
                            </button>
                        </div>
                   </div>
               )}
           </div>
        </div>
      )}
    </div>
  );
};