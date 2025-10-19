"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Link from "next/link";
import {
  Users,
  FileText,
  Folder,
  Tag,
  CheckSquare,
  Plus,
  UserPlus,
  FolderPlus,
  Database,
  Clock,
  Activity,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const client = generateClient<Schema>();

interface Stats {
  users: number;
  posts: number;
  categories: number;
  tags: number;
  todos: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    posts: 0,
    categories: 0,
    tags: 0,
    todos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, posts, categories, tags, todos] = await Promise.all([
        client.models.User.list(),
        client.models.Post.list(),
        client.models.Category.list(),
        client.models.Tag.list(),
        client.models.Todo.list(),
      ]);

      setStats({
        users: users.data.length,
        posts: posts.data.length,
        categories: categories.data.length,
        tags: tags.data.length,
        todos: todos.data.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: "Users",
      value: stats.users,
      href: "/admin/users",
      icon: Users,
      color: "text-blue-400",
    },
    {
      name: "Posts",
      value: stats.posts,
      href: "/admin/posts",
      icon: FileText,
      color: "text-green-400",
    },
    {
      name: "Categories",
      value: stats.categories,
      href: "/admin/categories",
      icon: Folder,
      color: "text-yellow-400",
    },
    {
      name: "Tags",
      value: stats.tags,
      href: "/admin/tags",
      icon: Tag,
      color: "text-purple-400",
    },
    {
      name: "Todos",
      value: stats.todos,
      href: "/admin/todos",
      icon: CheckSquare,
      color: "text-pink-400",
    },
  ];

  const quickActions = [
    { name: "New Post", href: "/admin/posts/new", icon: Plus },
    { name: "New User", href: "/admin/users/new", icon: UserPlus },
    { name: "New Category", href: "/admin/categories/new", icon: FolderPlus },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, Admin. Here's a snapshot of your application.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card) => (
          <Card key={card.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Link href={card.href} className="block">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.name}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {loading ? "..." : card.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-3" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted/50 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-3" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.name}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={action.href}>
                    <action.icon className="w-4 h-4 mr-3" />
                    {action.name}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-3" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Database</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Online
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">API</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Healthy
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last updated</span>
                <span className="text-sm font-medium">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
