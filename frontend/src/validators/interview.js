import { z } from 'zod';

export const createInterviewSchema = z.object({
  role: z.string().min(2, 'Job role is required'),
  experienceLevel: z.enum(['junior', 'mid', 'senior', 'lead']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  technologies: z.string().min(1, 'At least one technology is required'),
});
