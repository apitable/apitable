import { IdWorker } from '../../shared/helpers';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('vika_datasheet_widget')
export class DatasheetWidgetEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    unique: true,
    comment: '数表ID(关联#vika_datasheet#dst_id)',
    length: 50,
  })
    dstId: string;

  @Column({
    name: 'source_id',
    nullable: true,
    unique: true,
    comment: '小程序引用来源ID，如镜像',
    length: 50,
    default: () => null,
  })
    sourceId: string | null;

  @Column({
    name: 'space_id',
    nullable: false,
    unique: true,
    comment: '空间ID',
    length: 50,
  })
    spaceId: string;

  @Column({
    name: 'widget_id',
    nullable: false,
    unique: true,
    comment: '自定组件ID',
    length: 50,
  })
    widgetId: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    nullable: true,
    comment: '更新时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    updatedAt: Date | null;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
