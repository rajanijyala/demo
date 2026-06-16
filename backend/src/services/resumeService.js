const fs = require("fs/promises");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const knownSkills = [
  "React", "Redux", "JavaScript", "TypeScript", "Node.js", "Express", "MongoDB",
  "Mongoose", "SQL", "MySQL", "PostgreSQL", "HTML", "CSS", "Tailwind", "REST",
  "JWT", "Docker", "AWS", "Git", "Python", "Java", "C++", "Next.js", "GraphQL"
];

const normalizeWhitespace = (value = "") => value.replace(/\s+/g, " ").trim();

const splitLines = (value = "") =>
  value
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);

const sectionLines = (lines, labels) => {
  const startIndex = lines.findIndex((line) => labels.some((label) => new RegExp(`^${label}\\b`, "i").test(line)));
  if (startIndex === -1) return [];

  const nextIndex = lines.findIndex((line, index) =>
    index > startIndex && /^(skills|technical skills|projects|experience|work experience|education|certifications|achievements|summary)\b/i.test(line)
  );

  return lines.slice(startIndex + 1, nextIndex === -1 ? startIndex + 6 : nextIndex).slice(0, 8);
};

const extractTextFromFile = async (file) => {
  if (file.mimetype === "application/pdf") {
    const buffer = await fs.readFile(file.path);
    const parsed = await pdfParse(buffer);
    return parsed.text || "";
  }

  if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const parsed = await mammoth.extractRawText({ path: file.path });
    return parsed.value || "";
  }

  throw new Error("Only PDF and DOCX resume files are supported.");
};

const parseResumeText = (text) => {
  const lines = splitLines(text);
  const lowerText = text.toLowerCase();
  const skills = knownSkills.filter((skill) => lowerText.includes(skill.toLowerCase()));
  const projects = sectionLines(lines, ["projects", "project"]);
  const experience = sectionLines(lines, ["experience", "work experience", "employment"]);
  const education = sectionLines(lines, ["education", "academic"]);
  const summary = normalizeWhitespace(lines.slice(0, 4).join(" ")).slice(0, 500);

  return {
    skills,
    projects,
    experience,
    education,
    summary
  };
};

const buildResumeQuestions = ({ resume, questionCount = 8 }) => {
  const parsed = resume.parsed || {};
  const skills = parsed.skills?.length ? parsed.skills : ["your strongest technical skill"];
  const projects = parsed.projects?.length ? parsed.projects : ["your most relevant project"];
  const experience = parsed.experience?.length ? parsed.experience : ["your recent experience"];
  const education = parsed.education?.length ? parsed.education : ["your education"];

  const bank = [
    ...skills.map((skill) => ({
      prompt: `Your resume mentions ${skill}. Explain one practical scenario where you used it, including tradeoffs and measurable impact.`,
      skillTags: [skill],
      expectedSignals: ["specific example", "technical accuracy", "impact"]
    })),
    ...projects.slice(0, 4).map((project) => ({
      prompt: `Walk me through this resume project: ${project}. What was your role, architecture, and hardest technical decision?`,
      skillTags: ["project"],
      expectedSignals: ["ownership", "architecture", "tradeoffs"]
    })),
    ...experience.slice(0, 4).map((item) => ({
      prompt: `In your experience entry "${item}", what problem did you solve and how did you validate the result?`,
      skillTags: ["experience"],
      expectedSignals: ["problem solving", "validation", "result"]
    })),
    {
      prompt: `How does your education or training (${education[0]}) support the role you are targeting?`,
      skillTags: ["education"],
      expectedSignals: ["fundamentals", "learning", "role fit"]
    },
    {
      prompt: "Which resume claim would you expect an interviewer to challenge, and how would you defend it with evidence?",
      skillTags: ["communication"],
      expectedSignals: ["honesty", "evidence", "clarity"]
    }
  ];

  return Array.from({ length: questionCount }).map((_, index) => {
    const item = bank[index % bank.length];
    return {
      ...item,
      role: "Resume Based Interview",
      experienceLevel: "fresher",
      interviewType: "technical",
      difficulty: index % 3 === 0 ? "easy" : "medium",
      source: "resume",
      order: index + 1
    };
  });
};

const buildResumeMatchAnalysis = (resume) => {
  const parsed = resume.parsed || {};
  const skills = parsed.skills || [];
  const coverage = Math.min(100, 45 + skills.length * 7 + (parsed.projects?.length || 0) * 5 + (parsed.experience?.length || 0) * 5);

  return {
    score: coverage,
    matchedSkills: skills,
    projectSignals: parsed.projects || [],
    experienceSignals: parsed.experience || [],
    summary: coverage >= 75
      ? "Resume has strong technical signals for a focused interview."
      : "Resume has useful signals, but more concrete skills, projects, and measurable outcomes would improve interview alignment."
  };
};

module.exports = {
  extractTextFromFile,
  parseResumeText,
  buildResumeQuestions,
  buildResumeMatchAnalysis
};
