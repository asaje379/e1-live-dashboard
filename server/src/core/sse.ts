import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

interface SseClient {
  id: string;
  response: Response;
}

export class Sse {
  static clients: SseClient[] = [];

  constructor(req: Request, res: Response) {
    const newClient = { id: randomUUID(), response: res };
    Sse.clients.push(newClient);
    this.handleDisconnection(req, newClient.id);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    });
  }

  handleDisconnection(req: Request, id: string) {
    req.on('close', () => {
      Sse.clients = Sse.clients.filter((client) => client.id !== id);
    });
  }

  broadcast<T>(data: T) {
    for (const client of Sse.clients) {
      client.response.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }
}
