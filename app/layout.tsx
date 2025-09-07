import type { Metadata } from "next";
import "@fontsource/inter";
import "./globals.css";
import "../src/styles/design-system.css";
import ConditionalHeader from "@/components/ConditionalHeader";

export const metadata: Metadata = {
  title: "AI Exam Platform",
  description: "Transform traditional exams into personalized assessments with AI-powered customization",
  keywords: "education, AI, exam, assessment, personalization, teaching",
  authors: [{ name: "AI Exam Platform Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );
}
