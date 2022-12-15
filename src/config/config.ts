import dotenv from 'dotenv';
import Joi from 'joi';

import { API, GLOBAL } from '../constants';

dotenv.config();

const isEnv = (environment: string): boolean => {
  return process.env.NODE_ENV === environment;
};

const envVarSchema = Joi.object({
  // Application
  APP_VERSION: Joi.string().default('0.0.2'),
  APP_NAME: Joi.string().default('api'),
  NODE_ENV: Joi.string().allow(GLOBAL.ENV_DEV, GLOBAL.ENV_TEST, GLOBAL.ENV_PROD).default(GLOBAL.ENV_DEV),
  PORT: Joi.string().default(4200),
  FQDN: Joi.string().default('localhost'),
  OPENAPI_BASE_SCHEMA: Joi.string().default('src/openapi/api.schema.yml'),
  IGNORED_ACCESS_LOG_PATHS: Joi.string().default(`${API.HEALTH_CHECK},${API.READY_CHECK}`),
  SERVER_SHUTDOWN_GRACE_PERIOD_MS: Joi.number().default(2000),

  // Logger
  LOGGER_LOG_LEVEL: Joi.string().allow('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly').default('info'),
  LOGGER_LOG_STYLE: Joi.string().allow('json', 'cli').default('json'),

  // Database
  DATABASE_TYPE: isEnv(GLOBAL.ENV_TEST) ? Joi.string().default('mysql') : Joi.string().required(),
  MYSQL_USERNAME: isEnv(GLOBAL.ENV_TEST) ? Joi.string().default('root') : Joi.string().required(),
  MYSQL_PASSWORD: isEnv(GLOBAL.ENV_TEST) ? Joi.string().default('test') : Joi.string().required(),
  MYSQL_DATABASE: isEnv(GLOBAL.ENV_TEST) ? Joi.string().default('sd') : Joi.string().required(),
  MYSQL_HOST: isEnv(GLOBAL.ENV_TEST) ? Joi.string().default('localhost') : Joi.string().required(),
  MYSQL_PORT: isEnv(GLOBAL.ENV_TEST) ? Joi.string().default(3306) : Joi.string().required(),

  // Redis
  REDIS_HOST: isEnv(GLOBAL.ENV_TEST) ? Joi.string().default('localhost') : Joi.string().required(),
  REDIS_PORT: isEnv(GLOBAL.ENV_TEST) ? Joi.string().default(6379) : Joi.string().required(),

  //AWS
  AWS_REGION: isEnv(GLOBAL.ENV_TEST) ? Joi.string() : Joi.string().required(),

  // email
  NO_REPLY_EMAIL_ADDRESS: Joi.string().default('noreply@casion.com'),
  DEFAULT_EMAIL_RECEIVER: Joi.string().default('ufuksakar@gmail.com'),
  SMTP_HOST_NAME: Joi.string().default('smtp.gmail.com'),
  SMTP_PASSWORD: Joi.string().default('glvpbyivkejrylgt'),
  SITE_URL: Joi.string().default('http://localhost:3001'),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Application
export const appName = envVars.APP_NAME;
export const appVersion = envVars.APP_VERSION;
export const env = envVars.NODE_ENV;
export const port = envVars.PORT;
export const domain = envVars.FQDN;
export const openapiBaseSchema = envVars.OPENAPI_BASE_SCHEMA;
export const ignoredAccessLogPaths = envVars.IGNORED_ACCESS_LOG_PATHS.split(',');
export const serverShutdownGracePeriodMs = envVars.SERVER_SHUTDOWN_GRACE_PERIOD_MS;

// Logger
export const loggerLogLevel = envVars.LOGGER_LOG_LEVEL;
export const loggerLogStyle = envVars.LOGGER_LOG_STYLE;

// Database
export const dbType = isEnv(GLOBAL.ENV_TEST) ? 'mysql' : envVars.DATABASE_TYPE;
export const dbHostName = isEnv(GLOBAL.ENV_TEST) ? 'localhost' : envVars.MYSQL_HOST;
export const dbDBName = isEnv(GLOBAL.ENV_TEST) ? 'sd' : envVars.MYSQL_DATABASE;
export const dbUser = isEnv(GLOBAL.ENV_TEST) ? 'root' : envVars.MYSQL_USERNAME;
export const dbPassword = isEnv(GLOBAL.ENV_TEST) ? 'test' : envVars.MYSQL_PASSWORD;
export const dbPort = isEnv(GLOBAL.ENV_TEST) ? 3306 : envVars.MYSQL_PORT;

// Redis
export const redisHost = isEnv(GLOBAL.ENV_TEST) ? 'localhost' : envVars.REDIS_HOST;
export const redisPort = isEnv(GLOBAL.ENV_TEST) ? '6379' : envVars.REDIS_PORT;
export const redisPassword = '';

// AWS General
export const awsRegion = isEnv(GLOBAL.ENV_TEST) ? 'eu-west-1' : envVars.AWS_REGION;

// email
export const noReplyEmailAddress = envVars.NO_REPLY_EMAIL_ADDRESS;
export const receiverEmailAddress = envVars.DEFAULT_EMAIL_RECEIVER;
export const smtpHostname = envVars.SMTP_HOST_NAME;
export const smtpPassword = envVars.SMTP_PASSWORD;
export const siteurl = envVars.SITE_URL;
