import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { signInUser, signUpUser } from "@/auth/authService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: () => signInUser({ email, password }),
    onError: (err: any) => setFormError(err.message),
    onSuccess: () => onOpenChange(false),
  });

  const registerMutation = useMutation({
    mutationFn: () => signUpUser({ email, password }),
    onError: (err: any) => setFormError(err.message),
    onSuccess: () => onOpenChange(false),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (mode === "register" && password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (mode === "login") {
      loginMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };

  // TanStack Query v5: use status or pending
  const isLoading =
    loginMutation.status === "pending" || registerMutation.status === "pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Sign In" : "Register"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {mode === "register" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}
          {formError && <p className="text-destructive text-sm">{formError}</p>}
          {/* 
            DialogFooter from your Dialog uses:
            "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
            This means:
              - On mobile: vertical, main button on bottom
              - On desktop: horizontal, main button on right
          */}
          <DialogFooter>
            <div className="flex w-full flex-col justify-between gap-2 sm:gap-4 md:flex-row">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading
                  ? "Please wait…"
                  : mode === "login"
                    ? "Sign In"
                    : "Register"}
              </Button>
              <Button
                variant="link"
                className="text-muted-foreground text-sm"
                type="button"
                disabled={isLoading}
                onClick={() =>
                  setMode((m) => (m === "login" ? "register" : "login"))
                }
              >
                {mode === "login"
                  ? "Need an account? Register"
                  : "Already have one? Sign In"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
