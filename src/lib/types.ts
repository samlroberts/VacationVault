import { type Prisma } from "@prisma/client";

export type VacationWithPhotos = Prisma.VacationGetPayload<{
  include: { photos: true };
}>;
