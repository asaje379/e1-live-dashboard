import { Body, Controller, Post, Res, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { PersonPayload } from '@app/shared';
import {
  initPushEventSubscription,
  sendPushEvent,
} from '@asaje/sse-push-event-server';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async register(@Body() person: PersonPayload) {
    return this.appService.registerPerson(person);
  }

  @Sse('stats')
  async stats(@Res() res: Response) {
    const { value, destroy } = initPushEventSubscription();
    res.on('close', () => {
      destroy();
    });

    const data = await this.appService.getStats();
    console.log(data);
    setTimeout(async () => {
      sendPushEvent({ event: '', data });
    }, 500);

    return value;
  }
}
