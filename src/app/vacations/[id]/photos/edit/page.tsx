import { type Photo, type Vacation } from "@prisma/client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";
import EditPhotoForm from "./edit-photo-form";

type VacationWithPhotos = Vacation & {
  photos: Photo[];
};

async function getVacation(id: string): Promise<VacationWithPhotos | null> {
  const vacation = await db.vacation.findUnique({
    where: {
      id,
    },
    include: {
      photos: true,
    },
  });
  return vacation;
}

export default async function EditPhotosPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const vacation = await getVacation(params.id);

  if (!vacation) {
    redirect("/");
  }

  return (
    <HydrateClient>
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Edit Photos for {vacation.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading photos...</div>}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vacation.photos.length > 0 ? (
                  vacation.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative flex flex-col gap-4"
                    >
                      <div className="relative h-64 w-full overflow-hidden rounded-lg">
                        <Image
                          src={photo.url}
                          alt={`Vacation photo ${vacation.destination}`}
                          fill={true}
                          className="object-cover"
                        />
                      </div>
                      <EditPhotoForm photo={photo} vacationId={vacation.id} />
                    </div>
                  ))
                ) : (
                  <p>No photos to edit</p>
                )}
              </div>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </HydrateClient>
  );
}
