import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

/**
 * 自动化 action
 */
@Entity('vika_automation_action')
export class AutomationActionEntity extends BaseEntity {
  @Column({
    name: 'action_id',
    nullable: false,
    unique: true,
    length: 50,
  })
    actionId: string;

  @Column({
    name: 'robot_id',
    nullable: false,
    length: 50,
  })
    robotId: string;

  @Column({
    name: 'action_type_id',
    nullable: true,
    comment: '名称',
    length: 255,
  })
    actionTypeId: string | null;

  @Column({
    name: 'prev_action_id',
    nullable: true,
    comment: '前置 action ID',
    length: 255,
  })
    prevActionId: string | null;

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
