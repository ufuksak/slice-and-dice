// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { BootInfo } from './bootInfo';
import { Connector } from './connector';
import { Session } from './session';
import { StationLocation } from './stationLocation';

export interface IChargeStation {
  location?: string;
  protocol?: string;
  endpoint?: string;
  static_endpoint?: string;
  online?: boolean;
  active?: boolean;
  public?: boolean;
  model?: string;
  bootInfo?: BootInfo;
  stationLocation: StationLocation;
  sessions: Session[];
  coordinates?: number[];
  connectors?: Connector[];
  lastConnectAt?: string;
  lastDisconnectAt?: string;
  lastMessageAt?: string;
}

@Entity('charge_station')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ChargeStation extends BaseEntity implements IChargeStation {
  @Column({
    nullable: true,
  })
  location: string;

  @Column({
    nullable: true,
  })
  protocol?: string;

  @Column({
    nullable: true,
  })
  endpoint: string;

  @Column({
    nullable: true,
  })
  static_endpoint: string;

  @Column({
    nullable: true,
  })
  online: boolean;

  @Column({
    nullable: true,
  })
  active?: boolean;

  @Column({
    nullable: true,
  })
  public?: boolean;

  @Column({
    nullable: true,
  })
  model: string;

  @JoinColumn()
  @OneToOne(() => BootInfo, (bootInfo) => bootInfo.chargeStation)
  bootInfo: BootInfo;

  @JoinColumn()
  @OneToOne(() => StationLocation, (stationLocation) => stationLocation.chargeStation)
  stationLocation: StationLocation;

  @OneToMany(() => Session, (session) => session.chargeStation)
  sessions: Session[];

  @Column('simple-array', {
    nullable: true,
  })
  coordinates?: number[];

  @OneToMany(() => Connector, (connector) => connector.chargestationObject)
  connectors: Connector[];

  @Column({
    nullable: true,
  })
  lastConnectAt?: string;

  @Column({
    nullable: true,
  })
  lastDisconnectAt?: string;

  @Column({
    nullable: true,
  })
  lastMessageAt?: string;
}
