import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names safely with tailwind-merge and clsx.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format ISO datetime string into human readable display string.
 */
export function formatDateTime(isoString?: string | Date | null): string {
  if (!isoString) return "N/A";
  const date = typeof isoString === "string" ? new Date(isoString) : isoString;
  if (isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Format minutes into hours and minutes representation.
 */
export function formatDurationMinutes(minutes?: number | null): string {
  if (minutes === undefined || minutes === null) return "N/A";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}
