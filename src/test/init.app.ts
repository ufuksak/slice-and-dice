import App from '../http-server';
import routes from '../routes';
import {
  appName,
  loggerLogLevel,
  loggerLogStyle,
  env,
  openapiBaseSchema,
  ignoredAccessLogPaths,
} from '../config/config';

const appConfig = {
  router: routes,
  logger: { logLevel: loggerLogLevel, logStyle: loggerLogStyle, appName: appName, moduleName: 'App' },
  ignoredAccessLogPaths,
  openapiBaseSchema,
  env,
};

// This acts as sort of a Application factory for tests
export const app = new App(appConfig).init();
