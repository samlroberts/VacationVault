import { PencilIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { type VacationWithPhotos } from "~/lib/types";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";

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
  params: Promise<{
    id: string;
  }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

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
            <CardTitle className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 text-3xl font-bold">
                {vacation.name}
              </div>
              <Link
                href={`/vacations/${vacation.id}/edit`}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                <PencilIcon className="h-4 w-4" />
                Edit Vacation Details
              </Link>
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
              <div className="flex justify-between">
                <h2 className="mb-4 text-xl font-semibold">Photos</h2>
                <div className="mb-4 flex gap-4">
                  <Link
                    href={`/vacations/${vacation.id}/photos/new`}
                    className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Add photos
                  </Link>
                  <Link
                    href={`/vacations/${vacation.id}/photos/edit`}
                    className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                  >
                    Edit photos
                  </Link>
                </div>
              </div>
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
