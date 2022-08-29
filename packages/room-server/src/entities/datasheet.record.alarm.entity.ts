import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'entities/base.entity';

@Entity('vika_datasheet_record_alarm')
export class DatasheetRecordAlarmEntity extends BaseEntity {
  @Column({
    name: 'alarm_id',
    nullable: false,
    unique: true,
    comment: '闹钟ID',
    length: 50,
  })
    alarmId: string;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: '空间ID',
    length: 50,
  })
    spaceId: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: '数表ID',
    length: 50,
  })
    dstId: string;

  @Column({
    name: 'record_id',
    nullable: false,
    comment: '数表记录ID',
    length: 50,
  })
    recordId: string;

  @Column({
    name: 'field_id',
    nullable: false,
    comment: '数表列ID',
    length: 50,
  })
    fieldId: string;

  @Column({
    name: 'alarm_at',
    nullable: false,
    comment: '闹钟通知时间',
  })
    alarmAt: Date;

  @Column({
    name: 'alarm_status',
    nullable: false,
    comment: '闹钟状态 (0-pending, 1-processing, 2-done, 3-failed)',
    width: 1,
    type: 'tinyint',
    default: () => 0,
  })
    status: number;
}