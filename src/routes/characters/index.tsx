// src/routes/characters/index.tsx
import { BasicLayout } from "@/containers/grid/tile-container";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/characters/")({
  component: CharactersPage,
});

function CharactersPage() {
  const layout = [
    { i: "0", x: 0, y: 0, w: 1, h: 2 },
    { i: "1", x: 2, y: 0, w: 2, h: 1 },
    { i: "2", x: 4, y: 0, w: 2, h: 2 },
    { i: "3", x: 6, y: 0, w: 1, h: 1 },
    { i: "4", x: 8, y: 0, w: 2, h: 2 },
  ];
  return (
    <div className="h-full w-full">
      <BasicLayout layout={layout}>
        {["hgi", <div>Hello</div>, "hello", "hasjadh"]}
      </BasicLayout>
    </div>
  );
}
