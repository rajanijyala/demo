import openai from '../config/openai.js';

export const generateInterviewQuestions = async ({ role, experienceLevel, difficulty, technologies }) => {
  const prompt = `You are an expert technical interviewer. Generate interview questions for a ${experienceLevel} ${role} position.
Difficulty: ${difficulty}
Technologies: ${technologies.join(', ')}

Generate exactly 10 questions in JSON format:
- 5 technical questions
- 3 behavioral questions  
- 2 HR questions

Return a JSON array where each object has:
- "question": the question text
- "category": "technical" | "behavioral" | "hr"
- "expectedAnswer": a brief ideal answer outline

Return ONLY the JSON array, no other text.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 3000,
  });

  const content = response.choices[0].message.content.trim();
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Failed to parse AI response');
  return JSON.parse(jsonMatch[0]);
};

export const generateAnswerFeedback = async ({ question, answer, role, category }) => {
  const prompt = `You are an expert interviewer evaluating a candidate's answer for a ${role} position.

Category: ${category}
Question: ${question}
Candidate's Answer: ${answer}

Evaluate the answer and return a JSON object with:
- "technicalScore": 0-100
- "communicationScore": 0-100
- "confidenceScore": 0-100
- "overallScore": 0-100
- "strengths": array of 2-3 strengths
- "weaknesses": array of 2-3 weaknesses
- "improvements": array of 2-3 actionable improvement suggestions

Return ONLY the JSON object, no other text.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 1000,
  });

  const content = response.choices[0].message.content.trim();
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse AI feedback');
  return JSON.parse(jsonMatch[0]);
};

export const analyzeResume = async (resumeText) => {
  const prompt = `Analyze this resume and return a JSON object with:
- "score": overall resume score 0-100
- "skills": array of skills found
- "missingSkills": array of commonly expected skills that are missing
- "suggestions": array of 3-5 improvement suggestions

Resume text:
${resumeText}

Return ONLY the JSON object, no other text.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 1500,
  });

  const content = response.choices[0].message.content.trim();
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse resume analysis');
  return JSON.parse(jsonMatch[0]);
};
