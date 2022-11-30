import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity(`automation_trigger`)
export class AutomationTriggerEntity extends BaseEntity {
  @Column({
    name: 'trigger_id',
    nullable: false,
    unique: true,
    length: 50,
  })
    triggerId: string;

  @Column({
    name: 'robot_id',
    nullable: false,
    length: 50,
  })
    robotId: string;

  @Column({
    name: 'trigger_type_id',
    nullable: true,
    length: 255,
  })
    triggerTypeId: string | null;

  @Column('json', {
    name: 'input',
    nullable: true,
  })
    input: object;

  @Column({
    name: 'is_deleted',
    unsigned: true,
  })
    isDeleted: boolean;
}
