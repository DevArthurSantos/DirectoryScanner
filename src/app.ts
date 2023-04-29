import express, { json } from 'express';
import cors from 'cors';
import FullScannerController from './modules/FullScanner/FullScanner.controller';
import RobotsScannerController from './modules/RobotsScanner/RobotsScanner.controller';
import SourceScannerController from './modules/SourceScanner/SourceScanner.controller';
import WordListScannerController from './modules/WordListScanner/WordListScanner.controller';
import PainelController from './Painel/Painel.controller';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
  }

  middlewares(): void {
    this.express.use(json());
    this.express.use(cors({
      allowedHeaders: ['Access-Control-Allow-Origin', '*'],
      origin: true,
    }));
  }

  routes(): void {
    this.express.use(SourceScannerController.router);
    this.express.use(RobotsScannerController.router);
    this.express.use(WordListScannerController.router);
    this.express.use(FullScannerController.router);
    this.express.use(PainelController.router);
  }

  listen(port: number): void {
    this.express.listen(port, () => {
      console.log('Server listening');
    });
  }
}

export default new App();
