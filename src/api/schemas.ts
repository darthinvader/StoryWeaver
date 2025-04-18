import { z } from "zod";

// Schema for a single book object based on your example
export const BookSchema = z.object({
  categories: z.array(z.string()), // Array of strings
  description: z.string(), // Description string
  downloadLink: z.string().url({ message: "Invalid download URL" }), // Validate as URL
  imageUrl: z.string().url({ message: "Invalid image URL" }), // Validate as URL
  title: z.string().min(1, { message: "Title cannot be empty" }), // Non-empty title
});

// Schema for an array of books (what the /books endpoint likely returns)
export const BooksSchema = z.array(BookSchema);

// Infer the TypeScript type from the schema for use in your code
export type Book = z.infer<typeof BookSchema>;  