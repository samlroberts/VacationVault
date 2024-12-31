"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { DatePickerWithRange } from "~/components/ui/dateRangePicker";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function VacationTracker() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  const { mutate: createVacation } = api.vacation.create.useMutation({
    onSuccess: () => {
      toast.success("Vacation created successfully");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      createVacation({
        name,
        destination,
        startDate,
        endDate,
        description,
      });

      // Clean up
      setDestination("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setName("");
    } catch (error) {
      console.error("Error saving vacation:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Vacation Tracker</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Vacation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Trip Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date Range</Label>
              <DatePickerWithRange
                className="w-full"
                onDateChange={(dateRange) => {
                  if (dateRange.from && dateRange.to) {
                    setStartDate(dateRange.from.toISOString());
                    setEndDate(dateRange.to.toISOString());
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="caption">Trip Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description to your vacation"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                style={{ viewTransitionName: "add-vacation-button" }}
              >
                Add Vacation
              </Button>
              <Button variant="secondary" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
