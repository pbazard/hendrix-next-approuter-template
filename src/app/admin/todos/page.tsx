"use client";

import CrudTable from "../components/CrudTable";
import { CheckCircle, Clock } from "lucide-react";

const todoFields = [
  { key: "id", label: "ID", type: "string" as const },
  { key: "content", label: "Content", type: "string" as const, required: true },
  {
    key: "isDone",
    label: "Completed",
    type: "boolean" as const,
    render: (value: boolean) => (
      <div className="flex items-center space-x-2">
        {value ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Done</span>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4 text-yellow-500" />
            <span>Pending</span>
          </>
        )}
      </div>
    ),
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
