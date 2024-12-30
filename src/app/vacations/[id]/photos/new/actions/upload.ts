"use server";

import { writeFile } from "fs/promises";
import { join } from "path";

export async function uploadPhotos(data: FormData) {
  const files = data.getAll("files") as File[];

  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }

  const uploadPromises = files.map(async (file) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = join("public", "uploads", file.name);
    await writeFile(path, buffer);
    return `/uploads/${file.name}`;
  });

  const uploadedUrls = await Promise.all(uploadPromises);
  return uploadedUrls;
}
