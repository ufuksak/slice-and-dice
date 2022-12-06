// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { SubDepartment } from './subdepartment';
import { User } from './user';

export interface IDepartment {
  name: string;
  user: User[];
}

@Entity('departments')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Department extends BaseEntity implements IDepartment {
  @Column({
    nullable: true,
    length: 50,
  })
  name: string;

  @OneToMany(() => SubDepartment, (subDepartment) => subDepartment.department, { cascade: true })
  subDepartment: SubDepartment[];

  @OneToMany(() => User, (user) => user.department)
  user: User[];
}
