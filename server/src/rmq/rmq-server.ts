import amqp, { Channel, Connection } from 'amqplib/callback_api';

export class RmqServer {
  protected channel: Channel | undefined;

  constructor(url?: string) {
    this.init(url);
  }

  protected connect(
    url: string = 'amqp://127.0.0.1:5672',
  ): Promise<Connection | undefined> {
    return new Promise((resolve, reject) => {
      amqp.connect(url, (err, connection) => {
        if (err) {
          console.log('Unable to connect to RabbitMQ server: ', err);
          return reject(undefined);
        }
        resolve(connection);
      });
    });
  }

  protected setChannel(connection: Connection) {
    return new Promise((resolve, reject) => {
      connection.createChannel((err, channel) => {
        if (err) {
          console.log('Unable to create channel: ', err);
          return reject(undefined);
        }
        this.channel = channel;
        resolve(undefined);
      });
    });
  }

  protected async init(url?: string) {
    const connection = await this.connect(url);
    if (connection) await this.setChannel(connection);
  }

  /** DEPRECATED */
  protected deprecatedInit(url: string) {
    amqp.connect(url, (err, connection) => {
      if (err) {
        console.log('Unable to connect to RabbitMQ server: ', err);
        throw err;
      }
      connection.createChannel((_err, channel) => {
        if (_err) {
          console.log('Unable to create channel: ', _err);
          throw _err;
        }
        this.channel = channel;
      });
    });
  }
}
