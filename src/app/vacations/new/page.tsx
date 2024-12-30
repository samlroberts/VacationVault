"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { DatePickerWithRange } from "~/components/ui/dateRangePicker";

interface Vacation {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export default function VacationTracker() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newVacation: Vacation = {
        id: Date.now(),
        destination,
        startDate,
        endDate,
        description: description ?? undefined,
      };

      setVacations([...vacations, newVacation]);

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
            <Button type="submit">Add Vacation</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
