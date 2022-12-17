// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from './organization';
import { User } from './user';
import { Charge } from './charge';
import { BaseEntity } from './base';

export enum PaymentMethodStatus {
  Valid = 'valid',
  Archived = 'archived',
}

export interface IPaymentMethodStoredValues {
  organizationId: string;
  status: PaymentMethodStatus;
  connectedAccountId: string;
  externalId: string;
  user: User;
  // The last four digits of the card / payment method if this information is known.
  last4Digits: string;
  // Two-digit number representing the card’s expiration month if one exists
  expiryMonth: number;
  // Four-digit number representing the card’s expiration year if one exists
  expiryYear: number;
}

@Entity('payment_method')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PaymentMethod extends BaseEntity implements IPaymentMethodStoredValues {
  @Column({
    nullable: true,
  })
  public organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.paymentMethod)
  public organization: Organization;

  @ManyToOne(() => User, (user) => user.paymentMethod, { onDelete: 'CASCADE' })
  public user: User;

  @Column()
  public connectedAccountId: string;

  @Column()
  public status: PaymentMethodStatus;

  @Column()
  public externalId: string;

  @OneToMany(() => Charge, (charge) => charge.paymentMethod, { cascade: true })
  public charges: Charge[];

  @Column()
  public last4Digits: string;

  @Column()
  public expiryMonth: number;

  @Column({
    nullable: true,
  })
  public expiryYear: number;
}
