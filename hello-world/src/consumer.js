import amqp from 'amqplib/callback_api.js';

export function run() {
  amqp.connect('amqp://127.0.0.1:5672', (err, connection) => {
    if (err) {
      console.log('Unable to connect to RabbitMQ server: ', err);
      throw 'Unable to connect to RabbitMQ server: ';
    }
    connection.createChannel((err, channel) => {
      if (err) {
        console.log('Unable to create channel: ', err);
        throw 'Unable to create channel: ';
      }

      const queue = 'hello-world_queue';

      channel.assertQueue(queue, { durable: false });
      channel.consume(queue, (msg) => {
        console.log('Msg: ', msg?.content.toString());
      });
    });
  });
}

run();
