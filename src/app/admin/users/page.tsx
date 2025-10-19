"use client";

import CrudTable from "../components/CrudTable";

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
    render: (value: boolean) => (value ? "✅ Active" : "❌ Inactive"),
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
