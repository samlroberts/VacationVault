import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";
import EditPhotoForm from "./edit-photo-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { type VacationWithAllData } from "~/lib/types";

async function getVacation(id: string): Promise<VacationWithAllData | null> {
  const vacation = await db.vacation.findUnique({
    where: {
      id,
    },
    include: {
      photos: true,
      journal: true,
    },
  });
  return vacation;
}

export default async function EditPhotosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const vacationId = (await params).id;

  const vacation = await getVacation(vacationId);

  if (!vacation) {
    redirect("/");
  }

  return (
    <HydrateClient>
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              <div className="flex items-center gap-2">
                <Link href={`/vacations/${vacation.id}`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                Edit Photos for {vacation.name}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading photos...</div>}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vacation.photos.length > 0 ? (
                  vacation.photos.map((photo) => {
                    const viewTransitionName = `vacation-photo-${vacation.id}-${photo.id}`;
                    return (
                      <div
                        key={photo.id}
                        style={{ viewTransitionName }}
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
                    );
                  })
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
