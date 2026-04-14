import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

const fullNameSchema = z
  .string()
  .trim()
  .min(1, "Full Name is required.")
  .min(2, "Full Name must be at least 2 characters.");

const passwordSchema = z
  .string()
  .min(1, "Password is required.")
  .min(8, "Password must be at least 8 characters.");

const newPasswordSchema = z
  .string()
  .min(1, "New Password is required.")
  .min(8, "New Password must be at least 8 characters.");

const confirmPasswordSchema = z
  .string()
  .min(1, "Confirm Password is required.")
  .min(8, "Confirm Password must be at least 8 characters.");

const confirmNewPasswordSchema = z
  .string()
  .min(1, "Confirm new Password is required.")
  .min(8, "Confirm new Password must be at least 8 characters.");

const skillSchema = z
  .string()
  .trim()
  .min(1, "Skill is required.")
  .min(2, "Skill must be at least 2 characters.");

const portfolioSchema = z
  .string()
  .trim()
  .min(1, "Portfolio Link is required.")
  .url("Enter a valid link.");

const codeSchema = z
  .string()
  .trim()
  .min(1, "Code is required.")
  .regex(/^\d{4,8}$/, "Enter the code from your email.");

const resumeSchema = z
  .unknown()
  .refine(hasSelectedFile, "Resume is required.")
  .refine(hasAcceptedResumeType, "Upload a PDF, DOC, or DOCX file.");

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  remember: z.boolean().optional(),
});

export const studentSignUpSchema = z
  .object({
    confirmPassword: confirmPasswordSchema,
    email: emailSchema,
    fullName: fullNameSchema,
    password: passwordSchema,
    remember: z.boolean().optional(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const mentorRequestSchema = z.object({
  email: emailSchema,
  fullName: fullNameSchema,
  portfolio: portfolioSchema,
  resume: resumeSchema,
  skill: skillSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    code: codeSchema,
    confirmPassword: confirmNewPasswordSchema,
    password: newPasswordSchema,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type MentorRequestFormValues = z.infer<typeof mentorRequestSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type SignInFormValues = z.infer<typeof signInSchema>;
export type StudentSignUpFormValues = z.infer<typeof studentSignUpSchema>;

function hasSelectedFile(value: unknown) {
  return getFirstFile(value) !== undefined;
}

function hasAcceptedResumeType(value: unknown) {
  const file = getFirstFile(value);

  if (!file) {
    return true;
  }

  const acceptedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const acceptedExtensions = [".pdf", ".doc", ".docx"];
  const fileName = file.name.toLowerCase();

  return (
    acceptedMimeTypes.includes(file.type) ||
    acceptedExtensions.some((extension) => fileName.endsWith(extension))
  );
}

function getFirstFile(value: unknown) {
  if (!value || typeof value !== "object" || !("length" in value)) {
    return undefined;
  }

  const files = value as { 0?: File; length: number };
  return files.length > 0 ? files[0] : undefined;
}
