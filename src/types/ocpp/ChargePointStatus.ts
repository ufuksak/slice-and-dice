import { OCPP16ChargePointStatus } from './1.6/ChargePointStatus';

export type ChargePointStatus = OCPP16ChargePointStatus;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ChargePointStatus = {
  ...OCPP16ChargePointStatus,
};
