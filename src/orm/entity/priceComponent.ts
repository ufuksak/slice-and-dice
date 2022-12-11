// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { Rate } from './rate';

export interface IPriceComponent {
  tax?: number;
  type?: string;
  price?: number;
  grace_period?: number;
  rate: Rate;
}

@Entity('price_component')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PriceComponent extends BaseEntity implements IPriceComponent {
  @Column({
    nullable: true,
  })
  tax?: number;

  @Column({
    nullable: true,
  })
  type?: string;

  @Column({
    nullable: true,
  })
  price?: number;

  @Column({
    nullable: true,
  })
  grace_period?: number;

  @ManyToOne(() => Rate, (rate) => rate.price_components, { onDelete: 'CASCADE' })
  rate: Rate;
}
