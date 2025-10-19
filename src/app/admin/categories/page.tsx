"use client";

import CrudTable from "../components/CrudTable";
import { Check, X } from "lucide-react";

const categoryFields = [
  { key: "id", label: "ID", type: "string" as const },
  { key: "name", label: "Name", type: "string" as const, required: true },
  { key: "slug", label: "Slug", type: "string" as const, required: true },
  { key: "description", label: "Description", type: "string" as const },
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
  { key: "createdAt", label: "Created", type: "datetime" as const },
];

export default function CategoriesPage() {
  return (
    <CrudTable
      modelName="Category"
      title="Categories"
      fields={categoryFields}
      searchFields={["name", "slug", "description"]}
    />
  );
}
