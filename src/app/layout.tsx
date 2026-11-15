import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/providers";
import { APP_CONFIG } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.name} — Power Outage & Load Shedding Management`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  applicationName: APP_CONFIG.name,
  keywords: [
    "Load Shedding",
    "Power Outage Management",
    "Electricity Grid Monitoring",
    "Substation & Feeder Schedules",
    "Outage Reporting",
    "Area Reliability Analytics",
    "GridWatch",
  ],
  authors: [{ name: "GridWatch Engineering Team" }],
  openGraph: {
    title: APP_CONFIG.fullName,
    description: APP_CONFIG.description,
    siteName: APP_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
