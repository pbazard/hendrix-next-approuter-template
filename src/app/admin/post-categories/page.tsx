"use client";

import CrudTable from "../components/CrudTable";

const postCategoryFields = [
  { key: "id", label: "ID", type: "string" as const },
  { key: "postId", label: "Post ID", type: "string" as const, required: true },
  {
    key: "categoryId",
    label: "Category ID",
    type: "string" as const,
    required: true,
  },
  { key: "createdAt", label: "Created", type: "datetime" as const },
  { key: "updatedAt", label: "Updated", type: "datetime" as const },
];

export default function PostCategoriesPage() {
  return (
    <CrudTable
      modelName="PostCategory"
      title="Post Categories"
      fields={postCategoryFields}
      searchFields={["postId", "categoryId"]}
    />
  );
}
