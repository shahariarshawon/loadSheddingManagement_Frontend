import { Zap } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6 flex items-center justify-center">
        {/* Outer pulsating energy ring */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <Zap className="h-7 w-7 animate-pulse text-amber-300" />
        </div>
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        Loading GridWatch System
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Connecting to power distribution nodes and fetching real-time grid data...
      </p>

      {/* Modern animated progress bar */}
      <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-full origin-left animate-pulse bg-primary" />
      </div>
    </div>
  );
}
