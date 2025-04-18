// src/routes/books/index.tsx
import { useGetBooks } from "@/api/queries";
import type { Book } from "@/api/schemas"; // Import the Book type
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import Accordion components
import { BookCard } from "@/containers/Book-Card";
import { createFileRoute } from "@tanstack/react-router";

// Define the major categories in the desired display order (Newbie -> Advanced)
const ORDERED_MAJOR_CATEGORIES = [
  "coreRules", // Most essential
  "majorExpansionsPlayer", // Next step for players
  "adventureModules", // Essential for DMs running campaigns
  "majorExpansionsDM", // More DM resources (monsters, lore)
  "settingGuides", // Specific world exploration
  "supplementaryOfficial", // Smaller official additions
  "unearthedArcanaHomebrew", // Experimental/Unofficial
  "miscellaneousThirdParty", // Other systems, non-rulebooks, 3rd party
];

// Helper function to get a display-friendly name for the category
function getCategoryDisplayName(categoryKey: string): string {
  switch (categoryKey) {
    case "coreRules":
      return "Core Rules (Start Here!)";
    case "majorExpansionsPlayer":
      return "Player Expansions (More Options)";
    case "adventureModules":
      return "Adventure Modules (Ready-to-Play Stories)";
    case "majorExpansionsDM":
      return "DM Expansions (Monsters & Lore)";
    case "settingGuides":
      return "Setting Guides (Explore New Worlds)";
    case "supplementaryOfficial":
      return "Official Supplements (Extras)";
    case "unearthedArcanaHomebrew":
      return "Unearthed Arcana & Homebrew (Use with Caution)";
    case "miscellaneousThirdParty":
      return "Miscellaneous & Third Party";
    case "5.5E":
      return "5.5E (Experimental)"; // Added for clarity
    case "homebrew":
      return "Homebrew (Custom Content)"; // Added for clarity
    case "misc":
      return "Other Resources"; // Renamed for clarity
    default:
      return categoryKey
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
  }
}

export const Route = createFileRoute("/books/")({
  component: BooksPageComponent,
});

function BooksPageComponent() {
  const { data: books, isLoading, isError, error } = useGetBooks();

  // --- Handle Loading State ---
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-4">
        <p className="text-muted-foreground text-lg">Loading books...</p>
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

  // --- Group Books by Major Category ---
  const groupedBooks = books.reduce(
    (acc, book) => {
      const majorCategory = book.categories?.find((cat) =>
        ORDERED_MAJOR_CATEGORIES.includes(cat),
      );
      const groupKey = majorCategory || "misc"; // Assign to 'misc' if no major category found

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(book);
      return acc;
    },
    {} as Record<string, Book[]>,
  );

  // Define the final order, including 'misc' at the end
  const displayOrder = [...ORDERED_MAJOR_CATEGORIES, "misc"];

  // Get keys of categories that actually have books, maintaining the desired order
  const categoriesWithBooks = displayOrder.filter(
    (key) => groupedBooks[key] && groupedBooks[key].length > 0,
  );

  // --- Render Collapsible Categories ---
  return (
    <div className="p-4 md:p-6">
      <Accordion
        type="multiple" // Allow multiple sections open
        // Default to opening the first few categories (e.g., Core Rules, Player Expansions)
        defaultValue={[
          "coreRules",
          "majorExpansionsPlayer",
          "adventureModules",
        ].filter((key) => categoriesWithBooks.includes(key))} // Only default open if they exist
        className="w-full space-y-4"
      >
        {categoriesWithBooks.map((categoryKey) => {
          const booksInCategory = groupedBooks[categoryKey];
          // We already filtered, so booksInCategory should always exist and have items
          // if ( !booksInCategory || booksInCategory.length === 0) return null; // Redundant check now

          return (
            <AccordionItem value={categoryKey} key={categoryKey}>
              <AccordionTrigger className="bg-muted hover:bg-muted/90 rounded-md px-4 py-3 text-xl font-medium md:text-2xl">
                {getCategoryDisplayName(categoryKey)} ({booksInCategory.length})
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {" "}
                {/* Add padding top to content */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {booksInCategory.map((book: Book) => (
                    <BookCard
                      key={book.title} // Use title as key (ensure uniqueness or use an ID if available)
                      title={book.title}
                      description={book.description}
                      bookImage={book.imageUrl}
                      bookLink={book.downloadLink}
                      categories={book.categories}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
