"use client";

import { Zap, ArrowRight, BookOpen, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "./components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center transition-colors relative">
      {/* Floating theme toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 backdrop-blur-md"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>

      <div className="text-center space-y-8 p-8 max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center">
          <Card className="w-32 h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl border-0">
            <Zap className="w-16 h-16 text-white" />
          </Card>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">
            Welcome to Hendrix
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your modern web application powered by Next.js, Tailwind CSS, and
            AWS Amplify
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="flex items-center space-x-2">
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Learn More</span>
          </Button>
        </div>

        <div className="mt-8">
          <Button variant="link" asChild className="text-sm">
            <a href="/admin" className="inline-flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Admin Panel</span>
            </a>
          </Button>
        </div>

        <div className="mt-12 text-muted-foreground text-sm">
          Built with ❤️ using modern web technologies
        </div>
      </div>
    </div>
  );
}
