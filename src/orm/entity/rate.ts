// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base';
import { Connector } from './connector';
import { PriceComponent } from './priceComponent';

export interface IChargingProfile {
  currency?: string;
  price_components?: PriceComponent[];
  connector: Connector;
}

@Entity('rate')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Rate extends BaseEntity implements IChargingProfile {
  @Column({
    nullable: true,
  })
  currency?: string;

  @OneToMany(() => PriceComponent, (priceComponents) => priceComponents.rate, { cascade: true })
  price_components?: PriceComponent[];

  @OneToOne(() => Connector, (connector) => connector.rate)
  connector: Connector;
}
