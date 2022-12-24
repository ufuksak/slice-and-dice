// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base';
import { Connector } from './connector';

export interface IReservation {
  connector: Connector;
  expiryDate?: number;
  idTag?: string;
  parentIdTag: string;
}

@Entity('reservation')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Reservation extends BaseEntity implements IReservation {
  @JoinColumn()
  @OneToOne(() => Connector, (connector) => connector.id, { cascade: true })
  connector: Connector;

  @Column({
    nullable: true,
  })
  expiryDate?: number;

  @Column({
    nullable: true,
  })
  idTag?: string;

  @Column({
    nullable: true,
  })
  parentIdTag: string;

  @Column({
    nullable: true,
  })
  status: string;
}
