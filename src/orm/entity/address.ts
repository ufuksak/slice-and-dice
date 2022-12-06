// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user';

export interface IAddress {
  inCareOf: string;
  line1?: string;
  line2: string;
  city?: string;
  state: string;
  zipcode: string;
  user: User;
}

@Entity('addresses')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Address extends BaseEntity implements IAddress {
  @Column({
    nullable: true,
    length: 50,
  })
  inCareOf: string;

  @Column({
    nullable: true,
    length: 50,
  })
  line1?: string;

  @Column({
    nullable: true,
    length: 50,
  })
  line2: string;

  @Column({
    nullable: true,
    length: 50,
  })
  city?: string;

  @Column({
    nullable: true,
    length: 50,
  })
  state: string;

  @Column({
    nullable: true,
    length: 10,
  })
  zipcode: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;
}
