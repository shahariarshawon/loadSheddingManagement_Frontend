import Link from "next/link";
import { Zap, ExternalLink, ShieldCheck, Activity, PhoneCall } from "lucide-react";
import { APP_CONFIG, ROUTES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-base font-bold tracking-tight text-foreground">
                {APP_CONFIG.name}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Official load-shedding scheduling and power outage management platform. Providing transparent, real-time grid telemetry for residential and commercial consumers.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Verified Enterprise Grid Architecture</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Grid Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={ROUTES.SCHEDULES} className="text-muted-foreground hover:text-foreground transition-colors">
                  Live Outage Schedules
                </Link>
              </li>
              <li>
                <Link href={ROUTES.NETWORK} className="text-muted-foreground hover:text-foreground transition-colors">
                  Distribution Network Hierarchy
                </Link>
              </li>
              <li>
                <Link href={ROUTES.LOGIN} className="text-muted-foreground hover:text-foreground transition-colors">
                  Submit Blackout Report
                </Link>
              </li>
              <li>
                <Link href={ROUTES.CUSTOMER_ANALYTICS} className="text-muted-foreground hover:text-foreground transition-colors">
                  Area Reliability Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Grid Operations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Infrastructure
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Dhaka North Zone (Gulshan / Banani)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Dhaka South Zone (Dhanmondi / Motijheel)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>132/33kV Grid Substations</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>Residential & Commercial Feeders</span>
              </li>
            </ul>
          </div>

          {/* Support & Health */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              System Telemetry
            </h4>
            <div className="rounded-lg border border-border bg-card p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">API Status:</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Activity className="h-3 w-3" />
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Database:</span>
                <span className="font-medium text-foreground">PostgreSQL</span>
              </div>
              <a
                href={APP_CONFIG.swaggerDocsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between pt-1 text-primary hover:underline"
              >
                <span>Swagger Documentation</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <PhoneCall className="h-3.5 w-3.5 text-amber-500" />
              <span>Emergency Grid Hotline: 16120</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {APP_CONFIG.year} {APP_CONFIG.name}. Built for B7A7 Fullstack Power Management Project.
          </p>
          <div className="flex items-center gap-4">
            <Link href={ROUTES.ABOUT} className="hover:text-foreground transition-colors">
              About
            </Link>
            <span>•</span>
            <Link href={ROUTES.CONTACT} className="hover:text-foreground transition-colors">
              Support
            </Link>
            <span>•</span>
            <a
              href={APP_CONFIG.healthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <span>API Health</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
