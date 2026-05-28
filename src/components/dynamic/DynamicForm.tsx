"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { ModelDef, FieldDef } from "@/lib/engine/schema";
import { Loader2, X } from "lucide-react";

interface DynamicFormProps {
  model: ModelDef;
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function DynamicForm({ model, initialData, onSubmit, onCancel, loading }: DynamicFormProps) {
  // Build Zod schema dynamically from model fields
  const schemaShape: any = {};
  model.fields.forEach((field) => {
    let fieldSchema: any = z.any();

    if (field.type === "text" || field.type === "email" || field.type === "url") {
      fieldSchema = z.string();
      if (field.required) fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      if (field.type === "email") fieldSchema = fieldSchema.email();
      if (field.type === "url") fieldSchema = fieldSchema.url();
    } else if (field.type === "number") {
      fieldSchema = z.coerce.number();
      if (field.required) fieldSchema = fieldSchema.min(1, `${field.label} is required`);
    } else if (field.type === "boolean") {
      fieldSchema = z.boolean();
    } else if (field.type === "date") {
      fieldSchema = z.string(); // Simple date string for now
      if (field.required) fieldSchema = fieldSchema.min(1, `${field.label} is required`);
    } else if (field.type === "select") {
      fieldSchema = z.string();
      if (field.required) fieldSchema = fieldSchema.min(1, `${field.label} is required`);
    }

    schemaShape[field.name] = field.required ? fieldSchema : fieldSchema.optional().nullable();
  });

  const formSchema = z.object(schemaShape);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  return (
    <div className="relative rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {initialData ? "Edit" : "New"} {model.label}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="rounded-md p-1 transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {model.fields.map((field) => (
            <div key={field.name} className={cn("space-y-2", field.type === "text" ? "sm:col-span-2" : "")}>
              <label
                htmlFor={field.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>

              {field.type === "select" ? (
                <select
                  {...register(field.name)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "boolean" ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register(field.name)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">{field.label}</span>
                </div>
              ) : (
                <input
                  type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                  {...register(field.name)}
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              )}
              {errors[field.name] && (
                <p className="text-xs font-medium text-destructive">
                  {String(errors[field.name]?.message)}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 border-t pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update" : "Save"} {model.label}
          </button>
        </div>
      </form>
    </div>
  );
}
