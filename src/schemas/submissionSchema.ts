import { z } from "zod";

export const submissionSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  submissionUrl: z
    .url("Please enter a valid URL starting with https://")
    .refine(
      (url) => url.includes("github.com"),
      "Submission URL must be a valid GitHub repository link."
    ),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;