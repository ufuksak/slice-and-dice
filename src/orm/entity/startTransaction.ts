// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base';
import { Connector } from './connector';
import { Reservation } from './reserve';

export interface IStartTransaction {
  connector: Connector;
  idTag?: string;
  meterStart: number;
  reservation: Reservation;
  timestamp: number;
}

@Entity('start_transaction')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class StartTransaction extends BaseEntity implements IStartTransaction {
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
  meterStart: number;

  @JoinColumn()
  @OneToOne(() => Reservation, (reservation) => reservation.id, { cascade: true })
  reservation: Reservation;

  @Column({
    nullable: true,
  })
  timestamp: number;
}
