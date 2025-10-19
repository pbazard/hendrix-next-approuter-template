"use client";

import CrudTable from "../components/CrudTable";
import { Globe, Lock } from "lucide-react";

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
    render: (value: boolean) => (
      <div className="flex items-center space-x-2">
        {value ? (
          <>
            <Globe className="w-4 h-4 text-green-500" />
            <span>Public</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-red-500" />
            <span>Private</span>
          </>
        )}
      </div>
    ),
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
