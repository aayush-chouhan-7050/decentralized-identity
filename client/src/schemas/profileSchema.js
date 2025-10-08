// src/schemas/profileSchema.js
import { z } from 'zod';

// Helper for optional but valid URLs
const optionalUrl = z.string().url({ message: "Invalid URL format." }).optional().or(z.literal(''));

export const profileSchema = z.object({
  name: z.string().min(2, { message: "Full Name must be at least 2 characters." }),
  username: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  profileImage: optionalUrl,
  bio: z.string().max(300, { message: "Bio cannot exceed 300 characters." }).optional(),
  occupation: z.string().optional(),
  organization: z.string().optional(),
  website: optionalUrl,
  skills: z.array(z.string()).optional(),
  education: z.array(z.object({
    institution: z.string().optional(),
    degree: z.string().optional(),
    field: z.string().optional(),
    year: z.string().optional(),
  })).optional(),
  socialLinks: z.object({
    github: optionalUrl,
    linkedin: optionalUrl,
    twitter: optionalUrl,
  })
});