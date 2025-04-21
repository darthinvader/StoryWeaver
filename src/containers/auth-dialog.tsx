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

type AuthMode = "login" | "register";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: AuthMode;
}

export function AuthDialog({
  open,
  onOpenChange,
  initialMode = "login",
}: AuthDialogProps) {
  const [mode, setMode] = React.useState<AuthMode>(initialMode);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setMode(initialMode);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFormError(null);
    }
  }, [open, initialMode]);

  const mutationOptions = {
    onError: (err: Error) => setFormError(err.message),
    onSuccess: () => onOpenChange(false),
  };

  const loginMutation = useMutation({
    mutationFn: () => signInUser({ email, password }),
    ...mutationOptions,
  });

  const registerMutation = useMutation({
    mutationFn: () => signUpUser({ email, password }),
    ...mutationOptions,
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

  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const isLoginMode = mode === "login";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLoginMode ? "Sign In" : "Register"}</DialogTitle>
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
              autoComplete={isLoginMode ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {!isLoginMode && (
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
          <DialogFooter>
            <div className="flex w-full flex-col justify-between gap-2 sm:gap-4 md:flex-row">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading
                  ? "Please wait…"
                  : isLoginMode
                    ? "Sign In"
                    : "Register"}
              </Button>
              <Button
                variant="link"
                className="text-muted-foreground text-sm"
                type="button"
                disabled={isLoading}
                onClick={() => setMode(isLoginMode ? "register" : "login")}
              >
                {isLoginMode
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
