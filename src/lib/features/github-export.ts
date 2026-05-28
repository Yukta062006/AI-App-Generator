"use server";

import JSZip from "jszip";
import { AppConfig } from "../engine/schema";

export async function exportToGitHub(config: AppConfig) {
  const zip = new JSZip();
  
  // Create a minimal project structure
  zip.file("app-config.json", JSON.stringify(config, null, 2));
  zip.file("README.md", `# ${config.name}\n\nGenerated with AI App Generator.\n\nDescription: ${config.description || "No description"}`);
  
  // In a real app, we would add the entire Next.js codebase here with the config burned in.
  // For this demo, we'll just return the base64 of the zip.
  
  const content = await zip.generateAsync({ type: "base64" });
  return content;
}
