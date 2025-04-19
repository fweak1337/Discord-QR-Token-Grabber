import express, { Express, Request, Response } from 'express';
import { fileURLToPath } from 'url';
import * as fs from 'fs/promises';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { config } from '../util/config.mts';

class App {
  private app: Express;
  private port: Number;

  constructor() {
    this.app = express();
    this.port = Number(config.port) || 433;

    this.routes();
  }

  private async handleRoot(req: Request, res: Response) {
    res.json({ msg: '/tokens' });
  }

  private async handleTokens(req: Request, res: Response) {
    try {
      res.set('Content-Type', 'text/plain');
      res.send(await fs.readFile(path.join(__dirname, '..', '..', 'tokens.txt'), 'utf8'));
    } catch (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Error reading tokens');
    }
  }

  private routes() {
    this.app.get('/', this.handleRoot);
    this.app.get('/tokens', this.handleTokens);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Website running at http://localhost:${this.port}`);
    });
  }
}

new App().start();
