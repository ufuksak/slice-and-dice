// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { PriceComponent } from './priceComponent';

export interface IChargingProfile {
  currency?: string;
  price_components?: PriceComponent[];
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
}
