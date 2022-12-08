import {
  OCPP16MeterValue,
  OCPP16MeterValueMeasurand,
  OCPP16MeterValuePhase,
  OCPP16SampledValue,
} from './1.6/MeterValues';

export type MeterValueMeasurand = OCPP16MeterValueMeasurand;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MeterValueMeasurand = {
  ...OCPP16MeterValueMeasurand,
};

export type MeterValuePhase = OCPP16MeterValuePhase;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MeterValuePhase = {
  ...OCPP16MeterValuePhase,
};

export type SampledValue = OCPP16SampledValue;

export type MeterValue = OCPP16MeterValue;
