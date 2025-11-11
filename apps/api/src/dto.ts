import { z } from "zod";

export const RegisterDTO = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const SessionCreateDTO = z.object({
  topic: z.string().min(3),
  tags: z.array(z.string()).default([]),
  mode: z.enum(["instant","scheduled"]).default("instant"),
  priceCredits: z.number().int().nonnegative().default(2),
  maxParticipants: z.number().int().min(1).default(1),
  description: z.string().default("")
});

export const ProfileUpdateDTO = z.object({
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  availability: z.object({
    timezone: z.string(),
    slots: z.array(z.object({
      dayOfWeek: z.number().min(0).max(6),
      start: z.string(),
      end: z.string()
    }))
  }).optional(),
  avatarUrl: z.string().url().optional()
});

export const RatingCreateDTO = z.object({
  sessionId: z.string(),
  rateeId: z.string(),
  stars: z.number().int().min(1).max(5),
  comment: z.string().optional()
});
