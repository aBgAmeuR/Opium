import { Button } from "@opium/ui/components/button";
import { Particles } from "@opium/ui/components/particles";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";
import { Icon } from "@/components/icons";
import { MagicLinkForm } from "@/components/magic-link-form";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative w-full md:h-screen md:overflow-hidden">
      <Particles
        className="absolute inset-0"
        color="#666666"
        ease={20}
        quantity={120}
      />
      <div
        aria-hidden
        className="-z-10 absolute inset-0 isolate opacity-50 contain-strict dark:opacity-100"
      >
        <div className="-translate-y-87.5 -rotate-45 absolute top-0 left-0 h-320 w-140 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
        <div className="-rotate-45 absolute top-0 left-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="-translate-y-87.5 -rotate-45 absolute top-0 left-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4">
        <Button
          className="absolute top-4 left-4"
          render={<Link to="/" />}
          variant="ghost"
        >
          <ChevronLeftIcon />
          Home
        </Button>

        <div className="mx-auto max-w-72 space-y-4 sm:w-sm">
          <Icon.Wordmark className="h-5" />
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-2xl tracking-wide">Welcome Back</h1>
            <p className="text-base text-muted-foreground">
              Sign in or create an account.
            </p>
          </div>
          <div className="space-y-2">
            <MagicLinkForm />
          </div>
          <p className="mt-8 text-muted-foreground text-sm">
            By clicking continue, you agree to our{" "}
            <a
              className="underline underline-offset-4 hover:text-primary"
              href="#"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              className="underline underline-offset-4 hover:text-primary"
              href="#"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
