// src/schemas/profileSchema.js
import { z } from 'zod';

const fileSchema = (types) => z.any().refine(value => {
    if (typeof value === 'string') {
        return true;
    }
    if (value instanceof FileList || value === null || value === undefined) {
        if (!value || value.length === 0) return true;
        if (value.length > 1) return false;
        if (value[0].size > 5 * 1024 * 1024) return false;
        if (!types.includes(value[0].type)) return false;
        return true;
    }
    return false;
}, {
    message: `Invalid file. Must be one of ${types.join(', ')} and under 5MB.`
});

export const profileSchema = z.object({
  firstName: z.string().min(2, { message: "First Name must be at least 2 characters." }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: "Last Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  dateOfBirth: z.date().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  nationality: z.string().optional(),
  profilePhoto: fileSchema(['image/jpeg', 'image/jpg']),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  phoneNumber: z.string().optional(),
  residentialAddress: z.string().optional(),
  nationalIdType: z.enum(["", "Aadhaar", "Passport", "Driver's License", "Other"]).optional(),
  nationalIdNumber: z.string().optional(),
  documentFile: fileSchema(['application/pdf']),
  jobTitle: z.string().optional(),
  organization: z.string().optional(),
  workExperience: z.string().optional(),
  skills: z.string().optional(),
  resume: fileSchema(['application/pdf']),
  portfolio: z.string().url().optional().or(z.literal('')),
  highestQualification: z.string().optional(),
  institutionName: z.string().optional(),
  graduationYear: z.string().optional(),
  certifications: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  blog: z.string().url().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (data.nationalIdType && !data.nationalIdNumber) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['nationalIdNumber'],
            message: 'National ID Number is required when a type is selected.',
        });
    }
    if (data.nationalIdType === 'Aadhaar' && data.nationalIdNumber && !/^\d{12}$/.test(data.nationalIdNumber)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['nationalIdNumber'],
            message: 'Aadhaar number must be 12 digits.',
        });
    }
    if (data.nationalIdType === 'Passport' && data.nationalIdNumber && !/^[A-Z][0-9]{7}$/.test(data.nationalIdNumber)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['nationalIdNumber'],
            message: 'Passport number must be one letter followed by seven numbers.',
        });
    }
    if (data.nationalIdType === "Driver's License" && data.nationalIdNumber && data.nationalIdNumber.length !== 16) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['nationalIdNumber'],
            message: "Driver's License number must be 16 characters.",
        });
    }
});