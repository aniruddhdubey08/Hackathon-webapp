
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Question, StudyGuide, Sector, UserStats, KnowledgeLevel, LearningStyle } from "../types";
import { db } from "./db";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- GLOBAL CIRCUIT BREAKER & OFFLINE STATE ---
let isCircuitBreakerOpen = false;
let isManualOffline = false;
let recoveryInterval: any = null;

export const setOfflineMode = (enabled: boolean) => {
    isManualOffline = enabled;
    if (!enabled) {
        // Reset recovery check if we were in circuit breaker mode too
        if (isCircuitBreakerOpen) {
            checkApiRecovery();
        }
    }
};

export const getOfflineModeStatus = () => isManualOffline || isCircuitBreakerOpen;

const activateCircuitBreaker = () => {
  if (isCircuitBreakerOpen) return;
  isCircuitBreakerOpen = true;
  
  if (!recoveryInterval) {
    recoveryInterval = setInterval(checkApiRecovery, 30000);
  }
};

const checkApiRecovery = async () => {
  if (isManualOffline) return; // Don't check if user manually wants offline

  try {
    await ai.models.generateContent({ 
        model: "gemini-3-flash-preview", 
        contents: "ping",
        config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    
    isCircuitBreakerOpen = false;
    if (recoveryInterval) {
        clearInterval(recoveryInterval);
        recoveryInterval = null;
    }
  } catch (e) {
    // Still unreachable, will retry in next interval
  }
};

// --- MAIN FUNCTIONS ---

async function withRetry<T>(fn: () => Promise<T>, retries = 1, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0) {
      await new Promise(res => setTimeout(res, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const generateQuizQuestions = async (topic: string, difficulty: string, count: number = 5, context?: string): Promise<Question[]> => {
  if (getOfflineModeStatus()) {
      // 1. Try to get from local cache first
      const cached = db.getCachedQuiz(topic);
      if (cached) return cached;

      // 2. Fallback to procedural
      return getOfflineQuiz(topic, count, difficulty);
  }

  try {
    const model = "gemini-3-flash-preview";
    let prompt = `Generate a quiz with ${count} multiple-choice questions about "${topic}" at a "${difficulty}" difficulty level.
    Ensure the questions are educational, clear, and have exactly 4 options.
    Include a brief explanation for the correct answer.`;

    if (context) {
       prompt += `\n\nIMPORTANT: The questions must be generated strict based on the following learning material provided below.\n\nLEARNING MATERIAL:\n"${context}"`;
    }

    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionText: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
            },
            required: ["questionText", "options", "correctAnswerIndex", "explanation", "difficulty"],
          },
        },
      },
    }));

    if (response.text) {
      const data = JSON.parse(response.text);
      const questions = data.map((q: any, index: number) => ({ ...q, id: `q-${Date.now()}-${index}` }));
      
      // Cache the successful quiz
      db.saveCachedQuiz(topic, questions);
      
      return questions;
    }
    throw new Error("No data");
  } catch (error: any) {
    activateCircuitBreaker();
    
    // Fallback on error: Try cache first
    const cached = db.getCachedQuiz(topic);
    if (cached) return cached;

    return getOfflineQuiz(topic, count, difficulty);
  }
};

