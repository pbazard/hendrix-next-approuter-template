"use client";

import { useState, useEffect } from "react";
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
  Link as LinkIcon,
  Cog,
  Loader2,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuth } from "../components/AuthProvider";
import LoginForm from "../components/LoginForm";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isSuperAdmin, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const pathname = usePathname();

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Debug logging
  console.log("[SEARCH] Admin Layout Debug:");
  console.log("- User:", user);
  console.log("- Loading:", loading);
  console.log("- isSuperAdmin:", isSuperAdmin);
  console.log("- User groups:", user?.groups);

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <h2 className="text-lg font-semibold">Loading...</h2>
            <p className="text-muted-foreground">Checking authentication</p>
          </div>
        </Card>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Admin Access Required</span>
              </CardTitle>
              <CardDescription>
                Please sign in with your admin credentials
              </CardDescription>
            </CardHeader>
          </Card>
          <LoginForm />
        </div>
      </div>
    );
  }

  // Not super admin
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You need super admin privileges to access this area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Signed in as: <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex flex-col space-y-2">
              <Button onClick={signOut} variant="outline" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/50 dark:bg-card/20 glassmorphism border-r border-white/10 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
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
            className="text-muted-foreground hover:text-foreground"
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
        <div className="absolute bottom-0 left-0 w-full p-4 space-y-2">
          <div className="text-xs text-muted-foreground px-4">
            Signed in as: {user.email}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3"
            asChild
          >
            <Link href="/profile">
              <User className="w-5 h-5 mr-3" />
              <span className="font-medium">Profile</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={signOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3"
            asChild
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-3" />
              <span className="font-medium">Back to Site</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}
      >
        <header className="sticky top-0 h-20 bg-background/50 dark:bg-background/20 glassmorphism border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-accent transition-colors"
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1">
              {/* Breadcrumbs or other header content can go here */}
            </div>
          </div>
          <div>{/* User menu or other actions */}</div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
