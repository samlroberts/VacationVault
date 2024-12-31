"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
// import Link from "next/link";
import { type VacationWithPhotos } from "~/lib/types";
import { Link } from "next-view-transitions";
interface VacationGridProps {
  vacations: VacationWithPhotos[];
}

export default function VacationGrid({ vacations }: VacationGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {vacations.map((vacation) => {
        let photo = vacation.photos[0];
        if (!photo) {
          photo = {
            id: "placeholder",
            url: "https://placehold.co/500x200",
            caption: "No photo",
            userId: "placeholder",
            createdAt: new Date(),
            updatedAt: new Date(),
            vacationId: "placeholder",
          };
        }
        const viewTransitionName = `vacation-photo-${vacation.id}-${photo.id}`;
        return (
          <Card key={vacation.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  style={{ viewTransitionName }}
                  src={photo?.url ?? "https://placehold.co/500x200"}
                  alt={`Photo of ${vacation.destination}`}
                  objectFit="cover"
                  fill={true}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="mb-2 text-xl">
                {vacation.destination}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {new Date(vacation.startDate).toLocaleDateString()} -{" "}
                {new Date(vacation.endDate).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="p-4">
              <Link href={`/vacations/${vacation.id}`}>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
