import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NavBar } from "@/containers/navbar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Important: Wrap with AuthProvider *inside* ThemeProvider if AuthProvider
  // needs theme context, or wrap ThemeProvider with AuthProvider if ThemeProvider
  // needs auth context (less likely). Usually, AuthProvider goes outside or alongside.
  // Let's assume they are independent for now and wrap ThemeProvider first.
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
