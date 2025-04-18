// src/routes/books/index.tsx
import { useGetBooks } from "@/api/queries";
import type { Book } from "@/api/schemas"; // Import the Book type
import { BookCard } from "@/containers/Book-Card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/books/")({
  component: BooksPageComponent, // Renamed component for clarity
});

function BooksPageComponent() {
  // Fetch books using the custom hook. It defaults to the 'books' endpoint.
  const { data: books, isLoading, isError, error } = useGetBooks();

  // --- Handle Loading State ---
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-4">
        <p className="text-muted-foreground text-lg">Loading books...</p>
        {/* Optional: Add a spinner component here */}
      </div>
    );
  }

  // --- Handle Error State ---
  if (isError) {
    return (
      <div className="text-destructive flex h-64 flex-col items-center justify-center p-4 text-center">
        <p className="mb-2 text-lg font-semibold">Error fetching books</p>
        <p className="text-sm">
          {error?.message || "An unknown error occurred."}
        </p>
      </div>
    );
  }

  // --- Handle Empty State ---
  if (!books || books.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center p-4">
        <p className="text-muted-foreground text-lg">No books found.</p>
      </div>
    );
  }

  // --- Render Book Grid (Success State) ---
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book: Book) => (
        <BookCard
          // Use a unique identifier if available (e.g., book.id),
          // otherwise fallback to title (ensure titles are unique enough)
          key={book.title}
          title={book.title}
          description={book.description}
          bookImage={book.imageUrl}
          // Construct the link dynamically. Assuming a detail route like /books/{bookId} or /books/{bookTitle}
          // Using title for now, ensure it's URL-safe. An ID would be better.
          bookLink={book.downloadLink} // Placeholder link
          categories={book.categories}
        />
      ))}
    </div>
  );
}
