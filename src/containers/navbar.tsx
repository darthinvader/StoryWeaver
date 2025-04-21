import { Link } from "@tanstack/react-router";
import { AuthMenu } from "@/containers/auth-menu";

export function NavBar() {
  const navLinks: Array<{ to: string; label: string }> = [
    { to: "/", label: "Home" },
    { to: "/books", label: "Books" },
    // …add more links here
  ];

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex h-14 items-center justify-between border-b px-4 backdrop-blur md:px-6">
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="text-foreground hover:text-primary transition-colors"
            activeProps={{ className: "text-primary font-bold" }}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <AuthMenu />
      </div>
    </header>
  );
}
