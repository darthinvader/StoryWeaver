// src/routes/books/index.tsx
import { useGetBooks } from "@/api/queries";
import type { Book } from "@/api/schemas"; // Import the Book type
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import Accordion components
// Import TooltipProvider - necessary for shadcn/ui tooltips to work
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookCard } from "@/containers/book-card"; // Assumes BookCard handles its own tooltips
import { createFileRoute } from "@tanstack/react-router";

// Define the major categories in the desired display order (Newest -> Older -> Advanced)
const ORDERED_MAJOR_CATEGORIES = [
  "coreRules", // Original core rules
  "5.5", // Newest rules
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
      const groupKey = majorCategory || "misc";

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(book);
      return acc;
    },
    {} as Record<string, Book[]>,
  );

  const displayOrder = [...ORDERED_MAJOR_CATEGORIES, "misc"];
  const categoriesWithBooks = displayOrder.filter(
    (key) => groupedBooks[key] && groupedBooks[key].length > 0,
  );

  // --- Render Collapsible Categories ---
  return (
    // Wrap the main content area with TooltipProvider
    <TooltipProvider delayDuration={300}>
      {" "}
      {/* Optional: Adjust delay */}
      <div className="p-4 md:p-6">
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
                  {getCategoryDisplayName(categoryKey)} (
                  {booksInCategory.length})
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
                        // --- TOOLTIP IMPLEMENTATION NOTE ---
                        // The actual tooltips for description and categories
                        // need to be implemented *inside* the BookCard component.
                        //
                        // Inside BookCard.tsx, you would:
                        // 1. Import Tooltip components from "@/components/ui/tooltip":
                        //    import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
                        //
                        // 2. For the description:
                        //    - Wrap the description text element (e.g., a <p> tag) with <TooltipTrigger>.
                        //    - You might want to truncate the visible description (e.g., using CSS line-clamp).
                        //    - Place the full description inside <TooltipContent>.
                        //    - Example:
                        //      <Tooltip>
                        //        <TooltipTrigger asChild>
                        //          <p className="line-clamp-3">{description}</p>
                        //        </TooltipTrigger>
                        //        <TooltipContent>
                        //          <p>{description}</p>
                        //        </TooltipContent>
                        //      </Tooltip>
                        //
                        // 3. For the categories:
                        //    - When mapping over the categories to display them (e.g., as badges),
                        //      wrap each category element (e.g., a <span> or <Badge>) with <Tooltip> and <TooltipTrigger>.
                        //    - Place the desired tooltip text (e.g., a fuller explanation of the category)
                        //      inside <TooltipContent>. You might need a helper function to get this text.
                        //    - Example (for one category badge):
                        //      <Tooltip>
                        //        <TooltipTrigger asChild>
                        //          <Badge variant="secondary">{category}</Badge>
                        //        </TooltipTrigger>
                        //        <TooltipContent>
                        //          <p>{getCategoryTooltipText(category)}</p> {/* Define this helper */}
                        //        </TooltipContent>
                        //      </Tooltip>
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </TooltipProvider>
  );
}
