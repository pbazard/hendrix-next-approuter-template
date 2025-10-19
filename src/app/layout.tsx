import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AmplifyProvider from "./components/AmplifyProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./components/AuthProvider";
import ConditionalLayout from "./components/ConditionalLayout";
import ToastProvider from "./components/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hendrix - Modern Web Application",
  description:
    "A modern web application built with Next.js, Tailwind CSS, and AWS Amplify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AmplifyProvider>
          <AuthProvider>
            <ThemeProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
              <ToastProvider />
            </ThemeProvider>
          </AuthProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}
