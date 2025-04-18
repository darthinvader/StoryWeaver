// src/lib/queryKeys.ts

/**
 * Centralized factory for creating query keys for TanStack Query.
 * Query keys are arrays used to uniquely identify data in the cache.
 * They should include any variables that the query depends on.
 */
export const queryKeys = {
  books: {
    /**
     * Generates the query key for fetching a list of books.
     * Includes the endpoint name because the data depends on it.
     * Example usage: queryKeys.books.list('books'), queryKeys.books.list('featured')
     * @param endpoint - The specific API endpoint for the books list.
     */
    list: (endpoint: string = "books") => ["books", "list", endpoint] as const,

    /**
     * Example: Generates the query key for fetching a single book by its ID.
     * (Uncomment and adjust if you implement fetchBookById)
     * @param id - The unique identifier of the book.
     */
    // detail: (id: string | number) => ["books", "detail", String(id)] as const,
  },
  // Add keys for other data types/features here
  // users: {
  //   all: () => ['users', 'list'] as const,
  //   detail: (id: string) => ['users', 'detail', id] as const,
  // }
};
