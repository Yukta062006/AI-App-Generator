import { z } from "zod";

export const FieldTypeSchema = z.enum([
  "text",
  "number",
  "boolean",
  "date",
  "select",
  "email",
  "url",
]);

export const FieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: FieldTypeSchema,
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // For select type
  defaultValue: z.any().optional(),
});

export const ModelSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  fields: z.array(FieldSchema),
});

export const ComponentTypeSchema = z.enum([
  "table",
  "form",
  "stats",
  "chart",
  "text",
]);

export const PageComponentSchema = z.object({
  id: z.string(),
  type: ComponentTypeSchema,
  title: z.string().optional(),
  modelName: z.string().optional(), // For data-bound components
  props: z.record(z.string(), z.any()).optional(),
});

export const PageSchema = z.object({
  id: z.string(),
  title: z.string(),
  path: z.string(),
  components: z.array(PageComponentSchema),
});

export const WorkflowTriggerSchema = z.enum([
  "on_create",
  "on_update",
  "on_delete",
]);

export const WorkflowActionTypeSchema = z.enum([
  "log",
  "notification",
  "webhook",
  "update_field",
]);

export const WorkflowActionSchema = z.object({
  type: WorkflowActionTypeSchema,
  params: z.record(z.string(), z.any()),
});

export const WorkflowSchema = z.object({
  name: z.string(),
  modelName: z.string(),
  trigger: WorkflowTriggerSchema,
  actions: z.array(WorkflowActionSchema),
});

export const AppConfigSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  theme: z.object({
    primary: z.string().default("#3b82f6"),
    darkMode: z.boolean().default(true),
  }).default({ primary: "#3b82f6", darkMode: true }),
  auth: z.object({
    enabled: z.boolean().default(false),
    providers: z.array(z.enum(["credentials", "github", "google"])).default(["credentials"]),
  }).default({ enabled: false, providers: ["credentials"] }),
  i18n: z.object({
    enabled: z.boolean().default(false),
    defaultLanguage: z.string().default("en"),
    languages: z.array(z.string()).default(["en"]),
    translations: z.record(z.string(), z.any()).default({ en: {} }),
  }).default({ enabled: false, defaultLanguage: "en", languages: ["en"], translations: { en: {} } }),
  notifications: z.object({
    enabled: z.boolean().default(false),
  }).default({ enabled: false }),
  pwa: z.object({
    enabled: z.boolean().default(false),
  }).default({ enabled: false }),
  models: z.array(ModelSchema),
  pages: z.array(PageSchema),
  workflows: z.array(WorkflowSchema).default([]),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
export type ModelDef = z.infer<typeof ModelSchema>;
export type FieldDef = z.infer<typeof FieldSchema>;
export type PageDef = z.infer<typeof PageSchema>;
export type WorkflowDef = z.infer<typeof WorkflowSchema>;