export const generateStudyGuide = async (subject: string, topic: string, learningStyle: LearningStyle = 'Practical'): Promise<StudyGuide> => {
  if (getOfflineModeStatus()) {
      return db.getMockStudyGuide(subject, topic, learningStyle);
  }

  try {
    let styleInstruction = "";
    let interactionInstruction = "";
    
    if (learningStyle === 'Visual') {
        styleInstruction = "The student is a VISUAL learner. It is CRITICAL that you describe concepts using vivid imagery. You MUST provide a 'visualImagePrompt' describing a clear, educational illustration.";
        interactionInstruction = "Interactive Element: Create a standard multiple choice question.";
    } else if (learningStyle === 'Theoretical') {
        styleInstruction = "The student is a THEORETICAL learner. Focus on 'Why', history, and underlying principles.";
        interactionInstruction = "Interactive Element: Create a challenging multiple choice question.";
    } else {
        styleInstruction = "The student is a PRACTICAL learner. Focus on 'How', implementation, and code/real-world examples.";
        interactionInstruction = "Interactive Element: Create a 'Fill in the Blank' exercise. Provide a sentence or code snippet with ONE missing key word/value.";
    }

    const prompt = `Act as an expert tutor. Create a lesson for MicroSkill: "${topic}" in Subject: "${subject}".
    ADAPTIVE LEARNING STYLE: ${styleInstruction}
    Structure Requirements: Overview, 3 Key Concepts, Practical Application, 2 Common Misconceptions, Example, Summary, ${interactionInstruction}`;

    const baseProperties: any = {
        topic: { type: Type.STRING },
        overview: { type: Type.STRING },
        keyConcepts: {
            type: Type.ARRAY,
            items: {
            type: Type.OBJECT,
            properties: { title: { type: Type.STRING }, content: { type: Type.STRING } },
            required: ["title", "content"]
            }
        },
        practicalApplication: { type: Type.STRING },
        commonMisconceptions: { type: Type.ARRAY, items: { type: Type.STRING } },
        example: { type: Type.STRING },
        summary: { type: Type.STRING },
        visualImagePrompt: { type: Type.STRING },
    };

    const interactiveProperties: any = {
        type: { type: Type.STRING, enum: learningStyle === 'Practical' ? ['fill-in-the-blank'] : ['quiz'] },
        question: { type: Type.STRING },
        explanation: { type: Type.STRING }
    };

    if (learningStyle === 'Practical') {
        interactiveProperties.correctAnswerText = { type: Type.STRING };
    } else {
        interactiveProperties.options = { type: Type.ARRAY, items: { type: Type.STRING } };
        interactiveProperties.correctAnswer = { type: Type.INTEGER };
    }

    baseProperties.interactiveElement = {
        type: Type.OBJECT,
        properties: interactiveProperties,
        required: learningStyle === 'Practical' ? ["type", "question", "correctAnswerText", "explanation"] : ["type", "question", "options", "correctAnswer", "explanation"]
    };

    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: baseProperties,
          required: ["topic", "overview", "keyConcepts", "practicalApplication", "commonMisconceptions", "example", "summary", "interactiveElement"],
        }
      }
    }));

    if (response.text) return JSON.parse(response.text) as StudyGuide;
    throw new Error("No data");
  } catch (error: any) {
    activateCircuitBreaker();
    return db.getMockStudyGuide(subject, topic, learningStyle);
  }
}

export const generateSubjectRoadmap = async (subject: string, userStats?: UserStats): Promise<Sector[]> => {
  if (getOfflineModeStatus()) {
      return db.getMockRoadmap(subject);
  }

  try {
    const knowledgeLevel = userStats?.subjectKnowledge?.[subject] || 'Beginner';
    const prompt = `Create a "Mission Map" learning roadmap for "${subject}". Current Knowledge: ${knowledgeLevel}. Break into Sectors, Levels, and MicroSkills.`;

    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              levels: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    skills: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          title: { type: Type.STRING },
                          description: { type: Type.STRING },
                          status: { type: Type.STRING, enum: ['locked', 'active', 'completed'] }
                        },
                        required: ["id", "title", "description", "status"]
                      }
                    }
                  },
                  required: ["id", "title", "skills"]
                }
              }
            },
            required: ["id", "title", "description", "levels"]
          }
        }
      }
    }));

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.map((sector: any, sIdx: number) => ({
        ...sector,
        id: `sec-${sIdx}`,
        levels: sector.levels.map((lvl: any, lIdx: number) => ({
          ...lvl,
          id: `lvl-${sIdx}-${lIdx}`,
          skills: lvl.skills.map((skill: any, skIdx: number) => ({
             ...skill,
             id: `sk-${sIdx}-${lIdx}-${skIdx}`,
             status: (sIdx === 0 && lIdx === 0 && skIdx === 0) ? 'active' : 'locked'
          }))
        }))
      }));
    }
    throw new Error("No data");
  } catch (error: any) {
    activateCircuitBreaker();
    return db.getMockRoadmap(subject);
  }
}

export const resolveDoubt = async (subject: string, topic: string, contextContent: string, doubt: string): Promise<string> => {
    if (getOfflineModeStatus()) {
        return "I am currently in offline mode. Please check the study guide above.";
    }
    
    try {
        const prompt = `CONTEXT: Subject: ${subject}, Topic: ${topic}, Content: ${contextContent.substring(0,500)}... QUESTION: ${doubt}`;
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        }));
        return response.text || "Could you rephrase?";
    } catch (e) {
        return "I'm offline right now.";
    }
}

export const getLearningRecommendation = async (topic: string, score: number, total: number): Promise<string> => {
    if (getOfflineModeStatus()) return "Great effort! (Offline)";
    try {
        const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Quiz on "${topic}", score ${score}/${total}. Short recommendation.`,
        }));
        return response.text || "Keep practicing!";
    } catch {
        return "Good job!";
    }
}

// Helper for quiz generation fallback
const getOfflineQuiz = (topic: string, count: number, difficulty: string): Question[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `fallback-${Date.now()}-${i}`,
        questionText: `(Offline Mode) Question ${i + 1} about ${topic}: What is a core principle?`,
        options: [`Principle A related to ${topic}`, `Principle B related to ${topic}`, `Principle C related to ${topic}`, `Principle D related to ${topic}`],
        correctAnswerIndex: 0,
        explanation: "This is a generated placeholder question because you are offline and no cached quiz was found for this specific topic.",
        difficulty: difficulty as any,
        isFallback: true
    }));
};
