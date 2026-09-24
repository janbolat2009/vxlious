import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "vxlious | Private Academic Archive",
  description:
    "vxlious is a private educational archive for organized academic preparation. Verified access to authorized previous-year assessment materials and study resources.",
  keywords: [
    "vxlious",
    "academic archive",
    "previous year assessments",
    "study materials",
    "practice papers",
    "revision PDFs",
    "Kazakhstan education",
  ],
  authors: [{ name: "vxlious Academic Archive" }],
  openGraph: {
    title: "vxlious | Private Academic Archive",
    description: "Previous-year materials. Organized. Private. Accessible.",
    url: "https://vxlious.kz",
    siteName: "vxlious",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F7" },
    { media: "(prefers-color-scheme: dark)", color: "#08090B" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-primaryLight dark:text-text-primaryDark bg-ambient-mesh transition-colors duration-300`}>
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
