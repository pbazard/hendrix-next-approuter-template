"use client";

import CrudTable from "../components/CrudTable";

const postFields = [
  { key: "id", label: "ID", type: "string" as const },
  { key: "title", label: "Title", type: "string" as const, required: true },
  {
    key: "content",
    label: "Content",
    type: "string" as const,
    render: (value: string) => (value ? `${value.substring(0, 100)}...` : "-"),
  },
  {
    key: "status",
    label: "Status",
    type: "enum" as const,
    options: ["DRAFT", "PUBLISHED", "ARCHIVED"],
    render: (value: string) => {
      const colors = {
        DRAFT: "bg-yellow-100 text-yellow-800",
        PUBLISHED: "bg-green-100 text-green-800",
        ARCHIVED: "bg-gray-100 text-gray-800",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors] || "bg-gray-100 text-gray-800"}`}
        >
          {value}
        </span>
      );
    },
  },
  { key: "publishedAt", label: "Published", type: "datetime" as const },
  { key: "createdAt", label: "Created", type: "datetime" as const },
];

export default function PostsPage() {
  return (
    <CrudTable
      modelName="Post"
      title="Posts"
      fields={postFields}
      searchFields={["title", "content"]}
    />
  );
}
