import * as z from "zod";

// Reusable 'freal' schema with validation rules
const frealSchema = z.string().nonempty({ message: "Freal content cannot be empty." }).min(3, { message: "Freal content must be at least 3 characters." });

// Freal Validation Schema
export const FrealValidation = z.object({
  freal: frealSchema, // Reusing freal schema for consistency
  accountId: z.string().optional(), // Optional if not always required
});

// Comment Validation Schema
export const CommentValidation = z.object({
  freal: frealSchema, // Reusing freal schema to ensure uniform validation
});
