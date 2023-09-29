import { Options } from 'amqplib';
import { RmqServer } from './rmq-server';

export interface ProducerPayload<T> {
  queueName: string;
  message: T;
  options?: Options.AssertQueue;
}

export class RmqProducer extends RmqServer {
  constructor(url?: string) {
    super(url);
  }

  async produce<T>({ message, queueName, options }: ProducerPayload<T>) {
    console.log('Start producing: ', message, queueName, options);
    this.channel?.assertQueue(queueName, options);
    this.channel?.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify({ data: message })),
    );
  }
}
