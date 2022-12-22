// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { TransactionData } from './transactionData';

export interface IStopTransaction {
  idTag?: string;
  meterStop: number;
  transactionId: number;
  reason: string;
  transactionData: TransactionData[];
  timestamp: string;
}

@Entity('stop_transaction')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class StopTransaction extends BaseEntity implements IStopTransaction {
  @Column({
    nullable: true,
  })
  idTag?: string;

  @Column({
    nullable: true,
  })
  meterStop: number;

  @Column()
  transactionId: number;

  @Column()
  reason: string;

  @OneToMany(() => TransactionData, (transactionData) => transactionData.id, { cascade: true })
  transactionData: TransactionData[];

  @Column({
    nullable: true,
  })
  timestamp: string;
}
