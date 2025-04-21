import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "./api";
import { queryKeys } from "./queryKeys";
import type { Book } from "./schemas";
import { PostgrestError } from "@supabase/supabase-js"; // Import Supabase error type
import { ZodError } from "zod"; // Keep ZodError if you want to check for it

// Define a union type for possible errors
type FetchBooksError = PostgrestError | ZodError | Error;

/**
 * Custom React Query hook to fetch the list of books from Supabase.
 *
 * @returns The result object from TanStack Query's useQuery.
 */
export const useGetBooks = () => {
  // Generate the query key using the updated factory.
  const bookListQueryKey = queryKeys.books.list();

  return useQuery<Book[], FetchBooksError>({ // Use the union error type
    // This unique key tells React Query how to cache this specific request
    queryKey: bookListQueryKey,
    // The function that performs the data fetching and validation using Supabase
    queryFn: fetchBooks, // Directly pass the updated fetchBooks function
    // Optional common configurations:
    // staleTime: 5 * 60 * 1000,
    // gcTime: 15 * 60 * 1000,
  });
};
