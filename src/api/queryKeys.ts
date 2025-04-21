/**
 * Centralized factory for creating query keys for TanStack Query.
 * Query keys are arrays used to uniquely identify data in the cache.
 * They should include any variables that the query depends on.
 */
export const queryKeys = {
  books: {
    /**
     * Generates the query key for fetching the list of all books from Supabase.
     * Example usage: queryKeys.books.list()
     */
    list: () => ["books", "list"] as const, // Simplified key

    /**
     * Example: Generates the query key for fetching a single book by its ID.
     * (Uncomment and adjust if you implement fetchBookById)
     * @param id - The unique identifier of the book.
     */
    // detail: (id: string | number) => ["books", "detail", String(id)] as const,
  },
  // ... other keys
};
