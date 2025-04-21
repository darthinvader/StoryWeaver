// src/containers/auth-menu.tsx
import { useState, useCallback } from "react";
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

type AuthMode = "login" | "register";

export function AuthMenu() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initialDialogMode, setInitialDialogMode] = useState<AuthMode>("login");

  const signOutMutation = useMutation({
    mutationFn: signOutUser,
    onSuccess: () => navigate({ to: "/" }),
    onError: (err) => console.error("Sign out error:", err),
  });

  const handleOpenDialog = useCallback((mode: AuthMode = "login") => {
    setInitialDialogMode(mode);
    setDialogOpen(true);
  }, []);

  const handleDialogChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setInitialDialogMode("login"); // Reset mode on close
    }
  }, []);

  const handleDoubleClickLogin = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault(); // Prevent potential single-click triggers
      handleOpenDialog("login");
    },
    [handleOpenDialog],
  );

  const getUserInitials = (email: string | undefined): string => {
    if (!email) return "";
    const namePart = email.split("@")[0];
    // Improved split to handle more cases like 'john.doe' or 'jane_doe'
    const parts = namePart.split(/[\s._-]+/);
    return parts
      .map((part) => part[0]?.toUpperCase() ?? "")
      .filter(Boolean) // Ensure we don't join empty strings
      .slice(0, 2)
      .join("");
  };

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled aria-label="Loading user">
        …
      </Button>
    );
  }

  const initials = getUserInitials(user?.email);
  const userDisplayName = user?.email ? user.email.split("@")[0] : "Guest";

  return (
    <>
      <AuthDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        initialMode={initialDialogMode}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {user ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label={`User menu for ${userDisplayName}`}
            >
              {initials}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onDoubleClick={handleDoubleClickLogin}
              aria-label="Sign in or register"
              // onClick is implicitly handled by DropdownMenuTrigger for single click
            >
              <LogIn className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Signed in as {userDisplayName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user ? (
            <DropdownMenuItem
              onSelect={() => signOutMutation.mutate()}
              className="flex cursor-pointer items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onSelect={() => handleOpenDialog("login")}
              className="flex cursor-pointer items-center gap-2"
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
