"use client";

import { useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit,
  Save,
  X,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Initialize form data when user data is available
  useState(() => {
    if (user) {
      setFormData({
        firstName:
          user.attributes?.given_name || user.attributes?.first_name || "",
        lastName:
          user.attributes?.family_name || user.attributes?.last_name || "",
        email: user.email || "",
      });
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      firstName:
        user?.attributes?.given_name || user?.attributes?.first_name || "",
      lastName:
        user?.attributes?.family_name || user?.attributes?.last_name || "",
      email: user?.email || "",
    });
  };

  const handleSave = async () => {
    // TODO: Implement profile update functionality
    // This would typically involve updating user attributes in Cognito
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName:
        user?.attributes?.given_name || user?.attributes?.first_name || "",
      lastName:
        user?.attributes?.family_name || user?.attributes?.last_name || "",
      email: user?.email || "",
    });
  };

  const getRoleBadgeColor = (groups: string[]) => {
    if (groups?.includes("super_admins")) return "bg-red-100 text-red-800";
    if (groups?.includes("admins")) return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  const getRoleLabel = (groups: string[]) => {
    if (groups?.includes("super_admins")) return "Super Admin";
    if (groups?.includes("admins")) return "Admin";
    return "User";
  };

  const isAdmin = () => {
    return (
      user?.groups?.includes("admins") || user?.groups?.includes("super_admins")
    );
  };

  const getBackUrl = () => {
    return isAdmin() ? "/admin" : "/";
  };

  const getBackLabel = () => {
    return isAdmin() ? "Back to Admin" : "Back";
  };

  const getDisplayName = () => {
    const firstName =
      user?.attributes?.given_name || user?.attributes?.first_name;
    const lastName =
      user?.attributes?.family_name || user?.attributes?.last_name;

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (user?.email) {
      return user.email.split("@")[0];
    } else {
      return user?.username || "User";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 animate-spin mx-auto border-2 border-primary border-t-transparent rounded-full"></div>
            <h2 className="text-lg font-semibold">Loading...</h2>
            <p className="text-muted-foreground">Loading your profile</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Authentication Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please sign in to view your profile.
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={getBackUrl()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {getBackLabel()}
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          </div>
          {!isEditing && (
            <Button onClick={handleEdit} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{getDisplayName()}</CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getRoleBadgeColor(user.groups || [])}>
                    {getRoleLabel(user.groups || [])}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Personal Information
              </h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="block w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="block w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="block w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                      placeholder="Email address"
                      readOnly
                      title="Email cannot be changed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email address cannot be changed
                    </p>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{getDisplayName()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium">
                        {getRoleLabel(user.groups || [])}
                      </p>
                    </div>
                  </div>
                  {user.attributes?.lastLoginAt && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Last Login
                        </p>
                        <p className="font-medium">
                          {new Date(
                            user.attributes.lastLoginAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Account Information */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Groups</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.groups && user.groups.length > 0 ? (
                        user.groups.map((group) => (
                          <Badge
                            key={group}
                            variant="outline"
                            className="text-xs"
                          >
                            {group}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          No groups assigned
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
