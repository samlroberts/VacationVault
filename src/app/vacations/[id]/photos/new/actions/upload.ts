"use server";

import { writeFile } from "fs/promises";
import { join } from "path";

export async function uploadPhotos(data: FormData, vacationId: string) {
  const files = data.getAll("files") as File[];
  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }

  const uploadPromises = files.map(async (file) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${vacationId}-${Date.now()}`;
    const path = join("public", "uploads", filename);
    await writeFile(path, buffer);
    return `/uploads/${filename}`;
  });

  const uploadedUrls = await Promise.all(uploadPromises);
  return uploadedUrls;
}
