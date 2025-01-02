import { redirect } from "next/navigation";
import JournalForm from "~/components/journal-form";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function NewJournalEntryPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
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

    const session = await auth();

    if (!session) {
      redirect("/");
    }

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
    <JournalForm
      onSubmit={createJournalEntry}
      vacationId={vacationId}
      isEdit={false}
    />
  );
}
