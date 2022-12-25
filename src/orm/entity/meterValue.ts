// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { SampledValue } from './sampledValue';
import { MeterValueConnector } from './meterValueConnector';

export interface IMeterValue {
  timestamp: string;
  sampledValue: SampledValue[];
  meterValueConnector: MeterValueConnector;
}

@Entity('meter_value')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class MeterValue extends BaseEntity implements IMeterValue {
  @Column({
    nullable: true,
  })
  timestamp: string;

  @OneToMany(() => SampledValue, (sampledValue) => sampledValue.id)
  sampledValue: SampledValue[];

  @ManyToOne(() => MeterValueConnector, (meterValueConnector) => meterValueConnector.meterValue, {
    onDelete: 'CASCADE',
  })
  meterValueConnector: MeterValueConnector;
}
