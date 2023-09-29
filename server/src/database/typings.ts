import { Gender } from '@prisma/client';

export interface Person {
  firstname: string;
  lastname: string;
  gender: Gender;
}

export type PersonWithId = Person & { id: number };
