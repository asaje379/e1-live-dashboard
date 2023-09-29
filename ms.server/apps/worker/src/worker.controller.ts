import { Controller } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Globals, PersonPayload } from '@app/shared';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @MessagePattern(Globals.taskName)
  async register(@Payload() data: PersonPayload) {
    await this.workerService.registerPerson(data);
    return { msg: 'done' };
  }
}
