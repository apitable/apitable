import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

/**
 * 自动化 robot
 */
@Entity('vika_automation_robot')
export class AutomationRobotEntity extends BaseEntity {
  @Column({
    name: 'resource_id',
    nullable: false,
    unique: false,
    length: 50,
  })
    resourceId: string;

  @Column({
    name: 'name',
    nullable: true,
    unique: false,
    length: 255,
  })
    name: string;

  @Column({
    name: 'description',
    nullable: true,
    unique: false,
    length: 255,
  })
    description: string;

  @Column({
    name: 'robot_id',
    nullable: false,
    length: 50,
  })
    robotId: string;

  @Column({
    name: 'is_active',
    unsigned: true,
  })
    isActive: boolean;

  @Column({
    name: 'is_deleted',
    unsigned: true,
  })
    isDeleted: boolean;
}
