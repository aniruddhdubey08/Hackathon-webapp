
import React, { useState, useEffect } from 'react';
import { GraduationCap, Sparkles, Plus, Calendar, Users, X, FileText, Copy, Check, School, Layers, BookOpen, User, Upload, Download, Eye, Clock, ArrowLeft } from 'lucide-react';
import { UserStats, Assignment, Classroom } from '../types';
import { db } from '../services/db';

interface TeacherDashboardProps {
  userStats: UserStats;
}

type Tab = 'overview' | 'classrooms';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ userStats }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Data State
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Assignment Form
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedClassroomId, setSelectedClassroomId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0); // To force reset file input

  // Class Form
  const [className, setClassName] = useState('');
  const [classDesc, setClassDesc] = useState('');

  // Student List State
  const [selectedClassroomForStudents, setSelectedClassroomForStudents] = useState<Classroom | null>(null);
  const [studentList, setStudentList] = useState<UserStats[]>([]);

  // Submissions State
  const [selectedAssignmentForReview, setSelectedAssignmentForReview] = useState<Assignment | null>(null);

  useEffect(() => {
    // Load Data
    const myAssignments = db.getAssignments(userStats.id); 
    const myClassrooms = db.getClassroomsForTeacher(userStats.id);
    
    setAssignments(myAssignments.reverse());
    setClassrooms(myClassrooms.reverse());
    
    // Default selection
    if (myClassrooms.length > 0) {
        setSelectedClassroomId(myClassrooms[0].id);
    }
  }, [userStats.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // FILE SIZE CHECK: 500KB
      if (e.target.files[0].size > 500 * 1024) {
         alert("File too large. For this demo, please upload files smaller than 500KB.");
         return;
      }
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !dueDate || !selectedClassroomId) return;

    const targetClass = classrooms.find(c => c.id === selectedClassroomId);
    
    let attachmentUrl = undefined;
    let attachmentName = undefined;

    if (selectedFile) {
        // Convert to Base64 for demo purposes
        const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(selectedFile);
        });
        attachmentUrl = base64;
        attachmentName = selectedFile.name;
    }

    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      topic,
      difficulty,
      dueDate,
      classroomId: selectedClassroomId,
      className: targetClass ? targetClass.name : 'Unknown Class',
      teacherId: userStats.id, // Use ID, not name for robustness
      createdAt: new Date().toISOString(),
      status: 'pending',
      submissions: [],
      attachmentUrl,
      attachmentName
    };

    db.createAssignment(newAssignment);
    setAssignments(prev => [newAssignment, ...prev]);
    setShowAssignModal(false);
    
    // Reset form
    setTopic('');
    setDifficulty('Medium');
    setDueDate('');
    setSelectedFile(null);
    setFileInputKey(prev => prev + 1); // Force clear input
  };

  const handleCreateClass = (e: React.FormEvent) => {
      e.preventDefault();
      if (!className) return;

      const newClass = db.createClassroom(className, classDesc, userStats.id);
      setClassrooms(prev => [newClass, ...prev]);
      setShowCreateClassModal(false);
      setClassName('');
      setClassDesc('');
  };

  const handleViewStudents = (classroom: Classroom) => {
      setSelectedClassroomForStudents(classroom);
      // Fetch user details
      const students = db.getUsersByIds(classroom.studentIds);
      setStudentList(students);
      setShowStudentListModal(true);
  };

  const handleViewSubmissions = (assignment: Assignment) => {
      setSelectedAssignmentForReview(assignment);
      setShowSubmissionsModal(true);
  };

  const copyToClipboard = (code: string) => {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
         <div>
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Hello, {userStats.name}!</h2>
             <p className="text-slate-500 dark:text-slate-400">Manage your classrooms, generate codes, and track student progress.</p>
         </div>
         <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
             <button 
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
             >
                Overview
             </button>
             <button 
                onClick={() => setActiveTab('classrooms')}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'classrooms' ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
             >
                My Classrooms
             </button>
         </div>
      </div>

      {activeTab === 'overview' && (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Classroom Analytics</h2>
                <button 
                    onClick={() => setShowAssignModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                >
                    <Plus size={16} /> Assign Quiz
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Students</p>
                        <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                            {classrooms.reduce((acc, c) => acc + c.studentIds.length, 0)}
                        </h3>
                        </div>
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg"><Users size={20} /></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Assignments</p>
                        <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{assignments.length}</h3>
                        </div>
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg"><FileText size={20} /></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Classes</p>
                        <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{classrooms.length}</h3>
                        </div>
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg"><School size={20} /></div>
                    </div>
                </div>
            </div>

            {/* Recent Assignments List */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mt-8 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <FileText className="text-indigo-500" size={20} /> Recent Assignments
                    </h3>
                </div>

                <div className="space-y-3">
                {assignments.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-xl">
                        No active assignments. Create a class then assign a quiz!
                    </div>
                ) : (
                    assignments.map(assign => (
                    <div key={assign.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-indigo-100 dark:hover:border-indigo-800 bg-slate-50/50 dark:bg-slate-700/20 transition-colors gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white font-bold
                                ${assign.difficulty === 'Easy' ? 'bg-emerald-500' : assign.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'}
                            `}>
                                {assign.difficulty[0]}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">{assign.topic}</h4>
                                <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    <span className="flex items-center gap-1"><School size={12} /> {assign.className}</span>
                                    <span className="flex items-center gap-1"><Calendar size={12} /> Due: {new Date(assign.dueDate).toLocaleDateString()}</span>
                                    {assign.attachmentUrl && <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded"><FileText size={12} /> PDF Attached</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 sm:justify-end">
                            <button 
                                onClick={() => handleViewSubmissions(assign)}
                                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Eye size={14} /> View Submissions ({assign.submissions?.length || 0})
                            </button>
                            <button className="text-slate-400 hover:text-rose-500 p-2">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </div>
        </>
      )}

      {activeTab === 'classrooms' && (
          <>
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Classrooms</h2>
                <button 
                    onClick={() => setShowCreateClassModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-md transition-all"
                >
                    <Plus size={16} /> Create Classroom
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classrooms.map(room => (
                    <div key={room.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
                        <div className={`h-24 bg-gradient-to-r p-6 flex items-end
                            ${room.theme === 'indigo' ? 'from-indigo-500 to-indigo-600' : 
                              room.theme === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                              room.theme === 'rose' ? 'from-rose-500 to-rose-600' :
                              room.theme === 'amber' ? 'from-amber-500 to-amber-600' :
                              'from-sky-500 to-sky-600'
                            }
                        `}>
                            <h3 className="text-2xl font-bold text-white">{room.name}</h3>
                        </div>
                        <div className="p-6 flex-1">
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 min-h-[40px]">{room.description || "No description provided."}</p>
                            
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Class Code</span>
                                    <button 
                                        onClick={() => copyToClipboard(room.code)}
                                        className="flex items-center gap-2 text-2xl font-mono font-bold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {room.code} 
                                        {copiedCode === room.code ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} className="text-slate-300 dark:text-slate-600" />}
                                    </button>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                                        <Users size={16} /> {room.studentIds.length} Students
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/30 p-3 border-t border-slate-100 dark:border-slate-700 flex gap-2 justify-end">
                            <button 
                                onClick={() => handleViewStudents(room)}
                                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1 flex items-center gap-1"
                            >
                                <Users size={14} /> View Students
                            </button>
                            <button className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1">Settings</button>
                        </div>
                    </div>
                ))}
                
                {classrooms.length === 0 && (
                     <div className="md:col-span-2 text-center py-16 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
                         <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-500">
                             <School size={32} />
                         </div>
                         <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No Classrooms Yet</h3>
                         <p className="text-slate-500 dark:text-slate-400 mb-6">Create a classroom to generate a code for your students.</p>
                         <button 
                            onClick={() => setShowCreateClassModal(true)}
                            className="px-6 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors shadow-sm"
                        >
                            Create First Class
                        </button>
                     </div>
                )}
             </div>
          </>
      )}

      {/* --- MODALS --- */}

      {/* CREATE CLASS MODAL */}
      {showCreateClassModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create New Classroom</h2>
                <button onClick={() => setShowCreateClassModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateClass} className="space-y-4">
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Class Name</label>
                    <input 
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="e.g. Intro to Computer Science"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description (Optional)</label>
                    <textarea 
                      value={classDesc}
                      onChange={(e) => setClassDesc(e.target.value)}
                      placeholder="e.g. MWF 10:00 AM - Semester 1"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none h-24"
                    />
                 </div>

                 <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm flex gap-3">
                     <Sparkles className="shrink-0" size={20} />
                     <p>We'll automatically generate a unique 6-character code that you can share with your students to join.</p>
                 </div>

                 <div className="pt-4 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setShowCreateClassModal(false)}
                      className="flex-1 py-3 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!className}
                      className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      Create Class
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* STUDENT LIST MODAL */}
      {showStudentListModal && selectedClassroomForStudents && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh] border border-slate-100 dark:border-slate-700">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 sticky top-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedClassroomForStudents.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Enrolled Students ({studentList.length})</p>
                </div>
                <button onClick={() => setShowStudentListModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={24} />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                  {studentList.length === 0 ? (
                      <div className="text-center py-10">
                          <div className="bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                              <Users size={32} />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400">No students have joined this class yet.</p>
                          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Share code <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{selectedClassroomForStudents.code}</span> with them.</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {studentList.map((student, idx) => (
                              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                  <div className="shrink-0">
                                      {student.avatar ? (
                                          <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-600" />
                                      ) : (
                                          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-slate-200 dark:border-slate-600">
                                              {student.name.charAt(0).toUpperCase()}
                                          </div>
                                      )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-slate-800 dark:text-white truncate">{student.name}</h4>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{student.email || 'No email'}</p>
                                  </div>
                                  <div className="text-right">
                                      <span className="block text-sm font-bold text-indigo-600 dark:text-indigo-400">Lvl {student.level}</span>
                                      <span className="text-xs text-slate-400 dark:text-slate-500">{student.totalXp.toLocaleString()} XP</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 text-center">
                  <button 
                    onClick={() => setShowStudentListModal(false)}
                    className="text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 text-sm"
                  >
                      Close
                  </button>
              </div>
           </div>
        </div>
      )}

      {/* ASSIGN QUIZ MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Assign Quiz / Worksheet</h2>
                <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={24} />
                </button>
              </div>
              
              {classrooms.length === 0 ? (
                  <div className="text-center py-6">
                      <p className="text-slate-500 dark:text-slate-400 mb-4">You need to create a classroom first!</p>
                      <button 
                        onClick={() => { setShowAssignModal(false); setShowCreateClassModal(true); }}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold"
                      >
                          Create Classroom
                      </button>
                  </div>
              ) : (
                <form onSubmit={handleCreateAssignment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Classroom</label>
                        <select 
                            value={selectedClassroomId}
                            onChange={(e) => setSelectedClassroomId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            required
                        >
                            {classrooms.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Topic</label>
                        <input 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Newton's Laws"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                        <select 
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as any)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        </div>
                        <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
                        <input 
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-600"
                            required
                        />
                        </div>
                    </div>

                    {/* PDF UPLOAD */}
                    <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl p-6 bg-indigo-50/50 dark:bg-indigo-900/10 text-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                        <label className="cursor-pointer block">
                            <input 
                                key={fileInputKey}
                                type="file" 
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm text-indigo-600 dark:text-indigo-400">
                                    <Upload size={24} />
                                </div>
                                <span className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">
                                    {selectedFile ? selectedFile.name : "Upload PDF Worksheet"}
                                </span>
                                <span className="text-indigo-500 dark:text-indigo-400 text-xs">
                                    {selectedFile ? "Click to change" : "Optional: Attach a file for students to download"}
                                </span>
                            </div>
                        </label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                        type="button" 
                        onClick={() => setShowAssignModal(false)}
                        className="flex-1 py-3 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                        Cancel
                        </button>
                        <button 
                        type="submit"
                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
                        >
                        Assign
                        </button>
                    </div>
                </form>
              )}
           </div>
        </div>
      )}

      {/* SUBMISSIONS MODAL */}
      {showSubmissionsModal && selectedAssignmentForReview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh] border border-slate-100 dark:border-slate-700">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 sticky top-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedAssignmentForReview.topic}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Submissions Review</p>
                </div>
                <button onClick={() => setShowSubmissionsModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={24} />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                  {selectedAssignmentForReview.submissions.length === 0 ? (
                      <div className="text-center py-10">
                          <div className="bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                              <FileText size={32} />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400">No students have submitted work yet.</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {selectedAssignmentForReview.submissions.map((sub, idx) => (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                  <div className="flex-1">
                                      <h4 className="font-bold text-slate-800 dark:text-white">{sub.studentName}</h4>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                          <Clock size={12} /> Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                                      </p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <div className="text-xs text-slate-500 dark:text-slate-400 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg truncate max-w-[150px]">
                                          {sub.fileName}
                                      </div>
                                      <a 
                                        href={sub.fileUrl} 
                                        download={sub.fileName}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                      >
                                          <Download size={14} /> Download PDF
                                      </a>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 text-center">
                  <button 
                    onClick={() => setShowSubmissionsModal(false)}
                    className="text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 text-sm"
                  >
                      Close
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
