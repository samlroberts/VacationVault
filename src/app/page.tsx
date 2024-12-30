import { type Vacation } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import VacationGrid from "~/components/vacation-grid";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { db } from "~/server/db";
async function getVacations(userId: string): Promise<Vacation[]> {
  const vacations = await db.vacation.findMany({
    where: {
      userId,
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
      <div>Logged in</div>
      <Link className="text-blue-500" href="/api/auth/signout">
        Sign out
      </Link>
      <hr />
      <Link className="text-blue-500" href="/vacations/new">
        Add a vacation
      </Link>
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
