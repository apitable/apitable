import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity(`datasheet_record_alarm`)
export class DatasheetRecordAlarmEntity extends BaseEntity {
  @Column({
    name: 'alarm_id',
    nullable: false,
    unique: true,
    comment: 'alarm ID',
    length: 50,
  })
    alarmId: string;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: 'space ID',
    length: 50,
  })
    spaceId: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: 'datasheet ID',
    length: 50,
  })
    dstId: string;

  @Column({
    name: 'record_id',
    nullable: false,
    comment: 'datasheet record ID',
    length: 50,
  })
    recordId: string;

  @Column({
    name: 'field_id',
    nullable: false,
    comment: 'datasheet field ID',
    length: 50,
  })
    fieldId: string;

  @Column({
    name: 'alarm_at',
    nullable: false,
    comment: 'alarm time',
  })
    alarmAt: Date;

  @Column({
    name: 'alarm_status',
    nullable: false,
    comment: 'alarm status(0-pending, 1-processing, 2-done, 3-failed)',
    width: 1,
    type: 'tinyint',
    default: () => 0,
  })
    status: number;
}