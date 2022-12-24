// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user';
import { Currency } from '../../types/CurrencyTypes';
import { ChargeStatus } from '../../types/ChargeTypes';
import { Organization } from './organization';
import { PaymentMethod } from './paymentMethod';

export interface IChargeStoredValues {
  organizationId: string;
  amount: number;
  currency: Currency;
  description: string;
  status: ChargeStatus;
  refundReason: string;
  userId: string;
  user?: User;
  paymentMethodId: string;
  externalId: string;
  requestId?: string;
}

@Entity('charge')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Charge extends BaseEntity implements IChargeStoredValues {
  @Column({
    nullable: true,
  })
  public organizationId: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  public organization: Organization;

  @Column({
    nullable: true,
  })
  public userId: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  public amount: number;

  @Column()
  public currency: Currency;

  @Column({
    nullable: true,
  })
  public description: string;

  @Column({
    nullable: true,
  })
  public refundReason: string;

  @Column()
  public status: ChargeStatus;

  @Column()
  public paymentMethodId: string;

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.charges, { onDelete: 'CASCADE' })
  public paymentMethod: PaymentMethod[];

  @Column()
  public externalId: string;

  @Column({
    nullable: true,
  })
  public requestId: string;
}
