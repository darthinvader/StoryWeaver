import { supabase } from "./supabaseClient"; // Import the supabase client
import { BooksSchema, type Book } from "./schemas";
import { ZodError } from "zod";
import { PostgrestError } from "@supabase/supabase-js"; // Import Supabase error type

/**
 * Fetches a list of books from the Supabase 'books' table.
 * Validates the response against the BooksSchema.
 *
 * @returns A promise resolving to an array of validated Book objects.
 * @throws {ZodError} If Supabase response data fails validation.
 * @throws {PostgrestError | Error} If the Supabase query fails or other errors occur.
 */
export const fetchBooks = async (): Promise<Book[]> => {
  console.log("Fetching books from Supabase 'books' table...");
  try {
    // Query the 'books' table, selecting all columns
    const { data, error } = await supabase.from("DnDBooks").select("*");

    // Handle Supabase query errors
    if (error) {
      console.error("Supabase query failed:", error);
      throw error; // Re-throw the Supabase error
    }

    // Handle case where data is unexpectedly null (though select usually returns [])
    if (!data) {
      console.warn("Supabase returned null data for 'books' query.");
      return []; // Or throw an error if this shouldn't happen
    }

    console.log(`Received ${data.length} records from Supabase.`);

    // Validate data structure using Zod - .parse throws ZodError on failure
    const validatedBooks = BooksSchema.parse(data);
    console.log(
      `Successfully validated ${validatedBooks.length} books from Supabase.`
    );
    return validatedBooks;
  } catch (error) {
    if (error instanceof ZodError) {
      // Access detailed validation issues via error.issues
      console.error("Zod validation failed for Supabase data:", error.issues);
    } else if (error instanceof PostgrestError) {
      // Already logged above, but you could add specific handling here
      console.error("Supabase PostgrestError during fetch:", error.message);
    } else {
      // Handle other unexpected errors
      console.error("Failed to fetch or parse books from Supabase:", error);
    }
    // Re-throw the error for React Query to handle
    throw error;
  }
};

// Remove or comment out the old apiClient import if no longer needed
// import apiClient from "./apiClient";
