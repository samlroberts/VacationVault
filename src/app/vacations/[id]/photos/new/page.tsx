"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Image from "next/image";
import { uploadPhotos } from "./actions/upload";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function VacationPhotos({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ file: File; url: string }[]>(
    [],
  );

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);

      // Create temporary preview URLs for new files
      const newPreviews = newFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );

    // Clean up the removed preview URL
    URL.revokeObjectURL(previewUrls[indexToRemove]?.url ?? "");
    setPreviewUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleUpload = async () => {
    try {
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });
        const uploadedUrls = await uploadPhotos(formData);
        console.log("Uploaded URLs:", uploadedUrls);

        // Clean up
        previewUrls.forEach(({ url }) => URL.revokeObjectURL(url));
        setPreviewUrls([]);
        setSelectedFiles([]);
        router.push(`/vacations/${params.id}`);
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload Vacation Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="photo">Add More Photos</Label>
            <Input
              id="photo"
              type="file"
              onChange={handlePhotoSelect}
              accept="image/*"
              multiple
              // Clear the input value after each selection
              onClick={(e) => (e.currentTarget.value = "")}
            />
          </div>
          {previewUrls.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {previewUrls.map(({ url }, index) => (
                <div key={index} className="group relative">
                  <Image
                    src={url}
                    alt={`Vacation photo ${index + 1}`}
                    width={200}
                    height={200}
                    className="h-48 w-full rounded-md object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleRemovePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedFiles.length} photos selected
            </p>
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0}
            >
              Upload {selectedFiles.length} Photos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
