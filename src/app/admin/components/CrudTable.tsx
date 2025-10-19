"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";

const client = generateClient<Schema>();

interface Field {
  key: string;
  label: string;
  type: "string" | "number" | "boolean" | "datetime" | "enum" | "select";
  required?: boolean;
  options?: string[] | { value: string; label: string }[];
  render?: (value: any, record: any) => React.ReactNode;
}

interface CrudTableProps {
  modelName: string;
  title: string;
  fields: Field[];
  searchFields?: string[];
}

export default function CrudTable({
  modelName,
  title,
  fields,
  searchFields = [],
}: CrudTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, [modelName]);

  const loadData = async () => {
    try {
      setLoading(true);
      const model = (client.models as any)[modelName];
      const result = await model.list();
      setData(result.data || []);
    } catch (error) {
      console.error(`Error loading ${modelName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const model = (client.models as any)[modelName];
      await model.delete({ id });
      await loadData();
    } catch (error) {
      console.error(`Error deleting ${modelName}:`, error);
      alert("Error deleting item");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const model = (client.models as any)[modelName];

      if (editingItem) {
        // For updates, include the ID and all form data
        await model.update({ id: editingItem.id, ...formData });
      } else {
        // For creates, exclude ID and auto-generated fields to let Amplify generate them
        const createData = { ...formData };
        delete createData.id;
        delete createData.createdAt;
        delete createData.updatedAt;
        await model.create(createData);
      }

      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error(`Error saving ${modelName}:`, error);
      alert("Error saving item");
    }
  };

  const renderCell = (item: any, field: Field) => {
    const value = item[field.key];
    if (field.render) {
      return field.render(value, item);
    }

    switch (field.type) {
      case "boolean":
        return value ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
            <Check className="w-3 h-3 mr-1" />
            Yes
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
            <X className="w-3 h-3 mr-1" />
            No
          </span>
        );
      case "datetime":
        return value ? new Date(value).toLocaleString() : "-";
      case "enum":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {value}
          </span>
        );
      default:
        return value || "-";
    }
  };

  const renderInput = (field: Field) => {
    const value = formData[field.key] || "";
    const baseClasses =
      "block w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors";
    const readOnlyClasses =
      "block w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-muted-foreground cursor-not-allowed";

    // Make ID field read-only when editing
    if (field.key === "id" && editingItem) {
      return (
        <input
          type="text"
          value={value}
          readOnly
          className={readOnlyClasses}
          title="ID is auto-generated and cannot be modified"
        />
      );
    }

    switch (field.type) {
      case "boolean":
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) =>
              setFormData({ ...formData, [field.key]: e.target.checked })
            }
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
          />
        );
      case "enum":
      case "select":
        return (
          <select
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [field.key]: e.target.value })
            }
            className={baseClasses}
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option
                key={typeof option === "string" ? option : option.value}
                value={typeof option === "string" ? option : option.value}
              >
                {typeof option === "string" ? option : option.label}
              </option>
            ))}
          </select>
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [field.key]: e.target.value })
            }
            className={baseClasses}
            required={field.required}
          />
        );
      case "datetime":
        return (
          <input
            type="datetime-local"
            value={value ? new Date(value).toISOString().slice(0, 16) : ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.key]: e.target.value })
            }
            className={baseClasses}
            required={field.required}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [field.key]: e.target.value })
            }
            className={baseClasses}
            required={field.required}
          />
        );
    }
  };

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    return searchFields.some((field) =>
      String(item[field]).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="bg-card/50 dark:bg-card/20 glassmorphism p-6 rounded-2xl shadow-lg border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background/50 dark:bg-background/20 pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              {fields.map((field) => (
                <th
                  key={field.key}
                  className="p-4 font-semibold text-muted-foreground"
                >
                  {field.label}
                </th>
              ))}
              <th className="p-4 font-semibold text-muted-foreground text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={fields.length + 1}
                  className="text-center p-8 text-muted-foreground"
                >
                  Loading...
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-primary/5"
                >
                  {fields.map((field) => (
                    <td key={field.key} className="p-4 text-foreground">
                      {renderCell(item, field)}
                    </td>
                  ))}
                  <td className="p-4 text-right">
                    <div className="inline-flex rounded-md shadow-sm">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-2 text-sm font-medium text-foreground bg-background hover:bg-muted rounded-l-lg border border-border"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-2 text-sm font-medium text-destructive bg-background hover:bg-muted rounded-r-lg border-t border-b border-r border-border"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-muted-foreground">
          Showing {paginatedData.length} of {filteredData.length} results
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed border border-border"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed border border-border"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 pt-24">
          <div className="bg-card w-full max-w-md p-6 rounded-lg shadow-xl border border-border mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {editingItem ? `Edit ${modelName}` : `New ${modelName}`}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields
                .filter((field) => {
                  // Hide ID field when creating new items
                  if (field.key === "id" && !editingItem) {
                    return false;
                  }
                  // Hide auto-generated timestamp fields when creating
                  if (
                    !editingItem &&
                    (field.key === "createdAt" || field.key === "updatedAt")
                  ) {
                    return false;
                  }
                  return true;
                })
                .map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={field.key}
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      {field.label}
                      {field.key === "id" && editingItem && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (auto-generated)
                        </span>
                      )}
                    </label>
                    {renderInput(field)}
                  </div>
                ))}
              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm"
                >
                  {editingItem ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
