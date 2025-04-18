// src/containers/Book-Card.tsx
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter, // Not currently used, can be removed if not needed
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Import Tooltip components
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  // TooltipProvider, // Provider should wrap the page/app, not individual cards
} from "@/components/ui/tooltip";

interface BookCardProps {
  title: string;
  description: string;
  bookLink: string;
  bookImage: string;
  categories?: string[]; // Make categories optional prop
}

// Optional: Helper function for category display names/tooltips if needed later
// function getCategoryTooltipText(categoryKey: string): string {
//   // Add logic here to return more descriptive text based on the category key
//   return `Information about ${categoryKey}`;
// }

export const BookCard = ({
  title,
  description,
  bookLink,
  bookImage,
  categories = [], // Default to empty array if undefined
}: BookCardProps) => {
  // console.log("BookCard bookLink:", bookLink); // Keep for debugging if needed

  const MAX_VISIBLE_CATEGORIES = 3; // Adjust how many categories to show directly

  return (
    // The TooltipProvider should wrap the parent component (BooksPageComponent)
    // <TooltipProvider> // <-- No provider needed here if parent has one
    <a
      href={bookLink}
      target="_blank"
      className="group block"
      rel="noopener noreferrer"
      aria-label={`View details for ${title}`} // Accessibility improvement
    >
      <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-200 group-hover:shadow-lg">
        <CardHeader className="p-4 pb-0 md:p-5 md:pb-0">
          {" "}
          {/* Adjust padding */}
          <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
          <div className="my-3 aspect-[210/297] overflow-hidden rounded-md">
            {" "}
            {/* Container for image */}
            <img
              src={bookImage}
              alt={`Cover of ${title}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" // Add subtle zoom on hover
              loading="lazy"
              width="210" // Add dimensions for performance/layout stability
              height="297"
            />
          </div>
          {/* --- Description Tooltip --- */}
          <Tooltip>
            <TooltipTrigger asChild>
              {/* Apply line-clamp here for truncation */}
              <CardDescription className="line-clamp-3 cursor-help text-sm md:text-base">
                {description || <span className="italic">No description</span>}
              </CardDescription>
            </TooltipTrigger>
            {/* Show full description only if it's provided */}
            {description && (
              <TooltipContent
                side="bottom"
                className="bg-popover text-popover-foreground max-w-[300px]"
              >
                <p>{description}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </CardHeader>
        {/* Place categories in CardContent for better spacing control */}
        <CardContent className="flex flex-grow flex-col justify-end p-4 pt-2 md:p-5 md:pt-3">
          {/* --- Categories Tooltip --- */}
          {categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {/* Visible Categories */}
              {categories.slice(0, MAX_VISIBLE_CATEGORIES).map((category) => (
                <Tooltip key={category}>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="cursor-default">
                      {category}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground">
                    {/* Use a helper function here if you want more descriptive tooltips */}
                    <p>{category}</p>
                    {/* <p>{getCategoryTooltipText(category)}</p> */}
                  </TooltipContent>
                </Tooltip>
              ))}
              {/* Hidden Categories Indicator */}
              {categories.length > MAX_VISIBLE_CATEGORIES && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="cursor-default">
                      +{categories.length - MAX_VISIBLE_CATEGORIES} more
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground max-w-[250px]">
                    <p className="font-medium">Additional Categories:</p>
                    <ul className="list-disc pl-4">
                      {categories
                        .slice(MAX_VISIBLE_CATEGORIES)
                        .map((category) => (
                          <li key={category}>{category}</li>
                        ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </CardContent>
        {/* CardFooter could be added here if needed for actions like buttons */}
        {/* <CardFooter className="p-4 pt-0 md:p-5 md:pt-0">...</CardFooter> */}
      </Card>
    </a>
    // </TooltipProvider>
  );
};

// --- Usage in BooksPage remains the same: ---
// <BookCard
//   key={book.title} // Or preferably book.id if available
//   title={book.title}
//   description={book.description || ""} // Pass empty string if null/undefined
//   bookImage={book.imageUrl}
//   bookLink={book.downloadLink} // Ensure this is the correct prop name
//   categories={book.categories}
// />
