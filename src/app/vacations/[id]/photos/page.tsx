"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { uploadPhotos } from "../../actions/upload";

export default function VacationPhotos({ params }: { params: { id: string } }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
      // Create temporary preview URLs
      const previewUrls = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file),
      );
      setPhotoUrls(previewUrls);
    }
  };

  const handleUpload = async () => {
    try {
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });
        const uploadedUrls = await uploadPhotos(formData);
        // Here you would typically save these URLs to your vacation in the database
        console.log("Uploaded URLs:", uploadedUrls);

        // Clean up
        setSelectedFiles([]);
        photoUrls.forEach((url) => URL.revokeObjectURL(url));
        setPhotoUrls([]);
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      photoUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photoUrls]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload Vacation Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="photo">Select Photos</Label>
            <Input
              id="photo"
              type="file"
              onChange={handlePhotoSelect}
              accept="image/*"
              multiple
            />
          </div>
          {photoUrls.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {photoUrls.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Vacation photo ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded-md object-cover"
                />
              ))}
            </div>
          )}
          <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>
            Upload
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
