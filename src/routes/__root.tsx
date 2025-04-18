import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="w-100vw h-100vh">
      <div className="flex gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/books" className="[&.active]:font-bold">
          Books
        </Link>
      </div>
      <hr />
      <Outlet />
    </div>
  ),
});
