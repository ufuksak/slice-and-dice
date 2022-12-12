// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { Chargestation } from './chargestation';
import { Rate } from './rate';

export interface IConnector {
  active: boolean;
  status?: string;
  type: string;
  format: string;
  power_type: string;
  power?: number;
  chargestation?: string;
  rate: Rate;
  chargestationObject: Chargestation;
}

@Entity('connector')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Connector extends BaseEntity implements IConnector {
  @Column({
    nullable: true,
  })
  active: boolean;

  @Column({
    nullable: true,
    length: 50,
  })
  status?: string;

  @Column({
    nullable: true,
    length: 50,
  })
  type: string;

  @Column({
    nullable: true,
  })
  format: string;

  @Column({
    nullable: true,
  })
  power_type: string;

  @Column({
    nullable: true,
  })
  power?: number;

  @Column({
    nullable: true,
  })
  chargestation?: string;

  @JoinColumn()
  @OneToOne(() => Rate, (rate) => rate.connector)
  rate: Rate;

  @ManyToOne(() => Chargestation, (chargestation) => chargestation.connectors)
  chargestationObject: Chargestation;
}
