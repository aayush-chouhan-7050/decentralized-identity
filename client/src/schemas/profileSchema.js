// src/schemas/profileSchema.js
import { z } from 'zod';

const fileSchema = (types) => z.any().refine(value => {
    // If the value is a string, it's an existing URL, so we consider it valid.
    if (typeof value === 'string') {
        return true;
    }
    // If it's a FileList, null, or undefined, we proceed with file validation.
    if (value instanceof FileList || value === null || value === undefined) {
        if (!value || value.length === 0) return true; // No file selected is valid.
        if (value.length > 1) return false; // Ensure only one file is uploaded.
        if (value[0].size > 5 * 1024 * 1024) return false; // Check file size.
        if (!types.includes(value[0].type)) return false; // Check file type.
        return true;
    }
    return false;
}, {
    message: `Invalid file. Must be one of ${types.join(', ')} and under 5MB.`
});

export const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  nationality: z.string().optional(),
  profilePhoto: fileSchema(['image/jpeg', 'image/jpg']),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  phoneNumber: z.string().optional(),
  residentialAddress: z.string().optional(),
  nationalIdType: z.enum(["Aadhaar", "Passport", "Driver's License"]).optional(),
  nationalIdNumber: z.string().optional(),
  documentFile: fileSchema(['application/pdf']),
});