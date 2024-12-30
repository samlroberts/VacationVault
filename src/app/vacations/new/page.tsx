"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { uploadPhoto } from "../actions/upload";
import { DatePickerWithRange } from "~/components/ui/dateRangePicker";

interface Vacation {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  photoUrl?: string;
  caption?: string;
}

export default function VacationTracker() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [caption, setCaption] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadedPhotoUrl = await uploadPhoto(formData);
        setPhotoUrl(uploadedPhotoUrl);
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVacation: Vacation = {
      id: Date.now(),
      destination,
      startDate,
      endDate,
      photoUrl: photoUrl ?? undefined,
      caption: caption ?? undefined,
    };
    setVacations([...vacations, newVacation]);
    setDestination("");
    setStartDate("");
    setEndDate("");
    setCaption("");
    setPhotoUrl(null);
    setName("");
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
              <Label htmlFor="photo">Photo</Label>
              <Input
                id="photo"
                type="file"
                onChange={handlePhotoUpload}
                accept="image/*"
              />
            </div>
            {photoUrl && (
              <div className="mt-2">
                <Image
                  src={photoUrl}
                  alt="Uploaded vacation photo"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>
            )}
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption to your vacation photo"
              />
            </div>
            <Button type="submit">Add Vacation</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
