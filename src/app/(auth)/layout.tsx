import type React from "react";
import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { APP_CONFIG, ROUTES } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-muted/20">
      {/* Background Subtle Gradient & Grid Pattern */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-background pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-border/40 bg-background/60 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Zap className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground leading-none">
              {APP_CONFIG.name}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
              Power Telemetry
            </span>
          </div>
        </Link>

        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Form Center Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        <p>
          &copy; {APP_CONFIG.year} {APP_CONFIG.fullName}. Secure Authentication Gateway.
        </p>
      </footer>
    </div>
  );
}
