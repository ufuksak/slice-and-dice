// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, ManyToOne, OneToOne } from 'typeorm'
import { BaseEntity } from './base';
import { ChargingProfile } from './chargingProfile'

export interface IChargingSchedule {
  duration: number;
  startSchedule?: string;
  chargingRateUnit: string;
  startPeriod: number;
  limit: number;
  numberPhases?: number;
  minChargingRate?: number;
}

@Entity('charging_schedule')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ChargingSchedule extends BaseEntity implements IChargingSchedule {
  @Column({
    nullable: true,
  })
  duration: number;

  @Column({
    nullable: true,
    length: 50,
  })
  startSchedule?: string;

  @Column({
    nullable: true,
    length: 50,
  })
  chargingRateUnit: 'W' | 'A';

  @Column({
    nullable: true,
  })
  startPeriod: number;

  @Column({
    nullable: true,
  })
  limit: number;

  @Column({
    nullable: true,
  })
  numberPhases?: number;

  @Column({
    nullable: true,
  })
  minChargingRate?: number;

  @OneToOne(() => ChargingProfile, (chargingProfile) => chargingProfile.chargingSchedule, { onDelete: 'CASCADE' })
  chargingProfile: ChargingProfile;
}
