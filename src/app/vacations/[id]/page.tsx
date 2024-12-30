import { type Photo, type Vacation } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";

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

export default async function VacationPage({
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
              {vacation.name}
            </CardTitle>
            <p className="text-lg text-gray-600">{vacation.destination}</p>
            <p className="text-sm text-gray-500">
              {new Date(vacation.startDate).toLocaleDateString()} -{" "}
              {new Date(vacation.endDate).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold">Description</h2>
              <p className="text-gray-700">{vacation.description}</p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Photos</h2>
              <Link href={`/vacations/${vacation.id}/photos/new`}>
                Add a photo
              </Link>
              <Link href={`/vacations/${vacation.id}/photos/edit`}>
                Edit photos
              </Link>
              <Suspense fallback={<div>Loading photos...</div>}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {vacation.photos.length > 0
                    ? vacation.photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="relative flex flex-col gap-2"
                        >
                          <div className="relative h-64 w-full overflow-hidden rounded-lg">
                            <Image
                              src={photo.url}
                              alt={`Vacation photo ${vacation.destination}`}
                              fill={true}
                              className="object-cover"
                            />
                          </div>
                          <div className="text-gray-700">{photo.caption}</div>
                        </div>
                      ))
                    : "No photos yet"}
                </div>
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>
    </HydrateClient>
  );
}
