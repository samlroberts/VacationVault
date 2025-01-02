import { ArrowLeft, PencilIcon } from "lucide-react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { type VacationWithAllData } from "~/lib/types";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "~/components/ui/accordion";

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
export default async function VacationPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
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
            <CardTitle className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 text-3xl font-bold">
                <Link href={`/`}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
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

            <div className="mb-6">
              <div className="flex justify-between">
                <h2 className="mb-2 text-xl font-semibold">Journal</h2>
                <Link
                  href={`/vacations/${vacation.id}/journal/new`}
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Add Journal Entry
                </Link>
              </div>

              <Accordion type="single" collapsible>
                <AccordionItem value="journal">
                  <AccordionTrigger> Entries </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-4 gap-4">
                      {vacation.journal.length > 0 ? (
                        vacation.journal.map((entry) => {
                          return (
                            <div
                              key={entry.id}
                              className="rounded-lg border p-4"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                  {new Date(entry.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "2-digit",
                                      day: "2-digit",
                                      year: "numeric",
                                      timeZone: "UTC",
                                    },
                                  )}
                                </h3>
                                <Link
                                  href={`/vacations/${vacation.id}/journal/${entry.id}/edit`}
                                  className="text-primary hover:text-primary/80"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </Link>
                              </div>
                              <p className="h-10 truncate text-gray-700">
                                {entry.entry}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500">No journal entries yet.</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
                    ? vacation.photos.map((photo) => {
                        const viewTransitionName = `vacation-photo-${vacation.id}-${photo.id}`;
                        return (
                          <div
                            key={photo.id}
                            style={{ viewTransitionName }}
                            className={
                              "relative flex flex-col gap-2 rounded-lg border-2 border-solid border-gray-200 p-2"
                            }
                          >
                            <div className="relative h-64 w-full overflow-hidden rounded-lg">
                              <Image
                                src={photo.url}
                                alt={
                                  photo.caption ??
                                  `Vacation photo ${vacation.destination}`
                                }
                                fill={true}
                                className="object-cover"
                              />
                            </div>
                            <div className="text-gray-700">{photo.caption}</div>
                          </div>
                        );
                      })
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
