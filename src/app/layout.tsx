import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ESOL Learning Platform - AI-Powered English Learning",
  description: "Master English with AI-powered learning platform. CEFR-aligned practice (A1-C2), NZCEL exam prep, real-time speaking coach, and adaptive learning for ESOL students.",
  icons: {
    icon: "/images/brand/nzcel-prep-logo.svg",
    shortcut: "/images/brand/nzcel-prep-logo.svg",
    apple: "/images/brand/nzcel-prep-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Providers>
              {children}
            </Providers>
            <Toaster />
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
