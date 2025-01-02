import { ArrowLeft } from "lucide-react";
import { Link } from "next-view-transitions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function NewJournalEntryPage({
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

  const vacation = await db.vacation.findUnique({
    where: {
      id: vacationId,
    },
  });

  if (!vacation) {
    redirect("/");
  }

  async function createJournalEntry(formData: FormData) {
    "use server";

    const date = formData.get("date") as string;
    const entry = formData.get("entry") as string;

    if (!date || !entry) {
      return;
    }

    await db.journalEntry.create({
      data: {
        date: new Date(date),
        entry,
        vacationId,
      },
    });

    redirect(`/vacations/${vacationId}`);
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex w-full items-center gap-2">
            <Link href={`/vacations/${vacation.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
            New Journal Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createJournalEntry} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="entry"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Journal Entry
              </label>
              <textarea
                id="entry"
                name="entry"
                required
                rows={4}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary focus:ring-primary"
                placeholder="Write about your day..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50"
            >
              Save Entry
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
