"use client";

import CrudTable from "../components/CrudTable";

const categoryFields = [
  { key: "id", label: "ID", type: "string" as const },
  { key: "name", label: "Name", type: "string" as const, required: true },
  { key: "slug", label: "Slug", type: "string" as const, required: true },
  { key: "description", label: "Description", type: "string" as const },
  {
    key: "isActive",
    label: "Active",
    type: "boolean" as const,
    render: (value: boolean) => (value ? "✅" : "❌"),
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
