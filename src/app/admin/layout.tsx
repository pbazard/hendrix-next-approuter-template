"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Folder,
  Tag,
  Settings,
  CheckSquare,
  Menu,
  X,
  Home,
  LogOut,
  Database,
  ChevronDown,
  ChevronRight,
  Table,
  Link as LinkIcon,
  Cog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const client = generateClient<Schema>();

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // TODO: Implement proper authentication check
    // For now, we'll simulate super admin access
    setIsAuthenticated(true);
    setUserRole("SUPER_ADMIN");
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  ];

  const schemaModels = [
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      description: "User management",
    },
    {
      name: "Posts",
      href: "/admin/posts",
      icon: FileText,
      description: "Content posts",
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Folder,
      description: "Post categories",
    },
    {
      name: "Tags",
      href: "/admin/tags",
      icon: Tag,
      description: "Content tags",
    },
    {
      name: "PostTag",
      href: "/admin/post-tags",
      icon: LinkIcon,
      description: "Post-Tag relations",
    },
    {
      name: "PostCategory",
      href: "/admin/post-categories",
      icon: LinkIcon,
      description: "Post-Category relations",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Cog,
      description: "Application settings",
    },
    {
      name: "Todos",
      href: "/admin/todos",
      icon: CheckSquare,
      description: "Todo items",
    },
  ];

  const bottomMenuItems = [];

  if (!isAuthenticated || userRole !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Access Denied
            </h1>
            <p className="text-muted-foreground mb-6">
              You need super admin privileges to access this area.
            </p>
            <Button asChild>
              <Link href="/" className="inline-flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/50 dark:bg-card/20 glassmorphism border-r border-white/10 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-20 px-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <h1 className="text-foreground text-xl font-semibold">Admin</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4 px-4 space-y-1">
          {/* Dashboard */}
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}

          {/* Schema Section */}
          <Collapsible open={schemaOpen} onOpenChange={setSchemaOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-start px-4 py-3 h-auto font-medium ${
                  pathname.startsWith("/admin/") && pathname !== "/admin"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Database className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">Schema</span>
                {schemaOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {schemaModels.map((model) => (
                <Link
                  key={model.name}
                  href={model.href}
                  className={`flex items-center px-4 py-2 ml-4 rounded-lg transition-all duration-200 text-sm ${
                    pathname === model.href
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  title={model.description}
                >
                  <model.icon className="w-4 h-4 mr-3" />
                  <span>{model.name}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </nav>
        <div className="absolute bottom-0 left-0 w-full p-4">
          <Link
            href="/"
            className="flex items-center px-4 py-3 my-1 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-foreground"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 transition-all duration-300 ease-in-out">
        <header className="sticky top-0 h-20 bg-background/50 dark:bg-background/20 glassmorphism border-b border-white/10 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            {/* Breadcrumbs or other header content can go here */}
          </div>
          <div>{/* User menu or other actions */}</div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
