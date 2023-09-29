import { Message, Options } from 'amqplib';
import { RmqServer } from './rmq-server';

export interface ConsumerArgs<T> {
  queueName: string;
  assertOptions?: Options.AssertQueue;
  consumeOptions?: Options.Consume;
  cb: (data: T) => void | Promise<void>;
}

export class RmqConsumer extends RmqServer {
  constructor(url?: string) {
    super(url);
  }

  consume<T>({
    cb,
    queueName,
    assertOptions,
    consumeOptions,
  }: ConsumerArgs<T>) {
    console.log('Consume', queueName);
    this.channel?.assertQueue(queueName, assertOptions, console.log);
    this.channel?.consume(
      queueName,
      (msg: Message | null) => {
        const received = JSON.parse(msg?.content.toString() ?? '');
        console.log('Start consuming:', received.data);
        cb(received.data);
      },
      consumeOptions,
    );
  }
}
