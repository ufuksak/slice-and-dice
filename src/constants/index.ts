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

export enum BarcodeReaders {
  'code-128' = 'code-128',
  'code-2of5' = 'code-2of5',
  'code-39' = 'code-39',
  'code-93' = 'code-93',
  'ean-13' = 'file:///home/ufuk/slice-dice.postman_collection.json\nean-13',
  'ean-8' = 'ean-8',
  'codabar' = 'codabar',
}
