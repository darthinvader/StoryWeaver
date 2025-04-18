// src/api/queries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "./api";
import { queryKeys } from "./queryKeys"; // Use path alias for consistency
import type { Book } from "./schemas";
// import { ZodError } from 'zod'; // Uncomment if you need to check error type in component
// import { HTTPError } from 'ky'; // Uncomment if you need to check error type in component

/**
 * Custom React Query hook to fetch a list of books.
 *
 * @param endpoint - The specific API endpoint to fetch books from (defaults to "books").
 * @returns The result object from TanStack Query's useQuery, containing data, status, error etc.
 */
export const useGetBooks = (endpoint: string = "books") => {
  // Generate the query key using the factory. It includes the endpoint
  // because the fetchBooks function depends on it.
  const bookListQueryKey = queryKeys.books.list(endpoint);

  return useQuery<Book[], Error>({
    // This unique key tells React Query how to cache this specific request
    queryKey: bookListQueryKey,
    // The function that performs the data fetching and validation
    queryFn: () => fetchBooks(endpoint),
    // Optional common configurations:
    // staleTime: 5 * 60 * 1000, // Data considered fresh for 5 mins
    // gcTime: 15 * 60 * 1000, // Cache removed after 15 mins of inactivity
  });
};
