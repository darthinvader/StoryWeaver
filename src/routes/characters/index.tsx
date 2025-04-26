// src/routes/characters/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/characters/")({
  component: CharactersPage,
});

function CharactersPage() {
  return <div></div>;
}
