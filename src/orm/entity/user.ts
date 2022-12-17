// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, BeforeInsert, OneToMany, ManyToOne } from 'typeorm';
import { encryptPassword } from '../../providers/encryption';
import { BaseEntity } from './base';
import { Address } from './address';
import { Department } from './department';
import { Privilege } from './privilege';
import { Salary } from './salary';
import { SubDepartment } from './subdepartment';
import { Charge } from './charge';
import { PaymentMethod } from './paymentMethod';
import { Organization } from './organization';

export interface IUser {
  name: string;
  password: string;
  displayName: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string;
  phone: string;
  country: string;
  onContract: boolean;
  salary: Salary[];
  addresses: Address[];
  privileges: Privilege[];
  department: Department;
  subDepartment: SubDepartment;
}

@Entity('users')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class User extends BaseEntity implements IUser {
  @Column({
    length: 100,
    unique: true,
  })
  name: string;

  @BeforeInsert()
  hashPassword() {
    this.password = encryptPassword(this.password);
  }

  @Column()
  password: string;

  @Column({
    nullable: true,
    unique: true,
    length: 30,
  })
  displayName: string;

  @Column({
    nullable: true,
    length: 30,
  })
  firstName: string;

  @Column({
    nullable: true,
    length: 30,
  })
  lastName: string;

  @Column({
    nullable: true,
    length: 160,
  })
  bio: string;

  @Column({
    nullable: true,
    length: 50,
  })
  avatar: string;

  @Column({
    nullable: true,
    length: 20,
  })
  phone: string;

  @Column({
    nullable: true,
    length: 5,
  })
  country: string;

  @Column({ type: 'boolean', default: false })
  onContract: boolean;

  @OneToMany(() => Salary, (salary) => salary.user, { cascade: true })
  salary: Salary[];

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];

  @OneToMany(() => Privilege, (privilege) => privilege.user, { cascade: true })
  privileges: Privilege[];

  @OneToMany(() => Charge, (charge) => charge.user, { cascade: true })
  charge: Charge[];

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user, { cascade: true })
  paymentMethod: PaymentMethod[];

  @ManyToOne(() => Department, (department) => department.user)
  department: Department;

  @ManyToOne(() => Organization, (organization) => organization.user)
  organization: Organization;

  @ManyToOne(() => SubDepartment, (subDepartment) => subDepartment.user)
  subDepartment: SubDepartment;
}
