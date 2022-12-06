import App from './http-server';
import http from 'http';

import {
  port,
  appVersion,
  serverShutdownGracePeriodMs,
  appName,
  loggerLogLevel,
  loggerLogStyle,
  env,
  openapiBaseSchema,
  ignoredAccessLogPaths,
} from './config/config';

import { initLogger, Logger } from './helpers/logger';
import { AppDataSource } from './orm';
import routers from './routes';

interface ServerConfig {
  port: number;
  appVersion: string;
  serverShutdownGracePeriodMs: number;
}

export class Server {
  public config: ServerConfig;

  public httpServer!: http.Server;

  public app: App;

  private logger: Logger;

  constructor(config: ServerConfig) {
    this.config = config;
    this.app = new App({
      router: routers,
      logger: {
        logLevel: loggerLogLevel,
        logStyle: loggerLogStyle,
        appName: appName,
        moduleName: this.constructor.name,
      },
      ignoredAccessLogPaths,
      openapiBaseSchema,
      env,
    });
    this.logger = initLogger(this.constructor.name);
  }

  public async initServer() {
    try {
      await this.start();
    } catch (e) {
      this.logger.error(`Cannot start server  on ${port}. Reason: ${e}`, { version: this.config.appVersion });
      process.exit();
    }
  }

  public async start(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (reason?: Error) => void) => {
      // Start HTTP up the server

      this.httpServer = http.createServer(this.app.init());

      this.httpServer
        .listen(this.config.port, async () => {
          await AppDataSource.initialize();
          this.logger.info(`API listening on port ${port}`, { version: this.config.appVersion });
          this.setupGracefulShutdown();
          resolve();
        })
        .on('error', (err) => {
          if (err) {
            this.logger.error(err.message);
            reject(err);
          }
        });
    });
  }

  public async stop(): Promise<void> {
    let onceClosedServer = new Promise<void>((resolve: () => void): void => {
      this.logger.info('Closing HTTP server...');
      this.httpServer.close(resolve);
    });
    await onceClosedServer;

    this.logger.info('HTTP server closed successfully.');
  }

  private setupGracefulShutdown() {
    this.logger.info('Registering SIGTERM, SIGINT signal handlers...');

    this.registerSignalHandler('SIGTERM');
    this.registerSignalHandler('SIGINT');
  }

  private registerSignalHandler(signalName: string) {
    process.on(signalName, () => {
      this.logger.info(
        `${signalName} signal received: waiting for ${this.config.serverShutdownGracePeriodMs}ms before shutting down HTTP server`,
      );
      this.app.shutdown();

      setTimeout(() => this.stop(), this.config.serverShutdownGracePeriodMs);
    });
  }
}

const server = new Server({
  port,
  appVersion,
  serverShutdownGracePeriodMs,
});

server.initServer();
