import {
  OCPP16AuthorizationStatus,
  OCPP16AuthorizeResponse,
  OCPP16StartTransactionResponse,
  OCPP16StopTransactionReason,
  OCPP16StopTransactionResponse,
} from './1.6/Transaction';

export type AuthorizationStatus = OCPP16AuthorizationStatus;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthorizationStatus = {
  ...OCPP16AuthorizationStatus,
};

export type AuthorizeResponse = OCPP16AuthorizeResponse;

export type StopTransactionReason = OCPP16StopTransactionReason;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const StopTransactionReason = {
  ...OCPP16StopTransactionReason,
};

export type StartTransactionResponse = OCPP16StartTransactionResponse;

export type StopTransactionResponse = OCPP16StopTransactionResponse;
