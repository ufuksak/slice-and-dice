// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base';
import { Connector } from './connector';
import { TransactionData } from './transactionData';

export interface IStopTransaction {
  connector: Connector;
  idTag?: string;
  meterStop: number;
  transactionId: number;
  reason: string;
  transactionData: TransactionData;
  timestamp: number;
}

@Entity('stop_transaction')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class StopTransaction extends BaseEntity implements IStopTransaction {
  @JoinColumn()
  @OneToOne(() => Connector, (connector) => connector.id, { cascade: true })
  connector: Connector;

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

  @JoinColumn()
  @OneToOne(() => TransactionData, (transactionData) => transactionData.id, { cascade: true })
  transactionData: TransactionData;

  @Column({
    nullable: true,
  })
  timestamp: number;
}
