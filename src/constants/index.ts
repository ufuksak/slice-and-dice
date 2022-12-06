export const GLOBAL = {
  ENV_DEV: 'development',
  ENV_TEST: 'test',
  ENV_PROD: 'production',
} as const;

export const API = {
  HEALTH_CHECK: '/health-check',
  READY_CHECK: '/ready-check',
  SWAGGER_UI: '/api-docs',
} as const;

export const ROUTES = {
  AUTH: '/auth',
};
