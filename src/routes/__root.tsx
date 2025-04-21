import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
// Remove ThemeProvider import from here if it's now handled in main.tsx
// import { ThemeProvider } from "@/lib/theme-provider";
// Remove ThemeToggle import
// import { ThemeToggle } from "@/containers/theme-toggle";
import { AuthMenu } from "@/containers/auth-menu"; // Import the new AuthMenu
import { AuthProvider } from "@/auth/AuthContext"; // Import AuthProvider
import { ThemeProvider } from "@/lib/theme-provider"; // Keep ThemeProvider here if not in main.tsx

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Important: Wrap with AuthProvider *inside* ThemeProvider if AuthProvider
  // needs theme context, or wrap ThemeProvider with AuthProvider if ThemeProvider
  // needs auth context (less likely). Usually, AuthProvider goes outside or alongside.
  // Let's assume they are independent for now and wrap ThemeProvider first.
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        {" "}
        {/* AuthProvider now wraps the part needing auth state */}
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
                to="/books"
                className="hover:text-primary [&.active]:text-primary font-medium transition-colors [&.active]:font-bold"
              >
                Books
              </Link>
              {/* Add other nav links here */}
            </nav>
            <div className="flex items-center gap-2">
              {/* Replace ThemeToggle with AuthMenu */}
              <AuthMenu />
            </div>
          </header>
          <main className="flex-1">
            {" "}
            {/* Removed default padding here, add it in specific page routes if needed */}
            <Outlet /> {/* Page content renders here */}
          </main>
          {/* Optional Footer */}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
