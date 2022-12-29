import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity(`automation_service`)
export class AutomationServiceEntity extends BaseEntity {
  @Column({
    name: 'service_id',
    nullable: false,
    length: 50,
  })
    serviceId: string;

  @Column({
    name: 'slug',
    nullable: false,
    length: 50,
  })
    slug: string;

  @Column({
    name: 'name',
    nullable: true,
    length: 255,
  })
    name: string;

  @Column({
    name: 'description',
    nullable: true,
    length: 255,
  })
    description: string;

  @Column({
    name: 'logo',
    nullable: true,
    length: 255,
  })
    logo: string;

  @Column({
    name: 'base_url',
    nullable: true,
  })
    baseUrl: string;

  @Column('json', {
    name: 'i18n',
    nullable: true,
  })
    i18n: object;
}
