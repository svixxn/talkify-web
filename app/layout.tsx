import "./globals.css";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/components/shared/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
import { Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Talkify - Welcome",
  description:
    "Talkify is a chat application that connects people through conversations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head />
      <body
        className={cn(
          "bg-background min-h-full font-sans antialiased mx-auto",
          fontSans.variable
        )}
      >
        <Toaster />
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
