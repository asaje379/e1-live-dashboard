import { Message, Options, Replies } from 'amqplib';
import { RmqServer } from './rmq-server';
import { RmqAssertExchangeType } from './rmq-publisher';

export interface SubscriberArgs<T> {
  exchangeName: string;
  exchangeType: RmqAssertExchangeType;
  assertOptions?: Options.AssertExchange;
  consumeOptions?: Options.Consume;
  cb: (data: T) => void | Promise<void>;
}

export class RmqSubscriber extends RmqServer {
  constructor(url?: string) {
    super(url);
  }

  getQueue(): Promise<Replies.AssertQueue> {
    return new Promise((resolve, reject) => {
      this.channel?.assertQueue(
        '',
        { exclusive: true },
        (err, queue: Replies.AssertQueue) => {
          if (err) {
            console.log('Unable to assert queue: ', err);
            return reject(undefined);
          }
          resolve(queue);
        },
      );
    });
  }

  async subscribe<T>({
    exchangeName,
    exchangeType,
    assertOptions,
    consumeOptions,
    cb,
  }: SubscriberArgs<T>) {
    this.channel?.assertExchange(exchangeName, exchangeType, assertOptions);

    const queueManager = await this.getQueue();
    if (!queueManager) return;

    const queue = queueManager.queue;
    this.channel?.bindQueue(queue, exchangeName, '');
    this.channel?.consume(
      queue,
      (msg: Message | null) => {
        const received = JSON.parse(msg?.content.toString() ?? '');
        console.log('Subscription data event:', received.data);
        cb(received.data);
      },
      consumeOptions,
    );
  }
}
