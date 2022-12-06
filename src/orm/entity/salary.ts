// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user';

export interface ISalary {
  currency: string;
  amount: number;
  user: User;
}

@Entity('salaries')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Salary extends BaseEntity implements ISalary {
  @Column({
    nullable: false,
    length: 10,
  })
  currency: string;

  @Column()
  amount: number;

  @ManyToOne(() => User, (user) => user.salary, { onDelete: 'CASCADE' })
  user: User;
}
