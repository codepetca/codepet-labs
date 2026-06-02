import Link from "next/link";

import { HeaderUserArea } from "@/components/header-user-menu";
import { SiteHomeLink } from "@/components/site-home-link";

export function SiteHeader({ authReady }: { authReady: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <SiteHomeLink authReady={authReady} />

        <nav
          aria-label="Main navigation"
          className="-mx-1 flex min-w-0 items-center gap-1 text-sm"
        >
          <Link
            href="/about"
            className="inline-flex min-h-10 items-center rounded-md px-2.5 font-semibold text-muted transition hover:bg-card-soft hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/contributors"
            className="inline-flex min-h-10 items-center rounded-md px-2.5 font-semibold text-muted transition hover:bg-card-soft hover:text-foreground"
          >
            Contributors
          </Link>
          <HeaderUserArea authReady={authReady} />
        </nav>
      </div>
    </header>
  );
}
