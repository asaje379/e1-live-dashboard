import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export const Globals = {
  queueName: 'live-dash-worker-queue',
  workerName: 'WORKER_SERVICE',
  rmqUrl: 'amqp://127.0.0.1:5672',
  taskName: 'register.event',
};

export class PersonPayload {
  @ApiProperty() firstname: string;
  @ApiProperty() lastname: string;
  @ApiProperty({ enum: Gender }) gender: Gender;
}
