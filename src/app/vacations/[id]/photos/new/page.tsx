"use client";

import { X } from "lucide-react";
import { useEffect, useState, use } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Image from "next/image";
import { uploadPhotos } from "./actions/upload";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Textarea } from "~/components/ui/textarea";

interface PhotoWithPreview {
  file: File;
  url: string;
  caption: string;
}

type Params = Promise<{ id: string }>;

export default function VacationPhotos({ params }: { params: Params }) {
  const router = useRouter();

  const vacationId = use(params).id;
  const { mutateAsync: addPhotos, isPending } =
    api.vacation.addPhotos.useMutation();

  const [selectedPhotos, setSelectedPhotos] = useState<PhotoWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPhotos = newFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        caption: "", // Initialize with empty caption
      }));
      setSelectedPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setSelectedPhotos((prev) => {
      // Clean up the removed preview URL
      if (!prev[indexToRemove]) return prev;
      URL.revokeObjectURL(prev[indexToRemove].url);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  const handleCaptionChange = (index: number, caption: string) => {
    setSelectedPhotos((prev) =>
      prev.map((photo, i) => (i === index ? { ...photo, caption } : photo)),
    );
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      if (selectedPhotos.length > 0) {
        const formData = new FormData();
        selectedPhotos.forEach((photo) => {
          formData.append(`files`, photo.file);
          formData.append(`captions`, photo.caption);
        });
        const uploadedUrls = await uploadPhotos(formData, vacationId);
        console.log("Uploaded URLs:", uploadedUrls);

        await addPhotos({
          vacationId: vacationId,
          photos: uploadedUrls.map((url, index) => ({
            url,
            caption: selectedPhotos[index]?.caption ?? "",
          })),
        });

        // Clean up
        selectedPhotos.forEach(({ url }) => URL.revokeObjectURL(url));
        setSelectedPhotos([]);
        setIsUploading(false);
        router.push(`/vacations/${vacationId}`);
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedPhotos.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [selectedPhotos]);

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
              onClick={(e) => (e.currentTarget.value = "")}
            />
          </div>
          {selectedPhotos.length > 0 && (
            <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {selectedPhotos.map((photo, index) => (
                <div key={index} className="space-y-2">
                  <div className="group relative aspect-video">
                    <Image
                      src={photo.url}
                      alt={`Vacation photo ${index + 1}`}
                      fill
                      className="rounded-md object-cover"
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
                  <div className="space-y-1">
                    <Label htmlFor={`caption-${index}`}>Caption</Label>
                    <Textarea
                      id={`caption-${index}`}
                      value={photo.caption}
                      onChange={(e) =>
                        handleCaptionChange(index, e.target.value)
                      }
                      placeholder="Add a caption to this photo..."
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedPhotos.length} photos selected
            </p>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/vacations/${vacationId}`)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={
                  selectedPhotos.length === 0 || isUploading || isPending
                }
              >
                Upload {selectedPhotos.length} Photos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
