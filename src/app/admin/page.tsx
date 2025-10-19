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
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Posts",
      value: stats.posts,
      href: "/admin/posts",
      icon: FileText,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      name: "Categories",
      value: stats.categories,
      href: "/admin/categories",
      icon: Folder,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      name: "Tags",
      value: stats.tags,
      href: "/admin/tags",
      icon: Tag,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      name: "Todos",
      value: stats.todos,
      href: "/admin/todos",
      icon: CheckSquare,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to the Hendrix administration panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.name}
              href={card.href}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.bgColor} rounded-lg p-3`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions and System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
          <div className="space-y-3">
            <Link
              href="/admin/posts/new"
              className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
            >
              <div className="bg-blue-500 rounded-lg p-2 mr-4">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300">
                Create New Post
              </span>
            </Link>
            <Link
              href="/admin/users/new"
              className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
            >
              <div className="bg-green-500 rounded-lg p-2 mr-4">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-green-700 dark:text-green-400 group-hover:text-green-800 dark:group-hover:text-green-300">
                Add New User
              </span>
            </Link>
            <Link
              href="/admin/categories/new"
              className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors group"
            >
              <div className="bg-yellow-500 rounded-lg p-2 mr-4">
                <FolderPlus className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-yellow-700 dark:text-yellow-400 group-hover:text-yellow-800 dark:group-hover:text-yellow-300">
                Create Category
              </span>
            </Link>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              System Status
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Database
                </span>
              </div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Last Backup
                </span>
              </div>
              <span className="text-gray-900 dark:text-white font-medium">
                Never
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Version
                </span>
              </div>
              <span className="text-gray-900 dark:text-white font-medium">
                1.0.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
