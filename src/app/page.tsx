import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import VacationGrid from "~/components/vacation-grid";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { db } from "~/server/db";
import { type VacationWithPhotos } from "~/lib/types";
import { Button } from "~/components/ui/button";

async function getVacations(userId: string): Promise<VacationWithPhotos[]> {
  const vacations = await db.vacation.findMany({
    where: {
      userId,
    },
    include: {
      photos: true,
    },
  });

  return vacations;
}

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const vacations = await getVacations(session.user.id);

  return (
    <HydrateClient>
      <header className="flex items-center justify-between bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            className="text-sm text-gray-600 hover:text-gray-900"
            href="/api/auth/signout"
          >
            <Button variant="destructive">Sign out</Button>
          </Link>
        </div>
        <Link
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          href="/vacations/new"
        >
          Add a vacation
        </Link>
      </header>
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold">Your Vacations</h1>
        <Suspense fallback={<div>Loading vacations...</div>}>
          {vacations.length > 0 ? (
            <VacationGrid vacations={vacations} />
          ) : (
            <div>
              <p>No vacations found</p>
              <Link className="text-blue-500" href="/vacations/new">
                Add a vacation
              </Link>
            </div>
          )}
        </Suspense>
      </div>
    </HydrateClient>
  );
}
