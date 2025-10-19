"use client";

import { Zap, ArrowRight, BookOpen, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "./components/ThemeProvider";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center transition-colors relative">
      {/* Floating theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg z-50"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <div className="text-center space-y-8 p-8 max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
            <Zap className="w-16 h-16 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            Welcome to Hendrix
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your modern web application powered by Next.js, Tailwind CSS, and
            AWS Amplify
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold py-3 px-8 rounded-md transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2">
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 px-8 rounded-md border border-gray-300 dark:border-gray-600 transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Learn More</span>
          </button>
        </div>

        <div className="mt-8">
          <a
            href="/admin"
            className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Admin Panel</span>
          </a>
        </div>

        <div className="mt-12 text-gray-500 dark:text-gray-400 text-sm">
          Built with ❤️ using modern web technologies
        </div>
      </div>
    </div>
  );
}
