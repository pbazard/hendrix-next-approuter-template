"use client";

import CrudTable from "../components/CrudTable";
import { Check, X } from "lucide-react";

const userFields = [
  { key: "id", label: "ID", type: "string" as const },
  { key: "email", label: "Email", type: "string" as const, required: true },
  { key: "firstName", label: "First Name", type: "string" as const },
  { key: "lastName", label: "Last Name", type: "string" as const },
  {
    key: "role",
    label: "Role",
    type: "enum" as const,
    options: ["USER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    key: "isActive",
    label: "Active",
    type: "boolean" as const,
    render: (value: boolean) => (
      <div className="flex items-center space-x-2">
        {value ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span>Active</span>
          </>
        ) : (
          <>
            <X className="w-4 h-4 text-red-500" />
            <span>Inactive</span>
          </>
        )}
      </div>
    ),
  },
  { key: "lastLoginAt", label: "Last Login", type: "datetime" as const },
  { key: "createdAt", label: "Created", type: "datetime" as const },
];

export default function UsersPage() {
  return (
    <CrudTable
      modelName="User"
      title="Users"
      fields={userFields}
      searchFields={["email", "firstName", "lastName"]}
    />
  );
}
