// src/routes/__root.tsx
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "@/containers/theme-provider"; // Adjust path
import { ThemeToggle } from "@/containers/theme-toggle"; // Adjust path

export const Route = createRootRoute({
  component: RootComponent, // Use a separate component function
});

function RootComponent() {
  return (
    // Wrap the entire layout content with ThemeProvider
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {/* Apply base background/text using Tailwind classes that use your CSS vars */}
      {/* The ThemeProvider will ensure the correct vars are active */}
      <div className="bg-background text-foreground flex min-h-screen w-full flex-col">
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b px-4 backdrop-blur md:px-6">
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            <Link
              to="/"
              className="hover:text-primary [&.active]:text-primary font-medium transition-colors [&.active]:font-bold"
            >
              Home
            </Link>
            <Link
              to="/books" // Assuming you have this route defined elsewhere
              className="hover:text-primary [&.active]:text-primary font-medium transition-colors [&.active]:font-bold"
            >
              Books
            </Link>
            {/* Add other nav links here */}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Other header items like user profile */}
          </div>
        </header>
        {/* Apply padding or other layout styles as needed */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet /> {/* Page content renders here */}
        </main>
        {/* Optional Footer */}
        {/* <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          © 2025 Your App
        </footer> */}
      </div>
    </ThemeProvider>
  );
}
