const Question = require("../models/Question");

const baseQuestions = {
  technical: [
    "Explain a project where you solved a difficult technical problem. What tradeoffs did you consider?",
    "How would you debug a production issue where users report slow API responses?",
    "Describe how authentication with JWT works and what security risks you would watch for.",
    "How do you design a MongoDB schema for a feature that needs fast reads and safe updates?",
    "Explain the difference between client-side and server-side validation. Where should each live?",
    "Walk through how you would test an end-to-end user workflow before release."
  ],
  behavioral: [
    "Tell me about a time you received difficult feedback and how you responded.",
    "Describe a situation where you had to learn something quickly to complete a task.",
    "How do you handle conflict when teammates disagree on a technical decision?",
    "Tell me about a time you missed a deadline. What changed afterward?",
    "How do you communicate progress when a task is blocked?",
    "Describe a time you helped another person improve their work."
  ],
  hr: [
    "Why are you interested in this role?",
    "What are your strongest professional qualities?",
    "Where do you see yourself improving over the next six months?",
    "Describe your ideal work environment.",
    "Why should the organization select you?",
    "What motivates you during challenging projects?"
  ],
  system_design: [
    "Design a mock interview platform that supports many concurrent users.",
    "How would you design notifications for a learning platform?",
    "Design an analytics dashboard for interview performance over time.",
    "How would you scale question generation while keeping responses reliable?",
    "Design a resume upload and parsing workflow.",
    "How would you make an interview session resumable after browser refresh?"
  ]
};

const roleSignals = {
  "frontend developer": ["React", "state management", "accessibility", "API integration"],
  "backend developer": ["database", "API design", "security", "scalability"],
  "full stack developer": ["frontend", "backend", "database", "deployment"],
  "data analyst": ["metrics", "SQL", "visualization", "business impact"],
  default: ["clarity", "examples", "tradeoffs", "testing"]
};

const normalizeKey = (value = "") => value.toLowerCase().trim();

const pickBank = (interviewType) => {
  if (interviewType === "mixed") {
    return [
      ...baseQuestions.technical,
      ...baseQuestions.behavioral,
      ...baseQuestions.hr,
      ...baseQuestions.system_design
    ];
  }

  return baseQuestions[interviewType] || baseQuestions.technical;
};

const fallbackQuestions = ({ role, experienceLevel, interviewType, questionCount }) => {
  const bank = pickBank(interviewType);
  const signals = roleSignals[normalizeKey(role)] || roleSignals.default;

  return Array.from({ length: questionCount }).map((_, index) => {
    const prompt = bank[index % bank.length];
    return {
      prompt: `${prompt} Tailor your answer for a ${experienceLevel} ${role} interview.`,
      role,
      experienceLevel,
      interviewType,
      difficulty: experienceLevel === "senior" ? "hard" : index % 3 === 0 ? "easy" : "medium",
      skillTags: signals,
      expectedSignals: ["specific example", "structured reasoning", "measurable result"],
      source: "fallback",
      order: index + 1
    };
  });
};

const parseOpenAiQuestions = (content, config) => {
  try {
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed.slice(0, config.questionCount).map((item, index) => ({
      prompt: item.prompt,
      role: config.role,
      experienceLevel: config.experienceLevel,
      interviewType: config.interviewType,
      difficulty: item.difficulty || "medium",
      skillTags: item.skillTags || ["communication"],
      expectedSignals: item.expectedSignals || ["clear reasoning"],
      source: "openai",
      order: index + 1
    })).filter((item) => item.prompt);
  } catch (_error) {
    return null;
  }
};

const generateQuestionPayloads = async (config) => {
  if (!process.env.OPENAI_API_KEY || typeof fetch !== "function") {
    return fallbackQuestions(config);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: "Return only valid JSON array. Each item needs prompt, difficulty, skillTags, expectedSignals."
          },
          {
            role: "user",
            content: `Generate ${config.questionCount} ${config.interviewType} mock interview questions for a ${config.experienceLevel} ${config.role}.`
          }
        ]
      })
    });

    if (!response.ok) {
      return fallbackQuestions(config);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = parseOpenAiQuestions(content, config);
    return parsed?.length ? parsed : fallbackQuestions(config);
  } catch (_error) {
    return fallbackQuestions(config);
  }
};

const createQuestionsForSession = async ({ session, template, config }) => {
  const payloads = await generateQuestionPayloads(config);
  const questions = await Question.insertMany(
    payloads.map((question) => ({
      ...question,
      session: session._id,
      template: template?._id
    }))
  );

  return questions;
};

module.exports = {
  createQuestionsForSession,
  generateQuestionPayloads
};
