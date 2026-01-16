
import { GoogleGenAI, Type } from "@google/genai";
import { Question, StudyGuide, Sector, UserStats, KnowledgeLevel, LearningStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to identify quota errors or generic failures to provide fallbacks
const isError = (error: any) => {
    const msg = error?.message || '';
    return msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || true; // Fallback for all errors for demo stability
};

export const generateQuizQuestions = async (topic: string, difficulty: string, count: number = 5, context?: string): Promise<Question[]> => {
  try {
    const model = "gemini-3-flash-preview";
    
    let prompt = `Generate a quiz with ${count} multiple-choice questions about "${topic}" at a "${difficulty}" difficulty level.
    Ensure the questions are educational, clear, and have exactly 4 options.
    Include a brief explanation for the correct answer.`;

    if (context) {
       prompt += `\n\nIMPORTANT: The questions must be generated strict based on the following learning material provided below. Do NOT ask about concepts, syntax, or history that is not explicitly covered in this material. If the material is introductory, keep questions very basic.\n\nLEARNING MATERIAL:\n"${context}"`;
    }

    const response = await ai.models.generateContent({
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
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              explanation: { type: Type.STRING, description: "Explanation of why the answer is correct" },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
            },
            required: ["questionText", "options", "correctAnswerIndex", "explanation", "difficulty"],
          },
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Add IDs to questions
      return data.map((q: any, index: number) => ({
        ...q,
        id: `q-${Date.now()}-${index}`,
      }));
    }
    
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Error generating quiz:", error);
    
    // Fallback Questions for Demo/Quota Limits
    return Array.from({ length: count }).map((_, i) => ({
        id: `fallback-${Date.now()}-${i}`,
        questionText: `(Demo Mode) What is a key concept of ${topic}?`,
        options: [
            `${topic} Concept A`,
            `${topic} Concept B`,
            `${topic} Concept C`,
            `${topic} Concept D`
        ],
        correctAnswerIndex: 0,
        explanation: "This is a placeholder question because the AI service is currently experiencing high traffic or quota limits.",
        difficulty: difficulty as 'Easy' | 'Medium' | 'Hard'
    }));
  }
};

export const getLearningRecommendation = async (topic: string, score: number, total: number): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `The student just took a quiz on "${topic}" and scored ${score}/${total}. 
            Provide a short, encouraging 2-sentence recommendation for what they should study next or how to improve. 
            Address the student directly.`,
        });
        return response.text || "Keep practicing to improve your skills!";
    } catch (error) {
        console.error("Error getting recommendation:", error);
        return "Great effort! Review your mistakes and try again to master this topic.";
    }
}

export const generateStudyGuide = async (subject: string, topic: string, learningStyle: LearningStyle = 'Practical'): Promise<StudyGuide> => {
  try {
    let styleInstruction = "";
    if (learningStyle === 'Visual') {
        styleInstruction = "The student is a VISUAL learner. Use vivid analogies, describe concepts as mental images or diagrams (e.g., 'Imagine a pipe system for data flow'). Avoid walls of text. Structure content with bullet points and visual language.";
    } else if (learningStyle === 'Theoretical') {
        styleInstruction = "The student is a THEORETICAL learner. Focus on 'Why', history, and underlying principles. Explain the depth and abstract concepts thoroughly.";
    } else {
        styleInstruction = "The student is a PRACTICAL learner. Focus on 'How', implementation, and real-world utility. Provide concrete examples, code snippets (if applicable), or step-by-step guides. Keep theory minimal.";
    }

    const prompt = `Act as an expert tutor. Create a comprehensive, easy-to-understand study lesson for the specific MicroSkill: "${topic}" within the subject "${subject}".
    
    ADAPTIVE LEARNING STYLE: ${styleInstruction}

    Structure Requirements:
    1. Overview: A clear, friendly introduction suited to the learning style.
    2. Key Concepts: 3 distinct, foundational concepts.
    3. Practical Application: Explain HOW this concept is used in real life or real projects.
    4. Common Misconceptions: List 2 things students usually misunderstand about this.
    5. Example: A concrete analogy or code snippet (Adapt to style).
    6. Summary: 1 sentence takeaway.
    7. Interactive Element: One multiple choice question to check understanding.
    
    Style: Pedagogical, encouraging, clear.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            overview: { type: Type.STRING },
            keyConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                },
                required: ["title", "content"]
              }
            },
            practicalApplication: { type: Type.STRING },
            commonMisconceptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            example: { type: Type.STRING },
            summary: { type: Type.STRING },
            interactiveElement: {
               type: Type.OBJECT,
               properties: {
                  type: { type: Type.STRING, enum: ['quiz'] },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
               },
               required: ["type", "question", "options", "correctAnswer", "explanation"]
            }
          },
          required: ["topic", "overview", "keyConcepts", "practicalApplication", "commonMisconceptions", "example", "summary"],
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as StudyGuide;
    }
    throw new Error("No study guide returned");
  } catch (error) {
    console.error("Error generating study guide", error);
    
    // Fallback Study Guide
    return {
        topic: topic,
        overview: `We are currently experiencing high demand for AI-generated content. Here is a quick summary of ${topic}.`,
        keyConcepts: [
            { title: "Core Concept 1", content: `Understanding the basics of ${topic} is crucial.` },
            { title: "Core Concept 2", content: "This builds upon foundational knowledge." },
            { title: "Core Concept 3", content: "Mastery requires consistent practice." }
        ],
        practicalApplication: "This concept is widely used in industry to solve real-world problems efficiently.",
        commonMisconceptions: ["It's too hard to learn.", "It's not useful in daily work."],
        example: "Imagine this concept as a building block for larger systems.",
        summary: `Focus on the fundamentals of ${topic} to succeed.`,
        interactiveElement: {
            type: 'quiz',
            question: `What is the most important thing about ${topic}?`,
            options: ["It is cool", "It is useful", "It is hard", "It is irrelevant"],
            correctAnswer: 1,
            explanation: "Utility is a key driver for learning new skills."
        }
    };
  }
}

export const resolveDoubt = async (subject: string, topic: string, contextContent: string, doubt: string): Promise<string> => {
    try {
        const prompt = `
        CONTEXT:
        Subject: ${subject}
        Topic: ${topic}
        Current Lesson Content: "${contextContent.substring(0, 1000)}..."
        
        STUDENT QUESTION: "${doubt}"
        
        INSTRUCTION:
        Answer the student's doubt directly, clearly, and concisely. 
        Use an analogy if helpful. 
        If the student is confused, explain it like they are 12 years old.
        Keep the answer under 3 sentences if possible.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        
        return response.text || "I couldn't quite understand that. Could you rephrase?";
    } catch (e) {
        console.error("Error resolving doubt", e);
        return "I'm having trouble connecting to the AI brain right now due to high traffic. Please try again later.";
    }
}

