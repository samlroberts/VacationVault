"use server";

import { writeFile } from "fs/promises";
import { join } from "path";

export async function uploadPhoto(data: FormData) {
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    throw new Error("No file uploaded");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const path = join("public", "uploads", file.name);
  await writeFile(path, buffer);

  return `/uploads/${file.name}`;
}
