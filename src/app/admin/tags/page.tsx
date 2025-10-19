"use client";

import CrudTable from "../components/CrudTable";

const tagFields = [
  { key: "id", label: "ID", type: "string" as const },
  { key: "name", label: "Name", type: "string" as const, required: true },
  { key: "slug", label: "Slug", type: "string" as const, required: true },
  {
    key: "color",
    label: "Color",
    type: "string" as const,
    render: (value: string) =>
      value ? (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full mr-2 border border-gray-300"
            style={{ backgroundColor: value }}
          ></div>
          {value}
        </div>
      ) : (
        "-"
      ),
  },
  { key: "createdAt", label: "Created", type: "datetime" as const },
];

export default function TagsPage() {
  return (
    <CrudTable
      modelName="Tag"
      title="Tags"
      fields={tagFields}
      searchFields={["name", "slug"]}
    />
  );
}
