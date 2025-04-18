import { BookCard } from "@/containers/Book-Card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/books/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <BookCard
        title="Hello"
        description="lorem ipsum blah blah more talk here to pad the length of this text"
        bookLink="/books/1"
        bookImage="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJvb2slMjBpbWFnZXxlbnwwfHx8fDE2OTI3NTY5NzM&ixlib=rb-4.0.3&q=80&w=400"
      />
    </div>
  );
}
