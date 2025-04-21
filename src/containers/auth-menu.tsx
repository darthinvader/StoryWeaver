import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthContext";
import { signOutUser } from "@/auth/authService";
import { AuthDialog } from "@/containers/auth-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

export function AuthMenu() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const signOutMutation = useMutation({
    mutationFn: () => signOutUser(),
    onSuccess: () => navigate({ to: "/" }),
    onError: (err) => console.error(err),
  });

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        …
      </Button>
    );
  }

  // FIX: Check user?.email
  const initials = user?.email
    ? user.email
        .split("@")[0]
        .split(/[\s._-]+/)
        .map((w) => w[0].toUpperCase())
        .slice(0, 2)
        .join("")
    : "";

  return (
    <>
      <AuthDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {user ? (
            <Button variant="ghost" size="icon" className="rounded-full">
              {initials}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDialogOpen(true)}
            >
              <LogIn className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            {user?.email ? `Signed in as ${user.email.split("@")[0]}` : "Guest"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user ? (
            <DropdownMenuItem
              onSelect={() => signOutMutation.mutate()}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onSelect={() => setDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign In / Register
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
