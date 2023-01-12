// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user';

export interface IArea {
  area_name: string;
  user: User;
}

@Entity('area')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Area extends BaseEntity implements IArea {
  @Column({
    nullable: true,
    length: 50,
  })
  area_name: string;

  @ManyToOne(() => User, (user) => user.area, { onDelete: 'CASCADE' })
  user: User;
}
