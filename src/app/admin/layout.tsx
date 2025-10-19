"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Link from "next/link";
import { usePathname } from "next/navigation";

const client = generateClient<Schema>();

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // TODO: Implement proper authentication check
    // For now, we'll simulate super admin access
    setIsAuthenticated(true);
    setUserRole("SUPER_ADMIN");
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Posts", href: "/admin/posts", icon: "📝" },
    { name: "Categories", href: "/admin/categories", icon: "📁" },
    { name: "Tags", href: "/admin/tags", icon: "🏷️" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
    { name: "Todos", href: "/admin/todos", icon: "✅" },
  ];

  if (!isAuthenticated || userRole !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You need super admin privileges to access this area.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <h1 className="text-white text-xl font-bold">Hendrix Admin</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                pathname === item.href
                  ? "bg-gray-700 text-white border-r-4 border-blue-500"
                  : ""
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <div className="text-gray-400 text-sm">
            <p>Logged in as Super Admin</p>
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              ← Back to Site
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`${sidebarOpen ? "lg:ml-64" : ""} transition-all duration-300`}
      >
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              ☰
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Super Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
