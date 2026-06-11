import { z } from 'zod';

export const generateInterviewSchema = z.object({
  role: z.string().min(2, 'Job role is required'),
  experienceLevel: z.enum(['junior', 'mid', 'senior', 'lead']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  answer: z.string().min(1, 'Answer is required'),
});
