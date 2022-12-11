// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from './base';
import { ChargingSchedule } from './chargingSchedule';

export interface IChargingProfile {
  transactionId?: number;
  stackLevel: number;
  chargingProfilePurpose: string;
  chargingProfileKind: string;
  recurrenceKind?: string;
  validFrom?: string;
  validTo?: string;
  chargingSchedule: ChargingSchedule;
}

@Entity('charging_profile')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ChargingProfile extends BaseEntity implements IChargingProfile {
  @Column({
    nullable: true,
  })
  transactionId?: number;

  @Column({
    nullable: true,
  })
  stackLevel: number;

  @Column({
    nullable: true,
  })
  chargingProfilePurpose: 'ChargePointMaxProfile' | 'TxDefaultProfile' | 'TxProfile';

  @Column({
    nullable: true,
  })
  chargingProfileKind: 'Absolute' | 'Recurring' | 'Relative';

  @Column({
    nullable: true,
    length: 50,
  })
  recurrenceKind?: 'Daily' | 'Weekly';

  @Column({
    nullable: true,
    length: 10,
  })
  validFrom?: string;

  @Column({
    nullable: true,
    length: 10,
  })
  validTo?: string;

  @OneToOne(() => ChargingSchedule, (chargingSchedule) => chargingSchedule.chargingProfile, { cascade: true })
  chargingSchedule: ChargingSchedule;
}
