// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { Department } from './department';
import { User } from './user';

export interface ISubDepartment {
  subDepartmentName: string;
  department: Department;
}

@Entity('sub_departments')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class SubDepartment extends BaseEntity implements ISubDepartment {
  @Column({
    nullable: true,
    length: 50,
  })
  subDepartmentName: string;

  @ManyToOne(() => Department, (department) => department.subDepartment, { onDelete: 'CASCADE' })
  department: Department;

  @OneToMany(() => User, (user) => user.subDepartment)
  user: User[];
}
