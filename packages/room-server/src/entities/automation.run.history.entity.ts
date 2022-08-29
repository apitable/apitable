import { IdWorker } from 'helpers/snowflake';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * 自动化-机器人运行历史
 */
@Entity('vika_automation_run_history')
export class AutomationRunHistoryEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'task_id',
    nullable: false,
    unique: true,
    length: 50,
  })
    taskId: string;

  @Column({
    name: 'robot_id',
    nullable: false,
    length: 50,
  })
    robotId: string;

  @Column({
    name: 'space_id',
    nullable: false,
    length: 50,
    comment: '[冗余]当前任务机器人所属的空间站ID',
  })
    spaceId: string;

  @Column({
    name: 'status',
    nullable: false,
    unsigned: true,
    comment: '运行状态(0:运行中,1:成功,2:失败)',
  })
    status: number;

  @Column('json', {
    name: 'data',
    nullable: true,
  })
    data: object;

  @Column('timestamp', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
