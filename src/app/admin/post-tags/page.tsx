"use client";

import CrudTable from "../components/CrudTable";

const postTagFields = [
  { key: "id", label: "ID", type: "string" as const },
  { key: "postId", label: "Post ID", type: "string" as const, required: true },
  { key: "tagId", label: "Tag ID", type: "string" as const, required: true },
  { key: "createdAt", label: "Created", type: "datetime" as const },
  { key: "updatedAt", label: "Updated", type: "datetime" as const },
];

export default function PostTagsPage() {
  return (
    <CrudTable
      modelName="PostTag"
      title="Post Tags"
      fields={postTagFields}
      searchFields={["postId", "tagId"]}
    />
  );
}
