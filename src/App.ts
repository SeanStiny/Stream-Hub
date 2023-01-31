import express, { Application } from 'express';
import { logger } from './logger';

export class App {
  private app: Application;

  constructor(
    private port: number,
    private controllers: RouteController[],
    private listeners: ServiceEventListener[]
  ) {
    this.app = express();
  }

  public start() {
    this.initRoutes();
    this.initListeners();
    this.app.listen(this.port);
    logger.info(`Application listening on port ${this.port}`);
  }

  private initRoutes() {
    this.controllers.forEach((controller) => {
      controller.useRoutes(this.app);
    });
  }

  private initListeners() {
    this.listeners.forEach((listener) => {
      listener.listen();
    });
  }
}

export interface RouteController {
  useRoutes(app: Application): void;
}

export interface ServiceEventListener {
  listen(): void;
}
