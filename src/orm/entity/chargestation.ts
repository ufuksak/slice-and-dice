// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { BootInfo } from './bootInfo';
import { Connector } from './connector';

export interface IChargestation {
  location?: string;
  protocol?: string;
  endpoint?: string;
  static_endpoint?: string;
  online?: boolean;
  active?: boolean;
  public?: boolean;
  model?: string;
  bootInfo?: BootInfo;
  coordinates?: number[];
  connectors?: Connector[];
  lastConnectAt?: string;
  lastDisconnectAt?: string;
  lastMessageAt?: string;
}

@Entity('chargestation')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Chargestation extends BaseEntity implements IChargestation {
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
  @OneToOne(() => BootInfo, (bootInfo) => bootInfo.chargestation)
  bootInfo: BootInfo;

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
