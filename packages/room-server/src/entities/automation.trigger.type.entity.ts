import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

/**
 * 自动化 trigger type
 */
@Entity('vika_automation_trigger_type')
export class AutomationTriggerTypeEntity extends BaseEntity {
  @Column({
    name: 'service_id',
    length: 50,
    nullable: false,
  })
    serviceId: string;

  @Column({
    name: 'trigger_type_id',
    nullable: false,
    length: 50,
  })
    triggerTypeId: string;

  @Column({
    name: 'name',
    length: 255,
  })
    name: string;

  @Column({
    name: 'description',
    length: 255,
  })
    description: string;

  @Column({
    name: 'endpoint',
    length: 50,
  })
    endpoint: string;

  @Column('json', {
    name: 'input_json_schema',
    nullable: true,
  })
    inputJSONSchema: object;

  @Column('json', {
    name: 'output_json_schema',
    nullable: true,
  })
    outputJSONSchema: object;

  @Column('json', {
    name: 'i18n',
    nullable: true,
  })
    i18n: object;
}
