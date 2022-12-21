// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm'
import { Address } from './address';
import { BaseEntity } from './base';

export interface IChargerItem {
  picture?: string;
  name?: string;
  type?: string;
  active?: boolean;
  startChargeOption: string;
  locationInfo?: string;
  prices: number;
  lastUsed: number;
  googleMapSupport: string;
  favorite: string;
  shareLocation: string;
  officialAvailableFacilities: string;
  hoursOfOperation: string;
  addresses: Address;
}

@Entity('charger_item')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ChargerItem extends BaseEntity implements IChargerItem {
  @Column({
    nullable: true,
  })
  picture: string;

  @Column({
    nullable: true,
  })
  name?: string;

  @Column({
    nullable: true,
  })
  type: string;

  @Column({
    nullable: true,
  })
  active?: boolean;

  @Column({
    nullable: true,
  })
  startChargeOption: string;

  @Column({
    nullable: true,
  })
  locationInfo?: string;

  @Column({
    nullable: true,
  })
  prices: number;

  @Column({
    nullable: true,
  })
  lastUsed: number;

  @Column({
    nullable: true,
  })
  googleMapSupport: string;

  @Column({
    nullable: true,
  })
  favorite: string;

  @Column({
    nullable: true,
  })
  shareLocation: string;

  @Column({
    nullable: true,
  })
  officialAvailableFacilities: string;

  @Column({
    nullable: true,
  })
  hoursOfOperation: string;

  @JoinColumn()
  @OneToOne(() => Address, (address) => address.id, { cascade: true })
  addresses: Address;
}
