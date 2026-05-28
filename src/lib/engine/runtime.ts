"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { AppConfigSchema, WorkflowDef } from "./schema";

export async function getAppData(appId: string, modelName: string) {
  const data = await prisma.dynamicData.findMany({
    where: {
      appId,
      modelName,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

export async function createRecord(appId: string, modelName: string, data: any) {
  const record = await prisma.dynamicData.create({
  data: {
    appId,
    modelName,
    data: JSON.stringify(data),
  },
});

  // Execute Workflows
  await executeWorkflows(appId, modelName, "on_create", record);

  revalidatePath("/");
  return record;
}

export async function updateRecord(recordId: string, data: any) {
  const record = await prisma.dynamicData.update({
    where: { id: recordId },
    data: { data },
  });

  // Execute Workflows
  await executeWorkflows(record.appId, record.modelName, "on_update", record);

  revalidatePath("/");
  return record;
}

export async function deleteRecord(recordId: string) {
  const record = await prisma.dynamicData.delete({
    where: { id: recordId },
  });

  // Execute Workflows
  await executeWorkflows(record.appId, record.modelName, "on_delete", record);

  revalidatePath("/");
  return record;
}

async function executeWorkflows(appId: string, modelName: string, trigger: string, record: any) {
  const app = await prisma.application.findUnique({
    where: { id: appId },
  });

  if (!app) return;

const config = AppConfigSchema.parse(
  JSON.parse(app.config as string)
);
  const workflows = config.workflows.filter((w) => w.modelName === modelName && w.trigger === trigger);

  for (const workflow of workflows) {
    for (const action of workflow.actions) {
      console.log(`Executing action ${action.type} for workflow ${workflow.name}`);
      
      if (action.type === "log") {
        console.log("WORKFLOW LOG:", action.params.message || "No message", record);
      } else if (action.type === "notification") {
        // Mock notification
        console.log("WORKFLOW NOTIFICATION:", action.params.title, action.params.body);
      }
      // Add more actions as needed
    }
  }
}
