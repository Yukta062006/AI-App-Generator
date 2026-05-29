"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function importCSV(
  appId: string,
  modelName: string,
  records: any[]
) {
  console.log(
    `Importing ${records.length} records for ${modelName} in app ${appId}`
  );

  try {
    const validRecords = records.filter((record) =>
      Object.values(record).some(
        (value) => value !== "" && value !== null
      )
    );

    const createdRecords = await Promise.all(
      validRecords.map((record) =>
        prisma.dynamicData.create({
          data: {
            appId,
            modelName,
            data: JSON.stringify(record), // IMPORTANT FIX
          },
        })
      )
    );

    console.log(
      `Successfully imported ${createdRecords.length} records`
    );

    revalidatePath("/");

    return {
      success: true,
      count: createdRecords.length,
    };
  } catch (error) {
    console.error("Import failed:", error);

    return {
      success: false,
      error: String(error),
    };
  }
}