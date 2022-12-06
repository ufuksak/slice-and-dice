import { loggerLogLevel, loggerLogStyle, appName } from '../config/config';
import { getLogger, Logger } from '../logger';

export { Logger } from '../logger';

export const initLogger = (moduleName: string): Logger => {
  return getLogger({ logLevel: loggerLogLevel, logStyle: loggerLogStyle, appName, moduleName });
};
