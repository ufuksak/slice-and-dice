// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';

export interface IApplicationForm {
  name: string;
  email: string;
  phone: string;
  locationName?: string;
  relocationToLocation: string;
  locationAddress: string;
}

@Entity('application_form')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ApplicationForm extends BaseEntity implements IApplicationForm {
  @Column({
    nullable: true,
    length: 50,
  })
  name: string;

  @Column({
    nullable: false,
    length: 50,
  })
  email: string;

  @Column({
    nullable: true,
    length: 50,
  })
  phone: string;

  @Column({
    nullable: true,
    length: 50,
  })
  locationName?: string;

  @Column({
    nullable: true,
    length: 50,
  })
  relocationToLocation: string;

  @Column({
    nullable: true,
    length: 10,
  })
  locationAddress: string;
}
