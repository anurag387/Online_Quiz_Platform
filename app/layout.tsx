import type { Metadata } from "next";
import "./globals.css";
import AppInit from "@/components/AppInit";

export const metadata: Metadata = {
  title: "Quizzy — Online Quiz & Exam Platform",
  description:
    "Create quizzes, generate join codes, run timed exams with anti-cheating protection, and publish results — all in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <AppInit />
        {children}
      </body>
    </html>
  );
}
