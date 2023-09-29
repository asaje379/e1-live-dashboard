import express, { Express } from 'express';
import cors from 'cors';

export class Server {
  private app: Express;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
  }

  start(port = 5000) {
    this.app.listen(port, () => {
      console.log('Server is running...');
    });
    return this.app;
  }
}
