import Link from "next/link";
import { Unplug, Home, CalendarSearch } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/80 shadow-xl text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <Unplug className="h-8 w-8" />
          </div>
          <div className="text-4xl font-extrabold tracking-tight text-primary font-mono mb-1">
            404
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">
            Distribution Node Not Found
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            The requested page or power grid endpoint is disconnected or does not exist on this network.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <p className="text-xs text-muted-foreground">
            Please verify the URL or navigate back to the main GridWatch portal to view active schedules.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Link
            href={ROUTES.HOME}
            className={cn(buttonVariants({ variant: "default" }), "w-full gap-2 font-medium")}
          >
            <Home className="h-4 w-4" />
            Main Portal
          </Link>

          <Link
            href={ROUTES.SCHEDULES}
            className={cn(buttonVariants({ variant: "outline" }), "w-full gap-2 font-medium")}
          >
            <CalendarSearch className="h-4 w-4" />
            Live Schedules
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
