import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Globals } from '@app/shared';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: Globals.workerName,
        transport: Transport.RMQ,
        options: {
          urls: [Globals.rmqUrl],
          queue: Globals.queueName,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
