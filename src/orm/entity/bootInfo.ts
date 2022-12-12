// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base';
import { Chargestation } from './chargestation';

export interface IBootInfo {
  chargeBoxSerialNumber?: string;
  chargePointModel?: string;
  chargePointSerialNumber?: string;
  chargePointVendor?: string;
  firmwareVersion?: string;
  iccid?: string;
  imsi?: string;
  chargestation: Chargestation;
}

@Entity('boot_info')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BootInfo extends BaseEntity implements IBootInfo {
  @Column({
    nullable: true,
  })
  chargeBoxSerialNumber: string;

  @Column({
    nullable: true,
  })
  chargePointModel?: string;

  @Column({
    nullable: true,
  })
  chargePointSerialNumber: string;

  @Column({
    nullable: true,
  })
  chargePointVendor: string;

  @Column({
    nullable: true,
  })
  firmwareVersion: string;

  @Column({
    nullable: true,
  })
  iccid?: string;

  @Column({
    nullable: true,
  })
  imsi?: string;

  @OneToOne(() => Chargestation, (chargestation) => chargestation.bootInfo)
  chargestation: Chargestation;
}
