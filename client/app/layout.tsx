import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TailwindIndicator } from "@/components/ui/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";
import SupabaseProvider from "./supabase-provider";

export const metadata: Metadata = {
  title: "Entropy AI",
  description:
    "Imagine your favourite characters. Effortlessly generate diverse and dynamic character images tailored to your story",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Toaster />
            <TailwindIndicator />
            <SpeedInsights />
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
