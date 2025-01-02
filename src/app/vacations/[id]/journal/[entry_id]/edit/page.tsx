import { redirect } from "next/navigation";
import JournalForm from "~/components/journal-form";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function EditJournalEntryPage({
  params,
}: {
  params: Promise<{
    id: string;
    entry_id: string;
  }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const vacationId = (await params).id;
  const entryId = (await params).entry_id;

  const journalEntry = await db.journalEntry.findUnique({
    where: {
      id: entryId,
    },
    include: {
      vacation: true,
    },
  });

  if (!journalEntry) {
    redirect("/");
  }

  async function updateJournalEntry(formData: FormData) {
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

    await db.journalEntry.update({
      where: {
        id: entryId,
      },
      data: {
        date: new Date(date),
        entry,
      },
    });

    redirect(`/vacations/${vacationId}`);
  }

  return (
    <JournalForm
      onSubmit={updateJournalEntry}
      defaultValues={{
        date: journalEntry.date.toISOString().split("T")[0],
        entry: journalEntry.entry,
      }}
      vacationId={vacationId}
      isEdit={true}
      onDelete={async () => {
        "use server";

        const session = await auth();

        if (!session) {
          redirect("/");
        }

        await db.journalEntry.delete({
          where: { id: entryId },
        });
        redirect(`/vacations/${vacationId}`);
      }}
    />
  );
}
