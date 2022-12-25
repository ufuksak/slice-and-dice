// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { TransactionData } from './transactionData';
import { MeterValue } from './meterValue';

export interface ISampledValue {
  value: string;
  context: string;
  format: string;
  measurand: string;
  phase: string;
  location: string;
  transactionData: TransactionData;
}

@Entity('sampled_value')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class SampledValue extends BaseEntity implements ISampledValue {
  @Column({
    nullable: true,
  })
  value: string;

  @Column({
    nullable: true,
  })
  context: string;

  @Column({
    nullable: true,
  })
  format: string;

  @Column({
    nullable: true,
  })
  measurand: string;

  @Column({
    nullable: true,
  })
  phase: string;

  @Column({
    nullable: true,
  })
  location: string;

  @Column({
    nullable: true,
  })
  unit: string;

  @ManyToOne(() => TransactionData, (transactionData) => transactionData.id, { onDelete: 'CASCADE' })
  transactionData: TransactionData;

  @ManyToOne(() => MeterValue, (meterValue) => meterValue.sampledValue, { onDelete: 'CASCADE' })
  meterValue: MeterValue;
}
