"use client";

import CrudTable from "../components/CrudTable";

const todoFields = [
  { key: "id", label: "ID", type: "string" as const },
  { key: "content", label: "Content", type: "string" as const, required: true },
  {
    key: "isDone",
    label: "Completed",
    type: "boolean" as const,
    render: (value: boolean) => (value ? "✅ Done" : "⏳ Pending"),
  },
  { key: "createdAt", label: "Created", type: "datetime" as const },
  { key: "updatedAt", label: "Updated", type: "datetime" as const },
];

export default function TodosPage() {
  return (
    <CrudTable
      modelName="Todo"
      title="Todos"
      fields={todoFields}
      searchFields={["content"]}
    />
  );
}
