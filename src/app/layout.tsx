import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Markdown to Card",
  description: "Convert your Markdown to beautiful knowledge cards and social media images",
  keywords: ["markdown", "card", "social media", "image generator", "knowledge cards"],
  authors: [{ name: "Diana Tang" }],
  openGraph: {
    title: "Markdown to Card",
    description: "Convert your Markdown to beautiful knowledge cards and social media images",
    type: "website",
    url: "https://markdown-card-creator.vercel.app",
    siteName: "Markdown to Card",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown to Card",
    description: "Convert your Markdown to beautiful knowledge cards and social media images",
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <ClientBody>
        {children}
      </ClientBody>
    </html>
  );
}
