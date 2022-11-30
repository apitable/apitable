import { IdWorker } from 'shared/helpers/snowflake';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity(`automation_run_history`)
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
    comment: 'spaceID of current robot',
  })
    spaceId: string;

  @Column({
    name: 'status',
    nullable: false,
    unsigned: true,
    comment: 'state(0:running,1:succeed,2:failed)',
  })
    status: number;

  @Column('json', {
    name: 'data',
    nullable: true,
  })
    data: object;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
