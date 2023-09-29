import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Globals } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [Globals.rmqUrl],
        queue: Globals.queueName,
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.listen();
}
bootstrap();
