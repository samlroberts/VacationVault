"use client";

import { ArrowLeft } from "lucide-react";
import { Link } from "next-view-transitions";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface JournalFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  defaultValues?: {
    date?: string;
    entry?: string;
  };
  vacationId: string;
  isEdit?: boolean;
  onDelete?: () => Promise<void>;
}

export default function JournalForm({
  onSubmit,
  defaultValues,
  vacationId,
  isEdit = false,
  onDelete,
}: JournalFormProps) {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex w-full items-center gap-2">
            <Link href={`/vacations/${vacationId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
            {isEdit ? "Edit Journal Entry" : "New Journal Entry"}
            {isEdit && onDelete && (
              <form action={onDelete} className="ml-auto">
                <Button
                  type="submit"
                  variant="destructive"
                  className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Entry
                </Button>
              </form>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="flex flex-col gap-4">
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
                defaultValue={defaultValues?.date}
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
                defaultValue={defaultValues?.entry}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary focus:ring-primary"
                placeholder="Write about your day..."
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50"
              >
                {isEdit ? "Update Entry" : "Save Entry"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
