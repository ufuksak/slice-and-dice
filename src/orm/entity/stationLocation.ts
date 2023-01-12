// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { ChargeStation } from './chargeStation';

export interface IStationLocation {
  longitude: number;
  latitude?: number;
  name: string;
  kwh_7_is_available: boolean;
  kwh_22_is_available?: boolean;
}

@Entity('location')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class StationLocation extends BaseEntity implements IStationLocation {
  @Column({
    nullable: true,
  })
  longitude: number;

  @Column({
    nullable: true,
  })
  latitude?: number;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  kwh_7_is_available: boolean;

  @Column({
    nullable: true,
  })
  kwh_22_is_available?: boolean;

  @JoinColumn()
  @OneToOne(() => ChargeStation, (chargeStation) => chargeStation.stationLocation)
  chargeStation: ChargeStation;
}
