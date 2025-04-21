import { useState, useMemo } from "react";
import { useGetBooks } from "@/api/queries";
import type { Book } from "@/api/schemas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookCard } from "@/containers/book-card";
import { createFileRoute } from "@tanstack/react-router";

// --- Major categories in display order ---
const ORDERED_MAJOR_CATEGORIES = [
  "coreRules",
  "5.5",
  "majorExpansionsPlayer",
  "adventureModules",
  "majorExpansionsDM",
  "settingGuides",
  "supplementaryOfficial",
  "unearthedArcanaHomebrew",
  "miscellaneousThirdParty",
];

// --- Display names for categories ---
function getCategoryDisplayName(categoryKey: string): string {
  switch (categoryKey) {
    case "5.5":
      return "Revised 2024 Rules (5.5E) Ask Your DM!";
    case "coreRules":
      return "Core Rules (5E - Start Here!)";
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
    default:
      return categoryKey
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
  }
}

// --- Get a book's major category ---
function getBookMajorCategory(book: Book): string {
  return (
    book.categories?.find((cat) => ORDERED_MAJOR_CATEGORIES.includes(cat)) ||
    "misc"
  );
}

export const Route = createFileRoute("/books/")({
  component: BooksPageComponent,
});

function BooksPageComponent() {
  const { data: books, isLoading, isError, error } = useGetBooks();
  const [search, setSearch] = useState("");

  // Always call hooks, even if data is not ready yet!
  const filteredBooks = useMemo(() => {
    if (!books) return [];
    if (!search.trim()) return books;
    const term = search.trim().toLowerCase();
    return books.filter((book) => {
      if (book.title?.toLowerCase().includes(term)) return true;
      if (book.categories?.some((cat) => cat.toLowerCase().includes(term)))
        return true;
      const majorCat = getBookMajorCategory(book);
      if (
        majorCat.toLowerCase().includes(term) ||
        getCategoryDisplayName(majorCat).toLowerCase().includes(term)
      )
        return true;
      return false;
    });
  }, [books, search]);

  const groupedBooks = useMemo(() => {
    return filteredBooks.reduce(
      (acc, book) => {
        const majorCategory = getBookMajorCategory(book);
        if (!acc[majorCategory]) {
          acc[majorCategory] = [];
        }
        acc[majorCategory].push(book);
        return acc;
      },
      {} as Record<string, Book[]>,
    );
  }, [filteredBooks]);

  const displayOrder = [...ORDERED_MAJOR_CATEGORIES, "misc"];
  const categoriesWithBooks = displayOrder.filter(
    (key) => groupedBooks[key] && groupedBooks[key].length > 0,
  );

  // Now, do conditional rendering using variables, not early returns!
  let content: React.ReactNode = null;

  if (isLoading) {
    content = (
      <div className="flex h-64 items-center justify-center p-4">
        <p className="text-muted-foreground text-lg">Loading books...</p>
      </div>
    );
  } else if (isError) {
    content = (
      <div className="text-destructive flex h-64 flex-col items-center justify-center p-4 text-center">
        <p className="mb-2 text-lg font-semibold">Error fetching books</p>
        <p className="text-sm">
          {error?.message || "An unknown error occurred."}
        </p>
      </div>
    );
  } else if (!books || books.length === 0) {
    content = (
      <div className="flex h-64 items-center justify-center p-4">
        <p className="text-muted-foreground text-lg">No books found.</p>
      </div>
    );
  } else if (filteredBooks.length === 0) {
    content = (
      <div className="flex h-32 items-center justify-center">
        <p className="text-muted-foreground text-lg">
          No books match your search.
        </p>
      </div>
    );
  } else {
    content = (
      <Accordion
        type="multiple"
        defaultValue={["5.5", "coreRules", "majorExpansionsPlayer"].filter(
          (key) => categoriesWithBooks.includes(key),
        )}
        className="w-full space-y-4"
      >
        {categoriesWithBooks.map((categoryKey) => {
          const booksInCategory = groupedBooks[categoryKey];
          return (
            <AccordionItem value={categoryKey} key={categoryKey}>
              <AccordionTrigger className="bg-muted hover:bg-muted/90 rounded-md px-4 py-3 text-xl font-medium md:text-2xl">
                {getCategoryDisplayName(categoryKey)} ({booksInCategory.length})
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {booksInCategory.map((book: Book) => (
                    <BookCard
                      key={book.title}
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
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="p-4 md:p-6">
        {/* --- Search Bar --- */}
        <div className="mb-6 flex w-full max-w-lg items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="border-input bg-background focus:border-primary focus:ring-primary w-full rounded-md border px-3 py-2 text-base shadow-sm focus:ring-1 focus:outline-none"
            aria-label="Search books"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-muted-foreground hover:bg-muted ml-1 rounded px-2 py-1 text-sm"
              aria-label="Clear search"
              type="button"
            >
              ×
            </button>
          )}
        </div>
        {content}
      </div>
    </TooltipProvider>
  );
}
