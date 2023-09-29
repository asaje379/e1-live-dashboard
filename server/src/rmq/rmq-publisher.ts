import { Options } from 'amqplib';
import { RmqServer } from './rmq-server';

export enum RmqAssertExchangeType {
  DIRECT = 'direct',
  FANOUT = 'fanout',
  HEADERS = 'headers',
  TOPIC = 'topic',
}

export interface PublisherPayload<T> {
  exchangeName: string;
  exchangeType: RmqAssertExchangeType;
  message: T;
  options?: Options.AssertExchange;
}

export class RmqPublisher extends RmqServer {
  constructor(url?: string) {
    super(url);
  }

  async publish<T>({
    exchangeName,
    exchangeType,
    message,
    options,
  }: PublisherPayload<T>) {
    console.log('New publication: ', message);
    this.channel?.assertExchange(exchangeName, exchangeType, options);
    this.channel?.publish(
      exchangeName,
      '',
      Buffer.from(JSON.stringify({ data: message })),
    );
  }
}
