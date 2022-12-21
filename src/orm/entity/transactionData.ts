// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base';
import { SampledValue } from './sampledValue';
import { StopTransaction } from './stopTransaction';

export interface ITransactionData {
  timestamp: number;
  sampledValue: SampledValue[];
}

@Entity('transaction_data')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TransactionData extends BaseEntity implements ITransactionData {
  @Column({
    nullable: true,
  })
  timestamp: number;

  @JoinColumn()
  @OneToOne(() => TransactionData, (transactionData) => transactionData.id, { cascade: true })
  stopTransaction: StopTransaction;

  @OneToMany(() => SampledValue, (sampledValue) => sampledValue.transactionData, { cascade: true })
  sampledValue: SampledValue[];
}