export const generateSubjectRoadmap = async (subject: string, userStats?: UserStats): Promise<Sector[]> => {
  try {
    const knowledgeLevel: KnowledgeLevel = userStats?.subjectKnowledge?.[subject] || 'Beginner';
    const specificGoal = userStats?.subjectGoals?.[subject] || `Master ${subject}`;
    const academicLevel = userStats?.academicDetails?.level || 'Beginner';
    
    let prompt = `Create a "Mission Map" learning roadmap for "${subject}".
    
    STUDENT PROFILE:
    - Current Knowledge: ${knowledgeLevel}
    - Academic Level: ${academicLevel}
    - SPECIFIC GOAL: "${specificGoal}"

    INSTRUCTIONS:
    1. Structure the roadmap as a journey from their current knowledge level DIRECTLY to their Specific Goal.
    2. Divide the journey into 3-4 "Sectors" (Major Milestones).
    3. Each Sector has 2 "Levels" (Thematic clusters).
    4. CRITICAL: Each Level must have 3 "MicroSkills".
    
    WHAT IS A MICROSKILL?
    - A MicroSkill is a very small, atomic concept that can be learned in 5-10 minutes.
    - Do NOT use broad chapter titles like "Variables". 
    - USE granular titles like "Declaring Const vs Let", "Variable Naming Rules", "String Concatenation".
    - The goal is to prevent cognitive overload by breaking topics into tiny pieces.

    If Knowledge is Advanced, skip basics and focus on the Goal.
    If Knowledge is Beginner, start from zero.
    `;

    const response = await ai.models.generateContent({
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
              title: { type: Type.STRING, description: "Sector Title (Major Milestone)" },
              description: { type: Type.STRING, description: "What milestone is achieved here?" },
              levels: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING, description: "Level Title (Theme)" },
                    skills: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          title: { type: Type.STRING, description: "MicroSkill Title (Atomic Concept)" },
                          description: { type: Type.STRING, description: "1 sentence on what this is." },
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
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Ensure IDs are unique-ish
      return data.map((sector: any, sIdx: number) => ({
        ...sector,
        id: `sec-${sIdx}`,
        levels: sector.levels.map((lvl: any, lIdx: number) => ({
          ...lvl,
          id: `lvl-${sIdx}-${lIdx}`,
          skills: lvl.skills.map((skill: any, skIdx: number) => ({
             ...skill,
             id: `sk-${sIdx}-${lIdx}-${skIdx}`,
             // Force first item to be active if it's the very first one
             status: (sIdx === 0 && lIdx === 0 && skIdx === 0) ? 'active' : 'locked'
          }))
        }))
      }));
    }
    throw new Error("No roadmap generated");
  } catch (error) {
    console.error("Error generating roadmap", error);
    // Fallback static structure if AI fails
    return [
        {
            id: "sec-0",
            title: "Sector 0: Fundamentals (Offline Mode)",
            description: "Core concepts available without AI.",
            levels: [{ 
                id: "l1", 
                title: "Basics", 
                skills: [
                    {id: "s1", title: `Intro to ${subject}`, description: "Getting started fundamentals.", status: "active"},
                    {id: "s2", title: "Key Terminology", description: "Important words to know.", status: "locked"},
                    {id: "s3", title: "First Steps", description: "Practical application basics.", status: "locked"}
                ]
            }]
        }
    ];
  }
}
