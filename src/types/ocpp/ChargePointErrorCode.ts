import { OCPP16ChargePointErrorCode } from './1.6/ChargePointErrorCode';

export type ChargePointErrorCode = OCPP16ChargePointErrorCode;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ChargePointErrorCode = {
  ...OCPP16ChargePointErrorCode,
};
