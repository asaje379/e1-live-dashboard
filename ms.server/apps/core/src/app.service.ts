import { PrismaService } from '@app/prisma';
import { Globals, PersonPayload } from '@app/shared';
import { sendPushEvent } from '@asaje/sse-push-event-server';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Gender } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(
    @Inject(Globals.workerName) private client: ClientProxy,
    private prisma: PrismaService,
  ) {}

  registerPerson(person: PersonPayload) {
    const response = this.client.send(Globals.taskName, person);
    response.subscribe({
      next: async () => {
        const data = await this.getStats();
        sendPushEvent({ event: '', data });
      },
    });
  }

  async getStats() {
    const totalPersons = await this.prisma.person.count();
    const totalMales = await this.prisma.person.count({
      where: { gender: Gender.M },
    });
    const totalFemales = await this.prisma.person.count({
      where: { gender: Gender.F },
    });

    const persons = await this.prisma.person.findMany();
    return { persons, totalFemales, totalMales, totalPersons };
  }
}
