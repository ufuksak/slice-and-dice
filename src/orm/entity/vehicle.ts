// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base';

export interface IVehicle {
  brand: string;
  model: string;
  year: string;
  pictureLink?: string;
  postCode: string;
}

@Entity('vehicle')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Vehicle extends BaseEntity implements IVehicle {
  @Column({
    nullable: true,
    length: 50,
  })
  brand: string;

  @Column({
    nullable: true,
    length: 50,
  })
  model: string;

  @Column({
    nullable: true,
    length: 50,
  })
  year: string;

  @Column({
    nullable: true,
  })
  pictureLink?: string;

  @Column({
    nullable: true,
  })
  postCode: string;
}
