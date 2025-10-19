"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Link from "next/link";

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
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      name: "Posts",
      value: stats.posts,
      href: "/admin/posts",
      icon: "📝",
      color: "bg-green-500",
    },
    {
      name: "Categories",
      value: stats.categories,
      href: "/admin/categories",
      icon: "📁",
      color: "bg-yellow-500",
    },
    {
      name: "Tags",
      value: stats.tags,
      href: "/admin/tags",
      icon: "🏷️",
      color: "bg-purple-500",
    },
    {
      name: "Todos",
      value: stats.todos,
      href: "/admin/todos",
      icon: "✅",
      color: "bg-red-500",
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the Hendrix admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div
                className={`${card.color} rounded-lg p-3 text-white text-2xl mr-4`}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.name}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/posts/new"
              className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-blue-500 text-xl mr-3">➕</span>
              <span className="font-medium text-blue-700">Create New Post</span>
            </Link>
            <Link
              href="/admin/users/new"
              className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-green-500 text-xl mr-3">👤</span>
              <span className="font-medium text-green-700">Add New User</span>
            </Link>
            <Link
              href="/admin/categories/new"
              className="flex items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <span className="text-yellow-500 text-xl mr-3">📁</span>
              <span className="font-medium text-yellow-700">
                Create Category
              </span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Info</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Backup</span>
              <span className="text-gray-900">Never</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Version</span>
              <span className="text-gray-900">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
