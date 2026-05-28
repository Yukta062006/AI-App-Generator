"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function importCSV(appId: string, modelName: string, records: any[]) {
  console.log(`Importing ${records.length} records for ${modelName} in app ${appId}`);
  
  try {
    const createdRecords = await Promise.all(
      records
        .filter(r => Object.values(r).some(v => v !== "")) // Skip empty rows
        .map((data) =>
          prisma.dynamicData.create({
            data: {
              appId,
              modelName,
              data,
            },
          })
        )
    );

    console.log(`Successfully imported ${createdRecords.length} records`);
    revalidatePath("/");
    return { success: true, count: createdRecords.length };
  } catch (error) {
    console.error("Import failed:", error);
    throw error;
  }
}
