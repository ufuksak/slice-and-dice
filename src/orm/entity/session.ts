// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { ChargeStation } from './chargeStation';
import { User } from './user';

export interface ISession {
  start_time: number;
  terminated_at_timestamp?: number;
  time_limit: number;
  termination_reason?: string;
  chargeStation: ChargeStation;
}

@Entity('session')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Session extends BaseEntity implements ISession {
  @Column({
    nullable: true,
  })
  start_time: number;

  @Column({
    nullable: true,
    length: 50,
  })
  terminated_at_timestamp?: number;

  @Column({
    nullable: true,
    length: 50,
  })
  time_limit: number;

  @Column({
    nullable: true,
    length: 250,
  })
  termination_reason?: string;

  @ManyToOne(() => ChargeStation, (chargeStation) => chargeStation.sessions, { onDelete: 'CASCADE' })
  chargeStation: ChargeStation;

  @ManyToOne(() => User, (user) => user.session, { onDelete: 'CASCADE' })
  user: User;
}
