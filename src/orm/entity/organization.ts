import { Currency } from '../../types/CurrencyTypes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user';
import { PaymentMethod } from './paymentMethod';
import { Charge } from './charge';

export interface IOrganizationStoredValues {
  id: string;
  name: string;
  useOrganizationTerms: boolean;
  faqUrl: string;
  termsUrl: string;
  privacyPolicyUrl: string;
  superAdmin: boolean;
  currency: Currency;
  //userAuthenticationProviders: IAuthProvider[];
  defaultLocale: string;
  enableTripAnonymization: boolean;
  enableUserAnonymization: boolean;
  isDemoEnabled: boolean;
  weeklyReportsEnabled: boolean;
  dailyReportsEnabled: boolean;
  timezone: string;
  //featureFlags: FeatureFlag[];
  //unitsOfDistance: UnitsOfDistance;
  logoUrl: string;
}

@Entity('organization')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Organization extends BaseEntity implements IOrganizationStoredValues {
  @Column()
  public name: string;

  @Column({ type: 'boolean', default: false })
  public useOrganizationTerms: boolean;

  @Column()
  public faqUrl: string;

  @Column({
    nullable: true,
  })
  public termsUrl: string;

  @Column({
    nullable: true,
  })
  public privacyPolicyUrl: string;

  @Column({ type: 'boolean', default: false })
  public superAdmin: boolean;

  @Column({ default: Currency.USD })
  public currency: Currency;

  @Column()
  public defaultLocale: string;

  @Column({ type: 'boolean', default: false })
  public enableTripAnonymization: boolean;

  @Column({ type: 'boolean', default: false })
  public isDemoEnabled: boolean;

  @Column({ type: 'boolean', default: false })
  public weeklyReportsEnabled: boolean;

  @Column({ type: 'boolean', default: false })
  public dailyReportsEnabled: boolean;

  @Column()
  public timezone: string;

  @Column({ type: 'boolean', default: false })
  public enableUserAnonymization: boolean;

  @Column({
    nullable: true,
  })
  public logoUrl: string;

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.organization, { cascade: true })
  public paymentMethod: PaymentMethod[];

  @OneToMany(() => Charge, (charge) => charge.organization, { cascade: true })
  public charge: Charge[];

  @OneToMany(() => User, (user) => user.organization, { cascade: true })
  public user: User[];

  /*@HasMany(() => OrganizationMember)
  public organizationMembers: NonAttribute<OrganizationMember[]>;

  @HasMany(() => MobileAppOrganization)
  public mobileAppOrganizations: NonAttribute<MobileAppOrganization[] | undefined>;

  @HasMany(() => Dashboard)
  public dashboards: NonAttribute<Dashboard[]>;

  @BelongsToMany(() => MobileApp, () => MobileAppOrganization)
  private readonly mobileApps: NonAttribute<MobileApp[] | undefined>;
  */
}
