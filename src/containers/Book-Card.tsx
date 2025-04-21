// src/containers/Book-Card.tsx
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BookCardProps {
  title: string;
  description: string;
  bookLink: string;
  bookImage: string;
  categories?: string[];
}

export const BookCard = ({
  title,
  description,
  bookLink,
  bookImage,
  categories = [],
}: BookCardProps) => {
  const MAX_VISIBLE_CATEGORIES = 3;

  return (
    <a
      href={bookLink}
      target="_blank"
      className="group block"
      rel="noopener noreferrer"
      aria-label={`View details for ${title}`}
    >
      <Card className="flex h-full flex-col gap-2 overflow-hidden py-2 transition-shadow duration-200 group-hover:shadow-lg">
        <CardHeader className="p-3 pb-0 md:p-4 md:pb-0">
          <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
          <div className="my-2 aspect-[210/297] overflow-hidden rounded-md">
            <img
              src={bookImage}
              alt={`Cover of ${title}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              width="210"
              height="297"
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardDescription className="line-clamp-3 cursor-help text-sm md:text-base">
                {description || <span className="italic">No description</span>}
              </CardDescription>
            </TooltipTrigger>
            {description && (
              <TooltipContent
                side="bottom"
                sideOffset={10}
                className="bg-popover text-popover-foreground z-50 max-w-[300px] rounded-md p-4 text-base shadow-lg"
              >
                <p>{description}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col justify-end p-3 pt-1 md:p-4 md:pt-2">
          {categories.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {categories.slice(0, MAX_VISIBLE_CATEGORIES).map((category) => (
                <Tooltip key={category}>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="cursor-default">
                      {category}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={8}
                    className="bg-popover text-popover-foreground z-50 rounded-md p-3 text-sm shadow-lg"
                  >
                    <p>{category}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {categories.length > MAX_VISIBLE_CATEGORIES && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="cursor-default">
                      +{categories.length - MAX_VISIBLE_CATEGORIES} more
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={8}
                    className="bg-popover text-popover-foreground z-50 max-w-[250px] rounded-md p-4 text-base shadow-lg"
                  >
                    <p className="mb-2 font-medium">Additional Categories:</p>
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
      </Card>
    </a>
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
