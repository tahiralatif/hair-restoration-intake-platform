import type { Metadata } from "next";
import "./globals.css";
import { AssessmentProvider } from "@/lib/contexts/AssessmentContext";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Hair Restoration Assessment Platform",
  description: "Complete your hair restoration assessment and get personalized recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AssessmentProvider>
          <Navbar />
          {children}
        </AssessmentProvider>
      </body>
    </html>
  );
}
