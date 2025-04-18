// src/api/api.ts
import apiClient from "./apiClient"; // Using path alias based on your example
import { BooksSchema, type Book } from "./schemas";
import { ZodError } from "zod";
// import { HTTPError } from 'ky'; // Uncomment if needed for specific ky error handling

/**
 * Fetches a list of books from the specified API endpoint.
 * Validates the response against the BooksSchema.
 *
 * @param endpoint - The API endpoint path (e.g., "books"). Defaults to "books".
 * @returns A promise resolving to an array of validated Book objects.
 * @throws {ZodError} If API response data fails validation.
 * @throws {HTTPError | Error} If the network request fails or JSON parsing errors occur.
 */
export const fetchBooks = async (endpoint: string = "books"): Promise<Book[]> => {
  console.log(`Fetching books from endpoint: /${endpoint}`);
  try {
    const response = await apiClient.get(endpoint);
    const data = await response.json(); // Parse JSON response

    // Validate data structure - .parse throws ZodError on failure
    const validatedBooks = BooksSchema.parse(data);
    console.log(`Successfully validated ${validatedBooks.length} books from /${endpoint}.`);
    return validatedBooks;

  } catch (error) {
    if (error instanceof ZodError) {
      // Access detailed validation issues via error.issues
      console.error(`Zod validation failed for /${endpoint}:`, error.issues);
    } else {
      // Handle network errors (like ky's HTTPError) or other exceptions
      console.error(`Failed to fetch or parse books from /${endpoint}:`, error);
    }
    // Re-throw the error for React Query to handle (e.g., set query status to 'error')
    throw error;
  }
};
