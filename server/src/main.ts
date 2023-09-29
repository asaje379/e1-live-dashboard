import {
  pubSubOptions,
  assertOptions,
  runWorker,
  QUEUE_NAME,
} from './core/worker';
import { Request, Response } from 'express';
import { Server } from './core/server';
import { Person } from '@prisma/client';
import { Sse } from './core/sse';
import { RmqProducer } from './rmq/rmq-producer';
import { RmqSubscriber } from './rmq/rmq-subscriber';
import { getStats } from './database/service';

const server = new Server();
const app = server.start(3010);

const producer = new RmqProducer();
const subscriber = new RmqSubscriber();

app.post('/register', async (req: Request, res: Response) => {
  console.log('New registration: ', req.body);

  producer.produce<Person>({
    message: req.body as Person,
    queueName: QUEUE_NAME,
  });

  runWorker(QUEUE_NAME);

  res.status(201).json({ msg: 'Registered successfully' });
});

app.get('/stats', async (req: Request, res: Response) => {
  const sse = new Sse(req, res);
  respond();

  subscriber.subscribe<Person>({
    ...pubSubOptions,
    assertOptions,
    consumeOptions: { noAck: true },
    cb: respond,
  });

  async function respond() {
    const stats = await getStats();
    sse.broadcast({ data: stats });
  }
});
