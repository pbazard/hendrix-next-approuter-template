"use client";

import CrudTable from "../components/CrudTable";

const settingFields = [
  { key: "id", label: "ID", type: "string" as const },
  { key: "key", label: "Key", type: "string" as const, required: true },
  { key: "value", label: "Value", type: "string" as const },
  {
    key: "type",
    label: "Type",
    type: "enum" as const,
    options: ["STRING", "NUMBER", "BOOLEAN", "JSON"],
  },
  { key: "description", label: "Description", type: "string" as const },
  {
    key: "isPublic",
    label: "Public",
    type: "boolean" as const,
    render: (value: boolean) => (value ? "🌐 Public" : "🔒 Private"),
  },
  { key: "createdAt", label: "Created", type: "datetime" as const },
];

export default function SettingsPage() {
  return (
    <CrudTable
      modelName="Setting"
      title="Settings"
      fields={settingFields}
      searchFields={["key", "description"]}
    />
  );
}
