import cors from 'cors';
import express, { NextFunction, Request, Response, Express, Router } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import expressWinston from 'express-winston';
import httpStatus from 'http-status';
import helmet from 'helmet';
import morgan from 'morgan';
import * as swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import { Logger, getLogger, Config as LoggerConfig } from '../logger';
import { GLOBAL, API } from '../constants';
import ApiError, {
  DetailedError,
  ExtendableError,
  UnauthorizedError,
  MethodNotAllowedError,
  UnsupportedMediaTypeError,
  NotAcceptableError,
  EndpointNotFoundError,
} from '../errors';
import cookieParser from 'cookie-parser';
import { UnauthorizedError as JwtUnauthorizedError } from 'express-jwt';
import Auth from '../middleware/auth';

export { API, GLOBAL } from '../constants';

interface Config {
  router: Router;
  logger: LoggerConfig;
  ignoredAccessLogPaths: string;
  openapiBaseSchema: string;
  env: string;
}

export class App {
  public readonly app: Express;

  private readyState: Boolean = false;

  private readonly logger: Logger;

  private readonly config: Config;

  constructor(appConfig: Config) {
    this.config = appConfig;
    this.app = express();
    // CORS, JSON, Headers & Logger
    const corsHandler = cors({ origin: true });
    this.app
      .use(corsHandler)
      .use(express.urlencoded({ extended: true })) // Support for Form URL Encoded Body
      .use(express.json()) // Support for JSON Body
      .use(helmet())
      .use(morgan('combined'));

    // Auth
    this.app.use(Auth.initialize());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(express.json());
    this.app.use(cookieParser());
    this.logger = getLogger(appConfig.logger);
  }

  public init(): Express {
    this.initLogging();
    this.initSecurity();
    this.initHealth();
    this.initSwaggerUI();
    this.initRoutes();
    this.initErrorTranslation();
    this.initErrorHandling();
    // make sure service will receive HTTP traffic
    this.readyState = true;

    return this.app;
  }

  private initLogging() {
    const winstionLogger = expressWinston.logger({
      meta: false,
      msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
      winstonInstance: this.logger,
      ignoreRoute: (req: Request, res: Response) =>
        this.config.ignoredAccessLogPaths.indexOf(req.url) > -1 && res.statusCode === httpStatus.OK,
    });

    this.app.use(winstionLogger);
  }

  private initSecurity() {
    // security headers decorator
    this.app.use(helmet());
    this.app.use(helmet.frameguard({ action: 'deny' }));
    this.app.disable('x-powered-by');
  }

  private initHealth() {
    // kubernetes liveness probe endpoint
    this.app.get(API.HEALTH_CHECK, async (_req: Request, res: Response) => {
      res.sendStatus(httpStatus.OK);
    });

    // kubernetes readiness probe endpoint
    this.app.get(API.READY_CHECK, async (_req: Request, res: Response) => {
      if (this.readyState) {
        res.sendStatus(httpStatus.OK);
      } else {
        res.sendStatus(httpStatus.SERVICE_UNAVAILABLE);
      }
    });

    this.app.get('/', async (_req: Request, res: Response) => {
      res.sendStatus(httpStatus.OK);
    });
  }

  private initSwaggerUI() {
    const swaggerDocument = YAML.load(this.config.openapiBaseSchema);
    this.app.use(API.SWAGGER_UI, swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  }

  private initRoutes() {
    // request/response body/param validator
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: this.config.openapiBaseSchema,
        validateRequests: true,
        validateResponses: {
          onError: (err) => {
            this.logger.error('Response validation failed with error: %o', err);
          },
        },
      }),
    );

    // main router entry points. all routes must be defined under routes.ts
    this.app.use('/', this.config.router);

    // catches 404 and forwards to error handler
    this.app.use((_req: Request, _res: Response, next: NextFunction) => {
      const err = new ApiError('API endpoint not found', {
        code: 'error.endpoint.not-found',
        status: httpStatus.NOT_FOUND,
        isPublic: true,
      });
      return next(err);
    });
  }

  private openApiErrorTranslation() {
    this.app.use((err: Error, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof OpenApiValidator.error.BadRequest) {
        const details: any[] = err.errors.map((item: any) => ({
          target: item.path,
          message: item.message,
          code: item.code,
        }));

        return next(
          new DetailedError(err.name, details, { status: 400, isPublic: true, code: 'error.request.invalid' }, err),
        );
      }

      if (err instanceof OpenApiValidator.error.Unauthorized || err instanceof JwtUnauthorizedError) {
        return next(new UnauthorizedError(err.message, err));
      }

      if (err instanceof OpenApiValidator.error.NotFound) {
        return next(new EndpointNotFoundError(err.message, err));
      }

      if (err instanceof OpenApiValidator.error.MethodNotAllowed) {
        return next(new MethodNotAllowedError(err.message, err));
      }

      if (err instanceof OpenApiValidator.error.NotAcceptable) {
        return next(new NotAcceptableError(err.message, err));
      }

      if (err instanceof OpenApiValidator.error.UnsupportedMediaType) {
        return next(new UnsupportedMediaTypeError(err.message, err));
      }

      return next(err);
    });
  }

  private initErrorTranslation() {
    this.openApiErrorTranslation();
    // converts error if it's not an instanceOf ApiError
    this.app.use((err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (this.config.env !== GLOBAL.ENV_TEST) {
        this.logger.error(err);
      }

      if (err instanceof SyntaxError) {
        return next(new ApiError(err.message, { status: 400, isPublic: true, code: 'error.request.invalid' }, err));
      }

      if (!(err instanceof ApiError) && err instanceof ExtendableError) {
        const apiError = new ApiError(err.message, { code: err.code }, err);
        return next(apiError);
      }

      if (!(err instanceof ExtendableError)) {
        const apiError = new ApiError(err.message, {}, err);
        return next(apiError);
      }
      return next(err);
    });
  }

  private initErrorHandling() {
    this.app.use((error: ApiError, _req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        return next(error);
      }

      const errorResponse = {
        message: error.isPublic ? error.message : 'An unexpected error has occurred',
        code: error.code,
        stack: this.config.env === GLOBAL.ENV_DEV ? error.stack : undefined,
      };

      if (error instanceof DetailedError) {
        if (error.status != null) {
          res.status(error.status).json({
            ...errorResponse,
            details: error.details,
          });
        }
        return;
      }

      if (error.status != null) {
        res.status(error.status).json(errorResponse);
      }
    });
  }

  public shutdown() {
    this.readyState = false;
  }
}

export default App;
