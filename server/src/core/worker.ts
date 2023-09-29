import { Person } from '@prisma/client';
import { RmqConsumer } from '../rmq/rmq-consumer';
import { registerPerson } from '../database/service';
import { RmqAssertExchangeType, RmqPublisher } from '../rmq/rmq-publisher';

export const QUEUE_NAME = '_live-dash-registry_';

export const pubSubOptions = {
  exchangeName: 'live-dash',
  exchangeType: RmqAssertExchangeType.FANOUT,
};
export const assertOptions = { durable: false };

const consumer = new RmqConsumer();
const publisher = new RmqPublisher();

export function runWorker(queueName: string) {
  console.log('Start worker');

  consumer.consume<Person>({
    queueName,
    cb: async (person: Person) => {
      await registerPerson(person);

      publisher.publish({
        message: person,
        options: assertOptions,
        ...pubSubOptions,
      });
    },
  });
}
