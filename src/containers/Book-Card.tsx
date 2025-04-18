// Enhanced BookCard component

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent, // Add CardContent back if needed for badges
  CardDescription,
  CardFooter, // Add CardFooter back if needed for badges
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BookCardProps {
  title: string;
  description: string;
  bookLink: string;
  bookImage: string;
  categories?: string[]; // Make categories optional prop
}

export const BookCard = ({
  title,
  description,
  bookLink,
  bookImage,
  categories = [],
}: BookCardProps) => {
  console.log("BookCard bookLink:", bookLink); // Debugging line
  return (
    <a
      href={bookLink}
      target="_blank"
      className="group block"
      rel="noopener noreferrer"
    >
      <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-200 group-hover:shadow-lg">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl lg:text-2xl">
            {title}
          </CardTitle>
          <div className="my-3 md:my-4 lg:my-5">
            <img
              src={bookImage}
              alt={`Cover of ${title}`}
              className="aspect-[210/297] w-full rounded-md object-cover"
              loading="lazy"
            />
          </div>
          <CardDescription className="line-clamp-3 text-sm md:line-clamp-4 md:text-base">
            {description || <span className="italic">No description</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-4 pt-0 md:p-6 md:pt-0">
          {categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {categories.slice(0, 5).map(
                (
                  category, // Limit displayed badges
                ) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ),
              )}
              {categories.length > 5 && (
                <Badge variant="outline">+{categories.length - 5}</Badge>
              )}
            </div>
          )}
        </CardContent>

        {/* Empty Footer to ensure consistent spacing if CardContent pushes it */}
        <CardFooter className="p-4 md:p-6"></CardFooter>
      </Card>
    </a>
  );
};

// --- Usage in BooksPage would now include: ---
// <BookCard
//   key={book.title}
//   title={book.title}
//   description={book.description || "No description available."}
//   bookImage={book.imageUrl}
//   bookLink={bookRoute}
//   categories={book.categories} // Pass categories
// />
