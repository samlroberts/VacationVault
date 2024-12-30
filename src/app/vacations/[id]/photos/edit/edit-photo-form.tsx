"use client";

import { type Photo } from "@prisma/client";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
interface EditPhotoFormProps {
  photo: Photo;
  vacationId: string;
}

export default function EditPhotoForm({
  photo,
  vacationId,
}: EditPhotoFormProps) {
  const router = useRouter();
  const [caption, setCaption] = useState(photo.caption ?? "");

  const utils = api.useUtils();
  const updatePhoto = api.photo.update.useMutation({
    onSuccess: () => {
      void utils.vacation.getById.invalidate({ id: vacationId });
      router.refresh();
    },
  });

  const deletePhoto = api.photo.delete.useMutation({
    onSuccess: () => {
      void utils.vacation.getById.invalidate({ id: vacationId });
      router.refresh();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePhoto.mutate({
      id: photo.id,
      caption,
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this photo?")) {
      deletePhoto.mutate({ id: photo.id });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Add a caption..."
      />
      <div className="flex gap-2">
        <Button
          type="submit"
          variant="secondary"
          disabled={updatePhoto.isPending}
        >
          {updatePhoto.isPending ? "Saving..." : "Save Caption"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={deletePhoto.isPending}
        >
          {deletePhoto.isPending ? "Deleting..." : "Delete Photo"}
        </Button>
      </div>
    </form>
  );
}
