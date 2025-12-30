import { z } from "zod";

// --- Step 1: Student Details ---
export const studentSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(60).trim(),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian mobile number"),
  
  // FIX: Changed { required_error: ... } to { message: ... }
  grade: z.enum(["9", "10", "11", "12"], { message: "Class is required" }),
  board: z.enum(["CBSE", "ICSE", "State Board"], { message: "Board is required" }),
  language: z.enum(["English", "Hindi", "Hinglish"], { message: "Language is required" }),
});

// --- Step 2: Academic Details (Dynamic Schema) ---
export const createAcademicSchema = (grade?: string) => {
  return z.object({
    subjects: z.array(z.string()), 
    // FIX: Changed { required_error: ... } to { message: ... }
    examGoal: z.enum(["Board Excellence", "Concept Mastery", "Competitive Prep"], { message: "Goal is required" }),
    studyHours: z.coerce.number().min(1, "At least 1 hour required").max(40, "Max 40 hours allowed"),
    isScholarship: z.boolean().default(false),
    lastExamScore: z.coerce.number().optional(),
    achievements: z.string().optional(),
  }).superRefine((data, ctx) => {
    
    // 1. Validation: At least 2 subjects for Class 9–10; at least 3 for 11–12
    const isSenior = grade === '11' || grade === '12';
    const minSubjects = isSenior ? 3 : 2;

    if (data.subjects.length < minSubjects) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Class ${grade || 'selected'} requires at least ${minSubjects} subjects`,
        path: ["subjects"],
      });
    }

    // 2. Validation: Conditional schema for scholarship fields
    if (data.isScholarship) {
      // Check if score is missing or invalid
      if (data.lastExamScore === undefined || isNaN(data.lastExamScore) || data.lastExamScore === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Last exam score is required for scholarship applications",
          path: ["lastExamScore"],
        });
      }
      
      // Range check
      if (data.lastExamScore !== undefined && (data.lastExamScore < 0 || data.lastExamScore > 100)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Percentage must be between 0 and 100",
            path: ["lastExamScore"],
        });
      }
    }
  });
};

// --- Step 3: Address & Guardian ---
export const addressSchema = z.object({
  pinCode: z.string().regex(/^\d{6}$/, "Must be a valid 6-digit PIN"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(10, "Address too short").max(120),
  guardianName: z.string().min(2, "Guardian name required"),
  guardianMobile: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid Indian mobile number"),
  
  // FIX: Changed { required_error: ... } to { message: ... }
  paymentPlan: z.enum(["Quarterly", "Half-Yearly", "Annual"], { message: "Plan is required" }),
  paymentMode: z.enum(["UPI", "Card", "NetBanking"], { message: "Mode is required" }),
});

export type StudentData = z.infer<typeof studentSchema>;
export type AcademicData = z.infer<ReturnType<typeof createAcademicSchema>>;
export type AddressData = z.infer<typeof addressSchema>;
export type EnrollmentState = StudentData & AcademicData & AddressData;