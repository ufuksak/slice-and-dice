// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base';
import { Connector } from './connector';
import { MeterValue } from './meterValue';

export interface IMeterValue {
  connector: Connector;
  transactionId?: string;
  meterValue: MeterValue[];
}

@Entity('meter_value_connector')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class MeterValueConnector extends BaseEntity implements IMeterValue {
  @JoinColumn()
  @OneToOne(() => Connector, (connector) => connector.id, { cascade: true })
  connector: Connector;

  @Column({
    nullable: true,
  })
  transactionId?: string;

  @OneToMany(() => MeterValue, (meterValue) => meterValue.meterValueConnector, { cascade: true })
  meterValue: MeterValue[];
}
