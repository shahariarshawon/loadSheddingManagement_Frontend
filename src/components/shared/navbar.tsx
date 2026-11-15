"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Menu, Radio } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { APP_CONFIG, ROUTES } from "@/lib/constants";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { title: "Home", href: ROUTES.HOME },
  { title: "Live Schedules", href: ROUTES.SCHEDULES },
  { title: "Distribution Network", href: ROUTES.NETWORK },
  { title: "About", href: ROUTES.ABOUT },
  { title: "Contact", href: ROUTES.CONTACT },
];

export function Navbar() {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen } = useUiStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Zap className="h-5 w-5 fill-amber-400 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
              {APP_CONFIG.name}
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-mono font-medium">
                v1.0
              </Badge>
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider -mt-1 hidden sm:inline-block">
              Power Management
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions & Live Grid Status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Radio className="h-3 w-3 animate-pulse text-emerald-500" />
            <span>Grid Online</span>
          </div>

          <div className="h-4 w-[1px] bg-border" />

          <Link
            href={ROUTES.LOGIN}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "font-medium text-sm")}
          >
            Log In
          </Link>

          <Link
            href={ROUTES.REGISTER}
            className={cn(buttonVariants({ size: "sm" }), "font-medium text-sm shadow-sm")}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9 cursor-pointer"
              )}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 flex flex-col justify-between">
              <div>
                <SheetHeader className="text-left pb-4 border-b">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Zap className="h-5 w-5 fill-amber-400 text-amber-400" />
                    </div>
                    <SheetTitle className="text-base font-bold">{APP_CONFIG.name}</SheetTitle>
                  </div>
                </SheetHeader>

                <div className="flex items-center gap-2 my-4 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
                  <span>Neon Grid Telemetry Active</span>
                </div>

                <nav className="flex flex-col gap-1.5 mt-2">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-secondary text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        )}
                      >
                        {link.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t flex flex-col gap-2">
                <Link
                  href={ROUTES.LOGIN}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}
                >
                  Sign In
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(buttonVariants({ variant: "default" }), "w-full justify-center")}
                >
                  Create Citizen Account
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
