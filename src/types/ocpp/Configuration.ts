import { OCPP16StandardParametersKey, OCPP16SupportedFeatureProfiles } from './1.6/Configuration';

export type StandardParametersKey = OCPP16StandardParametersKey;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const StandardParametersKey = {
  ...OCPP16StandardParametersKey,
};

export type SupportedFeatureProfiles = OCPP16SupportedFeatureProfiles;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SupportedFeatureProfiles = {
  ...OCPP16SupportedFeatureProfiles,
};

export enum ConnectorPhaseRotation {
  NotApplicable = 'NotApplicable',
  Unknown = 'Unknown',
  RST = 'RST',
  RTS = 'RTS',
  SRT = 'SRT',
  STR = 'STR',
  TRS = 'TRS',
  TSR = 'TSR',
}

export interface OCPPConfigurationKey {
  key: string | StandardParametersKey;
  readonly: boolean;
  value?: string;
}
