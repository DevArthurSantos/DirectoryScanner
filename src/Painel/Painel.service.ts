import { type Request, type Response } from 'express'
import cheerio from 'cheerio'
import { readFileSync } from 'fs';

class Painel {
  constructor() {
    this.openPainel = this.openPainel.bind(this);
  }

  async openPainel(req: Request, res: Response) {

    return res.sendFile(__dirname + '/index.html');
  }
}

export default new Painel()
