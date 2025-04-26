import SimpleGridExample from "@/containers/gridstack/simple";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/characters/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
