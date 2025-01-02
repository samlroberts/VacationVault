import { type Prisma } from "@prisma/client";

export type VacationWithAllData = Prisma.VacationGetPayload<{
  include: { photos: true; journal: true };
}>;
