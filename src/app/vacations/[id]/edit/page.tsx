"use client";

import { useEffect, use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { DatePickerWithRange } from "~/components/ui/dateRangePicker";

export default function EditVacation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const vacationId = use(params).id;

  const [readyToRender, setReadyToRender] = useState(false);

  const { data: vacation } = api.vacation.getById.useQuery({ id: vacationId });
  const { mutateAsync: updateVacation, isPending } =
    api.vacation.update.useMutation();

  // Add this new state to track the initial date range
  const [initialDateRange, setInitialDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [formData, setFormData] = useState<{
    name: string;
    destination: string;
    description: string;
    startDate: Date;
    endDate: Date;
  }>({
    name: vacation?.name ?? "",
    destination: vacation?.destination ?? "",
    description: vacation?.description ?? "",
    startDate: new Date(vacation?.startDate ?? ""),
    endDate: new Date(vacation?.endDate ?? ""),
  });

  useEffect(() => {
    if (vacation) {
      setFormData({
        name: vacation.name,
        destination: vacation.destination ?? "",
        description: vacation.description ?? "",
        startDate: new Date(vacation.startDate),
        endDate: new Date(vacation.endDate),
      });
      setInitialDateRange({
        from: new Date(vacation.startDate),
        to: new Date(vacation.endDate),
      });
      setReadyToRender(true);
    }
  }, [vacation]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateVacation({
        id: vacationId,
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
      });
      router.push(`/vacations/${vacationId}`);
    } catch (error) {
      console.error("Error updating vacation:", error);
    }
  };

  if (!vacation || !readyToRender) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Vacation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <Label htmlFor="date">Date Range</Label>

            <DatePickerWithRange
              className="w-full"
              defaultDateRange={initialDateRange}
              onDateChange={(dateRange) => {
                const { from, to } = dateRange;
                if (from && to) {
                  setFormData((prev) => ({
                    ...prev,
                    startDate: from,
                    endDate: to,
                  }));
                }
              }}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/vacations/${vacationId}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
