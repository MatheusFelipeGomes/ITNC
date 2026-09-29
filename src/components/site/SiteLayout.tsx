import type { ReactNode } from "react";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="surface-navy">
      <div className="container-page py-16 md:py-20">
        <p className="eyebrow text-primary-foreground/70">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold md:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base text-primary-foreground/80 md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="card-elevated rounded-xl p-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
