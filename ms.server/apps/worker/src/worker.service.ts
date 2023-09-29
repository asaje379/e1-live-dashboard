import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { Gender } from '@prisma/client';

export interface Person {
  firstname: string;
  lastname: string;
  gender: Gender;
}

export type PersonWithId = Person & { id: number };

@Injectable()
export class WorkerService {
  constructor(private prisma: PrismaService) {}

  async registerPerson(person: Person) {
    try {
      return await this.prisma.person.create({ data: person });
    } catch (error) {
      console.log('Unable to register person: ', error);
    }
  }
}
