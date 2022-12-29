import { IdWorker } from '../../shared/helpers';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity(`datasheet_widget`)
export class DatasheetWidgetEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    unique: true,
    comment: 'datasheet ID(related#datasheet#dst_id)',
    length: 50,
  })
    dstId: string;

  @Column({
    name: 'source_id',
    nullable: true,
    unique: true,
    comment: 'source(referenced by widget) ID, such as mirror ID',
    length: 50,
    default: () => null,
  })
    sourceId: string | null;

  @Column({
    name: 'space_id',
    nullable: false,
    unique: true,
    comment: 'space ID',
    length: 50,
  })
    spaceId: string;

  @Column({
    name: 'widget_id',
    nullable: false,
    unique: true,
    comment: 'widget ID',
    length: 50,
  })
    widgetId: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    nullable: true,
    comment: 'updated time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    updatedAt: Date | null;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
