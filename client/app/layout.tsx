import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TailwindIndicator } from "@/components/ui/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import SupabaseProvider from "@/lib/providers/supabase-provider";
import { FormProvider } from "@/lib/providers/form-provider";

import "./globals.css";

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
          <FormProvider>
            <ThemeProvider attribute="class" defaultTheme="light">
              {children}
              <Toaster />
              <TailwindIndicator />
              <SpeedInsights />
            </ThemeProvider>
          </FormProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
